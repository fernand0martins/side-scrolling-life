'use strict';
(() => {
 let elapsed=0;
 const originalUpdate=update;
 const originalReset=reset;
 const originalBeginCelebration=beginCelebration;

 function formatRunTime(seconds){
  const total=Math.max(0,Math.floor(seconds));
  const hours=Math.floor(total/3600);
  const minutes=Math.floor((total%3600)/60);
  const secs=total%60;
  return hours>0
   ?`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
   :`${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
 }

 update=function(dt){
  if(state==='play')elapsed+=dt;
  originalUpdate(dt);
 };

 reset=function(full){
  if(full)elapsed=0;
  originalReset(full);
 };

 beginCelebration=function(){
  if(celebrating)return;
  originalBeginCelebration();
  if(state==='win'){
   const baseDetail=TEXT.messages.weddingDetail(score);
   ui.messageDetail.textContent=`${baseDetail} · Time: ${formatRunTime(elapsed)}`;
   ui.messageDetail.style.display='';
  }
 };

 window.RUN_TIMER=Object.freeze({
  getElapsed:()=>elapsed,
  format:()=>formatRunTime(elapsed),
  formatRunTime
 });
})();
