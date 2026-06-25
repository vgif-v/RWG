import { useState, useEffect, useRef } from 'react';
import { SECRET_NOTES } from '../content';
import heart1 from '../assets/hearts/heart-1.png';
import heart2 from '../assets/hearts/heart-2.png';
import heart3 from '../assets/hearts/heart-3.png';
import heart4 from '../assets/hearts/heart-4.png';

const HEARTS = [heart1, heart2, heart3, heart4];

// slight random tilt per card so they feel hand-hung
const TILTS = [-4, 2, -2, 5, -3, 3];

function NoteModal({ note, heartSrc, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-note-title"
      onClick={onClose}
    >
      <div
        className="note-modal glass relative max-w-xs w-full rounded-2xl shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* pin at top */}
        <div className="note-modal-pin" />

        <div className="px-8 pb-8 pt-10 text-center">
          <div className="mx-auto mb-3 h-10 w-10 overflow-hidden rounded-full">
            <img src={heartSrc} alt="" className="h-full w-full object-cover" />
          </div>
          <h3
            id="secret-note-title"
            className="font-display text-xl italic text-ink-800"
          >
            {note.title}
          </h3>
          <p className="mt-4 font-hand text-xl leading-relaxed text-ink-700">
            {note.message}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close note"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-sm text-ink-600/60 hover:bg-ink-100/40 hover:text-ink-800 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function SecretNotes() {
  const [activeNote, setActiveNote] = useState(null);
  const [activeHeart, setActiveHeart] = useState(null);

  function openNote(note, i) {
    setActiveNote(note);
    setActiveHeart(HEARTS[i % HEARTS.length]);
  }

  return (
    <section className="secret-notes-section relative w-full overflow-hidden px-6 py-24">
      <h2 className="relative z-10 mb-2 text-center font-display text-3xl italic text-ink-800">
        A few secret notes
      </h2>
      <p className="relative z-10 mb-16 text-center font-body text-sm text-ink-700/60">
        tap a note to open it
      </p>

      {/* clothesline string */}
      <div className="notes-line-wrap relative mx-auto max-w-2xl">
        <div className="notes-string" aria-hidden="true" />

        <div className="notes-row">
          {SECRET_NOTES.map((note, i) => (
            <button
              key={note.id}
              onClick={() => openNote(note, i)}
              className="note-tag"
              style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}
              aria-label={`Open secret note: ${note.title}`}
            >
              {/* string from line to card */}
              <span className="note-thread" aria-hidden="true" />

              {/* the card itself */}
              <span className="note-card">
                <span className="note-heart-seal">
                  <img
                    src={HEARTS[i % HEARTS.length]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="note-label font-display italic text-ink-800">
                  {note.title}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeNote && (
        <NoteModal
          note={activeNote}
          heartSrc={activeHeart}
          onClose={() => { setActiveNote(null); setActiveHeart(null); }}
        />
      )}
    </section>
  );
}