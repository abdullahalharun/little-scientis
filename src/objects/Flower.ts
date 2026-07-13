import Phaser from 'phaser';
import { TextureKeys } from '../constants/textureKeys';

const FLOWER_TEXTURES = [
  TextureKeys.flowerPink,
  TextureKeys.flowerYellow,
  TextureKeys.flowerPurple,
];

/** A flower swaying in the breeze, pivoting at the base of its stem. */
export class Flower extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, scale = 1) {
    super(scene, x, y, Phaser.Math.RND.pick(FLOWER_TEXTURES));
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setScale(scale);

    scene.tweens.add({
      targets: this,
      angle: { from: -6, to: 6 },
      duration: Phaser.Math.Between(1600, 2600),
      delay: Phaser.Math.Between(0, 800),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
