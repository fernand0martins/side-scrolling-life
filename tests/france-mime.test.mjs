import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const render=fs.readFileSync(path.join(root,'game-render.js'),'utf8');

test('France enemy renderer compiles',()=>{
 assert.doesNotThrow(()=>new vm.Script(render,{filename:'game-render.js'}));
});

test('French baguette enemies are converted into mimes carrying baguettes',()=>{
 assert.match(render,/if\(enemy\.type==='baguette'\)enemy\.type='mime'/);
 assert.match(render,/e\.type==='mime'/);
 assert.doesNotMatch(render,/e\.type==='baguette'/);
 assert.match(render,/rect\(-7,-4,14,4,'#15171c'\)/,'mime should have a black beret');
 assert.match(render,/rect\(-7,9,14,2,'#17191f'\)/,'mime should have a striped shirt');
 assert.match(render,/ctx\.rotate\(-\.38\)/,'mime should carry the baguette diagonally');
 assert.match(render,/poly\(\[\[-2,-5\],\[2,-7\],\[7,15\]/,'mime should carry a baguette');
});
