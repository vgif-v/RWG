'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface BurstFlower {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  delay: number;
  duration: number;
}

const FLOWER_COLORS = ['#FFB6D9', '#FFD4E5', '#FFFACD', '#FFFEF0', '#FFD4B4'];

const generateBurstFlowers = (count: number): BurstFlower[] => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 150 + Math.random() * 300;
    const size = 30 + Math.random() * 80;

    return {
      id: i,
      x: centerX,
      y: centerY,
      size,
      color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)],
      angle,
      distance,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1,
    };
  });
};

const BurstFlower: React.FC<{ flower: BurstFlower }> = ({ flower }) => {
  const targetX = flower.x + Math.cos(flower.angle) * flower.distance;
  const targetY = flower.y + Math.sin(flower.angle) * flower.distance;

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        x: flower.x,
        y: flower.y,
        zIndex: 50,
      }}
      initial={{
        x: flower.x,
        y: flower.y,
        scale: 0.1,
        opacity: 0,
      }}
      animate={{
        x: targetX,
        y: targetY,
        scale: [0.1, 1.2, 1],
        opacity: [1, 1, 0.3],
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: flower.duration,
        delay: flower.delay,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg
        width={flower.size}
        height={flower.size}
        viewBox="0 0 100 100"
        className="drop-shadow-lg"
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
              fill={flower.color}
              opacity="0.95"
              transform={`rotate(${(petal * 72 + 45).toFixed(0)} ${x} ${y})`}
            />
          );
        })}
        {/* Center */}
        <circle cx="50" cy="50" r="12" fill="#FFFEF0" opacity="0.98" />
      </svg>
    </motion.div>
  );
};

interface FlowerBurstProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const FlowerBurst: React.FC<FlowerBurstProps> = ({
  isActive,
  onComplete,
}) => {
  const [flowers, setFlowers] = React.useState<BurstFlower[]>([]);
  const [fullScreen, setFullScreen] = React.useState(false);

  useEffect(() => {
    if (!isActive) {
      setFlowers([]);
      setFullScreen(false);
      return;
    }

    // Initial burst
    setFlowers(generateBurstFlowers(40));

    const burstTimer = setTimeout(() => {
      setFullScreen(true);
    }, 300);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 5500);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  return (
    <>
      {/* Burst flowers */}
      {isActive && !fullScreen && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {flowers.map((flower) => (
            <BurstFlower key={flower.id} flower={flower} />
          ))}
        </div>
      )}

      {/* Full screen flower transition */}
      {fullScreen && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(circle at center, ${FLOWER_COLORS.slice(0, 3).join(', ')})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Floating flowers overlay */}
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={`overlay-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 40 + Math.random() * 100,
                height: 40 + Math.random() * 100,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                delay: i * 0.05,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-xl"
              >
                {[0, 1, 2, 3, 4].map((petal) => {
                  const angle = (petal * 72 * Math.PI) / 180;
                  const x = 50 + 30 * Math.cos(angle);
                  const y = 50 + 30 * Math.sin(angle);
                  const color =
                    FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
                  return (
                    <ellipse
                      key={petal}
                      cx={x}
                      cy={y}
                      rx="18"
                      ry="25"
                      fill={color}
                      opacity="0.6"
                      transform={`rotate(${(petal * 72 + 45).toFixed(0)} ${x} ${y})`}
                    />
                  );
                })}
                <circle cx="50" cy="50" r="12" fill="#FFFEF0" opacity="0.8" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};

export default FlowerBurst;
