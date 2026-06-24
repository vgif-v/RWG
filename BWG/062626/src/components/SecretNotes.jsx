import { useState, useEffect } from 'react';
import { SECRET_NOTES } from '../content';
import MusicPlayer from './MusicPlayer';
import heart1 from '../assets/hearts/heart-1.png';
import heart2 from '../assets/hearts/heart-2.png';
import heart3 from '../assets/hearts/heart-3.png';
import heart4 from '../assets/hearts/heart-4.png';

const HEARTS = [heart1, heart2, heart3, heart4];

const POSITIONS = [
  { top: '15%', left: '12%' },
  { top: '60%', left: '80%' },
  { top: '75%', left: '20%' },
  { top: '25%', left: '70%' },
];

function NoteModal({ note, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-note-title"
      onClick={onClose}
    >
      <div
        className="glass relative max-w-sm rounded-2xl p-8 text-center shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close note"
          className="absolute right-3 top-3 text-lg text-ink-700/70 hover:text-ink-800"
        >
          ✕
        </button>
        <div className="h-12 w-12 mx-auto overflow-hidden rounded-lg">
          <img
            src={HEARTS[Math.floor(Math.random() * HEARTS.length)]}
            alt="Heart decoration"
            className="h-full w-full object-cover"
          />
        </div>
        <h3 id="secret-note-title" className="mt-2 font-display text-xl italic text-ink-800">
          {note.title}
        </h3>
        <p className="mt-4 font-hand text-xl leading-relaxed text-ink-700">{note.message}</p>
      </div>
    </div>
  );
}

export default function SecretNotes({ canPlay = false }) {
  const [activeNote, setActiveNote] = useState(null);

  return (
    <section className="relative w-full overflow-hidden bg-blush-50 px-6 py-24">
      <h2 className="relative z-10 mb-2 text-center font-display text-3xl italic text-ink-800">
        A few secret notes
      </h2>
      <p className="relative z-10 mb-16 text-center font-body text-sm text-ink-700/70">
        Tap a heart to open one
      </p>

      <div className="mx-auto md:items-center">
        <div className="relative mx-auto h-[50vh] max-w-3xl">
          {SECRET_NOTES.map((note, i) => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note)}
              className="absolute animate-floatY overflow-hidden rounded-lg transition-transform hover:scale-125"
              style={{
                top: POSITIONS[i % POSITIONS.length].top,
                left: POSITIONS[i % POSITIONS.length].left,
                animationDelay: `${i * 0.6}s`,
                width: '48px',
                height: '48px',
              }}
              aria-label={`Open secret note: ${note.title}`}
            >
              <img
                src={HEARTS[i % HEARTS.length]}
                alt="Heart decoration"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

      </div>

      {activeNote && <NoteModal note={activeNote} onClose={() => setActiveNote(null)} />}
    </section>
  );
}
