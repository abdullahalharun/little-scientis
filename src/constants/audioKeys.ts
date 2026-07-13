/**
 * Every sound in the game — the swap manifest for real audio.
 *
 * All of these are synthesized in `utils/AudioManager.ts` as placeholders.
 * To replace one with a real recording, load an audio file under the SAME key
 * in BootScene; AudioManager plays a loaded Phaser sound when the key exists
 * and only falls back to synthesis when it doesn't.
 */
export const SfxKeys = {
  slurp: 'sfx-slurp',
  leafWiggle: 'sfx-leaf-wiggle',
  bubblePop: 'sfx-bubble-pop',
  sparkle: 'sfx-sparkle',
  sunShine: 'sfx-sun-shine',
  sizzle: 'sfx-sizzle',
  reward: 'sfx-reward',
  click: 'sfx-click',
  success: 'sfx-success',
  gentleFail: 'sfx-gentle-fail',
  talkBlip: 'sfx-talk-blip',
} as const;

export const MusicKeys = {
  duffLoop: 'music-duff-loop',
} as const;

/**
 * Voice-over keys mirror narration line ids: `voice-<lineId>`.
 * See constants/lines.ts. Drop in MP3s named after these keys and
 * NarrationManager will prefer them over text-to-speech.
 */
export const voiceKey = (lineId: string): string => `voice-${lineId}`;

export type SfxKey = (typeof SfxKeys)[keyof typeof SfxKeys];
export type MusicKey = (typeof MusicKeys)[keyof typeof MusicKeys];
