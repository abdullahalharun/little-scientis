import Phaser from 'phaser';
import { SfxKeys } from '../constants/audioKeys';
import { CENTER_X, GAME_HEIGHT } from '../constants/layout';
import type { NarrationLine } from '../constants/lines';
import { type SceneKey } from '../constants/scenes';
import { UiText } from '../constants/uiText';
import { BigButton } from '../objects/BigButton';
import { SpeechBubble } from '../objects/SpeechBubble';
import { starBurst } from '../objects/StarBurst';
import type { Titu } from '../objects/Titu';
import { AudioManager } from '../utils/AudioManager';
import { fadeIn, fadeToScene, nextSceneOf } from '../utils/SceneFlow';

/**
 * Shared ceremony for every gameplay scene: fade-in, audio unlock, one speech
 * bubble, and the completion flow (stars → chime → Next button → fade out).
 */
export abstract class LevelSceneBase extends Phaser.Scene {
  protected bubble!: SpeechBubble;
  protected titu?: Titu;
  private completed = false;

  constructor(private readonly key: SceneKey) {
    super(key);
  }

  create(): void {
    this.completed = false;
    fadeIn(this);
    // Any first touch unlocks audio (browser autoplay policy).
    this.input.on('pointerdown', () => AudioManager.unlock());
    this.buildScene();
    this.bubble = new SpeechBubble(this, CENTER_X, 0);
  }

  /** Build backgrounds, Titu and interactions here instead of create(). */
  protected abstract buildScene(): void;

  /** Show the bubble at the given height and let Titu talk. */
  protected say(line: NarrationLine, y: number, onDone?: () => void): void {
    this.bubble.setPosition(CENTER_X, y);
    this.bubble.say(line, this.titu, onDone);
  }

  /**
   * The winning ceremony. Runs once no matter how often it's called.
   * `doneLine` is spoken first, then stars + confetti + a Next button.
   */
  protected completeScene(doneLine: NarrationLine, celebrateAt?: { x: number; y: number }): void {
    if (this.completed) return;
    this.completed = true;

    this.titu?.setLeafHealth(1);
    this.titu?.happyEyes();
    this.say(doneLine, 200, () => {
      const at = celebrateAt ?? { x: CENTER_X, y: GAME_HEIGHT * 0.45 };
      AudioManager.playSfx(SfxKeys.success);
      starBurst(this, at.x, at.y);

      const next = nextSceneOf(this.key);
      if (next) {
        new BigButton(this, CENTER_X, GAME_HEIGHT - 130, UiText.next, () =>
          fadeToScene(this, next),
        ).popIn(400);
      }
    });
  }

  protected get isComplete(): boolean {
    return this.completed;
  }
}
