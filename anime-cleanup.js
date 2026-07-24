'use strict';

// Keep the anime palette and atmosphere, but remove both diagonal line effects.
const drawAnimeAtmosphereWithLines=drawAnimeAtmosphere;
drawAnimeAtmosphere=function(theme){
 const p=activePalette(theme),sunX=W-(cam*.035%620),sunColor=theme==='korea'?'#ff7bb7':'#fff0a8';
 ctx.globalAlpha=.88;ctx.beginPath();ctx.arc(sunX,48,theme==='korea'?24:31,0,Math.PI*2);ctx.fillStyle=sunColor;ctx.fill();ctx.globalAlpha=1;
 poly([[0,152],[80,94],[155,151],[246,83],[330,151],[420,102],[W,150]],p.far);
 poly([[0,190],[95,132],[184,190],[280,121],[385,190],[W,142],[W,215],[0,215]],p.near);
 for(let i=0;i<7;i++){
  const x=((i*109-cam*.18)%600+600)%600-50,y=62+(i*31)%112;
  poly([[x,y],[x+5,y-3],[x+10,y+1],[x+5,y+5]],i%2?'#f5a0bf':'#f5d36d');
 }
};

const staticBackgroundWithDiagonalOverlay=staticBackground;
staticBackground=function(){
 const originalLine=line;
 line=function(x1,y1,x2,y2,width,color){
  const animeOverlay=window.VISUAL_STYLE?.isAnime()&&y1===0&&y2===H&&x2===x1-72&&color==='#2b2345';
  if(!animeOverlay)originalLine(x1,y1,x2,y2,width,color);
 };
 try{staticBackgroundWithDiagonalOverlay()}
 finally{line=originalLine}
};
