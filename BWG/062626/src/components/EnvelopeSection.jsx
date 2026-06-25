import { useRef, useState } from 'react';
import gsap from 'gsap';
import { FINAL_LETTER } from '../content';

export default function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const flapRef = useRef(null);
  const sealRef = useRef(null);
  const letterRef = useRef(null);
  const hintRef = useRef(null);
  const sparkleLayerRef = useRef(null);

  function spawnSparkles() {
    const layer = sparkleLayerRef.current;
    if (!layer) return;
    const glyphs = ['+', '*', '·'];

    for (let i = 0; i < 22; i++) {
      const span = document.createElement('span');
      span.textContent = glyphs[i % glyphs.length];
      span.style.position = 'absolute';
      span.style.left = '0';
      span.style.top = '0';
      span.style.fontSize = `${12 + Math.random() * 14}px`;
      span.style.pointerEvents = 'none';
      span.style.color = i % 2 === 0 ? '#f491be' : '#ffd9ab';
      layer.appendChild(span);

      const angle = Math.random() * Math.PI * 2;
      const distance = 70 + Math.random() * 140;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 40;

      gsap.fromTo(
        span,
        { x: 0, y: 0, opacity: 1, scale: 0.5 },
        {
          x,
          y,
          opacity: 0,
          scale: 1.1,
          rotate: Math.random() * 180 - 90,
          duration: 1.4 + Math.random() * 0.5,
          ease: 'power2.out',
          onComplete: () => span.remove(),
        }
      );
    }
  }

  function handleOpen() {
    if (isOpen) return;
    setIsOpen(true);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const dur = (seconds) => (prefersReducedMotion ? 0.001 : seconds);

    const tl = gsap.timeline();

    // 1. Seal and hint fade out
    tl.to(sealRef.current, { opacity: 0, duration: dur(0.25), ease: 'power1.out' });
    tl.to(hintRef.current, { opacity: 0, duration: dur(0.25), ease: 'power1.out' }, '<');

    // 2. Flap folds back away from the viewer on its top-edge hinge
    //    transform-origin: top center + rotateX(-180) = folds flat against the back
    tl.to(flapRef.current, {
      opacity: 0,
      duration: dur(0.3),
      ease: 'power1.out',
    });

    // 3. Letter rises out of the envelope
    tl.to(
      letterRef.current,
      {
        y: prefersReducedMotion ? 0 : -70,
        opacity: 1,
        duration: dur(0.7),
        ease: 'power3.out',
      },
      prefersReducedMotion ? '+=0' : '-=0.25'
    );

    if (!prefersReducedMotion) {
      tl.call(() => spawnSparkles());
    }
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-blush-gradient px-6 py-24">
      <h2 className="mb-16 text-center font-display text-3xl italic text-ink-800 sm:text-4xl">
        One last thing
      </h2>

      <div className="envelope-scene">
        <div ref={sparkleLayerRef} className="sparkle-layer" />

        <div
          className="envelope-stage"
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="Open the envelope to read the final message"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen();
          }}
        >
          <div className="env-back" />

          <p ref={letterRef} className="env-letter">
            {FINAL_LETTER}
          </p>

          <div className="env-front" />

          <div ref={flapRef} className="env-flap">
            <div className="env-flap-face outer" />
            <div className="env-flap-face inner" />
          </div>

          <div ref={sealRef} className="env-seal">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-10-9.3C0.5 8.4 2 5 5.3 5c1.9 0 3.3 1 4.7 2.7C11.4 6 12.8 5 14.7 5 18 5 19.5 8.4 22 11.7 19.5 16.4 12 21 12 21Z" />
            </svg>
          </div>
        </div>

        {!isOpen && (
          <p ref={hintRef} className="envelope-hint">
            Tap to open
          </p>
        )}
      </div>
    </section>
  );
}