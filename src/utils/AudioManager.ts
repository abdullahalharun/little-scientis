import Phaser from 'phaser';
import { MusicKeys, SfxKeys, type SfxKey } from '../constants/audioKeys';
import { GameState } from '../game/GameState';

/**
 * All game audio flows through here.
 *
 * Every sound is a synthesized WebAudio placeholder. If a real audio file has
 * been loaded into Phaser under the same key (see constants/audioKeys.ts),
 * that file plays instead — so swapping in recorded audio needs no code
 * changes, only files.
 *
 * The AudioContext is created lazily and resumed on the first user gesture
 * (browsers block audio before that).
 */
class AudioManagerImpl {
  private game?: Phaser.Game;
  private ctx?: AudioContext;
  private master?: GainNode;
  private noiseBuffer?: AudioBuffer;
  private musicSource?: AudioBufferSourceNode;
  private musicGain?: GainNode;
  private musicStarted = false;

  attach(game: Phaser.Game): void {
    this.game = game;
  }

  /** Call from any pointerdown — safe to call repeatedly. */
  unlock(): void {
    const ctx = this.context();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
  }

  get muted(): boolean {
    return !GameState.soundOn;
  }

  setMuted(muted: boolean): void {
    GameState.soundOn = !muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
    if (muted) {
      window.speechSynthesis?.cancel();
    }
  }

  playSfx(key: SfxKey): void {
    if (this.muted) return;
    if (this.playLoadedFile(key)) return;
    const ctx = this.context();
    if (ctx.state !== 'running') return;

    switch (key) {
      case SfxKeys.click:
        this.blip(600, 380, 0.09, 'sine', 0.5);
        break;
      case SfxKeys.bubblePop:
        this.blip(320, 950, 0.07, 'sine', 0.55);
        this.noiseBurst(0.03, 2500, 0.25);
        break;
      case SfxKeys.slurp:
        this.slurp();
        break;
      case SfxKeys.sparkle:
        this.chime([1320, 1760, 2217], 0.07, 0.3);
        break;
      case SfxKeys.sunShine:
        this.chime([523, 659, 784, 1047], 0.12, 0.35);
        break;
      case SfxKeys.sizzle:
        this.noiseBurst(0.8, 4200, 0.18);
        break;
      case SfxKeys.success:
        this.chime([523, 659, 784, 1047], 0.1, 0.45, 'triangle');
        break;
      case SfxKeys.reward:
        this.chime([523, 659, 784, 1047, 1319, 1568], 0.11, 0.5, 'triangle');
        break;
      case SfxKeys.gentleFail:
        this.blip(420, 300, 0.22, 'triangle', 0.35);
        break;
      case SfxKeys.leafWiggle:
        this.noiseBurst(0.12, 1500, 0.2);
        break;
      case SfxKeys.talkBlip:
        this.blip(500 + Math.random() * 250, 700 + Math.random() * 250, 0.05, 'square', 0.12);
        break;
    }
  }

  /**
   * Gentle duff-style percussion loop (placeholder for real Hamd/Duff music).
   * Rendered once offline into a buffer, then looped very quietly.
   */
  async startMusic(): Promise<void> {
    if (this.musicStarted) return;
    this.musicStarted = true;

    if (this.playLoadedMusic()) return;

    const ctx = this.context();
    const buffer = await this.renderDuffLoop();
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.16;
    this.musicGain.connect(this.masterGain());

    this.musicSource = ctx.createBufferSource();
    this.musicSource.buffer = buffer;
    this.musicSource.loop = true;
    this.musicSource.connect(this.musicGain);
    this.musicSource.start();
  }

  // ── internals ────────────────────────────────────────────────────────────

  private context(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  private masterGain(): GainNode {
    const ctx = this.context();
    if (!this.master) {
      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(ctx.destination);
    }
    return this.master;
  }

  private playLoadedFile(key: string): boolean {
    if (this.game?.cache.audio.exists(key)) {
      this.game.sound.play(key);
      return true;
    }
    return false;
  }

  private playLoadedMusic(): boolean {
    if (this.game?.cache.audio.exists(MusicKeys.duffLoop)) {
      this.game.sound.play(MusicKeys.duffLoop, { loop: true, volume: 0.35 });
      return true;
    }
    return false;
  }

  /** Single pitch-sweep tone with a fast decay envelope. */
  private blip(
    fromHz: number,
    toHz: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ): void {
    const ctx = this.context();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(fromHz, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(toHz, 1), t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(this.masterGain());
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  /** Staggered high pings — sparkles, chimes and little fanfares. */
  private chime(
    freqs: number[],
    step: number,
    volume: number,
    type: OscillatorType = 'sine',
  ): void {
    const ctx = this.context();
    freqs.forEach((freq, i) => {
      const t = ctx.currentTime + i * step;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain).connect(this.masterGain());
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  /** Filtered white noise — pops, rustles and the cooking sizzle. */
  private noiseBurst(duration: number, filterHz: number, volume: number): void {
    const ctx = this.context();
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer();
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterHz;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.connect(filter).connect(gain).connect(this.masterGain());
    src.start(t);
    src.stop(t + duration + 0.02);
  }

  /** Wobbly rising suck — the water slurp. */
  private slurp(): void {
    const ctx = this.context();
    const t = ctx.currentTime;
    const duration = 0.55;
    const osc = ctx.createOscillator();
    const wobble = ctx.createOscillator();
    const wobbleGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + duration);

    wobble.frequency.value = 14;
    wobbleGain.gain.value = 40;
    wobble.connect(wobbleGain).connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.value = 900;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter).connect(gain).connect(this.masterGain());
    osc.start(t);
    wobble.start(t);
    osc.stop(t + duration + 0.02);
    wobble.stop(t + duration + 0.02);
  }

  private getNoiseBuffer(): AudioBuffer {
    if (!this.noiseBuffer) {
      const ctx = this.context();
      const length = ctx.sampleRate; // 1 second
      this.noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return this.noiseBuffer;
  }

  /**
   * Renders one 8-beat bar of a calm duff pattern (dum — tek — dum dum — tek)
   * with a soft pentatonic hum on top, offline, ready to loop.
   */
  private async renderDuffLoop(): Promise<AudioBuffer> {
    const bpm = 84;
    const beat = 60 / bpm;
    const barSeconds = beat * 8;
    const sampleRate = 22050;
    const off = new OfflineAudioContext(1, Math.ceil(barSeconds * sampleRate), sampleRate);

    const dum = (t: number) => {
      const osc = off.createOscillator();
      const gain = off.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.22);
      gain.gain.setValueAtTime(0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain).connect(off.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    };

    const tek = (t: number) => {
      const osc = off.createOscillator();
      const gain = off.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain).connect(off.destination);
      osc.start(t);
      osc.stop(t + 0.14);
    };

    // Classic gentle duff bar: DUM . tek . DUM DUM tek .
    dum(0 * beat);
    tek(2 * beat);
    dum(4 * beat);
    dum(5 * beat);
    tek(6 * beat);

    // Soft pentatonic hum floating above the rhythm.
    const hum = [392, 440, 523, 440]; // G4 A4 C5 A4
    hum.forEach((freq, i) => {
      const t = i * beat * 2;
      const osc = off.createOscillator();
      const gain = off.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + beat * 0.6);
      gain.gain.linearRampToValueAtTime(0.0001, t + beat * 1.9);
      osc.connect(gain).connect(off.destination);
      osc.start(t);
      osc.stop(t + beat * 2);
    });

    return off.startRendering();
  }
}

export const AudioManager = new AudioManagerImpl();
