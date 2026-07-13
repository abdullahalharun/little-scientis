/**
 * Every texture key in the game — the swap manifest for real art.
 *
 * All of these are generated procedurally in `utils/textures.ts` at boot.
 * To replace one with a real illustration, load a PNG under the SAME key in
 * BootScene *before* `generateAllTextures()` runs (it skips keys that already
 * exist). Nothing else in the codebase needs to change.
 */
export const TextureKeys = {
  // Titu the tree-chef
  tituTrunk: 'titu-trunk',
  tituCanopy: 'titu-canopy',
  tituBranch: 'titu-branch',
  tituHat: 'titu-hat',
  leaf: 'leaf',

  // Environment
  cloud: 'cloud',
  cloudDark: 'cloud-dark',
  hill: 'hill',
  flowerPink: 'flower-pink',
  flowerYellow: 'flower-yellow',
  flowerPurple: 'flower-purple',
  butterflyWing: 'butterfly-wing',
  butterflyBody: 'butterfly-body',
  bird: 'bird',
  stone: 'stone',

  // Water scene
  waterDrop: 'water-drop',
  rootTip: 'root-tip',

  // Air scene
  bubble: 'bubble',

  // Sun scene
  sunFace: 'sun-face',
  sunRay: 'sun-ray',

  // Reward scene
  cake: 'cake',
  apple: 'apple',

  // Particles & UI bits
  sparkle: 'sparkle',
  star: 'star',
  confetti: 'confetti',
  softCircle: 'soft-circle',
  dropletSmall: 'droplet-small',
  padlock: 'padlock',
} as const;

export type TextureKey = (typeof TextureKeys)[keyof typeof TextureKeys];
