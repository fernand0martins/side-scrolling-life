import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const styles=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const textSource=fs.readFileSync(path.join(root,'text.js'),'utf8');
const core=fs.readFileSync(path.join(root,'game-core.js'),'utf8');

test('all editable user-facing copy lives in text.js',()=>{
 const sandbox={window:{}};sandbox.window.window=sandbox.window;
 vm.runInNewContext(textSource,sandbox);
 const text=sandbox.window.GAME_TEXT;
 assert.equal(text.stages.length,9);
 assert.equal(text.hud.score,'Score');
 assert.equal(text.controls.jump,'Jump');
 assert.equal(text.messages.stage(4),'STAGE 4');
 assert.match(text.messages.weddingDetail(1234),/1234/);
 assert.match(html,/<script src="text\.js"><\/script>/);
 assert.ok(html.indexOf('text.js')<html.indexOf('game-core.js'));
 assert.doesNotMatch(core,/GAME OVER|TRY AGAIN|CHECKPOINT|KYUUBI JOINS YOU|JUST MARRIED/);
});

test('mobile HUD and messages use compact sizing',()=>{
 assert.match(styles,/#message\{min-width:0;width:min\(72vw,220px\);padding:10px 12px/);
 assert.match(styles,/#message-title\{font-size:16px\}/);
 assert.match(styles,/#banner-title\{font-size:13px\}/);
 assert.match(styles,/\.hud-title\{font-size:8px/);
 assert.match(styles,/\.hud-row\{font-size:7px/);
});
