'use strict';

const FINAL_STAGE_START=SEG*(stages.length-1);
for(let i=platforms.length-1;i>=0;i--)if(platforms[i].x>=FINAL_STAGE_START)platforms.splice(i,1);
platforms.push({x:FINAL_STAGE_START,y:GROUND,w:SEG,h:44,type:0,ceremony:true});
for(let i=enemies.length-1;i>=0;i--)if(enemies[i].x>=FINAL_STAGE_START)enemies.splice(i,1);
for(const enemy of enemies)if(enemy.type==='baguette')enemy.type='mime';
for(let i=coins.length-1;i>=0;i--)if(coins[i].x>=FINAL_STAGE_START)coins.splice(i,1);
const standardConfettiBurst=spawnConfetti;
spawnConfetti=function(){for(let burst=0;burst<4;burst++)standardConfettiBurst()};
launchFlames=function(){flameBursts.length=0};

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
  rect(-6,1,12,8,'#f0bd91');rect(-7,8,14,10,'#f7f7f2');rect(-7,8,3,10,'#2f69b1');rect(-2,8,3,10,'#2f69b1');rect(3,8,3,10,'#2f69b1');rect(-6,18,5,6,'#25324a');rect(1,18,5,6,'#25324a');rect(-4,3,2,2,'#222');rect(2,3,2,2,'#222');
 }else if(e.type==='bull'){
  rect(-11,8,20,12,'#5b3526');rect(7,4,10,12,'#6a3d29');poly([[-10,8],[-16,3],[-9,5]],'#eee1c1');poly([[13,5],[18,0],[16,8]],'#eee1c1');rect(10,8,2,2,'#111');rect(-8,20,5,4,'#3b261d');rect(3,20,5,4,'#3b261d');
 }else if(e.type==='mime'){
  const step=Math.floor(player.anim)%2;
  rect(-6,-1,12,8,'#f3eee8');rect(-7,-4,14,4,'#15171c');rect(-5,1,2,2,'#222');rect(3,1,2,2,'#222');rect(-2,5,4,1,'#b64855');
  rect(-7,7,14,11,'#f5f2ed');rect(-7,9,14,2,'#17191f');rect(-7,13,14,2,'#17191f');rect(-8,18+step,5,6-step,'#17191f');rect(3,18+(1-step),5,5+step,'#17191f');
  rect(-10,8,3,9,'#f3eee8');rect(7,8,3,9,'#f3eee8');rect(-11,15,4,3,'#17191f');rect(7,15,4,3,'#17191f');ctx.save();ctx.translate(10,7);ctx.rotate(-.38);
  poly([[-2,-5],[2,-7],[7,15],[4,19],[0,17],[-4,-3]],'#d89d4d');rect(-1,-2,5,2,'#f0c779');rect(1,5,5,2,'#f0c779');rect(3,12,4,2,'#f0c779');ctx.restore();
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
 const step=Math.floor(player.anim)%2;rect(x+4,y,7,7,'#f0bd91');rect(x+3,y,9,2,hair);
 if(style==='bride'){rect(x+2,y+7,11,9,'#f6f1e8');poly([[x-1,y+16],[x+15,y+16],[x+19,y+22],[x-5,y+22]],'#f6f1e8');rect(x+1,y-3,13,3,'#f5f2ed');rect(x+13,y,3,12,'#e9e4de')}
 else if(style==='groom'){rect(x+2,y+7,11,11,'#20242b');rect(x+6,y+7,3,8,'#f4f0e9');rect(x+7,y+8,1,3,'#111');rect(x+2,y+13,11,2,'#111')}
 else{rect(x+2,y+7,11,11,body);rect(x+13,y+9,2,6,'#f0bd91')}
 rect(x+3,y+18+step,3,6-step,'#18233b');rect(x+9,y+18+(1-step),3,5+step,'#18233b');
}
function spriteColors(){const theme=themeAt(player.x+7);if(theme==='spain')return['#d95e43','#efb64a'];if(theme==='france')return['#315d91','#d85e78'];if(theme==='belgium')return['#343941','#d29d3e'];if(theme==='amsterdam')return['#edb52f','#47a1b3'];if(theme==='japan')return['#466da2','#dc6687'];if(theme==='korea')return['#222a3b','#815bc2'];return['#ef6b38','#e75f8d']}
function drawDog(x,y,sitting=false,face=1){
 ctx.save();ctx.translate(snap(x),snap(y));ctx.scale(face*.72,.72);const black='#151922',shade='#252b36',white='#f5f3eb';
 if(sitting){rect(-7,-15,13,15,black);rect(-5,-23,10,10,black);rect(-7,-26,4,6,black);rect(3,-26,4,6,black);rect(-9,-6,5,7,shade);rect(4,-6,5,7,shade);rect(-4,-12,3,3,white);rect(1,-12,3,3,white);rect(-5,-10,10,3,white);rect(-4,-7,8,3,white);rect(-2,-4,4,2,white);rect(-3,-20,2,2,'#fff');rect(2,-20,2,2,'#fff');rect(4,-16,3,2,'#8e6a54')}
 else{const step=Math.floor(player.anim)%2;rect(-9,-13,17,11,black);rect(6,-18,9,10,black);rect(7,-22,4,6,black);rect(12,-21,4,5,black);rect(-7,-2+step,4,5-step,black);rect(3,-2+(1-step),4,4+step,black);rect(13,-15,3,2,black);rect(9,-16,2,2,'#707680');line(-9,-11,-14,-17,3,black)}ctx.restore();
}
function drawTravelCar(){const bounce=player.on?Math.sin(player.anim*1.7)*.5:0;ctx.save();ctx.translate(snap(player.x+7),snap(player.y+9+bounce));ctx.scale(player.face,1);rect(-24,4,48,13,'#d9dde2');rect(-20,1,35,8,'#f7f7f3');poly([[-14,1],[-7,-7],[9,-7],[17,1]],'#f7f7f3');rect(-10,-5,8,6,'#8bc2dc');rect(1,-5,8,6,'#8bc2dc');line(-1,-7,-1,2,1,'#9299a1');rect(-8,-4,4,4,'#e4ad84');rect(3,-4,4,4,'#e4ad84');rect(-8,-5,4,1,'#5e3926');rect(3,-5,4,1,'#49302a');rect(-25,8,4,4,'#ffd65e');rect(21,8,4,4,'#e55a5a');rect(-18,16,10,4,'#242a32');rect(9,16,10,4,'#242a32');ctx.restore()}
function drawHero(){if(player.inv&&Math.floor(player.inv*12)%2===0)return;const stage=stageIndex(player.x),colors=spriteColors(),duo=metGirl||stage>1,wedding=stage===8,travelling=stage===2||stage===7;if(travelling){drawTravelCar();return}ctx.save();ctx.translate(snap(player.x+7),snap(player.y));ctx.scale(player.face,1);if(!duo)person(-6,0,colors[0],'#5e3926');else if(wedding){person(-13,-1,colors[0],'#5e3926','groom');person(2,-1,colors[1],'#49302a','bride')}else{person(-13,0,colors[0],'#5e3926');person(2,0,colors[1],'#49302a')}ctx.restore()}
function drawTinyBirds(){const stage=stageIndex(cam+W*.5);if(stage%2!==1)return;const base=stage*SEG,t=player.anim;for(let i=0;i<5;i++){const x=base+90+((i*173+t*18)%(SEG-130)),y=42+(i*19)%54+Math.sin(t*2+i)*2;line(x-3,y,x,y-2,1,'#263241');line(x,y-2,x+3,y,1,'#263241')}}
function drawGirlNpc(){if(metGirl)return;const x=SEG+245;if(x<cam-30||x>cam+W+30)return;person(x,GROUND-24,'#e75f8d','#49302a');rect(x+4,GROUND-39,8,5,'#ff789d');rect(x+7,GROUND-44,2,5,'#ff789d')}
function drawDogNpc(){if(!metDog){if(DOG_X<cam-35||DOG_X>cam+W+35)return;drawDog(DOG_X,GROUND,true,1);return}drawDog(dogTrailX,dogTrailY,false,dogTrailFace)}
function drawCheckpoint(c){rect(c.x,181,3,45,'#f0ead9');rect(c.x+3,182,21,10,c.on?'#ffd447':'#e84d6b')}
function drawGoal(){const x=FINISH_X+26;rect(x,151,4,75,'#f4ead5');rect(x+34,151,4,75,'#f4ead5');poly([[x-5,155],[x+17,131],[x+39,155]],'#f7f0df');rect(x+8,168,19,5,'#dfc79c')}
function weddingGuest(x,y,index,near=false){const skin=['#e8b78d','#a96d4c','#6e4936','#d8a47f'][index%4],hair=['#3b2d28','#6d4b2e','#1f2028'][index%3],clothes=['#315d91','#d95e43','#e3b54c','#47a1b3','#8b5dc7','#6aad73','#e75f8d'][index%7],s=near?1.12:.9;ctx.save();ctx.translate(x,y);ctx.scale(s,s);rect(3,-21,7,7,skin);rect(3,-21,7,2,hair);rect(1,-14,11,13,clothes);rect(3,-1,3,4,'#202838');rect(8,-1,3,4,'#202838');if(index%4===0){rect(4,-29,4,4,'#ff7fa5');rect(6,-33,2,4,'#ff7fa5')}ctx.restore()}
function drawWeddingAisle(){const start=FINISH_X-410,end=FINISH_X+55;poly([[start,GROUND],[end,GROUND],[end-16,GROUND-18],[start+20,GROUND-10]],'#efe3cf');for(let x=start+34;x<end-45;x+=58){rect(x,GROUND-7,2,7,'#d8c3a5');rect(x+26,GROUND-7,2,7,'#d8c3a5')}for(let x=start+42;x<end-55;x+=74){line(x,GROUND-3,x+2,128,4,'#6f573f');line(x+45,GROUND-3,x+43,128,4,'#6f573f');poly([[x-5,137],[x+7,119],[x+22,126],[x+43,119],[x+52,138]],'#4f8b58');for(let i=0;i<7;i++){const px=x+i*8,py=126+(i%2)*5;rect(px,py,7,5,i%3===0?'#f6d7df':'#76a86e')}}}
function drawWeddingFarGuests(){const start=FINISH_X-390;for(let i=0;i<12;i++)weddingGuest(start+i*31,190-(i%2)*3,i,false)}
function drawWeddingNearGuests(){const start=FINISH_X-378;for(let i=0;i<11;i++)weddingGuest(start+i*34,GROUND+3+(i%2)*2,i+12,true)}
function drawOfficiant(){const x=FINISH_X+39,y=GROUND-25;rect(x+4,y,7,7,'#c99570');rect(x+3,y,9,2,'#494038');rect(x+1,y+7,13,17,'#4a395f');rect(x+5,y+8,5,13,'#efe7d5');rect(x-5,y+10,6,3,'#c99570');rect(x+14,y+10,6,3,'#c99570');rect(x+3,y+24,4,3,'#272333');rect(x+9,y+24,4,3,'#272333')}
function drawWeddingPetals(){if(player.x<FINISH_X-520)return;const t=player.anim;for(let i=0;i<22;i++){const x=FINISH_X-430+((i*47+t*15)%510),y=90+((i*29+t*9)%115);poly([[x,y],[x+3,y-2],[x+6,y+1],[x+3,y+4]],i%3===0?'#fff3f5':'#f4b7ca')}}
function drawThrillerDancer(){
 if(state!=='win')return;
 const entrance=clamp(celebrationClock/3,0,1),x=FINISH_X-520+entrance*225,y=GROUND-30,bounce=Math.sin(celebrationClock*9)*1.2,posed=entrance>=1;
 ctx.save();ctx.translate(snap(x),snap(y+bounce));
 rect(-5,-14,10,8,'#a96d4c');rect(-7,-18,14,6,'#17181d');rect(-5,-12,10,2,'#17181d');rect(-2,-10,4,2,'#f2eee8');
 poly([[-10,-8],[10,-8],[9,10],[-9,10]],'#d52d35');rect(-7,-6,3,14,'#17181d');rect(4,-6,3,14,'#17181d');rect(-2,-7,4,16,'#9e1d27');
 rect(-8,10,7,15,'#c92b34');rect(1,10,7,15,'#c92b34');rect(-8,24,8,4,'#f1eee5');rect(1,24,8,4,'#f1eee5');rect(-10,27,10,3,'#17181d');rect(1,27,10,3,'#17181d');
 if(posed){line(-8,-5,-17,-22,4,'#d52d35');line(8,-5,17,-22,4,'#d52d35');rect(-19,-25,5,5,'#a96d4c');rect(14,-25,5,5,'#a96d4c');line(-17,-25,-14,-29,2,'#a96d4c');line(17,-25,14,-29,2,'#a96d4c')}
 else{const swing=Math.sin(celebrationClock*10)*5;line(-8,-5,-13,6+swing,4,'#d52d35');line(8,-5,13,6-swing,4,'#d52d35')}
 ctx.restore();
}
function drawCelebrationParticles(){for(const p of celebrationParticles){ctx.save();ctx.translate(snap(p.x),snap(p.y));ctx.rotate(p.spin);rect(-p.size/2,-1,p.size,2,p.color);ctx.restore()}}
function drawCinematicOverlay(){const proximity=clamp((player.x-(FINISH_X-620))/420,0,1);if(proximity<=0)return;ctx.save();ctx.globalAlpha=.16*proximity;rect(0,0,W,H,'#2b1624');ctx.globalAlpha=.78*proximity;rect(0,0,W,8,'#09070b');rect(0,H-8,W,8,'#09070b');if(typeof ctx.createRadialGradient==='function'){const gradient=ctx.createRadialGradient(W*.62,H*.5,45,W*.62,H*.5,250);gradient.addColorStop(0,'rgba(0,0,0,0)');gradient.addColorStop(1,`rgba(0,0,0,${.6*proximity})`);ctx.fillStyle=gradient;ctx.fillRect(0,0,W,H)}ctx.restore()}
function draw(){ctx.clearRect(0,0,W,H);staticBackground();ctx.save();ctx.translate(-snap(cam),0);drawTinyBirds();for(const p of platforms)drawPlatform(p);for(const c of checkpoints)drawCheckpoint(c);drawGoal();for(const c of coins)drawCoin(c);for(const e of enemies)drawEnemy(e);drawWeddingAisle();drawWeddingFarGuests();drawOfficiant();drawWeddingPetals();drawGirlNpc();drawDogNpc();drawHero();drawThrillerDancer();drawWeddingNearGuests();for(const p of particles)rect(p.x,p.y,p.size,p.size,p.color);drawCelebrationParticles();ctx.restore();drawCinematicOverlay()}
function frame(timestamp){const dt=Math.min((timestamp-last)/1000||0,.05);last=timestamp;accumulator+=dt;while(accumulator>=1/120){update(1/120);accumulator-=1/120}draw();requestAnimationFrame(frame)}
setTimeout(()=>document.querySelector('#tips').style.opacity='.35',7000);
window.__SIDE_SCROLLING_LIFE__=Object.freeze({getState:()=>({stage:stageIndex(player.x),playerX:player.x,playerY:player.y,velocityX:player.vx,velocityY:player.vy,jumpsLeft:player.jumpsLeft,metGirl,metDog,dogX:dogTrailX,dogY:dogTrailY,state}),getEnemySummary:()=>enemies.map(enemy=>({type:enemy.type,x:enemy.x,on:enemy.on})),teleportToStage,setInput:(name,value)=>{if(Object.prototype.hasOwnProperty.call(key,name))key[name]=value?1:0},jump:()=>{pressed.jump=1},step:(dt=1/120)=>{update(dt);draw()}});
draw();canvas.dataset.ready='true';window.__SIDE_SCROLLING_LIFE_BOOTED__=true;requestAnimationFrame(frame);