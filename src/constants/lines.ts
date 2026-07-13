/**
 * Every word Titu says, in one place — for narration, voice-over file naming
 * (see audioKeys.voiceKey) and future translation.
 */
export interface NarrationLine {
  /** Stable id — voice-over files are named `voice-<id>`. */
  id: string;
  text: string;
}

export const Lines = {
  introSalaam: {
    id: 'intro-salaam',
    text: 'Assalamu Alaikum, my friend!',
  },
  introKitchen: {
    id: 'intro-kitchen',
    text: 'Allah has given me a wonderful kitchen, but my tummy is hungry!',
  },
  introInvite: {
    id: 'intro-invite',
    text: "Let's cook food together using the blessings Allah has provided!",
  },

  waterIntro: {
    id: 'water-intro',
    text: 'Pull my roots to the sparkly water drops!',
  },
  waterDone: {
    id: 'water-done',
    text: 'Alhamdulillah! Allah has given me sweet water!',
  },

  airIntro: {
    id: 'air-intro',
    text: 'Tap the magic air bubbles for my leaves!',
  },
  airDone: {
    id: 'air-done',
    text: 'Wonderful! The air has reached my kitchen!',
  },

  sunIntro: {
    id: 'sun-intro',
    text: 'Oh no, clouds! Slide them away to wake the sun!',
  },
  sunDone: {
    id: 'sun-done',
    text: "SubhanAllah! Without Allah's sunlight, I couldn't cook my food!",
  },

  rewardCooking: {
    id: 'reward-cooking',
    text: 'Water... air... sunlight... time to cook!',
  },
  rewardFull: {
    id: 'reward-full',
    text: "Hooray! By Allah's mercy, my tummy is full! Alhamdulillah!",
  },
  rewardApple: {
    id: 'reward-apple',
    text: 'This shiny apple is for you, my friend!',
  },

  gentleHint: {
    id: 'gentle-hint',
    text: 'Almost! Try again, you can do it!',
  },
} as const satisfies Record<string, NarrationLine>;

export type LineKey = keyof typeof Lines;
