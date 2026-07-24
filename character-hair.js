'use strict';

const basePersonRenderer=person;
person=function(x,y,body,hair,style='casual'){
 const hasShoulderHair=style==='shoulderHair'||style==='shoulderHairGlasses'||style==='brideGlasses';
 const baseStyle=style==='groomBeard'?'groom':style==='brideGlasses'?'bride':hasShoulderHair?'casual':style;
 basePersonRenderer(x,y,body,hair,baseStyle);

 if(hasShoulderHair){
  // Long hair falls from the crown and curves over the character's right shoulder.
  rect(x+10,y+1,4,8,hair);
  rect(x+11,y+6,5,7,hair);
  rect(x+10,y+12,4,5,hair);
  rect(x+9,y+15,3,3,hair);
 }

 if(style==='firstBeard'||style==='groomBeard'){
  // Compact beard covering the lower half of the first character's face.
  rect(x+4,y+4,7,3,'#4a2d20');
  rect(x+5,y+3,5,2,'#4a2d20');
 }

 if(style==='shoulderHairGlasses'||style==='brideGlasses'){
  // Two round lenses joined by a small bridge.
  ctx.save();
  ctx.strokeStyle='#292633';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(snap(x+5.5),snap(y+3.5),2,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.arc(snap(x+9.5),snap(y+3.5),2,0,Math.PI*2);ctx.stroke();
  line(x+7.5,y+3.5,x+7.5,y+3.5,1,'#292633');
  ctx.restore();
 }
};

drawGirlNpc=function(){
 if(metGirl)return;
 const x=SEG+245;
 if(x<cam-30||x>cam+W+30)return;
 person(x,GROUND-24,'#e75f8d','#49302a','shoulderHairGlasses');
 rect(x+4,GROUND-39,8,5,'#ff789d');
 rect(x+7,GROUND-44,2,5,'#ff789d');
};

drawHero=function(){
 if(player.inv&&Math.floor(player.inv*12)%2===0)return;
 const stage=stageIndex(player.x),colors=spriteColors(),duo=metGirl||stage>1,wedding=stage===8,travelling=stage===2||stage===7;
 if(travelling){drawTravelCar();return}
 ctx.save();ctx.translate(snap(player.x+7),snap(player.y));ctx.scale(player.face,1);
 if(!duo)person(-6,0,colors[0],'#5e3926','firstBeard');
 else if(wedding){person(-13,-1,colors[0],'#5e3926','groomBeard');person(2,-1,colors[1],'#49302a','brideGlasses')}
 else{person(-13,0,colors[0],'#5e3926','firstBeard');person(2,0,colors[1],'#49302a','shoulderHairGlasses')}
 ctx.restore();
};