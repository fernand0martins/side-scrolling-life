import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const render=fs.readFileSync(path.join(root,'game-render.js'),'utf8');

test('finale dancer renderer compiles',()=>{
 assert.doesNotThrow(()=>new vm.Script(render,{filename:'game-render.js'}));
});

test('thriller-style dancer enters only after reaching the ending',()=>{
 assert.match(render,/function drawThrillerDancer\(\)/);
 assert.match(render,/if\(state!==\'win\'\)return/);
 assert.match(render,/clamp\(celebrationClock\/3,0,1\)/);
 assert.match(render,/FINISH_X-520\+entrance\*225/);
 assert.match(render,/'#d52d35'/,'dancer should wear a red jacket');
 assert.match(render,/'#17181d'/,'jacket should have dark thriller-style trim');
 assert.match(render,/if\(posed\)/,'dancer should transition into a raised-arm pose');
 assert.match(render,/drawHero\(\);drawThrillerDancer\(\);drawWeddingNearGuests\(\)/);
});
