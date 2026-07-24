'use strict';

// Keep facade details inside each building instead of allowing fixed rows to
// continue through the ground line on shorter background houses.
windowGrid=function(x,y,cols,rows,gapX,gapY,color,maxY=Infinity){
 for(let r=0;r<rows;r++){
  const windowY=y+r*gapY;
  if(windowY+8>maxY)continue;
  for(let c=0;c<cols;c++)rect(x+c*gapX,windowY,6,8,color);
 }
};

canalHouse=function(x,y,color,shape){
 outlineRect(x,y,42,GROUND-y,color,'#303641',2);
 if(shape===0)poly([[x-3,y],[x+21,y-24],[x+45,y]],'#2f3540');
 if(shape===1){rect(x+7,y-18,28,18,color);rect(x+13,y-27,16,9,color)}
 if(shape===2){rect(x+6,y-16,30,16,color);poly([[x+6,y-16],[x+21,y-29],[x+36,y-16]],'#2f3540')}
 windowGrid(x+7,y+12,2,4,23,20,'#f3d59f',GROUND-4);
};
