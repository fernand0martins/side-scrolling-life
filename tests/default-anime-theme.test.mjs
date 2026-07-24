import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const visualStyle=fs.readFileSync(path.join(root,'visual-style.js'),'utf8');

 test('cinematic realistic visual style is enabled by default',()=>{
  assert.match(visualStyle,/let anime=false/);
  assert.match(visualStyle,/anime\?'anime':'realistic'/);
 });

 test('K key still toggles between realistic and anime themes',()=>{
  assert.match(visualStyle,/event\.code==='KeyK'/);
  assert.match(visualStyle,/anime=!anime/);
 });