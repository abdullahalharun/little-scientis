/**
 * Every non-dialogue string in the game (Bengali). Titu's spoken lines live
 * in lines.ts; this file covers buttons, titles and panels — one place to
 * touch for future locales.
 */
export const UiText = {
  gameTitle: '🔬 ছোট্ট মুসলিম\nবিজ্ঞানী 🌱',
  start: '▶  শুরু করি',
  next: 'পরের ধাপ  ➜',
  again: '🔄  আবার খেলি',
  home: '🏠  বাড়ি',
  mashaAllah: '✨ মাশাআল্লাহ্‌! ✨',
  plantsNeed: 'গাছের খাবার বানাতে লাগে:',
  loading: 'বিসমিল্লাহ্‌, চলো শুরু করি!',
  rotate: 'ফোনটা সোজা করে ধরো! 🌱',
  soundOn: 'শব্দ চালু করো',
  soundOff: 'শব্দ বন্ধ করো',
} as const;

/** 123 → ১২৩ for child-friendly Bengali numerals. */
export function bnDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)] ?? d);
}
