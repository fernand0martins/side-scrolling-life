import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const theme=fs.readFileSync(path.join(root,'photorealistic-theme.js'),'utf8');

 test('cinematic renderer loads after gameplay visuals and before hitboxes',()=>{
  const journey=html.indexOf('<script src="journey-details.js"></script>');
  const compatibility=html.indexOf('<script src="canvas-gradient-compat.js"></script>');
  const realism=html.indexOf('<script src="photorealistic-theme.js"></script>');
  const hitboxes=html.indexOf('<script src="sprite-hitboxes.js"></script>');
  assert.ok(journey>=0&&compatibility>journey&&realism>compatibility&&hitboxes>realism);
 });

 test('realistic theme replaces the major asset families coherently',()=>{
  for(const renderer of ['drawSkybox','drawPlatform','drawCoin','person','drawDog','drawTravelCar','drawEnemy','weddingGuest','drawGoal']){
   assert.match(theme,new RegExp(`${renderer}=function\\(`),`missing ${renderer} realism override`);
  }
  for(const landmark of ['clerigos','domLuisBridge','sagrada','eiffel','atomium','windmill','fuji','pagoda','namsan','gyeongbokgung']){
   assert.match(theme,new RegExp(`${landmark}=function\\(`),`missing ${landmark} realism override`);
  }
 });

 test('realistic renderer uses photographic depth and colour treatment',()=>{
  assert.match(theme,/createLinearGradient/);
  assert.match(theme,/createRadialGradient/);
  assert.match(theme,/shadowBlur/);
  assert.match(theme,/globalCompositeOperation='soft-light'/);
  assert.match(theme,/imageSmoothingEnabled=realistic\(\)/);
 });