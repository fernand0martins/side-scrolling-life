'use strict';

(() => {
 const realistic=()=>!window.VISUAL_STYLE?.isAnime();
 const gradient=(x0,y0,x1,y1,stops)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);for(const [p,c] of stops)g.addColorStop(p,c);return g};
 const radial=(x,y,r,stops)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);for(const [p,c] of stops)g.addColorStop(p,c);return g};
 const softRect=(x,y,w,h,fill,shadow='rgba(0,0,0,.18)')=>{ctx.save();ctx.shadowColor=shadow;ctx.shadowBlur=5;ctx.shadowOffsetY=2;ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.restore()};
 const oldSkybox=drawSkybox,oldPlatform=drawPlatform,oldCoin=drawCoin,oldEnemy=drawEnemy,oldPerson=person,oldDog=drawDog,oldCar=drawTravelCar,oldGuest=weddingGuest,oldGoal=drawGoal;

 drawSkybox=function(){
  if(!realistic()){oldSkybox();return}
  const theme=themeAt(cam+W*.5),night=theme==='korea';
  const skies={porto:['#7db6d5','#f4c99e'],spain:['#75a9cc','#e8b481'],france:['#7faac5','#ecd2ae'],belgium:['#7f91a3','#d4c6ae'],amsterdam:['#789fb5','#d9c6a5'],japan:['#8ca9bc','#efc6b2'],korea:['#263449','#c07478']};
  const pair=skies[theme]||skies.porto;
  ctx.fillStyle=gradient(0,0,0,H,[[0,pair[0]],[.58,pair[1]],[1,night?'#27313a':'#8c9b88']]);ctx.fillRect(0,0,W,H);
  const sunX=W-76-(cam*.025%120),sunY=night?54:62;
  ctx.fillStyle=radial(sunX,sunY,50,[[0,night?'rgba(255,186,164,.88)':'rgba(255,238,190,.92)'],[.28,night?'rgba(255,135,122,.28)':'rgba(255,213,145,.3)'],[1,'rgba(255,255,255,0)']]);ctx.fillRect(sunX-55,sunY-55,110,110);
  ctx.globalAlpha=.2;ctx.fillStyle='#fff';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(((i*127-cam*.08)%650+650)%650-70,35+(i%3)*24,55,10,0,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  ctx.fillStyle=gradient(0,145,0,226,[[0,night?'#5b6271':'#8c978b'],[1,night?'#2a3340':'#4f6859']]);ctx.beginPath();ctx.moveTo(0,196);for(let x=0;x<=W;x+=40)ctx.lineTo(x,174+Math.sin((x+cam*.12)/72)*16);ctx.lineTo(W,226);ctx.lineTo(0,226);ctx.fill();
 };

 drawPlatform=function(p){
  if(!realistic()){oldPlatform(p);return}
  const ground=p.type===0;
  ctx.fillStyle=ground?gradient(0,p.y,0,p.y+p.h,[[0,'#6f7657'],[.14,'#4f5e3f'],[.15,'#554536'],[1,'#292722']]):gradient(0,p.y,0,p.y+p.h,[[0,'#9b8b75'],[.2,'#756654'],[1,'#443a31']]);
  ctx.fillRect(p.x,p.y,p.w,p.h);
  ctx.fillStyle=ground?'rgba(211,219,165,.65)':'rgba(225,208,177,.45)';ctx.fillRect(p.x,p.y,p.w,ground?3:2);
  ctx.globalAlpha=.22;for(let x=p.x+8;x<p.x+p.w;x+=19){ctx.fillStyle=x%2?'#fff':'#171513';ctx.fillRect(x,p.y+9+(x%11),ground?2:1,ground?2:5)}ctx.globalAlpha=1;
 };

 drawCoin=function(c){
  if(!realistic()){oldCoin(c);return}
  if(!c.on)return;
  const bob=Math.sin(c.a)*1.5,x=c.x+4.5,y=c.y+6+bob;
  ctx.save();ctx.shadowColor=c.type==='bone'?'rgba(255,255,255,.6)':'rgba(255,190,70,.65)';ctx.shadowBlur=6;
  if(c.type==='bone'){
   ctx.strokeStyle='#ede5d5';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.stroke();
   for(const dx of [-4,4])for(const dy of [-3,3]){ctx.beginPath();ctx.arc(x+dx,y+dy,2.2,0,Math.PI*2);ctx.fillStyle='#f5efe5';ctx.fill()}
  }else{
   ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=radial(x-1,y-2,7,[[0,'#fff1a8'],[.45,'#d9a43b'],[1,'#8e5c19']]);ctx.fill();ctx.strokeStyle='#6e4715';ctx.lineWidth=1;ctx.stroke();
  }
  ctx.restore();
 };

 person=function(x,y,body,hair,style='casual'){
  if(!realistic()){oldPerson(x,y,body,hair,style);return}
  const step=Math.floor(player.anim)%2,skin='#c88e69';ctx.save();ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=3;
  ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(x+7.5,y+4,4.2,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=hair;ctx.beginPath();ctx.ellipse(x+7.5,y+1.5,5,3.2,0,Math.PI,Math.PI*2);ctx.fill();
  const formal=style==='groom'||style==='bride';ctx.fillStyle=style==='bride'?'#eee8df':style==='groom'?'#22262c':body;ctx.beginPath();ctx.roundRect(x+1,y+8,13,11,3);ctx.fill();
  if(style==='bride'){ctx.fillStyle='#f5f0e7';ctx.beginPath();ctx.moveTo(x+1,y+16);ctx.lineTo(x+14,y+16);ctx.lineTo(x+18,y+23);ctx.lineTo(x-3,y+23);ctx.closePath();ctx.fill()}
  if(style==='groom'){ctx.fillStyle='#e6e1d9';ctx.fillRect(x+6,y+8,3,8)}
  ctx.strokeStyle=formal?'#27282d':'#253044';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+4,y+18);ctx.lineTo(x+3,y+23+step);ctx.moveTo(x+10,y+18);ctx.lineTo(x+11,y+23+(1-step));ctx.stroke();ctx.restore();
 };

 drawDog=function(x,y,sitting=false,face=1){
  if(!realistic()){oldDog(x,y,sitting,face);return}
  ctx.save();ctx.translate(x,y);ctx.scale(face*.72,.72);ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=4;ctx.fillStyle='#151719';
  ctx.beginPath();ctx.ellipse(0,sitting?-8:-7,sitting?10:13,sitting?13:8,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(sitting?0:10,sitting?-19:-14,7,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#eee9df';ctx.beginPath();ctx.ellipse(sitting?0:11,sitting?-15:-12,4,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#282a2e';ctx.beginPath();ctx.arc(sitting?2:14,sitting?-20:-15,1.5,0,Math.PI*2);ctx.fill();ctx.restore();
 };

 drawTravelCar=function(){
  if(!realistic()){oldCar();return}
  const x=player.x+7,y=player.y+12;ctx.save();ctx.translate(x,y);ctx.scale(player.face,1);ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=5;ctx.fillStyle=gradient(-25,0,25,0,[[0,'#b6babd'],[.5,'#f0f1ef'],[1,'#8d9499']]);ctx.beginPath();ctx.roundRect(-25,0,50,16,5);ctx.fill();ctx.fillStyle='#a7c8d4';ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(-6,-9);ctx.lineTo(10,-9);ctx.lineTo(18,0);ctx.closePath();ctx.fill();for(const wx of [-14,14]){ctx.beginPath();ctx.arc(wx,16,5,0,Math.PI*2);ctx.fillStyle='#17191c';ctx.fill();ctx.beginPath();ctx.arc(wx,16,2,0,Math.PI*2);ctx.fillStyle='#8f969b';ctx.fill()}ctx.restore();
 };

 drawEnemy=function(e){if(!realistic()){oldEnemy(e);return}ctx.save();ctx.globalAlpha=.9;oldEnemy(e);ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(255,210,170,.22)';ctx.fillRect(e.x-10,e.y-8,45,38);ctx.restore()};
 weddingGuest=function(x,y,index,near=false){if(!realistic()){oldGuest(x,y,index,near);return}ctx.save();ctx.globalAlpha=near?.92:.68;oldGuest(x,y,index,near);ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(255,223,198,.25)';ctx.fillRect(x-4,y-30,22,34);ctx.restore()};
 drawGoal=function(){if(!realistic()){oldGoal();return}const x=FINISH_X+26;ctx.save();ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=6;ctx.strokeStyle='#eee7da';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,GROUND);ctx.lineTo(x,154);ctx.quadraticCurveTo(x+18,126,x+36,154);ctx.lineTo(x+36,GROUND);ctx.stroke();ctx.restore()};

 const oldClerigos=clerigos,oldBridge=domLuisBridge,oldSagrada=sagrada,oldEiffel=eiffel,oldAtomium=atomium,oldWindmill=windmill,oldFuji=fuji,oldPagoda=pagoda,oldNamsan=namsan,oldPalace=gyeongbokgung;
 clerigos=function(x){if(!realistic()){oldClerigos(x);return}softRect(x,64,32,162,gradient(x,64,x+32,226,[[0,'#d7c0a0'],[1,'#8e7057']]));for(let y=82;y<205;y+=21)softRect(x+10,y,12,10,'#3a322d');poly([[x-4,64],[x+16,30],[x+36,64]],'#6e513c')};
 domLuisBridge=function(x){if(!realistic()){oldBridge(x);return}ctx.save();ctx.strokeStyle='#3f4b51';ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=4;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+72,154,66,0,Math.PI,true);ctx.stroke();line(x-5,151,x+150,151,4,'#48545a');for(let px=x+12;px<x+140;px+=12)line(px,151,px,116+Math.abs(px-(x+72))*.42,1,'rgba(70,80,85,.8)');ctx.restore()};
 sagrada=function(x){if(!realistic()){oldSagrada(x);return}for(const off of [0,25,50,75,100]){const h=off%50?137:148;softRect(x+off,226-h,15,h,gradient(x,70,x+15,226,[[0,'#d6b07d'],[1,'#80664f']]));poly([[x+off-2,226-h],[x+off+7,226-h-30],[x+off+17,226-h]],'#8f7155')}softRect(x+20,124,75,102,'rgba(164,126,86,.9)')};
 eiffel=function(x){if(!realistic()){oldEiffel(x);return}ctx.save();ctx.strokeStyle='#4b4b48';ctx.lineWidth=3;ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=3;ctx.beginPath();ctx.moveTo(x,68);ctx.lineTo(x-40,226);ctx.moveTo(x,68);ctx.lineTo(x+40,226);ctx.stroke();for(let y=90;y<215;y+=14){const w=(y-68)*.25;line(x-w,y,x+w,y,1,'rgba(65,65,62,.9)')}ctx.restore()};
 atomium=function(x,y){if(!realistic()){oldAtomium(x,y);return}oldAtomium(x,y);ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x-50,y-10,100,125);ctx.restore()};
 windmill=function(x,y){if(!realistic()){oldWindmill(x,y);return}poly([[x-22,y+64],[x-13,y],[x+13,y],[x+22,y+64]],gradient(x-22,y,x+22,y+64,[[0,'#71523d'],[1,'#312821']]));softRect(x-15,y+20,30,9,'#e5dfd3');line(x,y+9,x,y-43,3,'#3a332e');line(x-48,y+9,x+48,y+9,3,'#3a332e')};
 fuji=function(x){if(!realistic()){oldFuji(x);return}ctx.fillStyle=gradient(x-120,60,x+120,226,[[0,'#a6b7c2'],[1,'#4f6570']]);poly([[x-120,226],[x,55],[x+125,226]],ctx.fillStyle);poly([[x-38,111],[x,55],[x+42,115],[x+20,107],[x,132],[x-20,107]],'#eee9e0')};
 pagoda=function(x){if(!realistic()){oldPagoda(x);return}for(const l of [{y:177,w:74},{y:150,w:62},{y:124,w:50},{y:101,w:38}]){softRect(x-l.w/2+7,l.y,l.w-14,24,'#b68e67');poly([[x-l.w/2,l.y],[x,l.y-12],[x+l.w/2,l.y]],'#3c3531')}softRect(x-4,88,8,138,'#6e3e31')};
 namsan=function(x){if(!realistic()){oldNamsan(x);return}softRect(x-2,86,5,140,'#d9dcdd');ctx.fillStyle='#c9d0d3';ctx.beginPath();ctx.ellipse(x,128,21,10,0,0,Math.PI*2);ctx.fill();poly([[x-9,86],[x,48],[x+9,86]],'#cfd4d6')};
 gyeongbokgung=function(x){if(!realistic()){oldPalace(x);return}softRect(x,169,122,57,'#aa7651');poly([[x-13,169],[x+61,126],[x+135,169]],'#3c4544');poly([[x,145],[x+61,111],[x+122,145]],'#56615f');softRect(x+49,180,24,46,'#8b3937')};

 const oldDraw=draw;
 draw=function(){ctx.imageSmoothingEnabled=realistic();oldDraw();if(realistic()){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=gradient(0,0,W,H,[[0,'rgba(255,218,180,.18)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(20,28,35,.18)']]);ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba(12,18,22,.08)';for(let y=0;y<H;y+=3)ctx.fillRect(0,y,W,1);ctx.restore()}};
 window.PHOTOREALISTIC_THEME=Object.freeze({active:realistic,referenceStyle:'cinematic travel photography'});
})();