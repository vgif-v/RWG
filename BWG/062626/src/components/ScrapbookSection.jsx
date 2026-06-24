import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCRAPBOOK_LETTER, HER_NAME } from '../content';

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

export default function ScrapbookSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const letterRef = useRef(null);
  const cakeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
        scale: 0.5,
        x: '-10%',
        ease: 'none',
      });

      gsap.from(cakeRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
      });

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
      className="relative flex min-h-screen w-full items-center justify-center bg-blush-50 px-6 py-24"
    >
      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
        {/* LEFT: cake + shrinking title */}
        <div className="relative flex flex-col items-center justify-center gap-6">
          <WashiTape className="-left-4 -top-2" rotate={-8} />
          <WashiTape className="-right-6 top-10" color="#F8D7FF" rotate={6} />

          <div ref={titleRef} className="text-center">
            <h2 className="font-display text-3xl font-bold italic text-ink-800 sm:text-4xl">
              Happy Birthday
            </h2>
            <span className="font-display text-2xl italic text-blush-400 sm:text-3xl">
              {HER_NAME}
            </span>
          </div>

          <div ref={cakeRef} className="relative">
            <svg viewBox="0 0 200 180" width="200" height="180">
              <ellipse cx="100" cy="150" rx="80" ry="14" fill="#FFD6E7" />
              <rect x="40" y="100" width="120" height="50" rx="8" fill="#FFE8F0" stroke="#FFB6D5" strokeWidth="2" />
              <rect x="55" y="70" width="90" height="40" rx="8" fill="#FFF0F6" stroke="#FFB6D5" strokeWidth="2" />
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <rect x={68 + i * 18} y="50" width="4" height="22" fill="#F8A8CC" />
                  <ellipse cx={70 + i * 18} cy="46" rx="4" ry="7" fill="#FFE8A3" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* RIGHT: handwritten letter */}
        <div ref={letterRef} className="relative flex items-center">
          <div className="glass relative w-full rounded-2xl p-8 shadow-glass">
            <PaperClip className="-left-3 -top-4 rotate-[-15deg]" />
            <p className="whitespace-pre-line font-hand text-2xl leading-relaxed text-ink-800 sm:text-3xl">
              {SCRAPBOOK_LETTER}
            </p>
            <span className="absolute -bottom-3 -right-2 text-2xl">🌸</span>
          </div>
        </div>
      </div>
    </section>
  );
}
