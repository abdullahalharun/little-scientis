import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { SfxKeys } from '../constants/audioKeys';
import { TextureKeys } from '../constants/textureKeys';
import { AudioManager } from '../utils/AudioManager';

/**
 * Titu — the tree-chef. A container whose origin is the base of the trunk.
 * Natural size ≈ 440w × 640h (scale to fit each scene).
 *
 * Always alive: breathes, blinks and sways on his own. Scenes trigger the big
 * emotes (wave / talk / dance / eat / leaf color).
 */
export class Titu extends Phaser.GameObjects.Container {
  private head: Phaser.GameObjects.Container;
  private canopy: Phaser.GameObjects.Image;
  private leftBranch: Phaser.GameObjects.Image;
  private rightBranch: Phaser.GameObjects.Image;
  private eyes: Phaser.GameObjects.Container[] = [];
  private mouth: Phaser.GameObjects.Graphics;
  private mouthOpen = 0;
  private talkTween?: Phaser.Tweens.Tween;
  private waveTween?: Phaser.Tweens.Tween;
  private danceTween?: Phaser.Tweens.Tween;
  /** 0 = thirsty pale green … 1 = happy deep green. */
  private leafHealth = 0.5;

  constructor(scene: Phaser.Scene, x: number, y: number, scale = 1) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setScale(scale);

    // Body ─ trunk and branch-arms.
    const trunk = scene.add.image(0, 0, TextureKeys.tituTrunk).setOrigin(0.5, 1);

    this.leftBranch = scene.add
      .image(-88, -190, TextureKeys.tituBranch)
      .setOrigin(0.92, 0.5)
      .setFlipX(true)
      .setAngle(20);
    this.rightBranch = scene.add
      .image(88, -190, TextureKeys.tituBranch)
      .setOrigin(0.08, 0.5)
      .setAngle(-20);

    // Head ─ canopy, hat and face live together so they bob as one.
    this.head = scene.add.container(0, -250);
    this.canopy = scene.add.image(0, -130, TextureKeys.tituCanopy);
    const hat = scene.add.image(-30, -290, TextureKeys.tituHat).setAngle(-10);

    const cheekLeft = scene.add
      .image(-80, -95, TextureKeys.softCircle)
      .setTint(Colors.tituCheek)
      .setScale(1.1);
    const cheekRight = scene.add
      .image(80, -95, TextureKeys.softCircle)
      .setTint(Colors.tituCheek)
      .setScale(1.1);

    this.eyes.push(this.buildEye(scene, -48, -135), this.buildEye(scene, 48, -135));

    this.mouth = scene.add.graphics({ x: 0, y: -95 });
    this.drawMouth();

    this.head.add([this.canopy, hat, cheekLeft, cheekRight, ...this.eyes, this.mouth]);
    this.add([this.leftBranch, this.rightBranch, trunk, this.head]);

    this.applyLeafTint();
    this.startIdle();
  }

  /** Lerp leaves between thirsty pale (0) and lush happy green (1). */
  setLeafHealth(health: number, animate = true): void {
    const target = Phaser.Math.Clamp(health, 0, 1);
    if (!animate) {
      this.leafHealth = target;
      this.applyLeafTint();
      return;
    }
    this.scene.tweens.addCounter({
      from: this.leafHealth,
      to: target,
      duration: 600,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        this.leafHealth = tween.getValue() ?? target;
        this.applyLeafTint();
      },
    });
  }

  /** Friendly arm wave (right branch). */
  wave(): void {
    this.waveTween?.stop();
    this.rightBranch.setAngle(-20);
    this.waveTween = this.scene.tweens.add({
      targets: this.rightBranch,
      angle: -75,
      duration: 260,
      yoyo: true,
      repeat: 5,
      ease: 'Sine.easeInOut',
      onComplete: () => this.rightBranch.setAngle(-20),
    });
  }

  /** Mouth chatters (with soft blips) for roughly `ms` milliseconds. */
  talkFor(ms: number): void {
    this.talkTween?.stop();
    const blipTimer = this.scene.time.addEvent({
      delay: 170,
      repeat: Math.floor(ms / 170),
      callback: () => AudioManager.playSfx(SfxKeys.talkBlip),
    });
    this.talkTween = this.scene.tweens.addCounter({
      from: 0,
      to: Math.PI * (ms / 220),
      duration: ms,
      onUpdate: (tween) => {
        this.mouthOpen = Math.abs(Math.sin(tween.getValue() ?? 0)) * 0.9;
        this.drawMouth();
      },
      onComplete: () => {
        blipTimer.remove();
        this.mouthOpen = 0;
        this.drawMouth();
      },
    });
  }

  /** Happy bouncing dance (runs until stopDance()). */
  dance(): void {
    this.stopDance();
    this.danceTween = this.scene.tweens.add({
      targets: this,
      y: this.y - 26,
      angle: { from: -4, to: 4 },
      duration: 220,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.wave();
  }

  stopDance(): void {
    if (this.danceTween) {
      this.danceTween.stop();
      this.danceTween = undefined;
      this.setAngle(0);
    }
  }

  /** Big chomps — used when eating the glucose cake. */
  eat(onDone?: () => void): void {
    this.scene.tweens.addCounter({
      from: 0,
      to: Math.PI * 4,
      duration: 1400,
      onUpdate: (tween) => {
        this.mouthOpen = Math.abs(Math.sin(tween.getValue() ?? 0));
        this.drawMouth();
      },
      onComplete: () => {
        this.mouthOpen = 0;
        this.drawMouth();
        onDone?.();
      },
    });
  }

  /** Squeezed-shut happy eyes for a moment. */
  happyEyes(durationMs = 1200): void {
    for (const eye of this.eyes) {
      this.scene.tweens.add({
        targets: eye,
        scaleY: 0.12,
        duration: 140,
        yoyo: true,
        hold: durationMs,
        ease: 'Sine.easeIn',
      });
    }
  }

  // ── internals ──────────────────────────────────────────────────────────

  private buildEye(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const eye = scene.add.container(x, y);
    const white = scene.add.ellipse(0, 0, 44, 52, 0xffffff);
    const pupil = scene.add.circle(0, 6, 13, 0x3a2e24);
    const shine = scene.add.circle(5, 0, 5, 0xffffff);
    eye.add([white, pupil, shine]);
    return eye;
  }

  private drawMouth(): void {
    const g = this.mouth;
    g.clear();
    // Smile line.
    g.lineStyle(7, 0x4a3b2a);
    g.beginPath();
    g.arc(0, 0, 30, Phaser.Math.DegToRad(25), Phaser.Math.DegToRad(155));
    g.strokePath();
    // Open mouth grows under the smile while talking/eating.
    if (this.mouthOpen > 0.05) {
      g.fillStyle(0x7a4a3a);
      g.fillEllipse(0, 16, 44, 10 + 34 * this.mouthOpen);
      g.fillStyle(0xff9d8a);
      g.fillEllipse(0, 22, 26, 6 + 16 * this.mouthOpen);
    }
  }

  private applyLeafTint(): void {
    const thirsty = Phaser.Display.Color.ValueToColor(Colors.tituLeafThirsty);
    const happy = Phaser.Display.Color.ValueToColor(Colors.tituLeafHappy);
    const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(
      thirsty,
      happy,
      100,
      this.leafHealth * 100,
    );
    this.canopy.setTint(Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b));
  }

  private startIdle(): void {
    // Breathing bob.
    this.scene.tweens.add({
      targets: this.head,
      y: this.head.y - 10,
      scaleX: 1.015,
      scaleY: 1.03,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    // Gentle branch sway.
    this.scene.tweens.add({
      targets: this.leftBranch,
      angle: 28,
      duration: 1900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.scene.tweens.add({
      targets: this.rightBranch,
      angle: -28,
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    // Random blinking.
    const blink = () => {
      for (const eye of this.eyes) {
        this.scene.tweens.add({
          targets: eye,
          scaleY: 0.08,
          duration: 70,
          yoyo: true,
          ease: 'Sine.easeIn',
        });
      }
      this.scene.time.delayedCall(Phaser.Math.Between(2200, 4600), blink);
    };
    this.scene.time.delayedCall(Phaser.Math.Between(1200, 2500), blink);
  }
}
