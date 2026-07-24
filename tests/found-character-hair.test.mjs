import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const hair=fs.readFileSync(path.join(root,'character-hair.js'),'utf8');

test('character detail renderer loads after the main renderer',()=>{
 const rendererIndex=html.indexOf('<script src="game-render.js"></script>');
 const hairIndex=html.indexOf('<script src="character-hair.js"></script>');
 assert.ok(rendererIndex>=0&&hairIndex>rendererIndex);
});

test('found character uses shoulder hair before and after joining',()=>{
 assert.match(hair,/drawGirlNpc=function\(\)[\s\S]*'shoulderHair'/);
 assert.match(hair,/person\(2,0,colors\[1\],'#49302a','shoulderHair'\)/);
});

test('hair extends from crown down over one shoulder',()=>{
 assert.match(hair,/rect\(x\+10,y\+1,4,8,hair\)/);
 assert.match(hair,/rect\(x\+11,y\+6,5,7,hair\)/);
 assert.match(hair,/rect\(x\+9,y\+15,3,3,hair\)/);
});

test('beard and glasses styling are not applied',()=>{
 assert.doesNotMatch(hair,/firstBeard|groomBeard|shoulderHairGlasses|brideGlasses/);
 assert.doesNotMatch(hair,/ctx\.arc\(snap\(x\+[59]\.5\),snap\(y\+3\.5\),2/);
});