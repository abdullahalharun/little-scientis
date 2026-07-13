import Phaser from 'phaser';
import { voiceKey } from '../constants/audioKeys';
import type { NarrationLine } from '../constants/lines';
import { GameState } from '../game/GameState';

/**
 * Titu's voice. Priority order:
 *   1. A recorded voice clip loaded into Phaser as `voice-<lineId>` (drop-in).
 *   2. Web Speech API text-to-speech (placeholder).
 * The speech bubble is always shown by the caller regardless, so devices with
 * no audio still work.
 */
class NarrationManagerImpl {
  private game?: Phaser.Game;
  private voice?: SpeechSynthesisVoice;

  attach(game: Phaser.Game): void {
    this.game = game;
    // Voice lists load asynchronously in some browsers.
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', () => this.pickVoice());
      this.pickVoice();
    }
  }

  speak(line: NarrationLine): void {
    if (!GameState.soundOn) return;

    const key = voiceKey(line.id);
    if (this.game?.cache.audio.exists(key)) {
      this.game.sound.play(key);
      return;
    }

    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.rate = 0.85; // slow and clear for young children
    utterance.pitch = 1.35; // friendly, higher "Titu" voice
    utterance.volume = 0.9;
    if (this.voice) utterance.voice = this.voice;
    window.speechSynthesis.speak(utterance);
  }

  /** Stop talking immediately (scene changes, mute). */
  stop(): void {
    window.speechSynthesis?.cancel();
  }

  private pickVoice(): void {
    const voices = window.speechSynthesis.getVoices();
    // Prefer a friendly English voice; otherwise the browser default is fine.
    this.voice =
      voices.find((v) => v.lang.startsWith('en') && /child|kid|junior/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en') && v.localService) ??
      voices.find((v) => v.lang.startsWith('en'));
  }
}

export const NarrationManager = new NarrationManagerImpl();
