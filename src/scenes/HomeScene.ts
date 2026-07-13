import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { Colors, hex } from '../constants/colors';
import { CENTER_X, FONT_FAMILY, FONT_SIZE, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { LEVELS, type LevelDef } from '../constants/levels';
import { SceneKeys, type SceneKey } from '../constants/scenes';
import { TextureKeys } from '../constants/textureKeys';
import { GameState } from '../game/GameState';
import { Butterfly } from '../objects/Butterfly';
import { Cloud } from '../objects/Cloud';
import { Flower } from '../objects/Flower';
import { AudioManager } from '../utils/AudioManager';
import { paintMeadow, paintSky } from '../utils/backgrounds';
import { fadeIn, fadeToScene } from '../utils/SceneFlow';

/**
 * The series hub — "Little Muslim Scientist". Renders one tile per entry in
 * constants/levels.ts; locked topics show a padlock until they're built.
 */
export class HomeScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.home);
  }

  create(): void {
    fadeIn(this);
    this.input.on('pointerdown', () => AudioManager.unlock());

    paintSky(this, Colors.skyTop, Colors.skyBottom);
    paintMeadow(this, GAME_HEIGHT - 200);
    new Cloud(this, 120, 130, 0.7, 8);
    new Cloud(this, 560, 220, 0.5, 12);
    new Butterfly(this, new Phaser.Geom.Rectangle(40, 900, GAME_WIDTH - 80, 300));
    new Butterfly(this, new Phaser.Geom.Rectangle(40, 900, GAME_WIDTH - 80, 300));
    for (let i = 0; i < 5; i++) {
      new Flower(this, 60 + i * 150, GAME_HEIGHT - 30 - (i % 2) * 30, 0.9);
    }

    // Floating title.
    const title = this.add
      .text(CENTER_X, 130, '🔬 Little Muslim\nScientist 🌱', {
        fontFamily: FONT_FAMILY,
        fontSize: `${FONT_SIZE.title}px`,
        color: hex(Colors.textLight),
        stroke: hex(Colors.buttonGreenDark),
        strokeThickness: 10,
        align: 'center',
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: title,
      y: 122,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.buildTiles();
  }

  private buildTiles(): void {
    const [featured, ...locked] = LEVELS;
    if (featured) {
      this.buildTile(featured, CENTER_X, 360, 560, 170, true);
    }
    locked.forEach((level, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      this.buildTile(level, 190 + col * 340, 560 + row * 165, 310, 140, false);
    });
  }

  private buildTile(
    level: LevelDef,
    x: number,
    y: number,
    width: number,
    height: number,
    featured: boolean,
  ): void {
    const tile = this.add.container(x, y).setSize(width, height);

    const g = this.add.graphics();
    g.fillStyle(Colors.buttonShadow, 0.2);
    g.fillRoundedRect(-width / 2 + 4, -height / 2 + 8, width, height, 34);
    g.fillStyle(level.available ? Colors.panelCream : Colors.lockedGrey);
    g.fillRoundedRect(-width / 2, -height / 2, width, height, 34);
    g.lineStyle(5, level.available ? Colors.panelBorder : 0xb5ad9e);
    g.strokeRoundedRect(-width / 2, -height / 2, width, height, 34);
    tile.add(g);

    const emojiSize = featured ? 76 : 52;
    const emoji = this.add
      .text(-width / 2 + emojiSize * 0.8, 0, level.emoji, { fontSize: `${emojiSize}px` })
      .setOrigin(0.5);
    const label = this.add
      .text(emojiSize * 0.45, 0, level.title, {
        fontFamily: FONT_FAMILY,
        fontSize: `${featured ? FONT_SIZE.heading : FONT_SIZE.small}px`,
        color: hex(Colors.textDark),
        align: 'center',
        wordWrap: { width: width - emojiSize * 2.4 },
      })
      .setOrigin(0.5);
    tile.add([emoji, label]);

    if (level.available) {
      if (GameState.isLevelComplete(level.id)) {
        tile.add(
          this.add
            .image(width / 2 - 34, -height / 2 + 6, TextureKeys.star)
            .setScale(0.55)
            .setAngle(12),
        );
      }
      tile.setInteractive({ useHandCursor: true });
      tile.on('pointerdown', () => {
        AudioManager.unlock();
        this.tweens.add({ targets: tile, scale: 0.94, duration: 80, yoyo: true });
      });
      tile.on('pointerup', () => {
        AudioManager.playSfx(SfxKeys.click);
        void AudioManager.startMusic();
        if (level.sceneKey) fadeToScene(this, level.sceneKey as SceneKey);
      });
      // Inviting pulse on the playable tile.
      this.tweens.add({
        targets: tile,
        scale: 1.04,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      label.setAlpha(0.6);
      emoji.setAlpha(0.5);
      // Corner badge so it never sits on the title text.
      tile.add(
        this.add
          .image(width / 2 - 26, -height / 2 + 26, TextureKeys.padlock)
          .setScale(0.65)
          .setAngle(10),
      );
    }
  }
}
