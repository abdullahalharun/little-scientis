import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors, hex } from '../constants/colors';
import { CENTER_X, FONT_FAMILY, FONT_SIZE, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { Lines } from '../constants/lines';
import { SceneKeys } from '../constants/scenes';
import { TextureKeys } from '../constants/textureKeys';
import { UiText } from '../constants/uiText';
import { GameEvents, gameEvents } from '../game/events';
import { GameState } from '../game/GameState';
import { BigButton } from '../objects/BigButton';
import { Butterfly } from '../objects/Butterfly';
import { confettiRain } from '../objects/StarBurst';
import { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { paintMeadow, paintSky } from '../utils/backgrounds';
import { fadeToScene } from '../utils/SceneFlow';
import { LevelSceneBase } from './LevelSceneBase';

const TITU_Y = GAME_HEIGHT - 240;
const CANOPY_Y = TITU_Y - 420;

/**
 * The finale: water + air + sunlight swirl into Titu's leaves, the glucose
 * cake appears, Titu feasts and dances, throws the player an apple, and the
 * big MashaAllah celebration caps it off with a simple picture recap.
 */
export class RewardScene extends LevelSceneBase {
  constructor() {
    super(SceneKeys.reward);
  }

  protected buildScene(): void {
    paintSky(this, Colors.skyTop, Colors.skyBottom);
    paintMeadow(this, GAME_HEIGHT - 340);
    new Butterfly(this, new Phaser.Geom.Rectangle(60, 780, GAME_WIDTH - 120, 300));
    new Butterfly(this, new Phaser.Geom.Rectangle(60, 780, GAME_WIDTH - 120, 300));

    this.titu = new Titu(this, CENTER_X, TITU_Y, 0.9);
    this.titu.setLeafHealth(1, false);

    this.time.delayedCall(600, () => {
      this.say(Lines.rewardCooking, 150, () => this.flyIngredients());
    });
  }

  /** Step 1 — the three blessings fly one by one into the canopy. */
  private flyIngredients(): void {
    const items: Array<{ key: string; tint?: number; scale: number }> = [
      { key: TextureKeys.waterDrop, scale: 1 },
      { key: TextureKeys.bubble, scale: 0.9 },
      { key: TextureKeys.sunFace, scale: 0.42 },
    ];

    items.forEach((item, i) => {
      const startX = 140 + i * 220;
      const icon = this.add
        .image(startX, 260, item.key)
        .setDepth(50)
        .setScale(0);
      if (item.tint) icon.setTint(item.tint);

      this.tweens.add({
        targets: icon,
        scale: item.scale,
        duration: 350,
        delay: i * 500,
        ease: 'Back.easeOut',
      });
      this.tweens.add({
        targets: icon,
        x: CENTER_X,
        y: CANOPY_Y,
        scale: item.scale * 0.3,
        alpha: 0.2,
        duration: 700,
        delay: 900 + i * 500,
        ease: 'Cubic.easeIn',
        onStart: () => AudioManager.playSfx(SfxKeys.sparkle),
        onComplete: () => icon.destroy(),
      });
    });

    this.time.delayedCall(900 + items.length * 500 + 700, () => this.magicSwirl());
  }

  /** Step 2 — magic sparkle vortex inside the leaves. */
  private magicSwirl(): void {
    AudioManager.playSfx(SfxKeys.sparkle);
    const sparkles: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 14; i++) {
      const sparkle = this.add
        .image(CENTER_X, CANOPY_Y, TextureKeys.sparkle)
        .setDepth(51)
        .setTint(i % 2 === 0 ? Colors.sparkleGold : Colors.magicPurple)
        .setScale(0.5);
      sparkles.push(sparkle);
      const startAngle = (i / 14) * Math.PI * 2;
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1600,
        delay: i * 40,
        ease: 'Sine.easeIn',
        onUpdate: (tween) => {
          const t = tween.getValue() ?? 0;
          const angle = startAngle + t * Math.PI * 3.5;
          const radius = 150 * (1 - t);
          sparkle.setPosition(
            CENTER_X + Math.cos(angle) * radius,
            CANOPY_Y + Math.sin(angle) * radius * 0.7,
          );
          sparkle.setScale(0.5 + t * 0.4);
          sparkle.setAlpha(1 - t * 0.5);
        },
        onComplete: () => sparkle.destroy(),
      });
    }

    // Canopy flashes with joy.
    const flash = this.add
      .image(CENTER_X, CANOPY_Y, TextureKeys.softCircle)
      .setDepth(49)
      .setTint(Colors.cakeGlow)
      .setScale(2)
      .setAlpha(0);
    this.tweens.add({
      targets: flash,
      alpha: 0.9,
      scale: 8,
      duration: 500,
      delay: 1500,
      yoyo: true,
      onComplete: () => flash.destroy(),
    });

    this.time.delayedCall(2100, () => this.serveCake());
  }

  /** Step 3 — the glowing glucose cake appears and Titu eats it. */
  private serveCake(): void {
    AudioManager.playSfx(SfxKeys.sizzle);

    const glow = this.add
      .image(CENTER_X, CANOPY_Y + 130, TextureKeys.softCircle)
      .setDepth(52)
      .setTint(Colors.cakeGlow)
      .setScale(0)
      .setAlpha(0.85);
    const cake = this.add
      .image(CENTER_X, CANOPY_Y + 130, TextureKeys.cake)
      .setDepth(53)
      .setScale(0);

    this.tweens.add({
      targets: [cake],
      scale: 1.1,
      duration: 550,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: glow,
      scale: 6,
      duration: 550,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: glow,
          scale: 7,
          alpha: 0.5,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    // Float temptingly, then get gobbled.
    this.tweens.add({
      targets: [cake, glow],
      y: CANOPY_Y + 110,
      duration: 800,
      delay: 550,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tweens.add({
          targets: [cake, glow],
          x: CENTER_X,
          y: TITU_Y - 335, // Titu's mouth
          scale: 0.15,
          alpha: 0,
          duration: 600,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            cake.destroy();
            glow.destroy();
            AudioManager.playSfx(SfxKeys.reward);
            this.titu?.eat(() => this.danceParty());
          },
        });
      },
    });
  }

  /** Step 4 — full tummy, dancing, and the apple gift. */
  private danceParty(): void {
    this.titu?.dance();
    this.say(Lines.rewardFull, 150, () => {
      this.titu?.stopDance();
      this.throwApple();
    });
    confettiRain(this, CENTER_X, GAME_HEIGHT * 0.4, 20);
  }

  private throwApple(): void {
    this.say(Lines.rewardApple, 150);
    this.titu?.wave();

    const apple = this.add
      .image(CENTER_X + 90, TITU_Y - 320, TextureKeys.apple)
      .setDepth(60)
      .setScale(0.3);

    // Arc toward the camera: up, then down to the foreground, growing huge.
    this.tweens.add({
      targets: apple,
      y: apple.y - 200,
      scale: 0.9,
      duration: 450,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: apple,
          y: GAME_HEIGHT - 400,
          scale: 2.4,
          angle: 360,
          duration: 600,
          ease: 'Sine.easeIn',
          onComplete: () => {
            // Bouncy landing.
            this.tweens.add({
              targets: apple,
              y: GAME_HEIGHT - 460,
              duration: 260,
              yoyo: true,
              repeat: 2,
              ease: 'Sine.easeOut',
              onComplete: () => {
                this.tweens.add({
                  targets: apple,
                  y: apple.y - 12,
                  duration: 900,
                  yoyo: true,
                  repeat: -1,
                  ease: 'Sine.easeInOut',
                });
              },
            });
            this.time.delayedCall(400, () => this.grandFinale());
          },
        });
      },
    });
  }

  /** Step 5 — MashaAllah!, the picture recap and replay buttons. */
  private grandFinale(): void {
    AudioManager.playSfx(SfxKeys.reward);
    confettiRain(this, CENTER_X, 300, 34);

    GameState.markLevelComplete('photosynthesis');
    gameEvents.emit(GameEvents.levelComplete, 'photosynthesis');

    const mashaAllah = this.add
      .text(CENTER_X, 320, UiText.mashaAllah, {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE.title}px`,
        color: hex(Colors.textLight),
        stroke: hex(Colors.buttonOrangeDark),
        strokeThickness: 12,
      })
      .setOrigin(0.5)
      .setDepth(70)
      .setScale(0);
    this.tweens.add({
      targets: mashaAllah,
      scale: 1,
      duration: 550,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: mashaAllah,
          scale: 1.08,
          angle: { from: -2, to: 2 },
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    this.time.delayedCall(800, () => this.showRecapPanel());
  }

  /**
   * The educational note, told entirely in pictures:
   * water + air + sunlight → the plant makes its food.
   */
  private showRecapPanel(): void {
    const panelY = 505; // above Titu's face — his smile stays visible
    const panel = this.add.container(CENTER_X, panelY).setDepth(71).setScale(0);

    const g = this.add.graphics();
    g.fillStyle(Colors.buttonShadow, 0.2);
    g.fillRoundedRect(-296, -102, 600, 220, 40);
    g.fillStyle(Colors.panelCream);
    g.fillRoundedRect(-300, -110, 600, 220, 40);
    g.lineStyle(6, Colors.panelBorder);
    g.strokeRoundedRect(-300, -110, 600, 220, 40);
    panel.add(g);

    const title = this.add
      .text(0, -70, UiText.plantsNeed, {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE.small}px`,
        color: hex(Colors.textDark),
      })
      .setOrigin(0.5);
    panel.add(title);

    // 💧 + 🍃 + ☀️ = 🍰 — no reading required.
    const row: Array<{ key?: string; text?: string; scale?: number }> = [
      { key: TextureKeys.waterDrop, scale: 0.75 },
      { text: '+' },
      { key: TextureKeys.bubble, scale: 0.7 },
      { text: '+' },
      { key: TextureKeys.sunFace, scale: 0.32 },
      { text: '=' },
      { key: TextureKeys.cake, scale: 0.5 },
    ];
    let x = -252;
    for (const item of row) {
      if (item.key) {
        const icon = this.add.image(x + 40, 20, item.key).setScale(item.scale ?? 1);
        panel.add(icon);
        this.tweens.add({
          targets: icon,
          y: 12,
          duration: Phaser.Math.Between(900, 1300),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        x += 92;
      } else {
        panel.add(
          this.add
            .text(x + 20, 20, item.text ?? '', {
              fontFamily: FONT_FAMILY,
              fontSize: `${FONT_SIZE.heading}px`,
              color: hex(Colors.textDark),
            })
            .setOrigin(0.5),
        );
        x += 52;
      }
    }

    this.tweens.add({ targets: panel, scale: 1, duration: 450, ease: 'Back.easeOut' });

    new BigButton(
      this,
      CENTER_X - 155,
      GAME_HEIGHT - 110,
      UiText.again,
      () => fadeToScene(this, SceneKeys.intro),
      { width: 280 },
    ).popIn(500);
    new BigButton(
      this,
      CENTER_X + 155,
      GAME_HEIGHT - 110,
      UiText.home,
      () => fadeToScene(this, SceneKeys.home),
      { color: Colors.buttonOrange, colorDark: Colors.buttonOrangeDark, width: 280 },
    ).popIn(650);
  }
}
