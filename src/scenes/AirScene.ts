import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors, hex } from '../constants/colors';
import { CENTER_X, FONT_FAMILY, FONT_SIZE, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { Lines } from '../constants/lines';
import { SceneKeys } from '../constants/scenes';
import { TextureKeys } from '../constants/textureKeys';
import { bnDigits } from '../constants/uiText';
import { Butterfly } from '../objects/Butterfly';
import { Cloud } from '../objects/Cloud';
import { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { paintMeadow, paintSky } from '../utils/backgrounds';
import { LevelSceneBase } from './LevelSceneBase';

const BUBBLE_COUNT = 8;

/**
 * Scene 2 — Air. Magical CO₂ bubbles drift around Titu's canopy; every tap
 * pops one and sends its sparkle into the leaves. A dot tracker (plus a big
 * number for grown-ups) counts up to 8.
 */
export class AirScene extends LevelSceneBase {
  private popped = 0;
  private counterText!: Phaser.GameObjects.Text;
  private dots: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super(SceneKeys.air);
  }

  protected buildScene(): void {
    this.popped = 0;
    this.dots = [];

    paintSky(this, Colors.skyTop, Colors.skyBottom);
    paintMeadow(this, GAME_HEIGHT - 260);
    new Cloud(this, 570, 140, 0.5, 11);
    new Butterfly(this, new Phaser.Geom.Rectangle(60, 760, GAME_WIDTH - 120, 320));

    this.titu = new Titu(this, CENTER_X, GAME_HEIGHT - 130, 0.95);
    this.titu.setLeafHealth(0.55, false);

    this.buildCounter();

    // Bubbles pop in one after another.
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      this.time.delayedCall(500 + i * 320, () => this.spawnBubble());
    }

    this.time.delayedCall(700, () => this.say(Lines.airIntro, 150));
  }

  private buildCounter(): void {
    this.counterText = this.add
      .text(GAME_WIDTH - 40, 44, bnDigits(`0 / ${BUBBLE_COUNT}`), {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE.counter}px`,
        color: hex(Colors.textLight),
        stroke: hex(Colors.waterDeep),
        strokeThickness: 9,
      })
      .setOrigin(1, 0)
      .setDepth(960);

    // Pre-readers track progress by dots filling up.
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const dot = this.add
        .circle(46 + i * 46, 76, 16, 0xffffff, 0.45)
        .setStrokeStyle(4, Colors.waterDeep, 0.8)
        .setDepth(960);
      this.dots.push(dot);
    }
  }

  private spawnBubble(): void {
    if (!this.scene.isActive()) return;
    const x = Phaser.Math.Between(80, GAME_WIDTH - 80);
    const y = Phaser.Math.Between(200, GAME_HEIGHT - 620);
    const bubble = this.add
      .image(x, GAME_HEIGHT + 80, TextureKeys.bubble)
      .setDepth(20)
      .setScale(Phaser.Math.FloatBetween(0.85, 1.15))
      .setInteractive({ useHandCursor: true });
    bubble.input!.hitArea = new Phaser.Geom.Circle(58, 58, 72);
    bubble.input!.hitAreaCallback = Phaser.Geom.Circle.Contains;

    // Rise into place, then wobble forever.
    this.tweens.add({
      targets: bubble,
      y,
      duration: 900,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: bubble,
          y: y - Phaser.Math.Between(18, 40),
          x: x + Phaser.Math.Between(-30, 30),
          duration: Phaser.Math.Between(1200, 2000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        this.tweens.add({
          targets: bubble,
          scaleX: bubble.scaleX * 1.08,
          scaleY: bubble.scaleY * 0.94,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    bubble.once('pointerdown', () => this.popBubble(bubble));
  }

  private popBubble(bubble: Phaser.GameObjects.Image): void {
    AudioManager.playSfx(SfxKeys.bubblePop);
    bubble.disableInteractive();
    this.tweens.killTweensOf(bubble);

    // Burst ring.
    const ring = this.add
      .circle(bubble.x, bubble.y, 30)
      .setStrokeStyle(8, Colors.bubbleRim, 0.9)
      .setDepth(21);
    this.tweens.add({
      targets: ring,
      radius: 70,
      alpha: 0,
      duration: 320,
      onComplete: () => ring.destroy(),
    });

    // The bubble's sparkle flies into the canopy.
    const canopyX = CENTER_X + Phaser.Math.Between(-120, 120);
    const canopyY = GAME_HEIGHT - 130 - 480 + Phaser.Math.Between(-40, 40);
    const mote = this.add
      .image(bubble.x, bubble.y, TextureKeys.softCircle)
      .setTint(Colors.bubbleFill)
      .setDepth(22)
      .setScale(1.4);
    bubble.destroy();

    this.tweens.add({
      targets: mote,
      x: canopyX,
      y: canopyY,
      scale: 0.5,
      duration: 550,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        mote.destroy();
        this.leafReceives(canopyX, canopyY);
      },
    });

    this.popped++;
    this.counterText.setText(bnDigits(`${this.popped} / ${BUBBLE_COUNT}`));
    this.tweens.add({ targets: this.counterText, scale: 1.25, duration: 120, yoyo: true });
    const dot = this.dots[this.popped - 1];
    if (dot) {
      dot.setFillStyle(Colors.waterBlue, 1);
      this.tweens.add({ targets: dot, scale: 1.4, duration: 140, yoyo: true });
    }

    if (this.popped === BUBBLE_COUNT) {
      this.time.delayedCall(900, () =>
        this.completeScene(Lines.airDone, { x: CENTER_X, y: GAME_HEIGHT * 0.4 }),
      );
    }
  }

  /** Little celebration where the air lands: sparkle + happy leaf wiggle. */
  private leafReceives(x: number, y: number): void {
    AudioManager.playSfx(SfxKeys.leafWiggle);
    this.titu?.setLeafHealth(0.55 + (this.popped / BUBBLE_COUNT) * 0.3);

    for (let i = 0; i < 3; i++) {
      const sparkle = this.add
        .image(x, y, TextureKeys.sparkle)
        .setTint(Colors.sparkleGold)
        .setDepth(23)
        .setScale(0.3);
      this.tweens.add({
        targets: sparkle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 30),
        scale: 0.85,
        alpha: 0,
        angle: Phaser.Math.Between(-90, 90),
        duration: 480,
        delay: i * 70,
        ease: 'Cubic.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }

    const leaf = this.add
      .image(x, y, TextureKeys.leaf)
      .setDepth(23)
      .setScale(0.9)
      .setAngle(-20);
    this.tweens.add({
      targets: leaf,
      angle: 20,
      duration: 110,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.tweens.add({ targets: leaf, alpha: 0, duration: 250, onComplete: () => leaf.destroy() });
      },
    });
  }
}
