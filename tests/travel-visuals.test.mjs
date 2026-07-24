import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const render=fs.readFileSync(path.join(root,'game-render.js'),'utf8');

test('updated travel renderer compiles',()=>{
 assert.doesNotThrow(()=>new vm.Script(render,{filename:'game-render.js'}));
});

test('Porto enemies use vertical blue shirt stripes',()=>{
 assert.match(render,/rect\(-7,8,14,10,'#f7f7f2'\)/);
 assert.match(render,/rect\(-7,8,3,10,'#2f69b1'\)/);
 assert.match(render,/rect\(-2,8,3,10,'#2f69b1'\)/);
 assert.doesNotMatch(render,/rect\(-7,10,14,2,'#fff'\)/);
});

test('alternating stages contain tiny animated birds',()=>{
 assert.match(render,/function drawTinyBirds\(/);
 assert.match(render,/if\(stage%2!==1\)return/);
 assert.match(render,/line\(x-3,y,x,y-2,1/);
 assert.match(render,/drawTinyBirds\(\);for\(const p of platforms\)/);
});

test('outbound and return stages render both characters in a white car',()=>{
 assert.match(render,/function drawTravelCar\(/);
 assert.match(render,/travelling=stage===2\|\|stage===7/);
 assert.match(render,/if\(travelling\)\{drawTravelCar\(\);return\}/);
 assert.match(render,/rect\(-20,1,35,8,'#f7f7f3'\)/,'car should be white');
 assert.match(render,/rect\(-8,-4,4,4,'#e4ad84'\).*rect\(3,-4,4,4,'#e4ad84'\)/s,'both characters should be visible inside');
});
