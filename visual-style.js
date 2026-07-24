'use strict';
(() => {
 let anime=true;
 function apply(){document.body.dataset.visualStyle=anime?'anime':'classic'}
 function toggle(){anime=!anime;apply();return anime}
 window.VISUAL_STYLE=Object.freeze({isAnime:()=>anime,toggle});
 addEventListener('keydown',event=>{
  if(event.code==='KeyK'&&!event.repeat){event.preventDefault();toggle()}
 });
 apply();
})();