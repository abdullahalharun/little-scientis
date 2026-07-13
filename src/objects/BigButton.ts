import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors, hex } from '../constants/colors';
import { BUTTON, FONT_FAMILY, FONT_SIZE } from '../constants/layout';
import { AudioManager } from '../utils/AudioManager';

export interface BigButtonOptions {
  width?: number;
  height?: number;
  color?: number;
  colorDark?: number;
  fontSize?: number;
}

/**
 * The one button style used everywhere: huge, rounded, floaty, squashes when
 * pressed. Touch-friendly (whole panel is the hit area) and needs no reading —
 * pair the label with an emoji.
 */
export class BigButton extends Phaser.GameObjects.Container {
  private floatTween: Phaser.Tweens.Tween;
  private pressed = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onPress: () => void,
    options: BigButtonOptions = {},
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(950);

    const width = options.width ?? BUTTON.width;
    const height = options.height ?? BUTTON.height;
    const radius = Math.min(BUTTON.radius, height / 2);
    const color = options.color ?? Colors.buttonGreen;
    const colorDark = options.colorDark ?? Colors.buttonGreenDark;

    const g = scene.add.graphics();
    // Grounded shadow.
    g.fillStyle(Colors.buttonShadow, 0.35);
    g.fillRoundedRect(-width / 2 + 4, -height / 2 + 10, width, height, radius);
    // Body: darker base with a lighter top face for a soft 3D pop.
    g.fillStyle(colorDark);
    g.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    g.fillStyle(color);
    g.fillRoundedRect(-width / 2, -height / 2, width, height - 10, radius);
    // Glossy highlight.
    g.fillStyle(0xffffff, 0.25);
    g.fillRoundedRect(-width / 2 + 14, -height / 2 + 8, width - 28, height / 3, radius / 2);

    const text = scene.add
      .text(0, -6, label, {
        fontFamily: FONT_FAMILY,
        fontSize: `${options.fontSize ?? FONT_SIZE.button}px`,
        color: hex(Colors.textLight),
        stroke: hex(colorDark),
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add([g, text]);

    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => {
      AudioManager.unlock();
      this.pressed = true;
      scene.tweens.add({ targets: this, scaleX: 0.92, scaleY: 0.88, duration: 80 });
    });
    this.on('pointerup', () => {
      if (!this.pressed) return;
      this.pressed = false;
      AudioManager.playSfx(SfxKeys.click);
      scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 160,
        ease: 'Back.easeOut',
        onComplete: onPress,
      });
    });
    this.on('pointerout', () => {
      if (this.pressed) {
        this.pressed = false;
        scene.tweens.add({ targets: this, scaleX: 1, scaleY: 1, duration: 120 });
      }
    });

    // Idle float so no screen is ever static.
    this.floatTween = scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /** Pop in from nothing (for buttons that appear after a task completes). */
  popIn(delayMs = 0): this {
    this.floatTween.pause();
    this.setScale(0);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      delay: delayMs,
      duration: 380,
      ease: 'Back.easeOut',
      onComplete: () => this.floatTween.resume(),
    });
    return this;
  }
}
