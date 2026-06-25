// ─────────────────────────────────────────────────────────────────────────
// EDIT ME — everything personal lives in this one file.
// Replace the placeholders below, then drop your photos into
// src/assets/photos/ and your song file into src/assets/music/
// ─────────────────────────────────────────────────────────────────────────

export const HER_NAME = 'Bé';

// Used by the memory counter. Format: 'YYYY-MM-DDTHH:mm:ss'
// Leave as-is for now — placeholder date, swap in the real one later.
export const RELATIONSHIP_START_DATE = '2025-01-01T00:00:00';

export const BIRTHDAY_TITLE = `Happy Birthday ${HER_NAME}`;

// The handwritten-style letter in the scrapbook section.
export const SCRAPBOOK_LETTER = `My dearest ${HER_NAME},

[Write a little about what makes today special — a memory,
an inside joke, or just how much you've been looking
forward to celebrating you.]

Every day with you feels like a page worth keeping.
This is just one small page in a much bigger story.

I love you, today and always.`;

// The final message inside the envelope at the very end of the site.
export const FINAL_LETTER = `${HER_NAME},

Happy Birthday. I love you more than this whole little
website could ever show.`;

// Secret floating-star notes. Add as many as you like.
export const SECRET_NOTES = [
  {
    id: 'note-1',
    title: 'Our first date',
    message: '[A short, sweet memory from the day you met or your first date.]',
  },
  {
    id: 'note-2',
    title: 'An inside joke',
    message: '[Something only the two of you would laugh at.]',
  },
  {
    id: 'note-3',
    title: 'My favorite memory',
    message: '[The moment with her you replay the most.]',
  },
  {
    id: 'note-4',
    title: 'A little secret',
    message: "[Something you've never told her, or rarely say out loud.]",
  },
];

// Photos for the Polaroid wall (left column of Memory Gallery).
// Drop files into src/assets/photos/ and list their imported names here.
// Using string paths so this file stays plain data — components import
// the actual images.
export const POLAROID_PHOTOS = [
  { id: 'p1', src: '/src/assets/photos/photo-1.jpg', caption: '[caption]' },
  { id: 'p2', src: '/src/assets/photos/photo-2.jpg', caption: '[caption]' },
  { id: 'p3', src: '/src/assets/photos/photo-3.jpg', caption: '[caption]' },
  { id: 'p4', src: '/src/assets/photos/photo-4.jpg', caption: '[caption]' },
  { id: 'p5', src: '/src/assets/photos/photo-5.jpg', caption: '[caption]' },
];

export const ALL_PHOTOS = [
  { id: 'photo-1', src: '/src/assets/photos/photo-1.jpg', caption: '' },
  { id: 'photo-2', src: '/src/assets/photos/photo-2.jpg', caption: '' },
  { id: 'photo-3', src: '/src/assets/photos/photo-3.jpg', caption: '' },
  { id: 'photo-4', src: '/src/assets/photos/photo-4.jpg', caption: '' },
  { id: 'photo-5', src: '/src/assets/photos/photo-5.jpg', caption: '' },
  { id: 'photo-6', src: '/src/assets/photos/photo-6.jpg', caption: '' },
  { id: 'photo-7', src: '/src/assets/photos/photo-7.jpg', caption: '' },
  { id: 'photo-8', src: '/src/assets/photos/photo-8.jpg', caption: '' },
  { id: 'photo-9', src: '/src/assets/photos/photo-9.jpg', caption: '' },
  { id: 'photo-10', src: '/src/assets/photos/photo-10.jpg', caption: '' },
  { id: 'photo-11', src: '/src/assets/photos/photo-11.jpg', caption: '' },
  { id: 'photo-12', src: '/src/assets/photos/photo-12.jpg', caption: '' },
  { id: 'photo-13', src: '/src/assets/photos/photo-13.jpg', caption: '' },
];
 
// Music player metadata. Drop your audio file into src/assets/music/
export const SONG = {
  title: 'Invisible String',
  artist: 'Taylor Swift',
  src: '/src/assets/music/song.mp3',
  cover: '/src/assets/photos/photo-1.jpg', // reuse a photo as the album cover, or add your own
};
