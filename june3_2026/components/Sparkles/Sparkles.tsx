'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const Sparkles: React.FC<{ count?: number; active?: boolean }> = ({
  count = 15,
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);

  useEffect(() => {
    if (!active) return;

    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 0.5,
      opacity: 0.6 + Math.random() * 0.4,
    }));

    setSparkles(newSparkles);

    // Generate new sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => ({
          ...s,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 0.5,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [count, active]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
    >
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, sparkle.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 228, 236, 0.8), transparent)`,
              boxShadow: '0 0 4px rgba(255, 182, 217, 0.6)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Sparkles;
