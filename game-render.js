'use strict';
function drawPlatform(p){
 const t=palette[themeAt(p.x)];
 if(p.type===0){rect(p.x,p.y,p.w,p.h,t.soil);rect(p.x,p.y,p.w,6,t.grass);for(let x=p.x+7;x<p.x+p.w;x+=17)rect(x,p.y+14,4,4,'#5e3a28')}
 else{outlineRect(p.x,p.y,p.w,p.h,'#bd7138','#81451f',2);rect(p.x+2,p.y+2,p.w-4,3,'#efab59');for(let x=p.x+12;x<p.x+p.w;x+=16)rect(x,p.y+5,2,p.h-7,'#8b4a22')}
}
function drawCoin(c){if(!c.on)return;const narrow=Math.abs(Math.sin(c.a))>.65;rect(c.x+(narrow?3:0),c.y,narrow?3:9,12,'#ffd447');rect(c.x+(narrow?3:2),c.y+2,narrow?1:3,7,'#fff08a')}
function drawEnemy(e){
 if(!e.on)return;
 const x=e.x,y=e.y,face=e.v>=0?1:-1;
 ctx.save();ctx.translate(snap(x+12),snap(y));ctx.scale(face,1);
 if(e.type==='kid'){
  rect(-6,1,12,8,'#f0bd91');rect(-7,8,14,10,'#2f69b1');rect(-7,10,14,2,'#fff');rect(-7,14,14,2,'#fff');rect(-6,18,5,6,'#25324a');rect(1,18,5,6,'#25324a');rect(-4,3,2,2,'#222');rect(2,3,2,2,'#222');
 }else if(e.type==='bull'){
  rect(-11,8,20,12,'#5b3526');rect(7,4,10,12,'#6a3d29');poly([[-10,8],[-16,3],[-9,5]],'#eee1c1');poly([[13,5],[18,0],[16,8]],'#eee1c1');rect(10,8,2,2,'#111');rect(-8,20,5,4,'#3b261d');rect(3,20,5,4,'#3b261d');
 }else if(e.type==='baguette'){
  poly([[-13,7],[-8,1],[12,5],[14,12],[9,18],[-11,14]],'#d89d4d');rect(-7,5,3,8,'#f0c779');rect(0,6,3,8,'#f0c779');rect(7,7,3,8,'#f0c779');rect(10,9,2,2,'#222');
 }else if(e.type==='cyclist'){
  ctx.strokeStyle='#252b34';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-8,18,6,0,Math.PI*2);ctx.arc(10,18,6,0,Math.PI*2);ctx.stroke();line(-8,18,0,7,2,'#c44747');line(0,7,10,18,2,'#c44747');line(-8,18,5,18,2,'#c44747');rect(-2,-2,8,8,'#f0bd91');rect(-4,6,11,8,'#315d91');rect(-1,-5,7,3,'#ffd447');
 }else if(e.type==='ninja'){
  rect(-8,1,16,20,'#171a22');rect(-6,4,12,6,'#c8a080');rect(-5,5,3,2,'#fff');rect(2,5,3,2,'#fff');rect(-8,18,6,6,'#0e1016');rect(2,18,6,6,'#0e1016');line(7,4,15,-5,2,'#9ca7b0');
 }else if(e.type==='chef'){
  rect(-7,3,14,18,'#f4f1e9');rect(-6,-4,12,8,'#fff');rect(-9,-1,5,5,'#fff');rect(4,-1,5,5,'#fff');rect(-4,5,8,6,'#e5b58b');rect(-3,6,2,2,'#222');rect(2,6,2,2,'#222');line(7,10,16,2,3,'#c9d0d5');line(16,2,19,0,2,'#333');line(-7,10,-16,2,3,'#c9d0d5');line(-16,2,-19,0,2,'#333');
 }
 ctx.restore();
}

function person(x,y,body,hair,style='casual'){
 const step=Math.floor(player.anim)%2;
 rect(x+4,y,7,7,'#f0bd91');rect(x+3,y,9,2,hair);
 if(style==='bride'){
  rect(x+2,y+7,11,9,'#f6f1e8');poly([[x-1,y+16],[x+15,y+16],[x+19,y+22],[x-5,y+22]],'#f6f1e8');
  rect(x+1,y-3,13,3,'#f5f2ed');rect(x+13,y,3,12,'#e9e4de');
 }else if(style==='groom'){
  rect(x+2,y+7,11,11,'#20242b');rect(x+6,y+7,3,8,'#f4f0e9');rect(x+7,y+8,1,3,'#111');rect(x+2,y+13,11,2,'#111');
 }else{
  rect(x+2,y+7,11,11,body);rect(x+13,y+9,2,6,'#f0bd91');
 }
 rect(x+3,y+18+step,3,6-step,'#18233b');rect(x+9,y+18+(1-step),3,5+step,'#18233b');
}
function spriteColors(){
 const theme=themeAt(player.x+7);
 if(theme==='spain')return['#d95e43','#efb64a'];if(theme==='france')return['#315d91','#d85e78'];
 if(theme==='belgium')return['#343941','#d29d3e'];if(theme==='amsterdam')return['#edb52f','#47a1b3'];
 if(theme==='japan')return['#466da2','#dc6687'];if(theme==='korea')return['#222a3b','#815bc2'];
 return['#ef6b38','#e75f8d'];
}
function drawDog(x,y,sitting=false,face=1){
 ctx.save();
 ctx.translate(snap(x),snap(y));
 ctx.scale(face*.72,.72);
 const black='#151922',shade='#252b36',white='#f5f3eb';
 if(sitting){
  rect(-7,-15,13,15,black);rect(-5,-23,10,10,black);rect(-7,-26,4,6,black);rect(3,-26,4,6,black);
  rect(-9,-6,5,7,shade);rect(4,-6,5,7,shade);
  rect(-4,-12,3,3,white);rect(1,-12,3,3,white);rect(-5,-10,10,3,white);rect(-4,-7,8,3,white);rect(-2,-4,4,2,white);
  rect(-3,-20,2,2,'#fff');rect(2,-20,2,2,'#fff');rect(4,-16,3,2,'#8e6a54');
 }else{
  const step=Math.floor(player.anim)%2;
  rect(-9,-13,17,11,black);rect(6,-18,9,10,black);rect(7,-22,4,6,black);rect(12,-21,4,5,black);
  rect(-7,-2+step,4,5-step,black);rect(3,-2+(1-step),4,4+step,black);rect(13,-15,3,2,black);
  rect(9,-16,2,2,'#707680');line(-9,-11,-14,-17,3,black);
 }
 ctx.restore();
}
function drawHero(){
 if(player.inv&&Math.floor(player.inv*12)%2===0)return;
 const colors=spriteColors(),duo=metGirl||stageIndex(player.x)>1,wedding=stageIndex(player.x)===8;
 ctx.save();ctx.translate(snap(player.x+7),snap(player.y));ctx.scale(player.face,1);
 if(!duo)person(-6,0,colors[0],'#5e3926');
 else if(wedding){person(-13,-1,colors[0],'#5e3926','groom');person(2,-1,colors[1],'#49302a','bride')}
 else{person(-13,0,colors[0],'#5e3926');person(2,0,colors[1],'#49302a')}
 ctx.restore();
}
function drawGirlNpc(){
 if(metGirl)return;const x=SEG+245;if(x<cam-30||x>cam+W+30)return;
 person(x,GROUND-24,'#e75f8d','#49302a');rect(x+4,GROUND-39,8,5,'#ff789d');rect(x+7,GROUND-44,2,5,'#ff789d');
}
function drawDogNpc(){
 if(!metDog){if(DOG_X<cam-35||DOG_X>cam+W+35)return;drawDog(DOG_X,GROUND,true,1);return}
 drawDog(dogTrailX,dogTrailY,false,dogTrailFace);
}
function drawCheckpoint(c){rect(c.x,181,3,45,'#f0ead9');rect(c.x+3,182,21,10,c.on?'#ffd447':'#e84d6b')}
function drawGoal(){rect(FINISH_X+22,135,5,91,'#f5f0df');rect(FINISH_X+27,140,28,15,'#e84d6b');rect(FINISH_X+35,145,4,4,'#fff')}

function drawCrowd(){
 const start=FINISH_X-88,colors=['#315d91','#d95e43','#e3b54c','#47a1b3','#8b5dc7','#6aad73','#e75f8d'];
 for(let row=0;row<3;row++)for(let i=0;i<11;i++){
  const x=start+i*18+(row%2)*8,y=GROUND-23-row*14;
  rect(x+3,y,7,7,['#e8b78d','#a96d4c','#6e4936','#d8a47f'][i%4]);rect(x+3,y,7,2,['#3b2d28','#6d4b2e','#1f2028'][i%3]);
  rect(x+1,y+7,11,13,colors[(i+row)%colors.length]);rect(x+3,y+20,3,4,'#202838');rect(x+8,y+20,3,4,'#202838');
  if((i+row)%4===0){rect(x+4,y-8,4,4,'#ff7fa5');rect(x+6,y-12,2,4,'#ff7fa5')}
 }
}
function drawFlames(){
 for(const f of flameBursts){
  const k=clamp(f.t/1.15,0,1),h=(1-k)*12+48*k;
  poly([[f.x-9,GROUND],[f.x-5,GROUND-h*.6],[f.x,GROUND-h],[f.x+5,GROUND-h*.62],[f.x+10,GROUND]],'#ff713d');
  poly([[f.x-5,GROUND],[f.x-2,GROUND-h*.45],[f.x+1,GROUND-h*.7],[f.x+5,GROUND]],'#ffd447');
  rect(f.x-11,GROUND,22,4,'#2a2730');
 }
}
function drawCelebrationParticles(){
 for(const p of celebrationParticles){
  ctx.save();ctx.translate(snap(p.x),snap(p.y));ctx.rotate(p.spin);rect(-p.size/2,-1,p.size,2,p.color);ctx.restore();
 }
}
function draw(){
 ctx.clearRect(0,0,W,H);staticBackground();
 ctx.save();ctx.translate(-snap(cam),0);
 for(const p of platforms)drawPlatform(p);for(const c of checkpoints)drawCheckpoint(c);drawGoal();
 for(const c of coins)drawCoin(c);for(const e of enemies)drawEnemy(e);
 drawCrowd();drawGirlNpc();drawDogNpc();drawHero();drawFlames();
 for(const p of particles)rect(p.x,p.y,p.size,p.size,p.color);
 drawCelebrationParticles();
 ctx.restore();
}
function frame(timestamp){
 const dt=Math.min((timestamp-last)/1000||0,.05);last=timestamp;accumulator+=dt;
 while(accumulator>=1/120){update(1/120);accumulator-=1/120}
 draw();requestAnimationFrame(frame);
}
setTimeout(()=>document.querySelector('#tips').style.opacity='.35',7000);
window.__SIDE_SCROLLING_LIFE__=Object.freeze({
 getState:()=>({stage:stageIndex(player.x),playerX:player.x,playerY:player.y,velocityX:player.vx,velocityY:player.vy,jumpsLeft:player.jumpsLeft,metGirl,metDog,dogX:dogTrailX,dogY:dogTrailY,state}),
 getEnemySummary:()=>enemies.map(enemy=>({type:enemy.type,x:enemy.x,on:enemy.on})),
 teleportToStage,
 setInput:(name,value)=>{if(Object.prototype.hasOwnProperty.call(key,name))key[name]=value?1:0},
 jump:()=>{pressed.jump=1},
 step:(dt=1/120)=>{update(dt);draw()}
});
draw();
canvas.dataset.ready='true';
window.__SIDE_SCROLLING_LIFE_BOOTED__=true;
requestAnimationFrame(frame);
