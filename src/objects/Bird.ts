import Phaser from 'phaser';
import { GAME_WIDTH } from '../constants/layout';
import { TextureKeys } from '../constants/textureKeys';

/**
 * A round little bird that glides across the sky, bobbing gently, and loops
 * back around forever.
 */
export class Bird extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, y: number, private speed = 24) {
    super(scene, Phaser.Math.Between(0, GAME_WIDTH), y, TextureKeys.bird);
    scene.add.existing(this);
    this.setScale(Phaser.Math.FloatBetween(0.6, 0.85));

    // Bobbing while flying.
    scene.tweens.add({
      targets: this,
      y: y - 14,
      angle: -6,
      duration: Phaser.Math.Between(700, 1000),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.glide, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.glide, this);
    });
  }

  private glide(_time: number, delta: number): void {
    this.x += (this.speed * delta) / 1000;
    if (this.x > GAME_WIDTH + 60) this.x = -60;
  }
}
