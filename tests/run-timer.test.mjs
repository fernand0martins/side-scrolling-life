import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const timer=fs.readFileSync(path.join(root,'run-timer.js'),'utf8');

test('run timer loads after the core game engine and before the world',()=>{
 const coreIndex=html.indexOf('<script src="game-core.js"></script>');
 const timerIndex=html.indexOf('<script src="run-timer.js"></script>');
 const worldIndex=html.indexOf('<script src="game-world.js"></script>');
 assert.ok(coreIndex>=0&&timerIndex>coreIndex&&worldIndex>timerIndex);
});

test('timer advances only during active play and resets on a full restart',()=>{
 assert.match(timer,/if\(state==='play'\)elapsed\+=dt/);
 assert.match(timer,/if\(full\)elapsed=0/);
});

test('completed run time is appended to the wedding result',()=>{
 assert.match(timer,/Time: \$\{formatRunTime\(elapsed\)\}/);
 assert.match(timer,/ui\.messageDetail\.textContent=`\$\{baseDetail\} · Time:/);
});

test('timer formats normal and long runs',()=>{
 assert.match(timer,/hours>0/);
 assert.match(timer,/padStart\(2,'0'\)/);
 assert.match(timer,/window\.RUN_TIMER=Object\.freeze/);
});
