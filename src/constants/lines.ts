/**
 * Every word Titu says, in one place.
 *
 * `text` (Bengali, from the original story) is what appears in the speech
 * bubble. `tts` is an English fallback read aloud by the browser's
 * text-to-speech, because most browsers can't speak Bengali well. Recorded
 * Bengali voice clips (loaded as `voice-<id>`, see audioKeys.voiceKey) always
 * take priority over TTS — drop them in and the English fallback disappears.
 */
export interface NarrationLine {
  /** Stable id — voice-over files are named `voice-<id>`. */
  id: string;
  /** Bengali line shown in the speech bubble. */
  text: string;
  /** English line spoken by placeholder TTS until real voice clips exist. */
  tts: string;
}

export const Lines = {
  introSalaam: {
    id: 'intro-salaam',
    text: 'আসসালামু আলাইকুম বন্ধু!',
    tts: 'Assalamu Alaikum, my friend!',
  },
  introKitchen: {
    id: 'intro-kitchen',
    text: 'আল্লাহ্‌ তায়ালা তো আমার খুব সুন্দর একটা রান্নাঘর বানিয়েছেন, কিন্তু আমার পেটে বড্ড ক্ষুধা!',
    tts: 'Allah has given me a wonderful kitchen, but my tummy is so hungry!',
  },
  introInvite: {
    id: 'intro-invite',
    text: 'চলো, আল্লাহ্‌র দেওয়া নেয়ামতগুলো দিয়ে একসাথে খাবার রান্না করি!',
    tts: "Let's cook food together using the blessings Allah has provided!",
  },

  waterIntro: {
    id: 'water-intro',
    text: 'শিকড়গুলো টেনে চকচকে পানির ফোঁটায় লাগিয়ে দাও তো!',
    tts: 'Pull my roots to the sparkly water drops!',
  },
  waterDone: {
    id: 'water-done',
    text: 'আলহামদুলিল্লাহ্‌! আল্লাহ্‌র দেওয়া মিষ্টি পানি পেয়ে গেলাম!',
    tts: 'Alhamdulillah! Allah has given me sweet water!',
  },

  airIntro: {
    id: 'air-intro',
    text: 'জাদুকরী বাতাসের বুদবুদগুলোতে টোকা দাও তো!',
    tts: 'Tap the magic air bubbles for my leaves!',
  },
  airDone: {
    id: 'air-done',
    text: 'বাহ! বাতাসও চলে এলো রান্নাঘরে!',
    tts: 'Wonderful! The air has reached my kitchen!',
  },

  sunIntro: {
    id: 'sun-intro',
    text: 'ইশ, মেঘ! মেঘগুলো সরিয়ে সূর্য মামাকে জাগিয়ে দাও!',
    tts: 'Oh no, clouds! Slide them away to wake up the sun!',
  },
  sunDone: {
    id: 'sun-done',
    text: 'সুবহানাল্লাহ্‌! সূর্য মামার আলো না থাকলে তো আমার রান্নাই হতো না!',
    tts: "SubhanAllah! Without the sun's light, I couldn't cook my food!",
  },

  rewardCooking: {
    id: 'reward-cooking',
    text: 'পানি... বাতাস... রোদ... এবার রান্না শুরু!',
    tts: 'Water... air... sunlight... time to cook!',
  },
  rewardFull: {
    id: 'reward-full',
    text: 'হুররে! আল্লাহ্‌র রহমতে আমার পেট ভরে গেছে! আলহামদুলিল্লাহ্‌!',
    tts: "Hooray! By Allah's mercy, my tummy is full! Alhamdulillah!",
  },
  rewardApple: {
    id: 'reward-apple',
    text: 'এই লাল টকটকে আপেলটা তোমার জন্য, বন্ধু!',
    tts: 'This shiny red apple is for you, my friend!',
  },

  gentleHint: {
    id: 'gentle-hint',
    text: 'প্রায় হয়ে গেছে! আবার চেষ্টা করো, তুমি পারবে!',
    tts: 'Almost! Try again, you can do it!',
  },
} as const satisfies Record<string, NarrationLine>;

export type LineKey = keyof typeof Lines;
