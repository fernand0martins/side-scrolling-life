import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const render=fs.readFileSync(path.join(root,'game-render.js'),'utf8');

test('wedding finale renderer compiles',()=>{
 assert.doesNotThrow(()=>new vm.Script(render,{filename:'game-render.js'}));
});

test('finale contains a playable aisle, greenery arches, guests, altar and officiant',()=>{
 for(const name of ['drawWeddingAisle','drawWeddingFarGuests','drawWeddingNearGuests','drawOfficiant','drawWeddingPetals','drawCinematicOverlay']){
  assert.match(render,new RegExp(`function ${name}\\(`),`missing ${name}`);
 }
 assert.match(render,/drawWeddingAisle\(\);drawWeddingFarGuests\(\);drawOfficiant\(\);/);
 assert.match(render,/drawHero\(\);drawWeddingNearGuests\(\)/,'near guests should render in front of the couple');
 assert.match(render,/FINISH_X-410/,'aisle should begin before the final approach');
 assert.match(render,/FINISH_X\+39/,'officiant should wait beyond the finish line');
 assert.match(render,/proximity=clamp/,'cinematic treatment should fade in during the approach');
});
