import { useEffect, useRef, useState } from 'react';
import { SONG } from '../content';

/**
 * Glassmorphism music player. `canPlay` should be wired to the same
 * "user interacted with the ribbon" event that unlocks scrolling
 * (browsers require a user gesture before audio can autoplay anyway).
 */
export default function MusicPlayer({ canPlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (canPlay && !hasAutoStarted.current && audioRef.current) {
      hasAutoStarted.current = true;
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked — that's fine, the user can press play themselves.
          setIsPlaying(false);
        });
    }
  }, [canPlay, volume]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = Number(e.target.value);
    audio.currentTime = next;
    setProgress(next);
  }

  function handleVolume(e) {
    const next = Number(e.target.value);
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  }

  function formatTime(t) {
    if (!Number.isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="glass mx-auto flex w-full max-w-md items-center gap-4 rounded-2xl p-4 shadow-glass">
      <audio
        ref={audioRef}
        src={SONG.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-polaroid">
        <img
          src={SONG.cover}
          alt={`${SONG.title} album cover`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-body text-sm font-semibold text-ink-800">
            {SONG.title}
          </span>
          <span className="whitespace-nowrap font-body text-xs text-ink-700/70">
            Now Playing ❤️
          </span>
        </div>
        <span className="truncate font-body text-xs text-ink-700/70">{SONG.artist}</span>

        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blush-300 text-white transition hover:bg-blush-400"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="h-1 flex-1 cursor-pointer accent-blush-400"
            aria-label="Seek"
          />

          <span className="w-10 flex-shrink-0 text-right font-body text-[11px] text-ink-700/70">
            {formatTime(progress)}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs">🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            className="h-1 w-20 cursor-pointer accent-blush-400"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
