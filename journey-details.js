'use strict';

(() => {
 const COIN_POINTS=100;
 const BONE_MULTIPLIER=5;

 // Add four extra pickups to each playable travel stage while keeping the
 // ceremony stage focused on the wedding approach.
 const extraCoinPattern=[
  [74,202],[372,202],[770,202],[1138,202]
 ];
 for(let stage=0;stage<stages.length-1;stage++){
  const base=stage*SEG;
  for(const [offset,y] of extraCoinPattern){
   coins.push({x:base+offset,y,w:9,h:12,on:1,a:stage+offset/100,type:'coin'});
  }
 }
 for(const coin of coins)if(!coin.type)coin.type='coin';

 // The first two pickups beyond Kyuubi become higher-value bones.
 const bonePickups=coins.filter(coin=>coin.x>DOG_X).sort((a,b)=>a.x-b.x).slice(0,2);
 for(const bone of bonePickups)bone.type='bone';

 const baseDrawCoin=drawCoin;
 drawCoin=function(pickup){
  if(pickup.type!=='bone'){baseDrawCoin(pickup);return}
  if(!pickup.on)return;
  const bob=Math.sin(pickup.a)*1.5,x=pickup.x,y=pickup.y+bob;
  rect(x+2,y+3,7,5,'#f5f0df');
  rect(x,y+1,4,4,'#f5f0df');rect(x,y+6,4,4,'#f5f0df');
  rect(x+7,y+1,4,4,'#f5f0df');rect(x+7,y+6,4,4,'#f5f0df');
  rect(x+3,y+4,5,2,'#d8cfba');
 };

 const baseUpdate=update;
 update=function(dt){
  const availableBones=bonePickups.filter(bone=>bone.on);
  baseUpdate(dt);
  let collectedBones=0;
  for(const bone of availableBones)if(!bone.on)collectedBones++;
  if(collectedBones){
   score+=collectedBones*COIN_POINTS*(BONE_MULTIPLIER-1);
   updateHud(true);
  }
 };

 const baseWeddingAisle=drawWeddingAisle;
 drawWeddingAisle=function(){
  baseWeddingAisle();
  const start=(stages.length-1)*SEG+18,end=FINISH_X+28;
  let x=start,index=0;
  while(x<end){
   const progress=clamp((x-start)/(end-start),0,1);
   const clusters=1+Math.floor(progress*3);
   for(let flower=0;flower<clusters;flower++){
    const side=(flower%2===0?-1:1),spread=7+flower*4;
    const fx=x+side*spread,fy=GROUND-5-(index%3)*2;
    line(fx,fy+5,fx,fy,1,'#4f8b58');
    rect(fx-2,fy-2,3,3,(index+flower)%3===0?'#fff3f5':'#f4a9c2');
    rect(fx+1,fy-1,3,3,(index+flower)%2===0?'#f7d36d':'#f6d7df');
   }
   x+=Math.max(12,42-progress*27);
   index++;
  }
 };

 window.JOURNEY_DETAILS=Object.freeze({
  boneMultiplier:BONE_MULTIPLIER,
  boneCount:bonePickups.length,
  extraCoinCount:extraCoinPattern.length*(stages.length-1)
 });
})();