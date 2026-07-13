import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { CENTER_X, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { TextureKeys } from '../constants/textureKeys';

/** Soft vertical gradient sky painted in bands (works in WebGL and Canvas). */
export function paintSky(
  scene: Phaser.Scene,
  top: number,
  bottom: number,
  height = GAME_HEIGHT,
): Phaser.GameObjects.Graphics {
  const bands = 32;
  const g = scene.add.graphics().setDepth(-100);
  const topColor = Phaser.Display.Color.ValueToColor(top);
  const bottomColor = Phaser.Display.Color.ValueToColor(bottom);
  for (let i = 0; i < bands; i++) {
    const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(
      topColor,
      bottomColor,
      bands - 1,
      i,
    );
    g.fillStyle(Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b));
    g.fillRect(0, (height / bands) * i, GAME_WIDTH, height / bands + 1);
  }
  return g;
}

/** Rolling hills + grass strip for garden-flavored scenes. */
export function paintMeadow(scene: Phaser.Scene, grassTop: number): void {
  scene.add
    .image(CENTER_X - 190, grassTop + 60, TextureKeys.hill)
    .setTint(Colors.hillFar)
    .setDepth(-60)
    .setScale(1.1, 0.8);
  scene.add
    .image(CENTER_X + 240, grassTop + 80, TextureKeys.hill)
    .setTint(Colors.grassLight)
    .setDepth(-55);
  const g = scene.add.graphics().setDepth(-50);
  g.fillStyle(Colors.grassLight);
  g.fillRect(0, grassTop + 40, GAME_WIDTH, GAME_HEIGHT - grassTop);
  g.fillStyle(Colors.grassDark, 0.4);
  g.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);
}
