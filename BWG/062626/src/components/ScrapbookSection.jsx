import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRAPBOOK_LETTER } from '../content';

gsap.registerPlugin(ScrollTrigger);

function WashiTape({ className, color = '#FFB6D5', rotate = -4 }) {
  return (
    <div
      className={`absolute h-6 w-24 opacity-80 ${className}`}
      style={{
        background: `repeating-linear-gradient(45deg, ${color} 0 8px, ${color}cc 8px 16px)`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
    />
  );
}

function PaperClip({ className }) {
  return (
    <svg viewBox="0 0 24 50" className={`absolute h-12 w-6 ${className}`}>
      <path
        d="M12 2 C18 2 21 6 21 12 L21 36 C21 42 17 46 12 46 C7 46 4 43 4 38 L4 16 C4 13 6 11 9 11 C12 11 14 13 14 16 L14 34"
        fill="none"
        stroke="#C9C9D6"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ScrapbookSection({ dockAnchorRef }) {
  const sectionRef = useRef(null);
  const letterRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(letterRef.current, { opacity: 0, y: 20 });

      gsap.to(letterRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 30%',
          scrub: true,
        },
        y: -60,
        opacity: 1,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scrapbook-trigger relative flex min-h-screen w-full items-center justify-center bg-blush-50 px-6 py-24"
    >
      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
        {/* LEFT: dock anchor for cake + title */}
        <div className="relative flex flex-col items-center justify-center gap-6">
          <WashiTape className="-left-4 -top-2" rotate={-8} />
          <WashiTape className="-right-6 top-10" color="#F8D7FF" rotate={6} />

          <div
            ref={dockAnchorRef}
            className="pointer-events-none w-full max-w-xs opacity-0"
            style={{ aspectRatio: '1 / 1' }}
            aria-hidden="true"
          />
        </div>

        {/* RIGHT: handwritten letter */}
        <div ref={letterRef} className="relative flex items-center">
          <div className="glass relative w-full rounded-2xl p-8 shadow-glass">
            <PaperClip className="-left-3 -top-4 rotate-[-15deg]" />

            {/* Ruled lines behind the text for a notepad feel */}
            <div className="letter-lines" aria-hidden="true" />

            <p className="letter-body whitespace-pre-line">
              {SCRAPBOOK_LETTER}
            </p>

            <span className="absolute -bottom-3 -right-2 text-2xl">🌸</span>
          </div>
        </div>
      </div>
    </section>
  );
}