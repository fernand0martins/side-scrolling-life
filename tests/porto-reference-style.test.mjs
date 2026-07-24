import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const porto=fs.readFileSync(path.join(root,'porto-reference-style.js'),'utf8');

test('Porto reference styling loads after the base renderer and before the photorealistic layer',()=>{
 const renderIndex=html.indexOf('<script src="game-render.js"></script>');
 const portoIndex=html.indexOf('<script src="porto-reference-style.js"></script>');
 const photoIndex=html.indexOf('<script src="photorealistic-theme.js"></script>');
 assert.ok(renderIndex>=0&&portoIndex>renderIndex&&photoIndex>portoIndex);
});

test('Porto anime stage uses stacked colourful hillside houses',()=>{
 assert.match(porto,/facadeColors=\['#19a6a0','#f2b632','#d94f55'/);
 assert.match(porto,/hillsideBand\(start,end,160,\.58,18,\.28\)/);
 assert.match(porto,/hillsideBand\(start,end,184,\.72,7,\.46\)/);
 assert.match(porto,/hillsideBand\(start,end,210,1,0,1\)/);
 assert.match(porto,/illustratedHouse/);
});

test('Porto waterfront includes tiled roofs, stone quay and rabelo boats',()=>{
 assert.match(porto,/roofColors=\['#b73b2f','#d65d2f'/);
 assert.match(porto,/rect\(start,210,length,16,'#7e9690'\)/);
 assert.match(porto,/function rabeloBoat/);
 assert.match(porto,/for\(let x=start\+90;x<end-30;x\+=280\)rabeloBoat/);
});

test('Porto tower and paper texture match the supplied illustration direction',()=>{
 assert.match(porto,/clerigos=function\(x\)/);
 assert.match(porto,/outlinedRect\(x\+2,76,30,150,'#ddb347'/);
 assert.match(porto,/ctx\.globalAlpha=\.08/);
 assert.match(porto,/PORTO_REFERENCE_STYLE=Object\.freeze/);
});

test('Porto adaptation is isolated to the anime theme',()=>{
 assert.match(porto,/animePorto=\(\)=>window\.VISUAL_STYLE\?\.isAnime\(\)/);
 assert.match(porto,/if\(!animePorto\(\)\)\{basePortoRibeira\(start,end\);return\}/);
 assert.doesNotThrow(()=>new vm.Script(porto,{filename:'porto-reference-style.js'}));
});
