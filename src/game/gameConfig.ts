import Phaser from 'phaser';
import { Colors } from '../constants/colors';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants/layout';
import { AirScene } from '../scenes/AirScene';
import { BootScene } from '../scenes/BootScene';
import { HomeScene } from '../scenes/HomeScene';
import { IntroScene } from '../scenes/IntroScene';
import { RewardScene } from '../scenes/RewardScene';
import { SunScene } from '../scenes/SunScene';
import { WaterScene } from '../scenes/WaterScene';

export function buildGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO, // WebGL with automatic Canvas fallback
    parent,
    backgroundColor: Colors.skyTop,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    render: {
      antialias: true,
      roundPixels: false,
    },
    input: {
      activePointers: 3, // little hands touch with several fingers
    },
    fps: {
      target: 60,
    },
    scene: [BootScene, HomeScene, IntroScene, WaterScene, AirScene, SunScene, RewardScene],
  };
}
