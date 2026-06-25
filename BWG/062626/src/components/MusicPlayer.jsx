import { useEffect, useRef, useState } from 'react';
import { SONG } from '../content';

/**
 * Glassmorphism music player styled as a vinyl record in a glass sleeve.
 * `canPlay` should be wired to the same "user interacted with the ribbon"
 * event that unlocks scrolling (browsers require a user gesture before
 * audio can autoplay anyway).
 */
export default function MusicPlayer({ canPlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [coverFailed, setCoverFailed] = useState(false);
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
    <div className="player-glass">
      <audio
        ref={audioRef}
        src={SONG.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* spinning vinyl in its glass sleeve — spins only while playing */}
      <div className="disc-frame">
        <div className={`disc${isPlaying ? ' spinning' : ''}`}>
          {!coverFailed && (
            <img
              src={SONG.cover}
              alt=""
              className="disc-cover"
              onError={() => setCoverFailed(true)}
            />
          )}
          <span className="disc-center" />
        </div>
      </div>

      <div className="player-meta">
        <div className="player-title-row">
          <span className="player-title">{SONG.title}</span>
          <span className="player-now-playing">now playing</span>
        </div>
        <span className="player-artist">{SONG.artist}</span>

        <div className="player-controls-row">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="player-play-btn"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 4.5v15l13-7.5-13-7.5Z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            aria-label="Seek"
          />

          <span className="player-time">{formatTime(progress)}</span>
        </div>

        <div className="player-volume-row">
          <svg className="player-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}