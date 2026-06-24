'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface Flower {
  id: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  colors: string[];
}

const FLOWER_COLORS = ['#FFB6D9', '#FFD4E5', '#FFFACD', '#FFFEF0', '#FFD4B4'];

const generateFlowers = (count: number): Flower[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 20 + Math.random() * 40,
    opacity: 0.3 + Math.random() * 0.7,
    colors: FLOWER_COLORS.sort(() => Math.random() - 0.5).slice(0, 2),
  }));
};

const FloatingFlower: React.FC<{ flower: Flower }> = ({ flower }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: flower.left,
        top: flower.top,
      }}
      initial={{ y: 0, opacity: flower.opacity }}
      animate={{
        y: [0, -30 - Math.random() * 40, -80 - Math.random() * 60],
        x: [0, Math.sin(flower.id) * 20, Math.cos(flower.id) * 30],
        opacity: [flower.opacity, flower.opacity * 0.7, 0],
        rotate: [0, Math.random() * 360],
        scale: [1, 1.1, 0.8],
      }}
      transition={{
        duration: flower.duration,
        delay: flower.delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    >
      <svg
        width={flower.size}
        height={flower.size}
        viewBox="0 0 100 100"
        className="drop-shadow-md"
      >
        {/* Petals */}
        {[0, 1, 2, 3, 4].map((petal) => {
          const angle = (petal * 72 * Math.PI) / 180;
          const x = 50 + 30 * Math.cos(angle);
          const y = 50 + 30 * Math.sin(angle);
          return (
            <ellipse
              key={petal}
              cx={x}
              cy={y}
              rx="18"
              ry="25"
              fill={flower.colors[0]}
              opacity="0.9"
              transform={`rotate(${(petal * 72 + 45).toFixed(0)} ${x} ${y})`}
            />
          );
        })}
        {/* Center */}
        <circle cx="50" cy="50" r="12" fill={flower.colors[1]} opacity="0.95" />
      </svg>
    </motion.div>
  );
};

export const FloatingFlowers: React.FC<{ count?: number; active?: boolean }> = ({
  count = 8,
  active = true,
}) => {
  const [flowers, setFlowers] = React.useState<Flower[]>([]);

  useEffect(() => {
    setFlowers(generateFlowers(count));
  }, [count]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {flowers.map((flower) => (
        <FloatingFlower key={flower.id} flower={flower} />
      ))}
    </div>
  );
};

export default FloatingFlowers;
