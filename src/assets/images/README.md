# Images

All art is currently generated procedurally at boot (`src/utils/textures.ts`).

## Replacing placeholder art with real illustrations

1. Put the final PNG in `public/assets/images/` (files in `public/` are served as-is).
2. In `src/scenes/BootScene.ts` → `preload()`, load it under the **same key**
   from `src/constants/textureKeys.ts`:

   ```ts
   this.load.image(TextureKeys.tituCanopy, 'assets/images/titu-canopy.png');
   ```

3. Done. The procedural generator skips any key that already exists, and every
   scene references textures only through `TextureKeys`, so no game code changes.

## Notes for the artist

- Design space is 720×1280 portrait. Match the placeholder sizes in
  `generateAllTextures()` (e.g. canopy 440×340, cloud 320×190) or scale in-scene.
- `titu-canopy`, `hill`, `butterfly-wing`, `confetti`, `soft-circle` and
  `sparkle` are **tinted at runtime** — deliver them in white/greyscale.
- Keep shapes soft and rounded; the palette lives in `src/constants/colors.ts`.
