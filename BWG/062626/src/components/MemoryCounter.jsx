import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RELATIONSHIP_START_DATE } from '../content';

gsap.registerPlugin(ScrollTrigger);

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getElapsed() {
  const start = new Date(RELATIONSHIP_START_DATE);
  const now = new Date();
  const diffMs = Math.max(0, now - start);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return { days, hours, minutes, start };
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

/* A single page-a-day calendar leaf. `weekday` is only passed for the
   Days leaf, where it reflects today's day of week — Hours/Minutes
   leave that line blank so the three leaves stay aligned. */
function CalendarLeaf({ value, label, weekday, size = 'small' }) {
  return (
    <div className="leaf">
      <span className="leaf-ring left" />
      <span className="leaf-ring right" />
      
      <p className={`leaf-number ${size}`}>
        <CountUpNumber target={value} />
      </p>
      <p className="leaf-label">{label}</p>
    </div>
  );
}

export default function MemoryCounter() {
  const [elapsed] = useState(getElapsed);
  const sectionRef = useRef(null);

  const startMonth = MONTHS[elapsed.start.getMonth()];
  const startDay = elapsed.start.getDate();
  const startYear = elapsed.start.getFullYear();
  const startWeekday = WEEKDAYS[elapsed.start.getDay()];
  const todayWeekday = WEEKDAYS[new Date().getDay()];

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.leaf, .calendar-header');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-blush-100 px-6 py-20 text-center"
    >
      {/* ambient glow so the glass has something soft to refract */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blush-300/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-blush-400/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

      <p className="font-hand text-2xl text-ink-700">We've shared</p>

      <div className="calendar-wrap mt-8">
        {/* torn-off header sheet — the day this all began */}
        <div className="calendar-header">
          <p className="since">Since {startWeekday}</p>
          <p className="date">{startMonth} {startDay}, {startYear}</p>
          <svg className="calendar-tear" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0,0 Q5,8 10,0 T20,0 T30,0 T40,0 T50,0 T60,0 T70,0 T80,0 T90,0 T100,0 T110,0 T120,0 T130,0 T140,0 T150,0 T160,0 T170,0 T180,0 T190,0 T200,0 L200,8 L0,8 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* stacked pages behind the front leaves, implying days already turned */}
        <div className="leaf-stack">
          <div className="stack-shadow" />
          <div className="stack-shadow two" />

          <div className="leaf-grid">
            <CalendarLeaf value={elapsed.days} label="Days" weekday={todayWeekday} size="large" />
            <CalendarLeaf value={elapsed.hours} label="Hours" />
            <CalendarLeaf value={elapsed.minutes} label="Minutes" />
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-md font-body text-sm text-ink-700/70">
        since the day it all began — and counting.
      </p>
    </section>
  );
}