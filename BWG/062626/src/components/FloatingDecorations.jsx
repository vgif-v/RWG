import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

/**
 * A fixed, full-viewport layer of slowly floating decorative elements
 * (hearts, flower doodles, sparkles, petals) that drift independently
 * and respond subtly to mouse movement via parallax.
 *
 * Pointer-events are disabled so the layer never blocks interaction
 * with content underneath.
 */
const FLOWER = (color) => (
  <svg viewBox="0 0 40 40" width="100%" height="100%">
    <g fill={color}>
      <ellipse cx="20" cy="10" rx="6" ry="9" />
      <ellipse cx="20" cy="30" rx="6" ry="9" />
      <ellipse cx="10" cy="20" rx="9" ry="6" />
      <ellipse cx="30" cy="20" rx="9" ry="6" />
      <circle cx="20" cy="20" r="5" fill="#FFE8A3" />
    </g>
  </svg>
);

const HEART = (color) => (
  <svg viewBox="0 0 32 28" width="100%" height="100%">
    <path
      d="M16 26 C16 26 2 17 2 8.5 C2 3.8 5.8 1 9.5 1 C12.6 1 14.8 3 16 5.5 C17.2 3 19.4 1 22.5 1 C26.2 1 30 3.8 30 8.5 C30 17 16 26 16 26 Z"
      fill={color}
    />
  </svg>
);

const SPARKLE = (color) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%">
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill={color}
    />
  </svg>
);

const PETAL = (color) => (
  <svg viewBox="0 0 24 36" width="100%" height="100%">
    <ellipse cx="12" cy="18" rx="9" ry="16" fill={color} />
  </svg>
);

function makeItems(count) {
  const palette = ['#FFB6D5', '#F8D7FF', '#FFD6E7', '#FF9FC9'];
  const kinds = [FLOWER, HEART, SPARKLE, PETAL];
  return Array.from({ length: count }, (_, i) => {
    const kind = kinds[i % kinds.length];
    const color = palette[i % palette.length];
    return {
      id: i,
      Render: kind(color),
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 16 + Math.random() * 26,
      depth: 0.3 + Math.random() * 0.7, // parallax strength
      duration: 5 + Math.random() * 6,
      delay: Math.random() * 4,
      opacity: 0.35 + Math.random() * 0.4,
    };
  });
}

export default function FloatingDecorations({ count = 16, className = '' }) {
  const containerRef = useRef(null);
  const items = useMemo(() => makeItems(count), [count]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const layers = Array.from(el.querySelectorAll('[data-depth]'));

    function handleMove(e) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1..1
      const y = (e.clientY / innerHeight - 0.5) * 2;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth);
        gsap.to(layer, {
          x: x * 18 * depth,
          y: y * 18 * depth,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    }

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          data-depth={item.depth}
          className="absolute animate-floatSlow"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.Render}
        </div>
      ))}
    </div>
  );
}
