import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const textSource = fs.readFileSync(path.join(root, 'text.js'), 'utf8');

test('mobile controls use image assets instead of selectable text glyphs', () => {
  for (const [key, file, label] of [
    ['left', 'left.svg', 'Move left'],
    ['right', 'right.svg', 'Move right'],
    ['jump', 'jump.svg', 'Jump']
  ]) {
    const escapedFile = file.replace('.', '\\.');
    assert.match(html, new RegExp(`<button data-key="${key}"><img src="icons/${escapedFile}" alt="" draggable="false"><\\/button>`));
    assert.match(textSource, new RegExp(`${key === 'left' ? 'moveLeft' : key === 'right' ? 'moveRight' : 'jump'}:'${label}'`));

    const icon = fs.readFileSync(path.join(root, 'icons', file), 'utf8');
    assert.match(icon, /<svg[\s>]/);
    assert.match(icon, /<path /);
  }

  assert.doesNotMatch(html, /[◀▶▲]/);
  assert.match(styles, /\.pad button\{[^}]*user-select:none/);
  assert.match(styles, /\.pad button img\{[^}]*pointer-events:none/);
  assert.match(styles, /-webkit-user-drag:none/);
  assert.match(styles, /-webkit-touch-callout:none/);
});
