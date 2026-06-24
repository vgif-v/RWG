# Her Birthday Gift — Setup Guide

## 1. Install dependencies

```bash
npm install
```

This pulls in: react, gsap (includes ScrollTrigger + MotionPathPlugin),
lenis, framer-motion, tailwindcss, postcss, autoprefixer, vite.

## 2. Add your content

Open **`src/content.js`** — every name, date, and piece of writing on the
site lives in this one file:

- `HER_NAME` — replace `[Her Name]`
- `RELATIONSHIP_START_DATE` — replace with the real date (format:
  `'YYYY-MM-DDTHH:mm:ss'`)
- `SCRAPBOOK_LETTER` — the handwritten-style letter in the scrapbook section
- `FINAL_LETTER` — the message inside the envelope at the end
- `SECRET_NOTES` — edit/add the floating-star messages
- `POLAROID_PHOTOS`, `STREAM_PHOTOS` — photo paths (see below)
- `SONG` — title, artist, audio path, cover image

## 3. Add your photos and music

Create these folders if they don't exist yet:

```
src/assets/photos/
src/assets/music/
```

Drop in your images (e.g. `photo-1.jpg`, `stream-1.jpg`...) and your song
(e.g. `song.mp3`), matching the filenames you set in `content.js`. The
gallery and music player will pick them up automatically. Until you add
real files, broken images quietly hide themselves rather than showing a
broken-image icon — so the layout still looks clean.

A couple of tips:

- Keep individual photos under ~500KB where possible (export at ~1600px
  wide max) — they're lazy-loaded, but smaller files mean a snappier feel.
- Any common audio format works for the music player (mp3, m4a, ogg).

## 4. Run it

```bash
npm run dev
```

Open the local URL it prints (usually `http://localhost:5173`).

## 5. Build for sharing

```bash
npm run build
```

This outputs a static `dist/` folder you can deploy anywhere (Vercel,
Netlify, GitHub Pages, etc.) or just zip up and send.

## File map, if you want to tweak anything further

```
src/
  content.js              ← all editable text/photos/music/dates
  App.jsx                 ← page composition + scroll-lock logic
  index.css               ← fonts, global styles, custom scrollbar
  lib/useLenis.js          ← smooth-scroll setup
  components/
    FloatingDecorations.jsx  ambient hearts/flowers/sparkles + parallax
    GiftBoxSection.jsx       intro: gift box, opening sequence
    RibbonAnimation.jsx      interactive ribbon (hover/click/unravel)
    BirthdayTitle.jsx        ribbon "writes" the title, scroll-unlock
    ScrapbookSection.jsx     cake + shrinking title + handwritten letter
    PageFlipTransition.jsx   journal page-flip between sections
    MemoryGallery.jsx        polaroid wall + infinite photo stream
    MusicPlayer.jsx          glassmorphism player
    MemoryCounter.jsx        animated days/hours/minutes counter
    SecretNotes.jsx          floating stars → modal notes
    EnvelopeSection.jsx      final envelope + letter reveal
```

Everything is plain Tailwind utility classes plus a few custom tokens in
`tailwind.config.js` (the blush/lilac palette, float/sparkle keyframes),
so colors and timings are easy to nudge if you want it more or less
intense.
