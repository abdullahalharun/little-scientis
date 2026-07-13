/**
 * The single source of truth for the game's soft pastel storybook palette.
 * All numbers are 0xRRGGBB for Phaser; use `hex()` when a CSS string is needed.
 */
export const Colors = {
  // Sky & atmosphere
  skyTop: 0xaee3f5,
  skyBottom: 0xe8f9ff,
  nightTop: 0x3d4d8a,
  nightBottom: 0x7a8ec9,
  cloudWhite: 0xffffff,
  cloudShadow: 0xdcecf7,

  // Garden
  grassLight: 0xa8e6a1,
  grassDark: 0x7ed17a,
  hillFar: 0xc5f0c0,
  flowerPink: 0xffb3c6,
  flowerYellow: 0xffe08a,
  flowerPurple: 0xd0b3ff,
  flowerCenter: 0xffd166,

  // Soil (water scene)
  soilTop: 0xc98d5e,
  soilDeep: 0x8a5a35,
  soilStone: 0xb0774a,

  // Titu
  tituTrunk: 0xa9765a,
  tituTrunkDark: 0x8f5f45,
  tituLeafThirsty: 0xb9d98a,
  tituLeaf: 0x7ecb6f,
  tituLeafHappy: 0x4fb84a,
  tituLeafShine: 0xa5e89b,
  tituCheek: 0xffb3a1,

  // Chef hat
  hatWhite: 0xfffdf6,
  hatShadow: 0xe8e2d0,
  hatBand: 0xffd9a1,

  // Water
  waterBlue: 0x6fc7f0,
  waterDeep: 0x3fa8e0,
  waterShine: 0xd6f2ff,

  // Air bubbles
  bubbleFill: 0xcdefff,
  bubbleRim: 0x8fd6f5,
  bubbleSparkle: 0xffffff,

  // Sun
  sunCore: 0xffd93b,
  sunGlow: 0xffe789,
  sunRay: 0xffedb0,
  sunCheek: 0xffb46b,

  // Reward
  cakeSponge: 0xffe0b3,
  cakeCream: 0xfff6e8,
  cakeGlow: 0xfff3b8,
  appleRed: 0xff6b6b,
  appleShine: 0xffb3b3,
  appleLeaf: 0x6fcf67,

  // UI
  buttonGreen: 0x6fcf67,
  buttonGreenDark: 0x54b04c,
  buttonOrange: 0xffb057,
  buttonOrangeDark: 0xf0954a,
  buttonShadow: 0x3f7a3a,
  panelCream: 0xfff9ec,
  panelBorder: 0xffd9a1,
  textDark: 0x4a3b2a,
  textLight: 0xffffff,
  lockedGrey: 0xc9c3b8,
  starYellow: 0xffd93b,

  // Confetti set
  confetti: [0xff6b6b, 0xffd93b, 0x6fcf67, 0x6fc7f0, 0xd0b3ff, 0xffb3c6],

  // Magic
  sparkleGold: 0xffe789,
  magicPurple: 0xd0b3ff,
} as const;

/** 0xRRGGBB → "#rrggbb" for text styles and DOM. */
export function hex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}
