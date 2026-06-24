'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const FloatingHearts: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const [hearts, setHearts] = React.useState<Heart[]>([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        delay: 0,
        duration: 3 + Math.random() * 2,
        size: 16 + Math.random() * 24,
      };
      setHearts((prev) => [...prev.slice(-10), newHeart]);
    }, 2000);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            bottom: '-20px',
            fontSize: heart.size,
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
          }}
          transition={{
            duration: heart.duration,
            ease: 'easeOut',
          }}
          onAnimationComplete={() => {
            setHearts((prev) => prev.filter((h) => h.id !== heart.id));
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
