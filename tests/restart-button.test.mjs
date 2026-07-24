import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const text=fs.readFileSync(path.join(root,'text.js'),'utf8');

test('restart button exists inside the result message',()=>{
 assert.match(html,/<div id="message">[\s\S]*<button id="restart-button" type="button"><\/button>[\s\S]*<\/div>/);
});

test('restart button appears only for win or game-over states',()=>{
 assert.match(html,/terminalState==='over'\|\|terminalState==='win'/);
 assert.match(html,/restartButton\.classList\.toggle\('show'/);
});

test('restart button performs a clean reload',()=>{
 assert.match(html,/restartButton\.addEventListener\('click',\(\)=>window\.location\.reload\(\)\)/);
});

test('restart button is localized and interactive',()=>{
 assert.match(text,/restart:'RESTART'/);
 assert.match(css,/#restart-button\{display:none/);
 assert.match(css,/#restart-button\.show\{display:block\}/);
 assert.match(css,/pointer-events:auto/);
});
