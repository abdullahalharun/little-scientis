import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { CENTER_X, GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { Lines } from '../constants/lines';
import { SceneKeys } from '../constants/scenes';
import { UiText } from '../constants/uiText';
import { BigButton } from '../objects/BigButton';
import { Bird } from '../objects/Bird';
import { Butterfly } from '../objects/Butterfly';
import { Cloud } from '../objects/Cloud';
import { Flower } from '../objects/Flower';
import { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { paintMeadow, paintSky } from '../utils/backgrounds';
import { fadeToScene } from '../utils/SceneFlow';
import { LevelSceneBase } from './LevelSceneBase';

/**
 * The storybook opening: Titu waves in his garden, gives salaam and invites
 * the child to cook. One big Start button.
 */
export class IntroScene extends LevelSceneBase {
  constructor() {
    super(SceneKeys.intro);
  }

  protected buildScene(): void {
    paintSky(this, Colors.skyTop, Colors.skyBottom);
    paintMeadow(this, GAME_HEIGHT - 320);

    new Cloud(this, 140, 120, 0.8, 9);
    new Cloud(this, 520, 210, 0.55, 13);
    new Bird(this, 170, 26);
    new Bird(this, 260, 20);
    new Butterfly(this, new Phaser.Geom.Rectangle(60, 700, GAME_WIDTH - 120, 380));
    new Butterfly(this, new Phaser.Geom.Rectangle(60, 700, GAME_WIDTH - 120, 380));

    for (let i = 0; i < 6; i++) {
      new Flower(
        this,
        50 + i * 130 + (i % 2) * 20,
        GAME_HEIGHT - 24 - (i % 3) * 26,
        0.85 + (i % 2) * 0.25,
      );
    }

    this.titu = new Titu(this, CENTER_X, GAME_HEIGHT - 230, 0.92);
    this.titu.setLeafHealth(0.5, false);

    // Wave hello, then talk through the welcome lines.
    this.time.delayedCall(600, () => {
      this.titu?.wave();
      this.say(Lines.introSalaam, 190, () => {
        this.say(Lines.introKitchen, 190, () => {
          this.say(Lines.introInvite, 190);
        });
      });
    });

    // Start is available right away — no forced waiting for narration.
    new BigButton(this, CENTER_X, GAME_HEIGHT - 90, UiText.start, () => {
      void AudioManager.startMusic();
      fadeToScene(this, SceneKeys.water);
    }).popIn(1200);
  }
}
