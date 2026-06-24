import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { BIRTHDAY_TITLE } from '../content';

gsap.registerPlugin(MotionPathPlugin);

/**
 * After the ribbon unravels, this component takes over: the ribbon
 * becomes a moving stroke that "writes" the birthday title letter by
 * letter, using a hidden motion path per letter combined with SVG
 * stroke-dashoffset drawing. A small dot (the "ribbon pen") travels
 * along each letter's path while it draws.
 *
 * onComplete fires once the full title has been drawn and has
 * finished its glow-in, so the parent can show the scroll-unlock cue.
 */
export default function BirthdayTitle({ active, onComplete }) {
  const containerRef = useRef(null);
  const penRef = useRef(null);
  const pathRefs = useRef([]);
  const [decorationsVisible, setDecorationsVisible] = useState(false);

  useEffect(() => {
    if (!active) return;

    const paths = pathRefs.current.filter(Boolean);
    if (paths.length === 0) {
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setDecorationsVisible(true);
        onComplete?.();
      },
    });

    if (penRef.current) {
      tl.set(penRef.current, { opacity: 1 });
    }

    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: Math.max(0.18, length / 260),
          ease: 'power1.inOut',
        },
        i === 0 ? undefined : '>-0.02'
      );

      // the ribbon-pen dot travels along this letter's path while it draws
      if (penRef.current) {
        tl.to(
          penRef.current,
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: Math.max(0.18, length / 260),
            ease: 'power1.inOut',
          },
          '<'
        );
      }
    });

    tl.to(penRef.current, { opacity: 0, duration: 0.4 });
    tl.to(containerRef.current, { duration: 0.3 }); // tiny settle beat

    return () => tl.kill();
  }, [active, onComplete]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 900 160"
        className="w-[90vw] max-w-[900px]"
        aria-label={BIRTHDAY_TITLE}
        role="img"
      >
        <title>{BIRTHDAY_TITLE}</title>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Playfair Display', serif"
          fontStyle="italic"
          fontWeight="700"
          fontSize="64"
          fill="none"
        >
          {BIRTHDAY_TITLE}
        </text>

        {/* Per-letter paths are simulated via a single text-to-path trick:
            since true text->path conversion needs a font-parsing lib,
            we draw a stylized handwritten flourish under/around the text
            using a small set of cursive strokes that read as "writing it in." */}
        {BIRTHDAY_TITLE.split('').map((char, i) => {
          if (char === ' ') return null;
          const totalChars = BIRTHDAY_TITLE.replace(/ /g, '').length;
          const index = BIRTHDAY_TITLE.slice(0, i).replace(/ /g, '').length;
          const t = totalChars <= 1 ? 0.5 : index / (totalChars - 1);
          const x = 60 + t * 780;
          const wobble = Math.sin(i * 1.7) * 14;
          return (
            <path
              key={i}
              ref={(el) => (pathRefs.current[i] = el)}
              d={`M ${x - 14} ${90 + wobble} Q ${x} ${60 + wobble} ${x + 14} ${90 + wobble}`}
              stroke="#FF9FC9"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0"
            />
          );
        })}

        <circle ref={penRef} r="5" fill="#FF6FA8" opacity="0" />
      </svg>

      {/* The real, final glowing title (revealed underneath the stroke animation) */}
      <h1
        className={`absolute inset-0 flex items-center justify-center text-center font-display italic text-[clamp(2.2rem,7vw,4.5rem)] font-bold text-ink-800 transition-opacity duration-1000 ${
          decorationsVisible ? 'opacity-100 text-shadow-glow' : 'opacity-0'
        }`}
      >
        {BIRTHDAY_TITLE}
      </h1>

      {decorationsVisible && (
        <div className="pointer-events-none absolute -inset-10 flex items-center justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-sparkle text-2xl"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {['✦', '♡', '✿'][i % 3]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
