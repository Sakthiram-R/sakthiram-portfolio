# Sakthiram R — personal portfolio

A résumé-grounded, monochrome portfolio built with Next.js 15, React 19, TypeScript, Tailwind CSS 4 and Lenis. All media, fonts and technology logos are served locally. No WebGL, GSAP, remote scripts, image CDN, loader or splash screen.

## Run

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build`. This project exports a deployable static site to `out/`; serve that directory with any static host. For a local production preview with compression, caching and video byte-range support, run `node scripts/serve.mjs` and open http://localhost:3002. `npm run lint` checks TypeScript. For social sharing, set `NEXT_PUBLIC_SITE_URL` to your actual production origin before building; this enables the absolute `og.jpg` metadata without inventing a domain.

## Content and provenance

`src/lib/data.ts` is the single source for profile, navigation, skills, projects, education and experience. Personal facts and project descriptions come exclusively from `Resume.pdf`, including its embedded LinkedIn URL: https://www.linkedin.com/in/sakthiramr/. The visible PDF text names a different LinkedIn path; the embedded destination was confirmed in chat. The summary is transcribed verbatim with line wrapping normalized. Additional skills (REST APIs, Git, testing, debugging and responsive design) are explicitly mentioned in internship descriptions. SEO and Search Engine Optimization refer to the same skill and are represented once.

No phone, GitHub, project repositories, certificates, achievements, scores or ID number were supplied; corresponding fields, links and sections are omitted. Latest internship is labelled as such, not as current employment. Project interfaces are CSS/JSX illustrations clearly labelled “Illustrative UI”; they are not real screenshots or claims about the original design. Labels, headings and calls to action are interface copy, not additional biographical claims.

| Order | Section | Interaction |
| --- | --- | --- |
| Hero | Intro video, role, résumé and contact links | Sound control; pauses below 35% visibility |
| 01 | About | Spring-damped lanyard card; hover, tap or keyboard flip |
| 02 | Skills | Periodic tiles, family filtering and focus/hover inspector |
| 03 | Work | Expanding desktop / vertical mobile accordion |
| 04 | Experience | Chronological education and internship path |
| 05 | Contact | Email, copy feedback, LinkedIn and back to top |

## Rebuild hero assets

Requires Python 3.10+, `numpy`, `Pillow` and FFmpeg with libx264, libvpx-vp9, AAC and Opus encoders.

```sh
python -m pip install numpy Pillow
python scripts/build-hero-assets.py /path/to/Intro_page.mp4 --ffmpeg /path/to/ffmpeg
```

For this supplied 1280×720, 8-second video, automatic silhouette detection selected `576:720:346:0`. Override detection with `--crop 576:720:346:0`. The script crops and scales to 768×960, applies the requested white levels plus a mild second white-point correction for this particular backdrop, and selects a sharp head-to-shirt still from five candidate frames. It exports `public/portrait-bust.webp`, `public/og.jpg`, `public/hero/hero.mp4` and `public/hero/hero.webm`.

The output loop is 7.5 seconds. It starts at source time 0.5 seconds, plays through time 7.5, then crossfades the last 0.5 seconds into the first 0.5 seconds. Audio uses the identical phase, linear crossfade weights and exactly 360,000 stereo samples at 48 kHz, implemented in numpy instead of FFmpeg acrossfade. No audio stretching or retiming is used. H.264 CRF 24 / slow / yuv420p / AAC 96k / faststart and VP9 CRF 36 / Opus 80k are provided, WebM first. The final visual overlap is followed by the next original frame at the loop boundary. Crossfading speech may blend words; review the supplied spoken content for phrasing at the join if replacing the source.

## Accessibility and motion

Semantic headings, visible keyboard focus, an early skip link, native accordion buttons, a focus-trapped mobile navigation dialog with Escape, text descriptions for media, and clipboard status announcements are included. Reduced motion disables Lenis, reveals, spring animation, decorative rotation and hover motion. Video speech is optional, with a keyboard-operable mute/play control. Browser autoplay policies may require a first interaction; no sound permission screen is added.

Component styles live in their components; shared classes and resets are in the appropriate Tailwind CSS layers. The muted gray text token is slightly darker than the supplied token for contrast.

## Credits and licenses

Inter Tight, Instrument Serif and JetBrains Mono: Google Fonts / original font authors, SIL Open Font License 1.1. WOFF2 Latin subsets supplied by Fontsource. License copies are in `src/fonts/*-LICENSE.txt`.

Technology SVGs: [Devicon](https://github.com/devicons/devicon), MIT license, copied to `public/logos/` with its `LICENSE`. Original colored logos are retained; Django uses the upstream plain official wordmark. Brand marks remain the property of their respective owners; the license does not imply endorsement or grant trademark rights. Concept icons are simple original line symbols.

Portrait, video and social image are derived only from the user-supplied intro footage. The résumé is copied unmodified into `public/Resume.pdf` for download.

## Verification

`npm run build` performs production compilation and TypeScript validation. `node scripts/qa.mjs` checks viewports 1440×900, 390×844, 360×800 and 1920×1080 against the running development server. Set `QA_URL=http://localhost:3002` to test the production preview instead. It saves desktop/mobile screenshots, runtime errors, overflow checks and interaction results in `qa/`. It requires a local Chrome installation (change the Playwright channel if necessary). Lighthouse reports and final verification notes live in `QA.md`.
