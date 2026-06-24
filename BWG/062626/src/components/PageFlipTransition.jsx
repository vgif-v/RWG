import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * A journal-style page that flips upward as the user scrolls past it,
 * revealing the next section underneath. Built with CSS 3D perspective
 * on the page itself, plus a soft shadow that intensifies mid-flip to
 * sell the depth.
 */
export default function PageFlipTransition() {
  const wrapRef = useRef(null);
  const pageRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pageRef.current, { transformOrigin: '50% 0%' });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 70%',
            end: 'bottom top',
            scrub: true,
          },
        })
        .to(pageRef.current, {
          rotateX: -170,
          ease: 'none',
        })
        .to(
          shadowRef.current,
          { opacity: 0.35, duration: 0.5 },
          0
        )
        .to(
          shadowRef.current,
          { opacity: 0, duration: 0.5 },
          0.5
        );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-[70vh] w-full items-center justify-center bg-blush-100"
      style={{ perspective: 1600 }}
    >
      <div
        ref={shadowRef}
        className="pointer-events-none absolute inset-0 bg-ink-900 opacity-0"
      />
      <div
        ref={pageRef}
        className="relative h-[60vh] w-[88vw] max-w-3xl rounded-lg bg-gradient-to-b from-white to-blush-50 shadow-polaroid"
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
          <span className="text-3xl">📖</span>
          <p className="font-hand text-2xl text-ink-700">turning the page to our memories…</p>
        </div>
      </div>
    </div>
  );
}
