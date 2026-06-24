import { useRef, useState } from 'react';
import gsap from 'gsap';
import { FINAL_LETTER } from '../content';

export default function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const flapRef = useRef(null);
  const letterRef = useRef(null);
  const messageRef = useRef(null);
  const sparkleLayerRef = useRef(null);

  function spawnSparkles() {
    const layer = sparkleLayerRef.current;
    if (!layer) return;
    const glyphs = ['✦', '♡', '✿', '💗'];

    for (let i = 0; i < 26; i++) {
      const span = document.createElement('span');
      span.textContent = glyphs[i % glyphs.length];
      span.style.position = 'absolute';
      span.style.left = '50%';
      span.style.top = '40%';
      span.style.fontSize = `${12 + Math.random() * 16}px`;
      span.style.pointerEvents = 'none';
      span.style.color = i % 2 === 0 ? '#FF9FC9' : '#FFE8A3';
      layer.appendChild(span);

      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 180;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 60;

      gsap.fromTo(
        span,
        { x: 0, y: 0, opacity: 1, scale: 0.5 },
        {
          x,
          y,
          opacity: 0,
          scale: 1.2,
          rotate: Math.random() * 180 - 90,
          duration: 1.8 + Math.random() * 0.6,
          ease: 'power2.out',
          onComplete: () => span.remove(),
        }
      );
    }
  }

  function handleOpen() {
    if (isOpen) return;
    setIsOpen(true);

    const tl = gsap.timeline();

    // 1. Envelope flap opens
    tl.to(flapRef.current, {
      rotateX: -160,
      duration: 0.7,
      ease: 'power2.out',
    });

    // 2. Letter rises
    tl.to(
      letterRef.current,
      {
        y: -120,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.2'
    );

    tl.call(() => spawnSparkles());

    // 3. Message fades in
    tl.to(
      messageRef.current,
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-blush-gradient px-6 py-24">
      <h2 className="mb-16 text-center font-display text-3xl italic text-ink-800 sm:text-4xl">
        One last thing
      </h2>

      <div
        ref={sparkleLayerRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0"
      />

      <div className="relative flex flex-col items-center" style={{ perspective: 1000 }}>
        <div
          className="relative cursor-pointer"
          style={{ width: 280, height: 190 }}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Open the envelope to read the final message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen();
          }}
        >
          {/* Letter, hidden behind the envelope body until it rises */}
          <div
            ref={letterRef}
            className="glass absolute left-1/2 top-6 z-10 w-64 -translate-x-1/2 rounded-lg p-6 opacity-0 shadow-glass"
          >
            <p
              ref={messageRef}
              className="translate-y-3 whitespace-pre-line text-center font-hand text-lg leading-relaxed text-ink-800 opacity-0"
            >
              {FINAL_LETTER}
            </p>
          </div>

          {/* Envelope body */}
          <svg viewBox="0 0 280 190" width="280" height="190" className="absolute inset-0 z-20">
            <rect x="0" y="0" width="280" height="190" rx="10" fill="#FFD6E7" stroke="#FF9FC9" strokeWidth="3" />
            <path d="M0 10 L140 120 L280 10" fill="none" stroke="#FF9FC9" strokeWidth="3" />
          </svg>

          {/* Flap, flips open on click */}
          <div
            ref={flapRef}
            className="absolute left-0 top-0 z-30"
            style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
          >
            <svg viewBox="0 0 280 130" width="280" height="130">
              <path d="M0 0 L280 0 L140 110 Z" fill="#FFB6D5" stroke="#FF9FC9" strokeWidth="3" />
            </svg>
          </div>

          {!isOpen && (
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-sm text-ink-700/70">
              Tap to open
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
