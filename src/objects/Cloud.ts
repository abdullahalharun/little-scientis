import Phaser from 'phaser';
import { GAME_WIDTH } from '../constants/layout';
import { TextureKeys } from '../constants/textureKeys';

/**
 * A background cloud drifting slowly across the sky, wrapping around.
 * (The draggable clouds in SunScene are plain images the scene controls.)
 */
export class Cloud extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, scale = 1, private speed = 10) {
    super(scene, x, y, TextureKeys.cloud);
    scene.add.existing(this);
    this.setScale(scale);
    this.setAlpha(0.9);

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.drift, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.drift, this);
    });
  }

  private drift(_time: number, delta: number): void {
    this.x += (this.speed * delta) / 1000;
    const margin = this.displayWidth / 2 + 20;
    if (this.x > GAME_WIDTH + margin) this.x = -margin;
  }
}
