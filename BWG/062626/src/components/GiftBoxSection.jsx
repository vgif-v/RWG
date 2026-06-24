import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import RibbonAnimation from './RibbonAnimation';
import BirthdayTitle from './BirthdayTitle';

const STAGES = {
  IDLE: 'idle',
  UNRAVELING: 'unraveling',
  OPENING: 'opening',
  TITLE: 'title',
  DONE: 'done',
};

/**
 * Full entry experience, in order:
 *  1. Floating gift box, top-down, with mouse parallax (IDLE)
 *  2. Ribbon click -> unravel (handled inside RibbonAnimation)
 *  3. Box opens: lid lifts/rotates, glow, confetti, flowers, dissolve (OPENING)
 *  4. Ribbon becomes a pen and writes the title (TITLE)
 *  5. Scroll-unlock cue appears (DONE) -> onUnlockScroll() fires once
 */
export default function GiftBoxSection({ onUnlockScroll }) {
  const [stage, setStage] = useState(STAGES.IDLE);
  const sceneRef = useRef(null);
  const lidRef = useRef(null);
  const boxBodyRef = useRef(null);
  const glowRef = useRef(null);
  const confettiLayerRef = useRef(null);
  const sceneWrapRef = useRef(null);

  // Mouse parallax on the whole scene
  useEffect(() => {
    if (stage !== STAGES.IDLE) return;
    function handleMove(e) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      gsap.to(sceneWrapRef.current, {
        x: x * 14,
        y: y * 14,
        duration: 1,
        ease: 'power2.out',
      });
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [stage]);

  const spawnConfetti = useCallback(() => {
    const layer = confettiLayerRef.current;
    if (!layer) return;
    const colors = ['#FF9FC9', '#FFB6D5', '#F8D7FF', '#FFE8A3', '#FFD6E7'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.left = '50%';
      piece.style.top = '40%';
      piece.style.width = `${6 + Math.random() * 6}px`;
      piece.style.height = `${10 + Math.random() * 8}px`;
      piece.style.background = colors[i % colors.length];
      piece.style.borderRadius = '2px';
      piece.style.willChange = 'transform, opacity';
      layer.appendChild(piece);

      const angle = Math.random() * Math.PI - Math.PI / 2; // mostly upward
      const distance = 120 + Math.random() * 220;
      const x = Math.cos(angle) * distance;
      const y = -Math.abs(Math.sin(angle) * distance) - 60;

      gsap.fromTo(
        piece,
        { x: 0, y: 0, opacity: 1, rotate: 0 },
        {
          x,
          y,
          opacity: 0,
          rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: 1.6 + Math.random() * 0.8,
          ease: 'power2.out',
          onComplete: () => piece.remove(),
        }
      );
    }
  }, []);

  const handleRibbonUnraveled = useCallback(() => {
    setStage(STAGES.OPENING);

    const tl = gsap.timeline({
      onComplete: () => setStage(STAGES.TITLE),
    });

    // 1. Lid lifts, 2. rotates slightly
    tl.to(lidRef.current, {
      y: -90,
      rotateX: 35,
      rotateZ: -8,
      duration: 0.9,
      ease: 'power2.out',
    });

    // 3. Light glows from inside
    tl.to(
      glowRef.current,
      { opacity: 1, scale: 1.6, duration: 0.7, ease: 'power1.out' },
      '-=0.5'
    );

    // 4. Confetti bursts out
    tl.call(() => spawnConfetti());

    // 5. Floating flowers emerge (reuse confetti layer logic w/ a flower-ish look)
    tl.to(lidRef.current, { opacity: 0, duration: 0.4 }, '+=0.2');

    // 6. Box dissolves into particles
    tl.to(boxBodyRef.current, {
      opacity: 0,
      scale: 0.85,
      filter: 'blur(6px)',
      duration: 0.9,
      ease: 'power2.in',
    });
    tl.to(glowRef.current, { opacity: 0, duration: 0.6 }, '-=0.3');
  }, [spawnConfetti]);

  const handleTitleComplete = useCallback(() => {
    setStage(STAGES.DONE);
    onUnlockScroll?.();
  }, [onUnlockScroll]);

  const showBox = stage === STAGES.IDLE || stage === STAGES.UNRAVELING || stage === STAGES.OPENING;
  const showTitle = stage === STAGES.TITLE || stage === STAGES.DONE;

  return (
    <section
      ref={sceneRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blush-gradient"
    >
      <div
        ref={sceneWrapRef}
        className="relative flex flex-col items-center justify-center"
        style={{ perspective: 900 }}
      >
        {showBox && (
          <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
            {/* glow burst from inside the box */}
            <div
              ref={glowRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,232,163,0.9) 0%, rgba(255,182,213,0.5) 50%, transparent 80%)',
                filter: 'blur(4px)',
              }}
            />

            <div ref={confettiLayerRef} className="pointer-events-none absolute inset-0 z-30" />

            {/* Box body, gently floating */}
            <div
              ref={boxBodyRef}
              className={`relative ${stage === STAGES.IDLE ? 'animate-floatY' : ''}`}
              style={{ width: 240, height: 180, transformStyle: 'preserve-3d' }}
            >
              <svg viewBox="0 0 240 180" width="240" height="180">
                <rect x="20" y="60" width="200" height="110" rx="10" fill="#FFD6E7" stroke="#FF9FC9" strokeWidth="3" />
                <rect x="20" y="60" width="200" height="110" rx="10" fill="url(#boxShade)" opacity="0.5" />
                <rect x="100" y="60" width="40" height="110" fill="#FFB6D5" opacity="0.8" />
                <defs>
                  <linearGradient id="boxShade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Lid */}
              <div
                ref={lidRef}
                className="absolute left-0 top-0"
                style={{ transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}
              >
                <svg viewBox="0 0 240 70" width="240" height="70">
                  <rect x="10" y="10" width="220" height="40" rx="10" fill="#FFB6D5" stroke="#FF9FC9" strokeWidth="3" />
                  <rect x="100" y="0" width="40" height="60" fill="#FF9FC9" opacity="0.85" />
                </svg>

                {/* Ribbon sits on the lid until unraveled */}
                <div className="absolute left-1/2 top-[-110px] -translate-x-1/2">
                  <RibbonAnimation
                    onUnraveled={handleRibbonUnraveled}
                    disabled={stage !== STAGES.IDLE}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showTitle && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <BirthdayTitle active={stage === STAGES.TITLE} onComplete={handleTitleComplete} />
          </div>
        )}
      </div>

      {stage === STAGES.DONE && (
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-ink-700">
          <span className="font-body text-sm font-medium tracking-wide">Scroll to continue</span>
          <span className="animate-bounceArrow text-xl">↓</span>
        </div>
      )}

      {stage === STAGES.IDLE && (
        <p className="absolute bottom-12 font-body text-sm text-ink-700/70">
          Tap the ribbon to open your gift
        </p>
      )}
    </section>
  );
}
