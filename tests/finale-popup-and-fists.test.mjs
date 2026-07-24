import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');

test('terminal result panel remains visible while the dancer enters',()=>{
 assert.match(html,/if\(terminal\)resultMessage\.classList\.add\('show'\)/);
 assert.match(html,/terminalState==='over'\|\|terminalState==='win'/);
});

test('thriller dancer uses closed fists without finger lines',()=>{
 assert.match(html,/rect\(-20,-26,7,6,'#a96d4c'\)/);
 assert.match(html,/rect\(13,-26,7,6,'#a96d4c'\)/);
 assert.doesNotMatch(html,/line\(-17,-25,-14,-29/);
 assert.doesNotMatch(html,/line\(17,-25,14,-29/);
});
