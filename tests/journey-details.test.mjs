import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const details=fs.readFileSync(path.join(root,'journey-details.js'),'utf8');

test('journey details load after character styling and before hitbox wrapping',()=>{
 const characterIndex=html.indexOf('<script src="character-hair.js"></script>');
 const detailIndex=html.indexOf('<script src="journey-details.js"></script>');
 const hitboxIndex=html.indexOf('<script src="sprite-hitboxes.js"></script>');
 assert.ok(characterIndex>=0&&detailIndex>characterIndex&&hitboxIndex>detailIndex);
});

test('additional coins are distributed through all travel stages',()=>{
 assert.match(details,/for\(let stage=0;stage<stages\.length-1;stage\+\+\)/);
 assert.match(details,/\[74,202\],\[372,202\],\[770,202\],\[1138,202\]/);
 assert.match(details,/for\(const \[offset,y\] of extraCoinPattern\)/);
 assert.doesNotMatch(details,/extraCoinPattern\[0\]/,'must iterate coordinate pairs, not the first pair values');
 assert.match(details,/coins\.push\(\{x:base\+offset/);
});

test('two pickups after Kyuubi become bones worth five coin values',()=>{
 assert.match(details,/coins\.filter\(coin=>coin\.x>DOG_X\)/);
 assert.match(details,/\.slice\(0,2\)/);
 assert.match(details,/BONE_MULTIPLIER=5/);
 assert.match(details,/score\+=collectedBones\*COIN_POINTS\*\(BONE_MULTIPLIER-1\)/);
});

test('bone pickup has a dedicated rendered silhouette',()=>{
 assert.match(details,/pickup\.type!=='bone'/);
 assert.match(details,/rect\(x\+2,y\+3,7,5,'#f5f0df'\)/);
 assert.match(details,/rect\(x,y\+1,4,4,'#f5f0df'\)/);
});

test('flower density increases towards the wedding altar',()=>{
 assert.match(details,/progress=clamp\(\(x-start\)\/\(end-start\),0,1\)/);
 assert.match(details,/clusters=1\+Math\.floor\(progress\*3\)/);
 assert.match(details,/x\+=Math\.max\(12,34-progress\*19\)/);
});