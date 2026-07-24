import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const visualStyle=fs.readFileSync(path.join(root,'visual-style.js'),'utf8');

test('anime visual style is enabled by default',()=>{
 assert.match(visualStyle,/let anime=true/);
 assert.match(visualStyle,/anime\?'anime':'classic'/);
});

test('K key still toggles between anime and classic themes',()=>{
 assert.match(visualStyle,/event\.code==='KeyK'/);
 assert.match(visualStyle,/anime=!anime/);
});