import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RELATIONSHIP_START_DATE } from '../content';

gsap.registerPlugin(ScrollTrigger);

function getElapsed() {
  const start = new Date(RELATIONSHIP_START_DATE);
  const now = new Date();
  const diffMs = Math.max(0, now - start);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

function CountUpNumber({ target, duration = 1.6 }) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      once: true,
      onEnter: () => setHasAnimated(true),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!hasAnimated || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.floor(obj.val).toLocaleString();
      },
    });
  }, [hasAnimated, target, duration]);

  return <span ref={ref}>0</span>;
}

export default function MemoryCounter() {
  const [elapsed] = useState(getElapsed);

  return (
    <section className="relative w-full bg-blush-100 px-6 py-20 text-center">
      <p className="font-hand text-2xl text-ink-700">We've shared</p>

      <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-8 sm:gap-14">
        <div className="flex flex-col items-center">
          <span className="font-display text-4xl font-bold text-blush-400 sm:text-5xl">
            <CountUpNumber target={elapsed.days} />
          </span>
          <span className="font-body text-sm text-ink-700/80">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-display text-4xl font-bold text-blush-400 sm:text-5xl">
            <CountUpNumber target={elapsed.hours} />
          </span>
          <span className="font-body text-sm text-ink-700/80">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-display text-4xl font-bold text-blush-400 sm:text-5xl">
            <CountUpNumber target={elapsed.minutes} />
          </span>
          <span className="font-body text-sm text-ink-700/80">Minutes</span>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md font-body text-sm text-ink-700/70">
        since the day it all began — and counting.
      </p>
    </section>
  );
}
