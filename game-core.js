'use strict';

const canvas=document.querySelector('#game');
const ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;

const ui={
 score:document.querySelector('#score'),lives:document.querySelector('#lives'),speed:document.querySelector('#speed'),
 stageName:document.querySelector('#stage-name'),stageSub:document.querySelector('#stage-sub'),progress:document.querySelector('#progress-bar'),
 banner:document.querySelector('#banner'),bannerTitle:document.querySelector('#banner-title'),bannerSub:document.querySelector('#banner-sub'),
 message:document.querySelector('#message'),messageTitle:document.querySelector('#message-title'),messageDetail:document.querySelector('#message-detail')
};

const W=480,H=270,GROUND=226,SEG=1200,WORLD_W=SEG*9,GRAVITY=780;
const BASE_SPEED=70,MAX_SPEED=BASE_SPEED*2,GROUND_ACCELERATION=144,SPRINT_ACCELERATION=256,AIR_ACCELERATION=84,GROUND_DECELERATION=145,TURN_ACCELERATION=380;
const DOG_X=SEG*6+310,FINISH_X=WORLD_W-92;

const stages=[
 {id:'porto1',title:'PORTO',sub:'THE BEGINNING'},
 {id:'portoMeet',title:'PORTO',sub:'TOGETHER'},
 {id:'outbound',title:'THE ROAD NORTH',sub:'SPAIN · FRANCE · BELGIUM'},
 {id:'amsterdam1',title:'AMSTERDAM',sub:'A NEW HOME'},
 {id:'japan',title:'JAPAN',sub:'ACROSS THE WORLD'},
 {id:'korea',title:'KOREA',sub:'NEON NIGHTS'},
 {id:'amsterdam2',title:'AMSTERDAM',sub:'KYUUBI JOINS THE JOURNEY'},
 {id:'return',title:'THE ROAD HOME',sub:'BELGIUM · FRANCE · SPAIN'},
 {id:'portoFinal',title:'PORTO',sub:'THE WEDDING'}
];

const zones=[
 {a:0,b:1200,t:'porto'},{a:1200,b:2400,t:'porto'},
 {a:2400,b:2800,t:'spain'},{a:2800,b:3200,t:'france'},{a:3200,b:3600,t:'belgium'},
 {a:3600,b:4800,t:'amsterdam'},{a:4800,b:6000,t:'japan'},{a:6000,b:7200,t:'korea'},
 {a:7200,b:8400,t:'amsterdam'},
 {a:8400,b:8800,t:'belgium'},{a:8800,b:9200,t:'france'},{a:9200,b:9600,t:'spain'},
 {a:9600,b:10800,t:'porto'}
];

const palette={
 porto:{sky:'#68bce3',horizon:'#d6d9ba',far:'#8bc088',near:'#4d9569',soil:'#85502d',grass:'#4bbd59',water:'#358db5'},
 spain:{sky:'#f4b15d',horizon:'#f0d096',far:'#d7aa63',near:'#ba7943',soil:'#97542e',grass:'#8caf43',water:'#4293b5'},
 france:{sky:'#7cbce7',horizon:'#d9e0d4',far:'#a6c58d',near:'#6fa078',soil:'#7d563c',grass:'#5caf5b',water:'#4b91b6'},
 belgium:{sky:'#899fb8',horizon:'#d5d4c4',far:'#a1ae95',near:'#698873',soil:'#735044',grass:'#5a9957',water:'#557f9d'},
 amsterdam:{sky:'#76bddd',horizon:'#dce5df',far:'#aacdc9',near:'#6d9f7a',soil:'#62462f',grass:'#56a45e',water:'#338bb4'},
 japan:{sky:'#eca1b6',horizon:'#f4d9d7',far:'#bea0b6',near:'#986d8e',soil:'#724d3c',grass:'#5ca16d',water:'#487fa7'},
 korea:{sky:'#5f4e89',horizon:'#c18cad',far:'#765f92',near:'#414967',soil:'#4e3e54',grass:'#6a9865',water:'#3a627e'}
};

let scale=1,cam=0,last=0,accumulator=0,score=0,lives=3,state='play',messageTime=0,spawn=34;
let metGirl=false,metDog=false,celebrating=false,bannerTime=2.6,previousStage=0,lastHudSignature='';
let player,particles=[],celebrationParticles=[],flameBursts=[],celebrationClock=0,dogTrailX=DOG_X,dogTrailY=GROUND,dogTrailFace=1;

const key={left:0,right:0,jump:0,sprint:0},pressed={jump:0};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const snap=v=>Math.round(v);

function fit(){
 const shell=document.querySelector('#shell'),ratio=W/H;
 let width=innerWidth,height=innerHeight;
 if(width/height>ratio)width=height*ratio;else height=width/ratio;
 scale=Math.min(width/W,height/H);
 shell.style.width=Math.floor(W*scale)+'px';
 shell.style.height=Math.floor(H*scale)+'px';
}
addEventListener('resize',fit);fit();

function stageIndex(x){return clamp(Math.floor(x/SEG),0,stages.length-1)}
function themeAt(x){for(const zone of zones)if(x>=zone.a&&x<zone.b)return zone.t;return'porto'}
function keyName(code){
 if(code==='ArrowLeft'||code==='KeyA')return'left';
 if(code==='ArrowRight'||code==='KeyD')return'right';
 if(code==='ArrowUp'||code==='KeyW'||code==='Space')return'jump';
 if(code==='ShiftLeft'||code==='ShiftRight')return'sprint';
 return'';
}
function teleportToStage(index){
 index=clamp(index,0,stages.length-1);
 player.x=index*SEG+42;player.y=GROUND-player.h;player.vx=0;player.vy=0;player.on=1;player.coyote=.1;player.buffer=0;player.jumpsLeft=2;
 spawn=player.x;cam=clamp(player.x-145,0,WORLD_W-W);previousStage=index;bannerTime=2.2;
 state='play';celebrating=false;celebrationClock=0;celebrationParticles=[];flameBursts=[];
 metGirl=index>=2;metDog=index>=7;dogTrailX=metDog?player.x-52:DOG_X;dogTrailY=GROUND;dogTrailFace=1;
 ui.bannerTitle.textContent=stages[index].title;ui.bannerSub.textContent=stages[index].sub;
 showMessage('STAGE '+(index+1),stages[index].title,.65);updateHud(true);
}
addEventListener('keydown',event=>{
 const name=keyName(event.code);
 if(name){event.preventDefault();if(name==='jump'&&!key.jump)pressed.jump=1;key[name]=1}
 if(/^Digit[1-9]$/.test(event.code)||/^Numpad[1-9]$/.test(event.code)){event.preventDefault();teleportToStage(Number(event.code.slice(-1))-1)}
 if(event.code==='KeyR')reset(true);
 if((state==='over'||state==='win')&&(event.code==='Enter'||event.code==='Space'))reset(true);
});
addEventListener('keyup',event=>{const name=keyName(event.code);if(name)key[name]=0});
document.querySelectorAll('button').forEach(button=>{
 const name=button.dataset.key;
 const on=event=>{event.preventDefault();if(name==='jump'&&!key.jump)pressed.jump=1;key[name]=1};
 const off=event=>{event.preventDefault();key[name]=0};
 button.addEventListener('pointerdown',on);
 ['pointerup','pointercancel','pointerleave'].forEach(type=>button.addEventListener(type,off));
});

const platforms=[];
function addPlatform(x,y,w,h=10,type=1){platforms.push({x,y,w,h,type})}
for(let i=0;i<stages.length;i++){
 const base=i*SEG;
 addPlatform(base,GROUND,360,44,0);addPlatform(base+390,GROUND,365,44,0);addPlatform(base+785,GROUND,415,44,0);
 const pattern=i%3;
 if(pattern===0){
  addPlatform(base+120,190,70);addPlatform(base+250,160,65);addPlatform(base+440,187,76);addPlatform(base+625,152,68);addPlatform(base+840,184,76);addPlatform(base+1010,143,68);
 }else if(pattern===1){
  addPlatform(base+105,181,68);addPlatform(base+235,145,72);addPlatform(base+430,170,70);addPlatform(base+610,194,65);addPlatform(base+830,160,72);addPlatform(base+1020,132,70);
 }else{
  addPlatform(base+90,194,65);addPlatform(base+215,166,70);addPlatform(base+350,132,68);addPlatform(base+535,178,70);addPlatform(base+720,151,76);addPlatform(base+940,188,72);addPlatform(base+1060,137,64);
 }
}
const coins=[];
for(let i=0;i<stages.length;i++){
 const base=i*SEG;
 [[137,178],[268,148],[460,175],[645,140],[860,172],[1028,131]].forEach((p,j)=>coins.push({x:base+p[0],y:p[1],w:9,h:12,on:1,a:i+j}));
}
const enemies=[];
const enemyTypeForTheme={porto:'kid',spain:'bull',france:'baguette',amsterdam:'cyclist',japan:'ninja',korea:'chef'};
for(const zone of zones){
 const type=enemyTypeForTheme[zone.t];
 if(!type)continue;
 const length=zone.b-zone.a,count=length>=1000?3:1;
 for(let i=0;i<count;i++){
  const center=zone.a+length*(i+1)/(count+1),range=Math.min(145,length*.32);
  enemies.push({x:center,y:GROUND-24,w:24,h:24,v:(i%2?1:-1)*(type==='cyclist'?42:30),min:center-range,max:center+range,on:1,type});
 }
}
const checkpoints=stages.slice(1).map((_,i)=>({x:(i+1)*SEG+24,on:0}));

function reset(full){
 player={x:full?34:spawn,y:204,w:15,h:22,vx:0,vy:0,on:0,coyote:0,buffer:0,face:1,inv:0,anim:0,jumpsLeft:2};
 if(full){
  score=0;lives=3;spawn=34;cam=0;metGirl=false;metDog=false;celebrating=false;celebrationClock=0;
  previousStage=0;bannerTime=2.6;particles=[];celebrationParticles=[];flameBursts=[];dogTrailX=DOG_X;dogTrailY=GROUND;dogTrailFace=1;
  coins.forEach(item=>item.on=1);enemies.forEach(item=>item.on=1);checkpoints.forEach(item=>item.on=0);
 }
 state='play';messageTime=0;ui.message.classList.remove('show');updateHud(true);
}
reset(true);

function puff(x,y,count,color){
 for(let i=0;i<count;i++)particles.push({x,y,vx:(Math.random()-.5)*90,vy:-25-Math.random()*70,t:.35+Math.random()*.4,color,size:2+Math.floor(Math.random()*2)});
}
function showMessage(title,detail='',duration=1){
 ui.messageTitle.textContent=title;ui.messageDetail.textContent=detail;ui.messageDetail.style.display=detail?'':'none';
 ui.message.classList.add('show');messageTime=duration;
}
function hurt(){
 if(player.inv||state!=='play')return;
 lives--;puff(player.x+7,player.y+10,12,'#ff5964');
 if(lives<=0){state='over';showMessage('GAME OVER','Press Enter, Space or R to restart',Infinity);return}
 player.x=spawn;player.y=198;player.vx=0;player.vy=-105;player.inv=1.6;showMessage('TRY AGAIN','',1);
}
function updateMovement(dt){
 const direction=(key.right?1:0)-(key.left?1:0);
 if(direction){
  const reversing=player.vx!==0&&Math.sign(player.vx)!==direction;
  let acceleration;
  if(reversing)acceleration=TURN_ACCELERATION;
  else if(!player.on)acceleration=AIR_ACCELERATION;
  else acceleration=key.sprint?SPRINT_ACCELERATION:GROUND_ACCELERATION;
  player.vx+=direction*acceleration*dt;
  player.vx=clamp(player.vx,-MAX_SPEED,MAX_SPEED);
  player.face=direction;
 }else{
  const deceleration=(player.on?GROUND_DECELERATION:52)*dt;
  player.vx=Math.abs(player.vx)<=deceleration?0:player.vx-Math.sign(player.vx)*deceleration;
 }
}

function spawnConfetti(){
 const colors=['#ff4f76','#ffd447','#45c7d8','#6dd36c','#9e73ff','#ffffff'];
 for(let i=0;i<180;i++)celebrationParticles.push({
  x:FINISH_X-155+Math.random()*260,y:35+Math.random()*80,
  vx:(Math.random()-.5)*115,vy:-35-Math.random()*120,g:75+Math.random()*60,
  t:3.8+Math.random()*3,color:colors[Math.floor(Math.random()*colors.length)],
  size:2+Math.floor(Math.random()*3),spin:Math.random()*8
 });
}
function launchFlames(){
 flameBursts.push({x:FINISH_X-185,y:GROUND,t:1.15},{x:FINISH_X-30,y:GROUND,t:1.15});
}
function beginCelebration(){
 if(celebrating)return;
 celebrating=true;state='win';player.vx=0;score+=3000+lives*500;
 spawnConfetti();launchFlames();showMessage('JUST MARRIED','Everyone is here · Final score: '+score,1.8);
}

function update(dt){
 if(state==='play'){
  if(pressed.jump){player.buffer=.12;pressed.jump=0}
  player.buffer=Math.max(0,player.buffer-dt);player.coyote=player.on ? .1 : Math.max(0,player.coyote-dt);player.inv=Math.max(0,player.inv-dt);
  updateMovement(dt);
  if(player.buffer&&(player.coyote||player.jumpsLeft>0)){const groundJump=player.coyote>0;player.vy=-260;player.on=0;player.buffer=0;player.coyote=0;player.jumpsLeft=groundJump?1:player.jumpsLeft-1;puff(player.x+7,player.y+22,groundJump?5:9,groundJump?'#d9b37b':'#8ed8ff')}
  if(!key.jump&&player.vy<-90)player.vy+=760*dt;
  player.vy=Math.min(player.vy+GRAVITY*dt,390);

  const oldX=player.x;player.x=clamp(player.x+player.vx*dt,0,WORLD_W-player.w);
  for(const platform of platforms)if(overlap(player,platform)){
   if(player.vx>0&&oldX+player.w<=platform.x+2){player.x=platform.x-player.w;player.vx=0}
   else if(player.vx<0&&oldX>=platform.x+platform.w-2){player.x=platform.x+platform.w;player.vx=0}
  }
  const oldY=player.y;player.y+=player.vy*dt;player.on=0;
  for(const platform of platforms)if(overlap(player,platform)){
   if(player.vy>=0&&oldY+player.h<=platform.y+3){player.y=platform.y-player.h;player.vy=0;player.on=1;player.jumpsLeft=2}
   else if(player.vy<0&&oldY>=platform.y+platform.h-3){player.y=platform.y+platform.h;player.vy=12}
  }
  if(player.y>290)hurt();
  player.anim+=dt*(4+Math.abs(player.vx)/14);

  for(const coin of coins){coin.a+=dt*5;if(coin.on&&overlap(player,coin)){coin.on=0;score+=100;puff(coin.x+4,coin.y+6,7,'#ffd447')}}
  for(const enemy of enemies){
   if(!enemy.on)continue;enemy.x+=enemy.v*dt;
   if(enemy.x<enemy.min){enemy.x=enemy.min;enemy.v=Math.abs(enemy.v)}
   if(enemy.x+enemy.w>enemy.max){enemy.x=enemy.max-enemy.w;enemy.v=-Math.abs(enemy.v)}
   if(overlap(player,enemy)){
    if(player.vy>35&&player.y+player.h-player.vy*dt<=enemy.y+6){enemy.on=0;player.vy=-175;score+=200;puff(enemy.x+9,enemy.y+9,8,'#9f67d5')}
    else hurt();
   }
  }
  for(const checkpoint of checkpoints)if(!checkpoint.on&&player.x>checkpoint.x){
   checkpoint.on=1;spawn=checkpoint.x-16;score+=200;showMessage('CHECKPOINT','',.75);
  }
  const currentStage=stageIndex(player.x);
  if(currentStage!==previousStage){
   previousStage=currentStage;bannerTime=2.2;ui.bannerTitle.textContent=stages[currentStage].title;ui.bannerSub.textContent=stages[currentStage].sub;
  }
  if(!metGirl&&player.x>SEG+245){metGirl=true;score+=500;showMessage('TOGETHER','',1.1);puff(player.x+7,player.y+8,16,'#ff7fa5')}
  if(!metDog&&player.x>DOG_X){metDog=true;dogTrailX=DOG_X;dogTrailY=GROUND;dogTrailFace=1;score+=500;showMessage('KYUUBI JOINS YOU','A small white heart on his chest',1.6);puff(DOG_X,GROUND-14,18,'#ffffff')}
  if(player.x>FINISH_X)beginCelebration();
 }

 if(metDog){const movingFace=Math.abs(player.vx)>2?Math.sign(player.vx):player.face;dogTrailFace=movingFace;const targetX=player.x-movingFace*52,targetY=player.y+player.h;dogTrailX+=(targetX-dogTrailX)*Math.min(1,dt*3.2);dogTrailY+=(targetY-dogTrailY)*Math.min(1,dt*5.2)}
 for(const p of particles){p.t-=dt;p.vy+=220*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}
 particles=particles.filter(p=>p.t>0);

 if(celebrating){
  celebrationClock+=dt;
  if(Math.floor(celebrationClock*1.4)!==Math.floor((celebrationClock-dt)*1.4))launchFlames();
  if(Math.floor(celebrationClock*.32)!==Math.floor((celebrationClock-dt)*.32))spawnConfetti();
 }
 for(const p of celebrationParticles){p.t-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.spin+=dt*8}
 celebrationParticles=celebrationParticles.filter(p=>p.t>0&&p.y<285);
 for(const flame of flameBursts)flame.t-=dt;
 flameBursts=flameBursts.filter(f=>f.t>0);

 cam+=(clamp(player.x-145,0,WORLD_W-W)-cam)*Math.min(1,dt*8);
 if(Number.isFinite(messageTime)){messageTime=Math.max(0,messageTime-dt);if(messageTime===0)ui.message.classList.remove('show')}
 bannerTime=Math.max(0,bannerTime-dt);ui.banner.classList.toggle('show',bannerTime>0);updateHud();
}
function updateHud(force=false){
 const currentStage=stageIndex(player.x),speedPercent=Math.round(Math.abs(player.vx)/BASE_SPEED*100);
 const signature=[score,lives,currentStage,speedPercent,metDog,Math.round(player.x/WORLD_W*1000)].join(':');
 if(!force&&signature===lastHudSignature)return;lastHudSignature=signature;
 ui.score.textContent=String(score).padStart(5,'0');ui.lives.textContent=Math.max(0,lives);ui.speed.textContent=speedPercent+'%';
 ui.stageName.textContent=(currentStage+1)+' / '+stages.length+' · '+stages[currentStage].title;
 ui.stageSub.textContent=stages[currentStage].sub+(metDog?' · 🐕':'');
 ui.progress.style.width=(clamp(player.x/WORLD_W,0,1)*100).toFixed(2)+'%';
}

