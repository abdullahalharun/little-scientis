import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { TextureKeys } from '../constants/textureKeys';

/**
 * The reward celebration: three big stars pop up in an arc while confetti
 * rains. Purely visual — the caller plays the success sound.
 */
export function starBurst(scene: Phaser.Scene, x: number, y: number): void {
  // Three arcing stars.
  const offsets = [
    { dx: -140, dy: -40, delay: 0 },
    { dx: 0, dy: -90, delay: 140 },
    { dx: 140, dy: -40, delay: 280 },
  ];
  for (const { dx, dy, delay } of offsets) {
    const star = scene.add
      .image(x, y, TextureKeys.star)
      .setDepth(980)
      .setScale(0)
      .setAlpha(0.95);
    scene.tweens.add({
      targets: star,
      x: x + dx,
      y: y + dy,
      scale: 1.35,
      angle: Phaser.Math.Between(-25, 25),
      delay,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: star,
          scale: 1.15,
          duration: 500,
          yoyo: true,
          repeat: 2,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            scene.tweens.add({
              targets: star,
              alpha: 0,
              scale: 0.6,
              duration: 350,
              onComplete: () => star.destroy(),
            });
          },
        });
      },
    });
  }

  confettiRain(scene, x, y);
}

/** A burst of drifting confetti pieces. */
export function confettiRain(scene: Phaser.Scene, x: number, y: number, count = 26): void {
  for (let i = 0; i < count; i++) {
    const piece = scene.add
      .image(x + Phaser.Math.Between(-60, 60), y + Phaser.Math.Between(-40, 0), TextureKeys.confetti)
      .setDepth(975)
      .setTint(Phaser.Math.RND.pick([...Colors.confetti]))
      .setScale(Phaser.Math.FloatBetween(0.7, 1.2));

    scene.tweens.add({
      targets: piece,
      x: piece.x + Phaser.Math.Between(-260, 260),
      y: piece.y - Phaser.Math.Between(120, 320),
      angle: Phaser.Math.Between(-360, 360),
      duration: Phaser.Math.Between(400, 700),
      ease: 'Cubic.easeOut',
      onComplete: () => {
        // Flutter down.
        scene.tweens.add({
          targets: piece,
          y: piece.y + Phaser.Math.Between(400, 700),
          x: piece.x + Phaser.Math.Between(-90, 90),
          angle: piece.angle + Phaser.Math.Between(-540, 540),
          alpha: 0,
          duration: Phaser.Math.Between(1200, 2000),
          ease: 'Sine.easeIn',
          onComplete: () => piece.destroy(),
        });
      },
    });
  }
}
