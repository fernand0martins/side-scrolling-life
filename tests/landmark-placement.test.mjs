import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const world=fs.readFileSync(path.join(root,'game-world.js'),'utf8');

test('world renderer compiles after landmark placement review',()=>{
 assert.doesNotThrow(()=>new vm.Script(world,{filename:'game-world.js'}));
});

test('landmarks and street props are anchored to the 226px ground baseline',()=>{
 assert.match(world,/atomium\(3450,113\)/);
 assert.match(world,/atomium\(8650,113\)/);
 assert.match(world,/windmill\(4470,162\)/);
 assert.match(world,/windmill\(8100,162\)/);
 assert.match(world,/bicycle\(4250,218\)/);
 assert.match(world,/bicycle\(4320,218\)/);
 assert.match(world,/bicycle\(7860,218\)/);
 assert.doesNotMatch(world,/atomium\((3450|8650),92\)/);
 assert.doesNotMatch(world,/windmill\((4470|8100),138\)/);
});
