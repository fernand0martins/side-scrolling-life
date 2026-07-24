import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const render=fs.readFileSync(path.join(root,'game-render.js'),'utf8');

test('final-stage renderer compiles',()=>{
 assert.doesNotThrow(()=>new vm.Script(render,{filename:'game-render.js'}));
});

test('stage 9 is flat, peaceful and confetti-heavy',()=>{
 assert.match(render,/FINAL_STAGE_START=SEG\*\(stages\.length-1\)/);
 assert.match(render,/platforms\.splice\(i,1\)/);
 assert.match(render,/w:SEG,h:44,type:0,ceremony:true/);
 assert.match(render,/enemies\.splice\(i,1\)/);
 assert.match(render,/coins\.splice\(i,1\)/);
 assert.match(render,/for\(let burst=0;burst<4;burst\+\+\)standardConfettiBurst\(\)/);
 assert.match(render,/launchFlames=function\(\)\{flameBursts\.length=0\}/);
 assert.doesNotMatch(render,/function drawFlames/);
 assert.doesNotMatch(render,/drawFlames\(\)/);
});
