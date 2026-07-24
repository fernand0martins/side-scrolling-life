import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const fix=fs.readFileSync(path.join(root,'background-window-fix.js'),'utf8');

test('background window fix loads after the world definitions and before rendering',()=>{
 const worldIndex=html.indexOf('<script src="game-world.js"></script>');
 const fixIndex=html.indexOf('<script src="background-window-fix.js"></script>');
 const renderIndex=html.indexOf('<script src="game-render.js"></script>');
 assert.ok(worldIndex>=0&&fixIndex>worldIndex&&renderIndex>fixIndex);
});

test('window rows are rejected when they cross the facade bottom',()=>{
 assert.match(fix,/if\(windowY\+8>maxY\)continue/);
});

test('variable-height canal houses keep windows above the ground line',()=>{
 assert.match(fix,/windowGrid\(x\+7,y\+12,2,4,23,20,'#f3d59f',GROUND-4\)/);
});
