import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gameSources = ['game-core.js', 'game-world.js', 'game-render.js'].map(file => ({ file, source: fs.readFileSync(path.join(root, file), 'utf8') }));
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]);

function makeClassList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach(name => values.add(name)),
    remove: (...names) => names.forEach(name => values.delete(name)),
    toggle: (name, force) => {
      const enabled = force === undefined ? !values.has(name) : Boolean(force);
      if (enabled) values.add(name); else values.delete(name);
      return enabled;
    },
    contains: name => values.has(name)
  };
}

function bootGame() {
  const listeners = new Map();
  const timers = [];
  const animationFrames = [];
  let fillRectCalls = 0;
  let clearRectCalls = 0;

  const context2d = new Proxy({}, {
    get(target, property) {
      if (property === 'fillRect') return () => { fillRectCalls++; };
      if (property === 'clearRect') return () => { clearRectCalls++; };
      if (property === 'measureText') return () => ({ width: 0 });
      if (!(property in target)) target[property] = () => {};
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  });

  function makeElement(id = '') {
    return {
      id,
      textContent: '',
      style: {},
      dataset: {},
      classList: makeClassList(),
      addEventListener() {},
      getContext: () => context2d
    };
  }

  const elementIds = [
    'game', 'score', 'lives', 'speed', 'stage-name', 'stage-sub',
    'progress-bar', 'banner', 'banner-title', 'banner-sub', 'message',
    'message-title', 'message-detail', 'shell', 'tips', 'fatal'
  ];
  const elements = new Map(elementIds.map(id => [`#${id}`, makeElement(id)]));
  const buttons = ['left', 'right', 'jump'].map(key => {
    const button = makeElement();
    button.dataset.key = key;
    return button;
  });

  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, makeElement(selector));
      return elements.get(selector);
    },
    querySelectorAll(selector) {
      return selector === 'button' ? buttons : [];
    }
  };

  const sandbox = {
    document,
    innerWidth: 1280,
    innerHeight: 720,
    console,
    Math,
    Number,
    Infinity,
    addEventListener(type, handler) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(handler);
    },
    requestAnimationFrame(handler) {
      animationFrames.push(handler);
      return animationFrames.length;
    },
    setTimeout(handler, delay) {
      timers.push({ handler, delay });
      return timers.length;
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  const context = vm.createContext(sandbox);
  for (const [index, source] of inlineScripts.entries()) {
    new vm.Script(source, { filename: `inline-script-${index + 1}.js` }).runInContext(context);
  }
  for (const { file, source } of gameSources) new vm.Script(source, { filename: file }).runInContext(context);

  return {
    sandbox,
    elements,
    listeners,
    animationFrames,
    metrics: {
      get fillRectCalls() { return fillRectCalls; },
      get clearRectCalls() { return clearRectCalls; }
    }
  };
}

test('index.html is a complete game document', () => {
  assert.match(html, /<canvas id="game" width="480" height="270"><\/canvas>/);
  assert.match(html, /SIDE SCROLLING LIFE/);
  assert.equal(inlineScripts.length, 1, 'expected one inline boot watchdog');
  for (const file of ['game-core.js','game-world.js','game-render.js']) assert.match(html, new RegExp(`<script src="${file.replace('.', '\\.')}\"><\\/script>`));
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(styles, /#fatal\.show/);
});

test('watchdog and game scripts compile', () => {
  inlineScripts.forEach((source, index) => {
    assert.doesNotThrow(() => new vm.Script(source, { filename: `inline-script-${index + 1}.js` }));
  });
  for (const { file, source } of gameSources) assert.doesNotThrow(() => new vm.Script(source, { filename: file }));
});

test('game boots and paints a frame without browser APIs', () => {
  const game = bootGame();
  assert.equal(game.sandbox.__SIDE_SCROLLING_LIFE_BOOTED__, true);
  assert.equal(game.elements.get('#game').dataset.ready, 'true');
  assert.ok(game.metrics.fillRectCalls > 100, 'expected the game to paint visible pixels');
  assert.ok(game.metrics.clearRectCalls > 0, 'expected the canvas to be cleared before painting');
  assert.equal(typeof game.sandbox.__SIDE_SCROLLING_LIFE__?.getState, 'function');
  assert.ok(game.animationFrames.length > 0, 'expected the animation loop to be scheduled');
  assert.equal(game.elements.get('#fatal').classList.contains('show'), false);
});

test('enemy roster follows the country rules and Belgium stays empty', () => {
  const { sandbox } = bootGame();
  const enemies = sandbox.__SIDE_SCROLLING_LIFE__.getEnemySummary();
  const types = new Set(enemies.map(enemy => enemy.type));
  for (const type of ['kid', 'bull', 'baguette', 'cyclist', 'ninja', 'chef']) {
    assert.ok(types.has(type), `missing ${type} enemy`);
  }
  const inBelgium = enemies.filter(enemy =>
    (enemy.x >= 3200 && enemy.x < 3600) ||
    (enemy.x >= 8400 && enemy.x < 8800)
  );
  assert.equal(inBelgium.length, 0);
});

test('double jump allows exactly two jumps before landing', () => {
  const { sandbox } = bootGame();
  const api = sandbox.__SIDE_SCROLLING_LIFE__;
  api.teleportToStage(0);

  api.jump();
  api.step();
  const first = api.getState();
  assert.equal(first.jumpsLeft, 1);
  assert.ok(first.velocityY < -200);

  api.jump();
  api.step();
  const second = api.getState();
  assert.equal(second.jumpsLeft, 0);
  assert.ok(second.velocityY < -200);

  api.jump();
  api.step();
  const third = api.getState();
  assert.equal(third.jumpsLeft, 0);
  assert.ok(third.velocityY > second.velocityY, 'third jump should not reset upward velocity');
});

test('dog follows behind after the encounter', () => {
  const { sandbox } = bootGame();
  const api = sandbox.__SIDE_SCROLLING_LIFE__;
  api.teleportToStage(7);
  assert.equal(api.getState().metDog, true);

  api.setInput('right', true);
  for (let i = 0; i < 180; i++) api.step();
  api.setInput('right', false);

  const state = api.getState();
  assert.ok(state.playerX > state.dogX, 'dog should trail the player');
  assert.ok(state.playerX - state.dogX > 15, 'dog should keep a visible delay');
});

test('number keys teleport to the corresponding stage', () => {
  const game = bootGame();
  const keydown = game.listeners.get('keydown')?.at(-1);
  assert.equal(typeof keydown, 'function');
  keydown({ code: 'Digit9', preventDefault() {} });
  assert.equal(game.sandbox.__SIDE_SCROLLING_LIFE__.getState().stage, 8);
  assert.match(game.elements.get('#stage-name').textContent, /^9 \/ 9/);
});
