import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');

test('speed counter is removed from the visible HUD',()=>{
 assert.doesNotMatch(html,/id="speed-label"/);
 assert.match(html,/id="speed" class="legacy-counter"/);
 assert.match(css,/\.legacy-counter\{display:none!important\}/);
});

test('three heart slots mirror the three-life state',()=>{
 assert.equal((html.match(/class="heart"/g)||[]).length,3);
 assert.match(html,/function syncHearts\(\)/);
 assert.match(html,/heart\.classList\.toggle\('empty',index>=remaining\)/);
 assert.match(html,/new MutationObserver\(syncHearts\)/);
 assert.match(css,/\.heart\{[^}]*background:#f04455/);
 assert.match(css,/\.heart\.empty\{background:#3a3f4c/);
});
