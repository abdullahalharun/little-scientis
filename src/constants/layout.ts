/**
 * The fixed design space. Every scene lays out against these coordinates;
 * Phaser's Scale.FIT maps them onto the real screen.
 */
export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;

export const CENTER_X = GAME_WIDTH / 2;
export const CENTER_Y = GAME_HEIGHT / 2;

/** Minimum touch-target size for little fingers (design-space pixels). */
export const MIN_TOUCH_SIZE = 96;

export const FONT_FAMILY =
  '"Baloo Da 2", "Hind Siliguri", "Noto Sans Bengali", "Baloo 2", "Comic Sans MS", sans-serif';

export const FONT_SIZE = {
  title: 64,
  heading: 48,
  speech: 34,
  button: 40,
  counter: 56,
  small: 28,
} as const;

export const BUTTON = {
  width: 340,
  height: 118,
  radius: 56,
} as const;

/** Standard duration (ms) for scene fade transitions. */
export const FADE_DURATION = 450;
