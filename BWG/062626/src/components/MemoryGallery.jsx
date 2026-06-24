import { useMemo } from 'react';
import { POLAROID_PHOTOS, STREAM_PHOTOS } from '../content';
import MusicPlayer from './MusicPlayer';

const ROTATIONS = [-6, 4, -3, 7, -8, 2, 5, -4];

function PolaroidWall() {
  const photos = useMemo(
    () =>
      POLAROID_PHOTOS.map((p, i) => ({
        ...p,
        rotate: ROTATIONS[i % ROTATIONS.length],
      })),
    []
  );

  return (
    <div className="relative flex flex-wrap items-start justify-center gap-x-2 gap-y-6 p-6">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="group relative -mb-4 w-40 rotate-0 cursor-default rounded-sm bg-white p-3 pb-6 shadow-polaroid transition-transform duration-300 ease-out hover:-translate-y-3 hover:scale-105 hover:shadow-glass sm:w-48"
          style={{
            transform: `rotate(${photo.rotate}deg)`,
            marginLeft: i % 2 === 1 ? '-1.5rem' : undefined,
            zIndex: i,
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
      ))}
    </div>
  );
}

function InfiniteStream() {
  // duplicate the list so the marquee loop is seamless
  const doubled = [...STREAM_PHOTOS, ...STREAM_PHOTOS];

  return (
    <div className="group relative h-[50vh] w-full overflow-hidden rounded-2xl [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marqueeUp flex flex-col gap-4 group-hover:[animation-play-state:paused]">
        {doubled.map((src, i) => (
          <div key={i} className="w-full overflow-hidden rounded-xl shadow-polaroid">
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-56 w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
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
        <div className="flex flex-col items-center justify-start gap-8">
          <InfiniteStream />
          <MusicPlayer canPlay={canPlay} heartIndex={0} />
        </div>
      </div>
    </section>
  );
}
