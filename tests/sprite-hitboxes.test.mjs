import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const hitboxes=fs.readFileSync(path.join(root,'sprite-hitboxes.js'),'utf8');

test('sprite hitboxes load after the renderer has finalized enemy types',()=>{
 const rendererIndex=html.indexOf('<script src="game-render.js"></script>');
 const hitboxIndex=html.indexOf('<script src="sprite-hitboxes.js"></script>');
 assert.ok(rendererIndex>=0&&hitboxIndex>rendererIndex);
});

test('player hitboxes match the single, duo, and car sprite footprints',()=>{
 assert.match(hitboxes,/return\{x:3,y:0,w:13,h:24,form:'single'\}/);
 assert.match(hitboxes,/return\{x:-4,y:0,w:29,h:24,form:'duo'\}/);
 assert.match(hitboxes,/return\{x:-18,y:2,w:50,h:27,form:'car'\}/);
});

test('enemy hitboxes are defined per rendered enemy type',()=>{
 for(const type of ['kid','bull','mime','cyclist','ninja','chef'])assert.match(hitboxes,new RegExp(`${type}:\\{x:`));
});

test('collision transforms are restored before rendering',()=>{
 assert.match(hitboxes,/try\{originalUpdate\(dt\)\}finally\{/);
 assert.match(hitboxes,/restoreEnemies\[i\]\(\)/);
 assert.match(hitboxes,/restorePlayer\(\)/);
});
