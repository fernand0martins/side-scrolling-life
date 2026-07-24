import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const renderSource = fs.readFileSync(path.join(root, 'game-render.js'), 'utf8');

test('Kyuubi is smaller and the following sprite has all-black fur', () => {
  const start = renderSource.indexOf('function drawDog');
  const end = renderSource.indexOf('function drawHero', start);
  assert.ok(start >= 0 && end > start, 'drawDog renderer must exist');

  const drawDog = renderSource.slice(start, end);
  assert.match(drawDog, /ctx\.scale\(face\*\.72,\.72\)/, 'Kyuubi should render at 72% scale');

  const followingStart = drawDog.indexOf('}else{');
  assert.ok(followingStart >= 0, 'following dog branch must exist');
  const following = drawDog.slice(followingStart);

  assert.doesNotMatch(following, /\bwhite\b|\bshade\b|#f5f3eb|#fff|#8e6a54/, 'following fur should not contain white, shaded, or brown patches');
  assert.match(following, /rect\(-7,-2\+step,4,5-step,black\)/, 'following legs should be black');
  assert.match(following, /rect\(13,-15,3,2,black\)/, 'following muzzle should be black');
});
