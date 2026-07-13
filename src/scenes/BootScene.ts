import Phaser from 'phaser';
import { SceneKeys } from '../constants/scenes';
import { GameEvents, gameEvents } from '../game/events';
import { AudioManager } from '../utils/AudioManager';
import { NarrationManager } from '../utils/NarrationManager';
import { generateAllTextures } from '../utils/textures';

/**
 * First scene: (optionally) loads real asset files, then fills every missing
 * texture with procedural placeholder art and hands off to the home screen.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.boot);
  }

  preload(): void {
    // ── Real-asset drop-in point ──────────────────────────────────────────
    // When real art/audio lands in public/assets, load it here under the keys
    // from constants/textureKeys.ts and constants/audioKeys.ts, e.g.:
    //   this.load.image(TextureKeys.tituCanopy, 'assets/images/titu-canopy.png');
    //   this.load.audio(SfxKeys.bubblePop, 'assets/sounds/bubble-pop.mp3');
    //   this.load.audio(voiceKey(Lines.introSalaam.id), 'assets/sounds/voice/intro-salaam.mp3');
    // Anything not loaded is generated procedurally below.
  }

  create(): void {
    generateAllTextures(this);
    AudioManager.attach(this.game);
    NarrationManager.attach(this.game);

    gameEvents.emit(GameEvents.ready);
    this.scene.start(SceneKeys.home);
  }
}
