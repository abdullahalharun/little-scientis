import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { TextureKeys } from '../constants/textureKeys';

const WING_TINTS = [Colors.flowerPink, Colors.flowerPurple, Colors.flowerYellow];

/**
 * A little butterfly that flaps its wings and wanders forever between random
 * points inside its home rectangle.
 */
export class Butterfly extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, private area: Phaser.Geom.Rectangle) {
    super(scene, area.centerX, area.centerY);
    scene.add.existing(this);

    const tint = Phaser.Math.RND.pick(WING_TINTS);
    const left = scene.add
      .image(-8, 0, TextureKeys.butterflyWing)
      .setOrigin(1, 0.5)
      .setTint(tint);
    const right = scene.add
      .image(8, 0, TextureKeys.butterflyWing)
      .setOrigin(1, 0.5)
      .setFlipX(true)
      .setTint(tint);
    // Mirror the right wing around the body.
    right.setOrigin(0, 0.5);
    const body = scene.add.image(0, 0, TextureKeys.butterflyBody);
    this.add([left, right, body]);
    this.setScale(Phaser.Math.FloatBetween(0.55, 0.8));

    // Wing flap.
    scene.tweens.add({
      targets: [left, right],
      scaleX: 0.25,
      duration: 140,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.wander();
  }

  private wander(): void {
    if (!this.scene) return; // destroyed with the scene
    const tx = Phaser.Math.Between(this.area.left, this.area.right);
    const ty = Phaser.Math.Between(this.area.top, this.area.bottom);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, tx, ty);
    this.scene.tweens.add({
      targets: this,
      x: tx,
      y: ty,
      angle: Phaser.Math.Between(-14, 14),
      duration: distance * 9 + 600,
      ease: 'Sine.easeInOut',
      onComplete: () => this.wander(),
    });
  }
}
