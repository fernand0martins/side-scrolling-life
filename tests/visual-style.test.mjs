import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const visual=fs.readFileSync(path.join(root,'visual-style.js'),'utf8');
const world=fs.readFileSync(path.join(root,'game-world.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('K toggles the alternate visual style',()=>{
 const listeners=new Map(),body={dataset:{}};
 const sandbox={window:null,document:{body},addEventListener:(type,fn)=>listeners.set(type,fn)};sandbox.window=sandbox;
 vm.runInNewContext(visual,sandbox);
 assert.equal(sandbox.VISUAL_STYLE.isAnime(),false);
 listeners.get('keydown')({code:'KeyK',repeat:false,preventDefault(){}});
 assert.equal(sandbox.VISUAL_STYLE.isAnime(),true);
 assert.equal(body.dataset.visualStyle,'anime');
});
test('skybox has independent cloud parallax and anime atmosphere',()=>{
 assert.match(html,/<script src="visual-style\.js"><\/script>[\s\S]*<script src="game-core\.js"><\/script>/);
 assert.match(world,/drawParallaxCloudLayer\(\.1,20/);
 assert.match(world,/drawParallaxCloudLayer\(\.28,48/);
 assert.match(world,/drawAnimeAtmosphere/);
 assert.match(world,/animePalette/);
 assert.doesNotMatch(world,/Naruto|Konoha|Uzumaki|Sharingan/i);
});
