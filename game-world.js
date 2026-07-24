'use strict';
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(snap(x),snap(y),snap(w),snap(h))}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(snap(points[0][0]),snap(points[0][1]));for(let i=1;i<points.length;i++)ctx.lineTo(snap(points[i][0]),snap(points[i][1]));ctx.closePath();ctx.fill()}
function line(x1,y1,x2,y2,width,color){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(snap(x1),snap(y1));ctx.lineTo(snap(x2),snap(y2));ctx.stroke()}
function outlineRect(x,y,w,h,fill,outline='#252535',thickness=2){rect(x,y,w,h,outline);rect(x+thickness,y+thickness,w-thickness*2,h-thickness*2,fill)}
function cloud(x,y){rect(x,y+5,28,7,'#f5f4eb');rect(x+6,y,14,13,'#f5f4eb');rect(x+18,y+3,15,10,'#f5f4eb')}
function windowGrid(x,y,cols,rows,gapX,gapY,color){for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)rect(x+c*gapX,y+r*gapY,6,8,color)}

function clerigos(x){
 outlineRect(x,62,34,164,'#e4c595','#a86f42',3);
 rect(x+6,72,22,8,'#b77e4b');rect(x+4,107,26,6,'#b77e4b');rect(x+3,145,28,6,'#b77e4b');
 for(let y=80;y<205;y+=22){rect(x+11,y,12,12,'#594535');rect(x+13,y+2,8,3,'#20232d')}
 poly([[x-5,62],[x+17,31],[x+39,62]],'#9b633b');rect(x+13,20,8,12,'#496957');rect(x+11,16,12,5,'#496957');
}
function domLuisBridge(x){
 line(x,148,x+145,148,5,'#304f68');line(x+12,148,x+72,83,5,'#304f68');line(x+133,148,x+72,83,5,'#304f68');
 line(x+12,148,x+133,148,3,'#20394e');
 for(let px=x+20;px<x+132;px+=13)line(px,148,px,117+Math.abs(px-(x+72))*.42,2,'#304f68');
 rect(x-6,151,158,5,'#e2d2ae');
}
function azulejoChurch(x){
 outlineRect(x,112,66,114,'#f2eee0','#346f9b',3);poly([[x-5,112],[x+33,77],[x+71,112]],'#e8e3d5');
 for(let yy=123;yy<210;yy+=13)for(let xx=x+7;xx<x+60;xx+=13){rect(xx,yy,8,8,'#3d79a7');rect(xx+2,yy+2,4,4,'#f3efe3')}
 rect(x+27,177,13,49,'#6c4a36');rect(x+27,94,13,18,'#f1eee2');rect(x+30,97,7,10,'#416f93');
}
function sagrada(x){
 rect(x+23,101,70,125,'#d4a36c');poly([[x+18,132],[x+58,94],[x+98,132]],'#b98355');
 const towers=[0,25,50,75,100];
 for(const off of towers){
  const y=79+(off%50?9:0);outlineRect(x+off,y,16,147-(off%50?9:0),'#d9ab72','#9a704c',2);
  for(let yy=y+17;yy<207;yy+=18)rect(x+off+6,yy,5,8,'#67503d');
  poly([[x+off-2,y],[x+off+8,y-28],[x+off+18,y]],'#9c6c43');rect(x+off+6,y-35,4,8,'#d9ab72');
 }
}
function eiffel(x){
 line(x,70,x-41,226,7,'#41464e');line(x,70,x+41,226,7,'#41464e');
 line(x-32,190,x+32,190,5,'#41464e');line(x-21,140,x+21,140,4,'#41464e');line(x-11,96,x+11,96,3,'#41464e');
 for(let y=82;y<218;y+=14){const width=(y-70)*.26;line(x-width,y,x+width,y,2,'#666b73')}
 line(x-35,218,x-5,185,2,'#626870');line(x+35,218,x+5,185,2,'#626870');
}
function arcTriomphe(x){
 outlineRect(x,144,78,82,'#d7c7a9','#9c896f',3);rect(x+22,174,34,52,'#8a7967');
 poly([[x+22,174],[x+39,153],[x+56,174]],'#8a7967');rect(x+11,157,56,8,'#b7a58b');rect(x+9,137,60,9,'#d7c7a9');
}
function atomium(x,y){
 const pts=[[0,0],[-35,33],[37,31],[-10,65],[43,70],[-44,76],[4,105]],links=[[0,1],[0,2],[1,3],[2,3],[2,4],[3,4],[1,5],[3,5],[3,6],[4,6],[5,6]];
 for(const l of links){const a=pts[l[0]],b=pts[l[1]];line(x+a[0],y+a[1],x+b[0],y+b[1],4,'#7e8d99')}
 for(const p of pts){rect(x+p[0]-7,y+p[1]-7,15,15,'#dce4e8');rect(x+p[0]-3,y+p[1]-3,5,5,'#8d9aa3')}
}
function grandPlace(x){
 const colors=['#a9674d','#d2a35d','#8f5d48','#c17d52'];
 for(let i=0;i<5;i++){
  const px=x+i*43,h=75+(i%3)*13;outlineRect(px,226-h,39,h,colors[i%colors.length],'#493d40',2);
  poly([[px-3,226-h],[px+19,226-h-28-(i%2)*8],[px+42,226-h]],'#3b353b');
  windowGrid(px+7,226-h+14,2,3,18,17,'#f0d59d');
 }
}
function windmill(x,y){
 poly([[x-22,y+64],[x-13,y],[x+13,y],[x+22,y+64]],'#69412b');rect(x-15,y+20,30,9,'#efe0c2');rect(x-6,y+45,12,19,'#2f251f');
 line(x,y+9,x,y-43,5,'#332d29');line(x,y+9,x+48,y+9,5,'#332d29');line(x,y+9,x,y+60,5,'#332d29');line(x,y+9,x-48,y+9,5,'#332d29');
 for(let i=-43;i<44;i+=11){rect(x-3,y+i,6,7,'#6e5547');rect(x+i,y+6,7,6,'#6e5547')}
}
function canalHouse(x,y,color,shape){
 outlineRect(x,y,42,GROUND-y,color,'#303641',2);
 if(shape===0)poly([[x-3,y],[x+21,y-24],[x+45,y]],'#2f3540');
 if(shape===1){rect(x+7,y-18,28,18,color);rect(x+13,y-27,16,9,color)}
 if(shape===2){rect(x+6,y-16,30,16,color);poly([[x+6,y-16],[x+21,y-29],[x+36,y-16]],'#2f3540')}
 windowGrid(x+7,y+12,2,4,23,20,'#f3d59f');
}
function bicycle(x,y){
 ctx.strokeStyle='#26313a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.arc(x+24,y,8,0,Math.PI*2);ctx.stroke();
 line(x,y,x+11,y-13,2,'#26313a');line(x+11,y-13,x+24,y,2,'#26313a');line(x,y,x+17,y,2,'#26313a');line(x+11,y-13,x+17,y,2,'#26313a');
 line(x+11,y-13,x+8,y-19,2,'#26313a');line(x+17,y,x+20,y-18,2,'#26313a');
}
function fuji(x){
 poly([[x-110,226],[x,55],[x+118,226]],'#617d9e');poly([[x-38,111],[x,55],[x+42,115],[x+20,107],[x,132],[x-20,107]],'#f4f1ed');
 rect(x-125,218,255,8,'#456f91');
}
function pagoda(x){
 const levels=[{y:177,w:74},{y:150,w:62},{y:124,w:50},{y:101,w:38}];
 for(const l of levels){rect(x-l.w/2+7,l.y,l.w-14,25,'#dbc5a0');poly([[x-l.w/2,l.y],[x,l.y-13],[x+l.w/2,l.y]],'#29313a')}
 rect(x-5,88,10,138,'#48372f');rect(x-2,76,4,13,'#dcc6a2');
}
function torii(x){
 rect(x-34,137,8,89,'#ce3b32');rect(x+26,137,8,89,'#ce3b32');rect(x-44,127,88,9,'#202126');rect(x-39,147,78,7,'#ce3b32');
}
function namsan(x){
 rect(x-2,86,5,140,'#d9dce1');rect(x-18,124,37,18,'#e1e4e7');rect(x-20,115,41,9,'#e84f78');poly([[x-10,86],[x,49],[x+10,86]],'#d9dce1');
}
function gyeongbokgung(x){
 rect(x,166,122,60,'#d7b386');rect(x+14,177,18,49,'#43352d');rect(x+90,177,18,49,'#43352d');
 rect(x+49,180,24,46,'#a84943');poly([[x-13,168],[x+61,126],[x+135,168]],'#253033');
 poly([[x,143],[x+61,109],[x+122,143]],'#364342');rect(x+57,94,8,18,'#c9904e');
}
function neonSkyline(x,width){
 rect(x,176,width,50,'#242c43');
 for(let px=x+10;px<x+width;px+=39){
  const h=42+(px%7)*10;rect(px,176-h,33,h,['#303a55','#3c4560','#28344f'][Math.floor(px/39)%3]);
  for(let yy=182-h;yy<168;yy+=12){rect(px+7,yy,4,3,'#ffd65e');rect(px+21,yy,4,3,'#ef6c9b')}
 }
}
function seoulSign(x,y,color){outlineRect(x,y,18,42,color,'#202535',2);rect(x+5,y+6,8,3,'#fff1a2');rect(x+8,y+12,3,18,'#fff1a2');rect(x+4,y+21,10,3,'#fff1a2')}
function portoRibeira(start,end){
 const colors=['#e8bd70','#d9805e','#e2d7b9','#6f9cb6','#c79b62'];
 for(let x=start;x<end;x+=48)canalHouse(x,170-(x%4)*5,colors[Math.floor(x/48)%colors.length],Math.floor(x/48)%3);
}
function cherryTrees(start,end){for(let x=start;x<end;x+=70){rect(x,188,5,38,'#71474f');rect(x-12,170,29,18,'#d681a3');rect(x-5,160,21,16,'#e69ab5');rect(x+8,174,20,14,'#f0abc2')}}
function spanishBlocks(start,end){for(let x=start;x<end;x+=58){outlineRect(x,168-(x%2)*9,51,58+(x%2)*9,'#efe4d3','#a64d38',2);rect(x+9,181,10,13,'#416d92');rect(x+31,181,10,13,'#416d92')}}
function parisBlocks(start,end){for(let x=start;x<end;x+=55){outlineRect(x,164,49,62,'#d9d1c7','#52677b',2);poly([[x,164],[x+24,148],[x+49,164]],'#52677b');windowGrid(x+8,176,2,2,26,18,'#eef3ef')}}
function cloudBand(){const clouds=[[80,27],[410,45],[900,24],[1370,38],[1880,22],[2440,44],[3030,25],[3540,40],[4110,22],[4700,43],[5250,24],[5870,40],[6500,22],[7130,42],[7720,25],[8300,39],[8950,21],[9590,41],[10330,25]];for(const c of clouds)cloud(c[0],c[1])}

function staticBackground(){
 ctx.save();ctx.translate(-snap(cam),0);
 for(const z of zones){
  if(z.b<cam-8||z.a>cam+W+8)continue;
  const c=palette[z.t];rect(z.a,0,z.b-z.a,H,c.sky);rect(z.a,142,z.b-z.a,84,c.horizon);rect(z.a,186,z.b-z.a,40,c.far);rect(z.a,207,z.b-z.a,19,c.near);
 }
 cloudBand();

 // Porto stages: Clérigos, São Bento-style azulejos, Ribeira and Dom Luís I.
 rect(0,205,2400,21,palette.porto.water);portoRibeira(8,1200);domLuisBridge(380);clerigos(825);azulejoChurch(1030);
 portoRibeira(1210,2400);domLuisBridge(1480);clerigos(1985);azulejoChurch(2180);

 // Spain, France, Belgium.
 rect(2400,40,26,26,'#f0c93e');spanishBlocks(2408,2800);sagrada(2570);
 parisBlocks(2805,3200);eiffel(3000);arcTriomphe(3110);
 grandPlace(3205);atomium(3450,92);

 // Amsterdam: distinctive canal frontage, large windmill and bikes.
 rect(3600,204,1200,22,palette.amsterdam.water);
 const canalColors=['#b65b48','#d49a42','#365d78','#8d4854','#d3c19b'];
 for(let x=3608;x<4800;x+=46)canalHouse(x,164-(x%5)*6,canalColors[Math.floor(x/46)%canalColors.length],Math.floor(x/46)%3);
 windmill(4470,138);bicycle(4250,213);bicycle(4320,213);

 // Japan.
 fuji(5350);torii(4930);pagoda(5700);cherryTrees(4810,6000);

 // Korea.
 neonSkyline(6000,1200);gyeongbokgung(6160);seoulSign(6520,128,'#dd4d86');seoulSign(6600,120,'#45b9cf');namsan(7010);

 // Amsterdam return and dog stage.
 rect(7200,204,1200,22,palette.amsterdam.water);
 for(let x=7208;x<8400;x+=46)canalHouse(x,164-(x%5)*6,canalColors[Math.floor(x/46)%canalColors.length],Math.floor(x/46)%3);
 windmill(8100,138);bicycle(7860,213);

 // Reverse travel.
 grandPlace(8405);atomium(8650,92);parisBlocks(8805,9200);eiffel(8990);arcTriomphe(9100);
 rect(9200,40,26,26,'#f0c93e');spanishBlocks(9208,9600);sagrada(9370);

 // Porto wedding finale.
 rect(9600,205,1200,21,palette.porto.water);portoRibeira(9608,10800);domLuisBridge(9790);clerigos(10200);azulejoChurch(10420);
 drawWeddingVenue();

 ctx.restore();
}

function drawWeddingVenue(){
 const x=FINISH_X-145;
 rect(x-70,188,240,38,'#d9d0b7');rect(x-65,181,230,9,'#eee6d2');
 rect(x+34,139,6,87,'#f4f0df');rect(x+116,139,6,87,'#f4f0df');
 poly([[x+21,148],[x+78,105],[x+135,148]],'#f5eee0');rect(x+43,144,70,8,'#d7b98c');
 rect(x+57,151,42,75,'#f2ead7');poly([[x+57,151],[x+78,128],[x+99,151]],'#e9dfc8');
 for(let i=0;i<8;i++){rect(x+28+i*14,133-(i%2)*3,5,5,i%2?'#f7c7d9':'#fff');rect(x+30+i*14,137-(i%2)*3,3,3,'#6aad73')}
}
