import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * The interactive ribbon sitting on top of the gift box lid.
 *
 * Visual states:
 *  - idle: gentle hover wiggle, pointer cursor
 *  - unraveling: stretch -> elastic pull -> bounce -> unravel, with
 *    sparkle/flower/heart particles bursting outward
 *
 * Once unraveling completes, calls onUnraveled() so the parent
 * (GiftBoxSection) can trigger the box-opening sequence.
 */
export default function RibbonAnimation({ onUnraveled, disabled }) {
  const ribbonRef = useRef(null);
  const bowRef = useRef(null);
  const tailLeftRef = useRef(null);
  const tailRightRef = useRef(null);
  const particleLayerRef = useRef(null);
  const [isUnraveling, setIsUnraveling] = useState(false);

  // Idle hover wiggle
  useEffect(() => {
    const bow = bowRef.current;
    if (!bow || isUnraveling) return;

    function handleEnter() {
      gsap.to(bow, {
        rotate: 6,
        duration: 0.18,
        ease: 'power1.out',
        yoyo: true,
        repeat: 3,
        transformOrigin: '50% 50%',
      });
    }

    bow.addEventListener('mouseenter', handleEnter);
    return () => bow.removeEventListener('mouseenter', handleEnter);
  }, [isUnraveling]);

  function spawnParticles() {
    const layer = particleLayerRef.current;
    if (!layer) return;
    const shapes = ['✦', '✿', '❀', '♡'];
    const colors = ['#FF9FC9', '#FFB6D5', '#F8D7FF', '#FFE8A3'];

    for (let i = 0; i < 22; i++) {
      const span = document.createElement('span');
      span.textContent = shapes[i % shapes.length];
      span.style.position = 'absolute';
      span.style.left = '50%';
      span.style.top = '50%';
      span.style.fontSize = `${10 + Math.random() * 16}px`;
      span.style.color = colors[i % colors.length];
      span.style.pointerEvents = 'none';
      span.style.willChange = 'transform, opacity';
      layer.appendChild(span);

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 140;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 40;

      gsap.fromTo(
        span,
        { x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 },
        {
          x,
          y,
          opacity: 0,
          scale: 1.1,
          rotate: Math.random() * 180 - 90,
          duration: 1.4 + Math.random() * 0.6,
          ease: 'power2.out',
          onComplete: () => span.remove(),
        }
      );
    }
  }

  function handleClick() {
    if (disabled || isUnraveling) return;
    setIsUnraveling(true);

    const tl = gsap.timeline({
      onComplete: () => onUnraveled?.(),
    });

    // 1. Ribbon stretches
    tl.to(ribbonRef.current, {
      scaleY: 1.18,
      scaleX: 0.94,
      duration: 0.32,
      ease: 'power2.out',
      transformOrigin: '50% 0%',
    });

    // 2. Elastic pull effect
    tl.to(ribbonRef.current, {
      scaleY: 0.92,
      scaleX: 1.06,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)',
    });

    // 3. Ribbon bounces
    tl.to(bowRef.current, {
      y: -18,
      duration: 0.28,
      ease: 'power2.out',
    }).to(bowRef.current, {
      y: 0,
      duration: 0.5,
      ease: 'bounce.out',
    });

    // particles right as the bounce lands
    tl.call(() => spawnParticles());

    // 4. Ribbon unravels — tails fling outward, bow loosens and fades
    tl.to(
      tailLeftRef.current,
      {
        x: -160,
        y: 60,
        rotate: -70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.in',
      },
      '+=0.05'
    );
    tl.to(
      tailRightRef.current,
      {
        x: 160,
        y: 60,
        rotate: 70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.in',
      },
      '<'
    );
    tl.to(
      bowRef.current,
      {
        scale: 0.3,
        opacity: 0,
        rotate: 30,
        duration: 0.7,
        ease: 'power2.in',
      },
      '<0.1'
    );
  }

  return (
    <div
      className="relative"
      style={{ width: 220, height: 200, cursor: disabled ? 'default' : 'pointer' }}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Click the ribbon to open your gift"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      <div ref={particleLayerRef} className="absolute inset-0 z-20" />

      <div ref={ribbonRef} className="absolute inset-0">
        <svg viewBox="0 0 220 200" width="220" height="200">
          {/* Left tail */}
          <g ref={tailLeftRef}>
            <path
              d="M100 90 C 60 110, 40 160, 55 195 L 80 188 C 72 158, 85 125, 110 100 Z"
              fill="#FF9FC9"
              stroke="#FFB6D5"
              strokeWidth="2"
            />
          </g>

          {/* Right tail */}
          <g ref={tailRightRef}>
            <path
              d="M120 90 C 160 110, 180 160, 165 195 L 140 188 C 148 158, 135 125, 110 100 Z"
              fill="#FF9FC9"
              stroke="#FFB6D5"
              strokeWidth="2"
            />
          </g>

          {/* Bow knot + loops */}
          <g ref={bowRef} style={{ transformOrigin: '110px 90px' }}>
            <ellipse cx="70" cy="80" rx="38" ry="26" fill="#FFB6D5" stroke="#FF9FC9" strokeWidth="2" />
            <ellipse cx="150" cy="80" rx="38" ry="26" fill="#FFB6D5" stroke="#FF9FC9" strokeWidth="2" />
            <circle cx="110" cy="85" r="20" fill="#FF9FC9" stroke="#FFD6E7" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
