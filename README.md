# 🔬 Little Muslim Scientist 🌱

A series of gentle, Islamic-friendly educational mini-games for children aged
4–6, built with **React + Phaser 3 + TypeScript + Vite**. Mobile-first,
touch-optimized, no reading required, and impossible to lose.

**Level 1 — Titu's Kitchen** teaches how Allah created green plants to make
their own food (photosynthesis). Titu, a cheerful tree wearing a chef hat,
asks the child to gather Allah's blessings for his kitchen:

1. 💧 **Water** — drag Titu's roots to sparkling underground water
2. 🍃 **Air** — pop 8 magical bubbles so the air reaches his leaves
3. ☀️ **Sunlight** — slide the clouds away and wake the smiling sun
4. 🍰 **The feast** — everything swirls into a glowing glucose cake, Titu
   dances, throws the player a shiny apple, and a picture recap shows
   *water + air + sunlight = the plant's food*. MashaAllah!

## Getting started

```bash
npm install
npm run dev        # dev server (opens on your LAN too, for phone testing)
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

Open the printed URL. On a desktop browser, use device emulation (portrait)
for the intended experience — the game is designed at 720×1280 and scales to
fit any screen.

## Project structure

```
src/
  scenes/        BootScene → HomeScene → IntroScene → WaterScene → AirScene
                 → SunScene → RewardScene (LevelSceneBase = shared ceremony)
  objects/       Titu, SpeechBubble, BigButton, StarBurst, Butterfly, Bird,
                 Cloud, Flower — reusable, always-animated game objects
  game/          Phaser config, React↔Phaser bridge, persistent GameState
  components/    React chrome: LoadingScreen, MuteButton, RotateHint
  utils/         textures (procedural art), AudioManager (synth SFX + duff
                 loop), NarrationManager (voice/TTS), SceneFlow, backgrounds
  constants/     colors, layout, textureKeys, audioKeys, lines, levels, scenes
  assets/        drop-in points + guides for real art, audio and fonts
```

## Placeholder assets — and how to replace them

Everything you see and hear is generated in code, so the game is fully
playable today. Every visual/audio element is referenced through a key
manifest, making real assets a pure drop-in:

- **Art** → `src/assets/images/README.md` (keys in `constants/textureKeys.ts`)
- **SFX & music** → `src/assets/sounds/README.md` (keys in `constants/audioKeys.ts`)
- **Titu's voice** → record the lines in `constants/lines.ts`, load as `voice-<id>`
- **Font** → `src/assets/fonts/README.md`

## Adding the next mini-game to the series

1. Build its scenes (subclass `LevelSceneBase` for free fade/speech/reward
   ceremony) and register them in `game/gameConfig.ts`.
2. Flip its entry in `constants/levels.ts` to `available: true` with its entry
   `sceneKey`.
3. The home screen tile unlocks automatically, and completion stars persist
   via `GameState`.

Planned topics: 🌧️ The Water Cycle · 🐝 How Bees Make Honey · 🐜 Amazing Ants ·
🌙 The Moon & Islamic Months · 🌰 How Seeds Grow · 🦋 The Butterfly Life Cycle.

## Design principles

- **Nothing is static** — breathing, blinking, swaying, floating everywhere.
- **No failure** — no timers, no penalties; a miss gets a soft sound and a hint.
- **No reading required** — big buttons with emoji, dot counters, voice
  narration, picture-only recap.
- **Touch-first** — hit areas ≥ 96px, whole-panel buttons, multi-touch safe.
- **Performance** — texture-baked art (no per-frame Graphics), tween-based
  animation, modest particle counts; targets 60 FPS on mid-range phones.

## Tech notes

- Audio starts after the first tap (browser autoplay policy) — the Start
  button unlocks the AudioContext and begins the gentle duff loop.
- Narration uses the Web Speech API where available; the speech bubble always
  shows the words, so muted/unsupported devices lose nothing.
- Progress and the sound setting persist in `localStorage`.
