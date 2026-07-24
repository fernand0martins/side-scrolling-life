'use strict';

(() => {
 const GROUND_RELEASE_DECELERATION=260;
 const AIR_RELEASE_DECELERATION=90;

 updateMovement=function(dt){
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
   return;
  }

  const deceleration=(player.on?GROUND_RELEASE_DECELERATION:AIR_RELEASE_DECELERATION)*dt;
  player.vx=Math.abs(player.vx)<=deceleration?0:player.vx-Math.sign(player.vx)*deceleration;
 };

 window.MOVEMENT_TUNING=Object.freeze({
  groundReleaseDeceleration:GROUND_RELEASE_DECELERATION,
  airReleaseDeceleration:AIR_RELEASE_DECELERATION
 });
})();
