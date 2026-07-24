'use strict';

(() => {
 const animePorto=()=>window.VISUAL_STYLE?.isAnime();
 const basePortoRibeira=portoRibeira;
 const baseClerigos=clerigos;
 const facadeColors=['#19a6a0','#f2b632','#d94f55','#e77f42','#6cc2b0','#af3f7d','#f0d56b','#3d91a7'];
 const roofColors=['#b73b2f','#d65d2f','#8f302c','#e07835'];
 const ink='#263d43';

 function outlinedRect(x,y,w,h,fill,stroke=ink,width=1){
  rect(x,y,w,h,stroke);
  rect(x+width,y+width,w-width*2,h-width*2,fill);
 }

 function illustratedHouse(x,ground,width,height,index,fade=1){
  const y=ground-height,body=facadeColors[index%facadeColors.length],roof=roofColors[index%roofColors.length];
  ctx.save();ctx.globalAlpha=fade;
  outlinedRect(x,y,width,height,body);
  poly([[x-2,y],[x+width*.5,y-8-(index%3)*3],[x+width+2,y]],roof);
  rect(x-2,y-2,width+4,2,ink);
  const floors=Math.max(1,Math.floor((height-12)/13));
  for(let floor=0;floor<floors;floor++){
   const wy=y+8+floor*13;
   for(let column=0;column<2;column++){
    const wx=x+5+column*(width-12);
    outlinedRect(wx,wy,6,8,index%3===0?'#f4e0b7':'#d9efe4',ink,1);
    rect(wx+2,wy+1,1,6,'rgba(38,61,67,.55)');
   }
  }
  outlinedRect(x+width*.5-3,ground-12,7,12,index%2?'#6d3442':'#31585d',ink,1);
  if(index%4===0){line(x+3,ground-17,x+width-3,ground-17,1,ink);rect(x+5,ground-19,4,2,'#f1c845');rect(x+width-10,ground-19,4,2,'#4c8ec2')}
  ctx.restore();
 }

 function hillsideBand(start,end,ground,scale,offset,alpha){
  let index=0;
  for(let x=start-offset;x<end+40;){
   const width=Math.round((25+(index%4)*5)*scale),height=Math.round((34+(index*17)%54)*scale);
   illustratedHouse(x,ground,width,height,index+offset,alpha);
   x+=width-2;index++;
  }
 }

 function rabeloBoat(x,y,scale=1){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  poly([[-27,0],[24,0],[16,7],[-20,7]],'#8c3c25');
  line(-23,0,22,0,2,ink);line(-5,-1,-5,-21,2,ink);
  poly([[-4,-20],[13,-6],[-4,-7]],'#e7cf91');
  line(-31,6,-42,13,2,'#8b4b2f');line(22,4,36,10,2,'#8b4b2f');
  rect(-18,-5,5,5,'#d68235');rect(-10,-5,5,5,'#d68235');rect(5,-4,6,4,'#d68235');
  ctx.restore();
 }

 portoRibeira=function(start,end){
  if(!animePorto()){basePortoRibeira(start,end);return}
  const length=end-start;
  // Layered hill neighbourhood inspired by the supplied Porto illustration.
  hillsideBand(start,end,160,.58,18,.28);
  hillsideBand(start,end,184,.72,7,.46);
  hillsideBand(start,end,210,1,0,1);
  // Stone quay and Douro edge.
  rect(start,210,length,16,'#7e9690');
  for(let x=start;x<end;x+=18){line(x,211,x+8,225,1,'#526c6c');line(x+8,225,x+18,211,1,'#526c6c')}
  rect(start,226,length,8,'#1599a5');
  for(let x=start+90;x<end-30;x+=280)rabeloBoat(x,224,.75+(x%3)*.08);
 };

 clerigos=function(x){
  if(!animePorto()){baseClerigos(x);return}
  outlinedRect(x+2,76,30,150,'#ddb347',ink,2);
  outlinedRect(x+7,88,20,24,'#edd774',ink,1);
  outlinedRect(x+9,119,16,28,'#c99a36',ink,1);
  outlinedRect(x+10,154,14,34,'#f0cf6b',ink,1);
  for(const y of [96,128,164]){outlinedRect(x+13,y,8,10,'#90b9a7',ink,1)}
  poly([[x-2,76],[x+17,48],[x+36,76]],'#c58b32');
  rect(x+15,38,4,12,ink);ctx.beginPath();ctx.arc(x+17,36,2,0,Math.PI*2);ctx.fillStyle=ink;ctx.fill();
 };

 const baseSkybox=drawSkybox;
 drawSkybox=function(){
  baseSkybox();
  if(!animePorto()||themeAt(cam+W*.5)!=='porto')return;
  ctx.save();ctx.globalAlpha=.08;
  for(let y=8;y<142;y+=7)for(let x=(y%14);x<W;x+=13)rect(x,y,2,1,'#8b694d');
  ctx.globalAlpha=.22;
  for(let i=0;i<4;i++){const x=((i*145-cam*.06)%620+620)%620-60;poly([[x,52+i*9],[x+22,43+i*9],[x+53,50+i*9],[x+71,45+i*9],[x+99,54+i*9]],'#2eaaa1')}
  ctx.restore();
 };

 window.PORTO_REFERENCE_STYLE=Object.freeze({palette:[...facadeColors],boats:true,hillBands:3});
})();
