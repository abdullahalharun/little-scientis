# Sounds

All audio is currently synthesized with WebAudio (`src/utils/AudioManager.ts`).

## Replacing placeholder audio with real recordings

1. Put MP3/OGG files in `public/assets/sounds/`.
2. In `src/scenes/BootScene.ts` → `preload()`, load each under the **same key**
   from `src/constants/audioKeys.ts`:

   ```ts
   this.load.audio(SfxKeys.bubblePop, 'assets/sounds/bubble-pop.mp3');
   this.load.audio(MusicKeys.duffLoop, 'assets/sounds/duff-loop.mp3');
   ```

3. Done — `AudioManager` prefers a loaded file over synthesis automatically.

## Voice-over (Titu's narration)

Narration falls back to browser text-to-speech until real recordings exist.
Record one clip per line in `src/constants/lines.ts` and load it as
`voice-<lineId>`:

```ts
this.load.audio(voiceKey(Lines.introSalaam.id), 'assets/sounds/voice/intro-salaam.mp3');
```

`NarrationManager` will play the clip instead of TTS.

## Wanted list

- Gentle Islamic duff / soft Hamd instrumental loop (`music-duff-loop`)
- SFX: slurp, leaf wiggle, bubble pop, magic sparkle, sun shine, cooking
  sizzle, reward fanfare, button click, success chime, gentle "try again"
- Voice: a warm, friendly child-appropriate voice for all lines in `lines.ts`
