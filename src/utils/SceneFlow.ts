import Phaser from 'phaser';
import { FADE_DURATION } from '../constants/layout';
import { LEVEL1_FLOW, type SceneKey } from '../constants/scenes';
import { NarrationManager } from './NarrationManager';

/** The scene that follows `current` in Level 1's play order (undefined at the end). */
export function nextSceneOf(current: SceneKey): SceneKey | undefined {
  const index = LEVEL1_FLOW.indexOf(current);
  return index >= 0 ? LEVEL1_FLOW[index + 1] : undefined;
}

/** Fade the camera out, silence narration, then start the target scene. */
export function fadeToScene(scene: Phaser.Scene, target: SceneKey): void {
  NarrationManager.stop();
  scene.cameras.main.fadeOut(FADE_DURATION, 255, 255, 255);
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.scene.start(target);
  });
}

/** Standard fade-in; call at the top of every scene's create(). */
export function fadeIn(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(FADE_DURATION, 255, 255, 255);
}
