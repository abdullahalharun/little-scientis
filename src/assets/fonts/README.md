# Fonts

The game text is Bengali. `FONT_FAMILY` (in `src/constants/layout.ts`) prefers
**Baloo Da 2** (the Bengali member of the Baloo family — soft, rounded,
child-friendly), then Hind Siliguri / Noto Sans Bengali system fallbacks.

## Shipping a bundled font (recommended for production)

1. Download the [Baloo Da 2](https://fonts.google.com/specimen/Baloo+Da+2)
   `.woff2` files (they cover Bengali + Latin) into this folder.
2. Add an `@font-face` rule in `index.html`'s `<style>` block:

   ```css
   @font-face {
     font-family: 'Baloo Da 2';
     src: url('/src/assets/fonts/BalooDa2-Bold.woff2') format('woff2');
     font-weight: 700;
     font-display: swap;
   }
   ```

3. Nothing else changes — `FONT_FAMILY` already lists "Baloo Da 2" first.

Baloo Da 2 is licensed under the SIL Open Font License.
