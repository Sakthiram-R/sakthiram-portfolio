# Verification — 7 October 2026

- Next.js 15.5.27 production compilation, TypeScript checks and static export: passed.
- First-load JavaScript: 121 kB, reported by Next.js.
- Lighthouse mobile, production export with compression/cache headers: Performance 91, Accessibility 100. FCP 1.9 s, LCP 3.1 s, TBT 120 ms, CLS 0. These are local lab measurements, not guaranteed scores for an unconfigured deployment or every device.
- Lighthouse desktop, final production export: Performance 90, Accessibility 100.
- Playwright: 1440×900, 390×844, 360×800, 1920×1080. No console/page errors. `document.documentElement.scrollWidth === innerWidth` in each section at each size.
- Video playing in hero, paused after leaving, resumed on return: passed across all four sizes.
- Keyboard ID flip, Python skill inspection, second project expansion, clipboard feedback, mobile menu Escape: passed.
- Reduced-motion skill visibility: passed. Decorative motion and smooth scrolling are disabled by CSS/JS preferences.
- Screenshots: `qa/1440-*.png` and `qa/390-*.png`, visually reviewed for hero, card, project gallery and contact layout.
- Media: both formats contain 180 frames at 24 fps, duration 7.5 seconds. WebM decodes to exactly 360,000 audio samples at 48 kHz; AAC has codec padding in raw decoding, with 7.5-second container duration. The input PCM crossfade is sample-accurate. Boundary mean image difference is under 1/255, close to ordinary adjacent-frame changes; the last/first frames were reviewed together in `qa/loop-*.png`.
- All supplied personal facts and external links were checked against the résumé. Empty certifications/achievements and unavailable contact/project fields are omitted.

## Delivery limits

Sites registration returned a connector transport error before an identity or publication URL was available. No public deployment is claimed. The full source and local production preview remain available. Set the real deployment origin in `NEXT_PUBLIC_SITE_URL` to enable absolute social-image metadata when hosting.

The loop uses a requested 0.5-second overlap of speech. The continuity checks establish frame/sample alignment; speech phrasing and the sound of overlapping words remain a subjective review of the supplied recording.
