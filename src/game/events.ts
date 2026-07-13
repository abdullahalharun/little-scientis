import Phaser from 'phaser';

/**
 * The bridge between Phaser and React. Phaser emits, React listens (and vice
 * versa for the mute button). Gameplay never depends on React.
 */
export const gameEvents = new Phaser.Events.EventEmitter();

export const GameEvents = {
  /** Phaser → React: boot finished, hide the loading screen. */
  ready: 'ready',
  /** React → Phaser + Phaser → React: sound toggled. Payload: muted boolean. */
  muteChanged: 'mute-changed',
  /** Phaser → React: a level was completed. Payload: level id. */
  levelComplete: 'level-complete',
} as const;
