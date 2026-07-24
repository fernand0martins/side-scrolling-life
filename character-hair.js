'use strict';

const basePersonRenderer=person;
person=function(x,y,body,hair,style='casual'){
 const hasShoulderHair=style==='shoulderHair';
 basePersonRenderer(x,y,body,hair,hasShoulderHair?'casual':style);
 if(!hasShoulderHair)return;
 // Long hair falls from the crown and curves over the character's right shoulder.
 rect(x+10,y+1,4,8,hair);
 rect(x+11,y+6,5,7,hair);
 rect(x+10,y+12,4,5,hair);
 rect(x+9,y+15,3,3,hair);
};

drawGirlNpc=function(){
 if(metGirl)return;
 const x=SEG+245;
 if(x<cam-30||x>cam+W+30)return;
 person(x,GROUND-24,'#e75f8d','#49302a','shoulderHair');
 rect(x+4,GROUND-39,8,5,'#ff789d');
 rect(x+7,GROUND-44,2,5,'#ff789d');
};

drawHero=function(){
 if(player.inv&&Math.floor(player.inv*12)%2===0)return;
 const stage=stageIndex(player.x),colors=spriteColors(),duo=metGirl||stage>1,wedding=stage===8,travelling=stage===2||stage===7;
 if(travelling){drawTravelCar();return}
 ctx.save();ctx.translate(snap(player.x+7),snap(player.y));ctx.scale(player.face,1);
 if(!duo)person(-6,0,colors[0],'#5e3926');
 else if(wedding){person(-13,-1,colors[0],'#5e3926','groom');person(2,-1,colors[1],'#49302a','bride')}
 else{person(-13,0,colors[0],'#5e3926');person(2,0,colors[1],'#49302a','shoulderHair')}
 ctx.restore();
};