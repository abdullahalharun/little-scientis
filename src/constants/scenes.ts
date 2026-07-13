/** Scene registry keys — referenced everywhere instead of string literals. */
export const SceneKeys = {
  boot: 'BootScene',
  home: 'HomeScene',
  intro: 'IntroScene',
  water: 'WaterScene',
  air: 'AirScene',
  sun: 'SunScene',
  reward: 'RewardScene',
} as const;

export type SceneKey = (typeof SceneKeys)[keyof typeof SceneKeys];

/** The play order of Level 1. LevelSceneBase uses this to find "next". */
export const LEVEL1_FLOW: SceneKey[] = [
  SceneKeys.intro,
  SceneKeys.water,
  SceneKeys.air,
  SceneKeys.sun,
  SceneKeys.reward,
];
