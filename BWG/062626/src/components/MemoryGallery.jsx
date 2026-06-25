import { useMemo, useRef, useState, useCallback } from 'react';
import { POLAROID_PHOTOS, ALL_PHOTOS } from '../content';
import MusicPlayer from './MusicPlayer';

const ROTATIONS = [-6, 4, -3, 7, -8, 2, 5, -4];

function PolaroidWall() {
  const initialPhotos = useMemo(
    () =>
      POLAROID_PHOTOS.map((p, i) => ({
        ...p,
        rotate: ROTATIONS[i % ROTATIONS.length],
      })),
    []
  );

  // Current photo shown on each of the five (or however many) polaroid slots.
  const [photos, setPhotos] = useState(initialPhotos);
  // Index of the slot currently mid swap-animation, so we know which one to
  // hide in the normal flow and which falling clone to render on top.
  const [swappingIndex, setSwappingIndex] = useState(null);
  // The frozen box (width/height/top/left) of the card being swapped, taken
  // right before it falls, so the falling clone can be positioned exactly
  // on top of it and then drop straight down past the other polaroids.
  const [fallingBox, setFallingBox] = useState(null);
  // Tracks which slot is hovered so it can rise above the rest of the wall.
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const pendingPhotoRef = useRef(null);

  const handlePolaroidClick = useCallback(
    (index) => {
      // Ignore clicks while that slot is already mid-animation.
      if (swappingIndex === index) return;

      const currentlyShown = new Set(photos.map((p) => p.src));
      const pool = ALL_PHOTOS.filter((p) => !currentlyShown.has(p.src));

      // If every photo in the gallery is already on display, fall back to
      // the full pool so a click still does something.
      const candidates = pool.length > 0 ? pool : ALL_PHOTOS;
      const next = candidates[Math.floor(Math.random() * candidates.length)];

      if (!next) return;

      const cardEl = cardRefs.current[index];
      const containerEl = containerRef.current;
      if (!cardEl || !containerEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      pendingPhotoRef.current = { index, next };
      setFallingBox({
        top: cardRect.top - containerRect.top,
        left: cardRect.left - containerRect.left,
        width: cardRect.width,
        height: cardRect.height,
      });
      setSwappingIndex(index);
    },
    [photos, swappingIndex]
  );

  const handleAnimationEnd = useCallback((index) => {
    const pending = pendingPhotoRef.current;
    if (!pending || pending.index !== index) return;

    setPhotos((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...pending.next,
              rotate: ROTATIONS[index % ROTATIONS.length],
            }
          : p
      )
    );
    pendingPhotoRef.current = null;
    setSwappingIndex(null);
    setFallingBox(null);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-start justify-center gap-x-2 gap-y-6 p-6">
      <style>{`
        @keyframes polaroidPopOut {
          0% {
            transform: rotate(var(--polaroid-rotate, 0deg)) scale(1) translateY(0);
          }
          100% {
            transform: rotate(var(--polaroid-rotate, 0deg)) scale(1.15) translateY(-18px);
          }
        }
        @keyframes polaroidDropVanish {
          0% {
            transform: rotate(var(--polaroid-rotate, 0deg)) scale(1.15) translateY(-18px);
            opacity: 1;
          }
          35% {
            opacity: 1;
          }
          100% {
            transform: rotate(var(--polaroid-rotate, 0deg)) scale(0.85) translateY(220px);
            opacity: 0;
          }
        }
      `}</style>
      {photos.map((photo, i) => {
        const isSwapping = swappingIndex === i;
        const isHovered = hoveredIndex === i;

        return (
          <div
            key={photo.id}
            ref={(el) => (cardRefs.current[i] = el)}
            role="button"
            tabIndex={0}
            aria-label="Show a different memory"
            onClick={() => handlePolaroidClick(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePolaroidClick(i);
              }
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex((cur) => (cur === i ? null : cur))}
            className={`group relative -mb-4 w-40 cursor-pointer rounded-sm bg-white p-3 pb-6 shadow-polaroid transition-transform duration-300 ease-out sm:w-48 ${
              isSwapping ? '' : 'hover:-translate-y-3 hover:scale-105 hover:shadow-glass'
            }`}
            style={{
              // While swapping, the real card is hidden (opacity 0) but
              // still occupies its layout slot — the falling clone below
              // is the one that's actually visible and animating.
              transform: isSwapping ? undefined : `rotate(${photo.rotate}deg)`,
              opacity: isSwapping ? 0 : undefined,
              marginLeft: i % 2 === 1 ? '-1.5rem' : undefined,
              zIndex: isHovered ? 50 : i,
              '--polaroid-rotate': `${photo.rotate}deg`,
            }}
          >
            <div className="aspect-square w-full overflow-hidden bg-blush-100">
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="mt-2 text-center font-hand text-base text-ink-700">{photo.caption}</p>

            {i % 3 === 0 && (
              <span className="absolute -right-2 -top-3 text-xl">🌷</span>
            )}
          </div>
        );
      })}

      {swappingIndex !== null && fallingBox && (
        <div
          aria-hidden="true"
          onAnimationEnd={(e) => {
            // Only react to the second (drop/vanish) animation finishing —
            // the pop-out is just the first half and shouldn't trigger swap.
            if (e.animationName === 'polaroidDropVanish') {
              handleAnimationEnd(swappingIndex);
            }
          }}
          className="pointer-events-none absolute rounded-sm bg-white p-3 pb-6 shadow-polaroid"
          style={{
            top: fallingBox.top,
            left: fallingBox.left,
            width: fallingBox.width,
            height: fallingBox.height,
            zIndex: 60,
            '--polaroid-rotate': `${ROTATIONS[swappingIndex % ROTATIONS.length]}deg`,
            animation:
              'polaroidPopOut 180ms ease-out forwards, ' +
              'polaroidDropVanish 650ms 180ms cubic-bezier(0.45, 0, 0.55, 1) forwards',
          }}
        >
          <div className="aspect-square w-full overflow-hidden bg-blush-100">
            <img
              src={photos[swappingIndex].src}
              alt={photos[swappingIndex].caption}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-center font-hand text-base text-ink-700">
            {photos[swappingIndex].caption}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MemoryGallery({ canPlay = false }) {
  return (
    <section className="relative w-full bg-blush-50 px-6 py-20">
      <h2 className="mb-12 text-center font-display text-3xl italic text-ink-800 sm:text-4xl">
        Little moments, kept safe
      </h2>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <PolaroidWall />
        <div className="flex flex-col items-center justify-center gap-8">
          <MusicPlayer canPlay={canPlay} heartIndex={0} />
        </div>
      </div>
    </section>
  );
}