import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors } from '../constants/colors';
import { CENTER_X, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { Lines } from '../constants/lines';
import { SceneKeys } from '../constants/scenes';
import { TextureKeys } from '../constants/textureKeys';
import { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { paintMeadow, paintSky } from '../utils/backgrounds';
import { LevelSceneBase } from './LevelSceneBase';

const SUN_X = CENTER_X;
const SUN_Y = 330;
const CLEAR_DISTANCE = 270;
const CLOUD_COUNT = 3;

/**
 * Scene 3 — Sunlight. Sleepy sun hides behind three fluffy clouds in a dim
 * sky. Dragging each cloud far enough sends it drifting away; the sky
 * brightens step by step until the sun wakes up and cooks Titu's kitchen.
 */
export class SunScene extends LevelSceneBase {
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private sunEyes!: Phaser.GameObjects.Graphics;
  private rays!: Phaser.GameObjects.Container;
  private cleared = 0;

  constructor() {
    super(SceneKeys.sun);
  }

  protected buildScene(): void {
    this.cleared = 0;

    // Day sky lives underneath; the night overlay dissolves cloud by cloud.
    paintSky(this, Colors.skyTop, Colors.skyBottom);
    paintMeadow(this, GAME_HEIGHT - 300);
    this.nightOverlay = this.add
      .rectangle(CENTER_X, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, Colors.nightTop, 0.62)
      .setDepth(30);

    this.titu = new Titu(this, CENTER_X, GAME_HEIGHT - 170, 0.8);
    this.titu.setLeafHealth(0.75, false);

    this.buildSun();
    this.buildClouds();

    this.time.delayedCall(700, () => this.say(Lines.sunIntro, 150));
  }

  private buildSun(): void {
    this.rays = this.add.container(SUN_X, SUN_Y).setDepth(31);
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * 360;
      const ray = this.add
        .image(0, 0, TextureKeys.sunRay)
        .setOrigin(0.5, 1)
        .setAngle(angle + 180)
        .setPosition(
          Math.sin(Phaser.Math.DegToRad(angle)) * 130,
          -Math.cos(Phaser.Math.DegToRad(angle)) * 130,
        );
      this.rays.add(ray);
    }
    this.rays.setScale(0).setAlpha(0);

    this.add.image(SUN_X, SUN_Y, TextureKeys.sunFace).setDepth(32);
    this.sunEyes = this.add.graphics({ x: SUN_X, y: SUN_Y }).setDepth(33);
    this.drawSunFace(false);
  }

  /** Sleeping: closed-arc eyes and a tiny mouth. Awake: big eyes + open smile. */
  private drawSunFace(awake: boolean): void {
    const g = this.sunEyes;
    g.clear();
    g.lineStyle(8, 0x8a5a20);
    if (awake) {
      g.fillStyle(0x5a3a10);
      g.fillCircle(-42, -20, 13);
      g.fillCircle(42, -20, 13);
      g.fillStyle(0xffffff);
      g.fillCircle(-37, -25, 5);
      g.fillCircle(47, -25, 5);
      g.beginPath();
      g.arc(0, 12, 40, Phaser.Math.DegToRad(25), Phaser.Math.DegToRad(155));
      g.strokePath();
    } else {
      // Peacefully closed eyes.
      g.beginPath();
      g.arc(-42, -18, 16, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
      g.strokePath();
      g.beginPath();
      g.arc(42, -18, 16, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
      g.strokePath();
      g.beginPath();
      g.arc(0, 22, 18, Phaser.Math.DegToRad(35), Phaser.Math.DegToRad(145));
      g.strokePath();
    }
  }

  private buildClouds(): void {
    const spots: Array<[number, number, number]> = [
      [SUN_X - 110, SUN_Y - 70, 1.15],
      [SUN_X + 120, SUN_Y - 20, 1.05],
      [SUN_X - 10, SUN_Y + 90, 1.25],
    ];
    spots.forEach(([x, y, scale], i) => {
      const cloud = this.add
        .image(x, y, TextureKeys.cloudDark)
        .setDepth(40)
        .setScale(scale)
        .setInteractive({ useHandCursor: true, draggable: true });

      // Restless little sway hints "I can move".
      const sway = this.tweens.add({
        targets: cloud,
        x: x + (i % 2 === 0 ? 18 : -18),
        duration: 1600 + i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      let gone = false;
      cloud.on(
        Phaser.Input.Events.GAMEOBJECT_DRAG,
        (_p: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          if (gone) return;
          sway.stop();
          cloud.setPosition(dragX, dragY);
          // Cleared the sun? Let it sail away — no need to release first.
          if (Phaser.Math.Distance.Between(dragX, dragY, SUN_X, SUN_Y) > CLEAR_DISTANCE) {
            gone = true;
            this.releaseCloud(cloud);
          }
        },
      );
    });
  }

  private releaseCloud(cloud: Phaser.GameObjects.Image): void {
    cloud.disableInteractive();
    const offX = cloud.x < SUN_X ? -260 : GAME_WIDTH + 260;
    this.tweens.add({
      targets: cloud,
      x: offX,
      y: cloud.y - 60,
      alpha: 0.4,
      duration: 1100,
      ease: 'Sine.easeIn',
      onComplete: () => cloud.destroy(),
    });

    this.cleared++;
    AudioManager.playSfx(SfxKeys.sparkle);

    // Sky brightens one step per cloud.
    this.tweens.add({
      targets: this.nightOverlay,
      fillAlpha: 0.62 * (1 - this.cleared / CLOUD_COUNT),
      duration: 800,
      ease: 'Sine.easeOut',
    });

    if (this.cleared === CLOUD_COUNT) {
      this.time.delayedCall(600, () => this.sunrise());
    }
  }

  /** The sun wakes: smile, golden rays, glowing leaves, cooking sounds. */
  private sunrise(): void {
    AudioManager.playSfx(SfxKeys.sunShine);
    this.drawSunFace(true);

    this.tweens.add({
      targets: this.rays,
      scale: 1,
      alpha: 1,
      duration: 900,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: this.rays,
      angle: 360,
      duration: 40000,
      repeat: -1,
    });

    // Golden sparkles rain toward Titu + the cooking sizzle.
    this.time.delayedCall(500, () => {
      AudioManager.playSfx(SfxKeys.sizzle);
      for (let i = 0; i < 10; i++) {
        const sparkle = this.add
          .image(Phaser.Math.Between(SUN_X - 140, SUN_X + 140), SUN_Y + 60, TextureKeys.sparkle)
          .setTint(Colors.sparkleGold)
          .setDepth(35)
          .setScale(0.4)
          .setAlpha(0);
        this.tweens.add({
          targets: sparkle,
          y: GAME_HEIGHT - 640,
          alpha: { from: 1, to: 0 },
          scale: 0.8,
          angle: 180,
          duration: 1300,
          delay: i * 130,
          ease: 'Sine.easeIn',
          onComplete: () => sparkle.destroy(),
        });
      }

      // Leaves glow under the light.
      const glow = this.add
        .image(CENTER_X, GAME_HEIGHT - 170 - 390, TextureKeys.softCircle)
        .setTint(Colors.sunGlow)
        .setDepth(29)
        .setScale(9)
        .setAlpha(0);
      this.tweens.add({
        targets: glow,
        alpha: 0.5,
        scale: 11,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    this.time.delayedCall(1600, () =>
      this.completeScene(Lines.sunDone, { x: CENTER_X, y: GAME_HEIGHT * 0.42 }),
    );
  }
}
