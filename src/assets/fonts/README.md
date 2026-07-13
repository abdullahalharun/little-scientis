# Fonts

The game currently uses a system font stack (see `FONT_FAMILY` in
`src/constants/layout.ts`): Baloo 2 if installed, else Comic Sans MS /
Chalkboard SE — all soft, rounded and child-friendly.

## Shipping a bundled font (recommended for production)

1. Download the [Baloo 2](https://fonts.google.com/specimen/Baloo+2) `.woff2`
   files into this folder.
2. Add an `@font-face` rule in `index.html`'s `<style>` block:

   ```css
   @font-face {
     font-family: 'Baloo 2';
     src: url('/src/assets/fonts/Baloo2-Bold.woff2') format('woff2');
     font-weight: 700;
     font-display: swap;
   }
   ```

3. Nothing else changes — `FONT_FAMILY` already lists "Baloo 2" first.

Baloo 2 is licensed under the SIL Open Font License.
