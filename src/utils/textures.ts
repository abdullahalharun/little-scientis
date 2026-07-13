import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { TextureKeys } from '../constants/textureKeys';

/**
 * Procedural placeholder art. Draws every sprite in the game with Phaser
 * Graphics and bakes it into the texture manager under the keys from
 * constants/textureKeys.ts.
 *
 * Any key that already exists (i.e. a real PNG was loaded first) is skipped,
 * so real illustrations can replace these one file at a time.
 */
export function generateAllTextures(scene: Phaser.Scene): void {
  gen(scene, TextureKeys.tituTrunk, 220, 270, drawTrunk);
  gen(scene, TextureKeys.tituCanopy, 440, 340, drawCanopy);
  gen(scene, TextureKeys.tituBranch, 150, 52, drawBranch);
  gen(scene, TextureKeys.tituHat, 210, 180, drawChefHat);
  gen(scene, TextureKeys.leaf, 72, 48, drawLeaf);

  gen(scene, TextureKeys.cloud, 320, 190, (g) => drawCloud(g, Colors.cloudWhite, Colors.cloudShadow));
  gen(scene, TextureKeys.cloudDark, 320, 190, (g) => drawCloud(g, 0xcfd4ec, 0xb4bbde));
  gen(scene, TextureKeys.hill, 800, 300, drawHill);
  gen(scene, TextureKeys.flowerPink, 84, 120, (g) => drawFlower(g, Colors.flowerPink));
  gen(scene, TextureKeys.flowerYellow, 84, 120, (g) => drawFlower(g, Colors.flowerYellow));
  gen(scene, TextureKeys.flowerPurple, 84, 120, (g) => drawFlower(g, Colors.flowerPurple));
  gen(scene, TextureKeys.butterflyWing, 52, 68, drawButterflyWing);
  gen(scene, TextureKeys.butterflyBody, 18, 52, drawButterflyBody);
  gen(scene, TextureKeys.bird, 84, 64, drawBird);
  gen(scene, TextureKeys.stone, 84, 60, drawStone);

  gen(scene, TextureKeys.waterDrop, 84, 108, drawWaterDrop);
  gen(scene, TextureKeys.rootTip, 76, 76, drawRootTip);

  gen(scene, TextureKeys.bubble, 116, 116, drawBubble);

  gen(scene, TextureKeys.sunFace, 280, 280, drawSunFace);
  gen(scene, TextureKeys.sunRay, 44, 170, drawSunRay);

  gen(scene, TextureKeys.cake, 240, 200, drawCake);
  gen(scene, TextureKeys.apple, 130, 150, drawApple);

  gen(scene, TextureKeys.sparkle, 48, 48, drawSparkle);
  gen(scene, TextureKeys.star, 100, 100, drawStar);
  gen(scene, TextureKeys.confetti, 26, 18, drawConfetti);
  gen(scene, TextureKeys.softCircle, 64, 64, drawSoftCircle);
  gen(scene, TextureKeys.dropletSmall, 34, 44, drawDropletSmall);
  gen(scene, TextureKeys.padlock, 68, 88, drawPadlock);
}

function gen(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (g: Phaser.GameObjects.Graphics) => void,
): void {
  if (scene.textures.exists(key)) return; // a real asset was loaded — keep it
  const g = scene.add.graphics();
  draw(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

// ── Titu ─────────────────────────────────────────────────────────────────────

function drawTrunk(g: Phaser.GameObjects.Graphics): void {
  // Gently flaring rounded trunk with a darker edge for depth.
  g.fillStyle(Colors.tituTrunkDark);
  g.fillRoundedRect(38, 8, 144, 254, 52);
  g.fillStyle(Colors.tituTrunk);
  g.fillRoundedRect(46, 4, 128, 252, 48);
  // Root flare at the bottom.
  g.fillEllipse(60, 250, 100, 40);
  g.fillEllipse(160, 250, 100, 40);
  // Soft bark lines.
  g.fillStyle(Colors.tituTrunkDark, 0.35);
  g.fillRoundedRect(85, 60, 12, 70, 6);
  g.fillRoundedRect(120, 120, 12, 60, 6);
}

/**
 * Drawn in white/greys so it can be tinted any leaf green at runtime
 * (thirsty → happy color shifts are just tint lerps).
 */
function drawCanopy(g: Phaser.GameObjects.Graphics): void {
  const blobs: Array<[number, number, number]> = [
    [220, 190, 105], // center
    [115, 215, 82],
    [325, 215, 82],
    [140, 120, 78],
    [300, 120, 78],
    [220, 82, 80],
  ];
  // Under-shadow pass (light grey → darker shade of the tint).
  g.fillStyle(0xbdbdbd);
  for (const [x, y, r] of blobs) g.fillCircle(x, y + 14, r);
  // Main pass (white → exact tint color).
  g.fillStyle(0xffffff);
  for (const [x, y, r] of blobs) g.fillCircle(x, y, r);
  // Highlight pass (extra-bright dabs read as leaf shine even when tinted).
  g.fillStyle(0xffffff, 0.55);
  g.fillCircle(170, 95, 34);
  g.fillCircle(280, 130, 26);
}

function drawBranch(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.tituTrunkDark);
  g.fillRoundedRect(0, 4, 150, 48, 24);
  g.fillStyle(Colors.tituTrunk);
  g.fillRoundedRect(0, 8, 144, 40, 20);
}

function drawChefHat(g: Phaser.GameObjects.Graphics): void {
  // Band.
  g.fillStyle(Colors.hatShadow);
  g.fillRoundedRect(48, 118, 114, 54, 18);
  g.fillStyle(Colors.hatWhite);
  g.fillRoundedRect(52, 114, 106, 50, 16);
  g.fillStyle(Colors.hatBand);
  g.fillRoundedRect(52, 148, 106, 12, 6);
  // Puffy top.
  g.fillStyle(Colors.hatShadow);
  g.fillCircle(105, 74, 62);
  g.fillStyle(Colors.hatWhite);
  g.fillCircle(62, 86, 42);
  g.fillCircle(148, 86, 42);
  g.fillCircle(105, 58, 52);
}

function drawLeaf(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.tituLeafHappy);
  g.fillEllipse(36, 24, 62, 34);
  g.fillStyle(Colors.tituLeafShine, 0.6);
  g.fillEllipse(28, 18, 26, 12);
  g.lineStyle(3, Colors.tituLeafHappy);
  g.lineBetween(36, 24, 68, 24);
}

// ── Environment ──────────────────────────────────────────────────────────────

function drawCloud(g: Phaser.GameObjects.Graphics, fill: number, shadow: number): void {
  g.fillStyle(shadow);
  g.fillEllipse(160, 130, 260, 80);
  g.fillStyle(fill);
  g.fillCircle(90, 110, 55);
  g.fillCircle(160, 80, 70);
  g.fillCircle(235, 110, 55);
  g.fillEllipse(160, 122, 240, 76);
}

function drawHill(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffffff); // tinted per-scene (near/far hills)
  g.fillEllipse(400, 250, 820, 400);
}

function drawFlower(g: Phaser.GameObjects.Graphics, petal: number): void {
  // Stem.
  g.fillStyle(Colors.grassDark);
  g.fillRoundedRect(38, 52, 8, 66, 4);
  // Petals around the center.
  g.fillStyle(petal);
  const cx = 42;
  const cy = 34;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.fillCircle(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18, 14);
  }
  g.fillStyle(Colors.flowerCenter);
  g.fillCircle(cx, cy, 13);
}

function drawButterflyWing(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffffff); // tinted per-butterfly
  g.fillCircle(26, 20, 20);
  g.fillCircle(26, 48, 16);
  g.fillStyle(0xffffff, 0.5);
  g.fillCircle(26, 20, 10);
}

function drawButterflyBody(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x6b5b4f);
  g.fillRoundedRect(4, 4, 10, 44, 5);
}

function drawBird(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x9fd8f0);
  g.fillCircle(38, 34, 24); // body
  g.fillCircle(60, 22, 14); // head
  g.fillStyle(0x7fc4e4);
  g.fillEllipse(30, 34, 26, 16); // wing
  g.fillStyle(Colors.flowerCenter);
  g.fillTriangle(72, 20, 82, 24, 72, 28); // beak
  g.fillStyle(0x2f2a26);
  g.fillCircle(63, 20, 2.6); // eye
}

function drawStone(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.soilStone);
  g.fillEllipse(42, 32, 76, 50);
  g.fillStyle(0xffffff, 0.15);
  g.fillEllipse(34, 24, 30, 16);
}

// ── Water scene ──────────────────────────────────────────────────────────────

function drawWaterDrop(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.waterDeep);
  g.fillCircle(42, 70, 34);
  g.fillTriangle(42, 4, 12, 60, 72, 60);
  g.fillStyle(Colors.waterBlue);
  g.fillCircle(42, 68, 28);
  g.fillTriangle(42, 14, 18, 58, 66, 58);
  g.fillStyle(Colors.waterShine, 0.9);
  g.fillEllipse(32, 60, 14, 20);
}

function drawRootTip(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.tituTrunkDark);
  g.fillCircle(38, 38, 34);
  g.fillStyle(Colors.tituTrunk);
  g.fillCircle(38, 38, 28);
  g.fillStyle(0xffffff, 0.25);
  g.fillCircle(30, 30, 10);
}

// ── Air scene ────────────────────────────────────────────────────────────────

function drawBubble(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.bubbleRim, 0.9);
  g.fillCircle(58, 58, 52);
  g.fillStyle(Colors.bubbleFill, 0.85);
  g.fillCircle(58, 58, 45);
  // Shine arc.
  g.fillStyle(Colors.bubbleSparkle, 0.85);
  g.fillEllipse(40, 38, 20, 12);
  g.fillCircle(76, 74, 5);
}

// ── Sun scene ────────────────────────────────────────────────────────────────

function drawSunFace(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.sunGlow, 0.55);
  g.fillCircle(140, 140, 138);
  g.fillStyle(Colors.sunCore);
  g.fillCircle(140, 140, 112);
  g.fillStyle(0xffffff, 0.35);
  g.fillCircle(108, 104, 34);
  // Rosy cheeks (eyes and mouth are animated live by the scene).
  g.fillStyle(Colors.sunCheek, 0.7);
  g.fillEllipse(84, 172, 34, 22);
  g.fillEllipse(196, 172, 34, 22);
}

function drawSunRay(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.sunRay);
  g.fillTriangle(22, 0, 2, 150, 42, 150);
  g.fillCircle(22, 8, 12);
}

// ── Reward scene ─────────────────────────────────────────────────────────────

function drawCake(g: Phaser.GameObjects.Graphics): void {
  // Plate.
  g.fillStyle(0xffffff);
  g.fillEllipse(120, 182, 220, 30);
  // Bottom sponge layer.
  g.fillStyle(Colors.cakeSponge);
  g.fillRoundedRect(30, 118, 180, 62, 20);
  // Top sponge layer.
  g.fillRoundedRect(52, 66, 136, 58, 18);
  // Cream drips.
  g.fillStyle(Colors.cakeCream);
  g.fillRoundedRect(52, 62, 136, 26, 13);
  for (let i = 0; i < 4; i++) g.fillCircle(72 + i * 33, 92, 11);
  g.fillRoundedRect(30, 114, 180, 26, 13);
  for (let i = 0; i < 5; i++) g.fillCircle(50 + i * 35, 142, 11);
  // Cherry.
  g.fillStyle(Colors.appleRed);
  g.fillCircle(120, 48, 16);
  g.fillStyle(0xffffff, 0.5);
  g.fillCircle(114, 42, 5);
}

function drawApple(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.appleRed);
  g.fillCircle(48, 82, 40);
  g.fillCircle(82, 82, 40);
  g.fillEllipse(65, 96, 110, 66);
  // Stem.
  g.fillStyle(Colors.tituTrunkDark);
  g.fillRoundedRect(60, 22, 9, 28, 4);
  // Leaf.
  g.fillStyle(Colors.appleLeaf);
  g.fillEllipse(88, 32, 40, 20);
  // Shine.
  g.fillStyle(Colors.appleShine, 0.8);
  g.fillEllipse(44, 66, 22, 30);
}

// ── Particles & UI ───────────────────────────────────────────────────────────

function drawSparkle(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffffff); // tinted gold/purple at runtime
  g.fillPoints(
    [
      { x: 24, y: 0 },
      { x: 30, y: 18 },
      { x: 48, y: 24 },
      { x: 30, y: 30 },
      { x: 24, y: 48 },
      { x: 18, y: 30 },
      { x: 0, y: 24 },
      { x: 18, y: 18 },
    ],
    true,
  );
}

function drawStar(g: Phaser.GameObjects.Graphics): void {
  const points: Phaser.Types.Math.Vector2Like[] = [];
  const cx = 50;
  const cy = 52;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 46 : 20;
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  g.fillStyle(Colors.starYellow);
  g.fillPoints(points, true);
  g.fillStyle(0xffffff, 0.4);
  g.fillCircle(cx - 10, cy - 12, 10);
}

function drawConfetti(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xffffff); // tinted from Colors.confetti at runtime
  g.fillRoundedRect(0, 0, 26, 18, 6);
}

/** Radial-fade circle — the workhorse for glows and soft particles. */
function drawSoftCircle(g: Phaser.GameObjects.Graphics): void {
  for (let r = 32; r > 0; r -= 4) {
    g.fillStyle(0xffffff, 0.14);
    g.fillCircle(32, 32, r);
  }
}

function drawDropletSmall(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(Colors.waterBlue);
  g.fillCircle(17, 28, 13);
  g.fillTriangle(17, 2, 6, 24, 28, 24);
  g.fillStyle(Colors.waterShine, 0.9);
  g.fillCircle(13, 25, 4);
}

function drawPadlock(g: Phaser.GameObjects.Graphics): void {
  g.lineStyle(9, 0x9a927f);
  g.strokeCircle(34, 26, 17);
  g.fillStyle(0xb8ae9a);
  g.fillRoundedRect(8, 36, 52, 44, 12);
  g.fillStyle(0x8d8471);
  g.fillCircle(34, 54, 7);
  g.fillRoundedRect(30, 54, 8, 16, 4);
}
