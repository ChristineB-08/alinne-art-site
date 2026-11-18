# AlinneArt — presentation site

Bilingual (IT/EN) one-page site for AlinneArt glass drawings.

- React + Vite + TypeScript
- GSAP + ScrollTrigger for scroll animations, Lenis for smooth scroll
- React Bits components (`src/components/rb`): SplitText, ScrollFloat, ScrollVelocity, TiltedCard, CircularText, Magnet, ClickSpark, Aurora
- Texts for both languages live in `src/i18n.ts`; switch with the IT/EN toggle or `?lang=en`
- Contact form posts to the existing Formspree endpoint

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
npx vercel --prod
```
