import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const tuning=fs.readFileSync(path.join(root,'movement-tuning.js'),'utf8');

test('movement tuning loads immediately after the game core',()=>{
 const coreIndex=html.indexOf('<script src="game-core.js"></script>');
 const tuningIndex=html.indexOf('<script src="movement-tuning.js"></script>');
 assert.ok(coreIndex>=0&&tuningIndex>coreIndex);
});

test('characters decelerate faster when movement input is released',()=>{
 assert.match(tuning,/GROUND_RELEASE_DECELERATION=260/);
 assert.match(tuning,/AIR_RELEASE_DECELERATION=90/);
 assert.match(tuning,/player\.on\?GROUND_RELEASE_DECELERATION:AIR_RELEASE_DECELERATION/);
});

test('acceleration, sprint, reversal, and top speed behavior remain intact',()=>{
 assert.match(tuning,/TURN_ACCELERATION/);
 assert.match(tuning,/AIR_ACCELERATION/);
 assert.match(tuning,/key\.sprint\?SPRINT_ACCELERATION:GROUND_ACCELERATION/);
 assert.match(tuning,/clamp\(player\.vx,-MAX_SPEED,MAX_SPEED\)/);
});
