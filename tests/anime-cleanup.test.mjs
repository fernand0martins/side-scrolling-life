import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cleanup=fs.readFileSync(path.join(root,'anime-cleanup.js'),'utf8');

test('anime cleanup loads after the world and before the renderer',()=>{
 assert.match(html,/game-world\.js[\s\S]*anime-cleanup\.js[\s\S]*game-render\.js/);
});

test('anime atmosphere keeps accents but omits diagonal speed lines',()=>{
 assert.match(cleanup,/drawAnimeAtmosphere=function/);
 assert.match(cleanup,/for\(let i=0;i<7;i\+\+\)/);
 assert.doesNotMatch(cleanup,/x\+34,y-15/);
});

test('full-screen anime diagonal overlay is filtered out',()=>{
 assert.match(cleanup,/y1===0&&y2===H&&x2===x1-72&&color==='#2b2345'/);
});
