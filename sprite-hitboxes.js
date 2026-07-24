'use strict';

(() => {
 const originalUpdate=update;
 const enemyBounds={
  kid:{x:5,y:0,w:14,h:24},
  bull:{x:-4,y:0,w:34,h:24},
  mime:{x:1,y:-4,w:28,h:28},
  cyclist:{x:-2,y:-5,w:30,h:29},
  ninja:{x:4,y:-5,w:23,h:29},
  chef:{x:-7,y:-4,w:38,h:28},
  baguette:{x:1,y:-4,w:28,h:28}
 };

 function playerBounds(){
  const stage=stageIndex(player.x+7);
  if(stage===2||stage===7)return{x:-18,y:2,w:50,h:27,form:'car'};
  if(metGirl||stage>1)return{x:-4,y:0,w:29,h:24,form:'duo'};
  return{x:3,y:0,w:13,h:24,form:'single'};
 }

 function platformBounds(platform){
  if(platform.type===0)return{x:0,y:0,w:platform.w,h:platform.h,form:'ground'};
  return{x:2,y:0,w:Math.max(1,platform.w-4),h:6,form:'ledge'};
 }

 function applyBounds(entity,bounds){
  const originalWidth=entity.w,originalHeight=entity.h;
  entity.x+=bounds.x;entity.y+=bounds.y;entity.w=bounds.w;entity.h=bounds.h;
  return()=>{
   entity.x-=bounds.x;entity.y-=bounds.y;entity.w=originalWidth;entity.h=originalHeight;
  };
 }

 update=function(dt){
  const activePlayerBounds=playerBounds();
  const restorePlayer=applyBounds(player,activePlayerBounds);
  const restoreEnemies=[];
  const restorePlatforms=[];
  for(const enemy of enemies){
   const bounds=enemyBounds[enemy.type];
   if(bounds)restoreEnemies.push(applyBounds(enemy,bounds));
  }
  for(const platform of platforms)restorePlatforms.push(applyBounds(platform,platformBounds(platform)));
  try{originalUpdate(dt)}finally{
   for(let i=restorePlatforms.length-1;i>=0;i--)restorePlatforms[i]();
   for(let i=restoreEnemies.length-1;i>=0;i--)restoreEnemies[i]();
   restorePlayer();
  }
 };

 window.SPRITE_HITBOXES=Object.freeze({
  playerBounds:()=>({...playerBounds()}),
  enemyBounds:type=>enemyBounds[type]?{...enemyBounds[type]}:null,
  platformBounds:platform=>({...platformBounds(platform)})
 });
})();