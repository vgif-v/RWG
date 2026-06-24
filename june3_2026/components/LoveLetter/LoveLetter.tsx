'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoveLetterProps {
  isVisible: boolean;
  onEdit?: (text: string) => void;
}

// This can be easily customized
const DEFAULT_LETTER = `My Dearest Love,

Every moment with you feels like a beautiful dream I never want to wake from. Your smile brightens even my darkest days, and your laughter is the sweetest melody I could ever hear.

I'm endlessly grateful for your kindness, your warmth, and the way you make me feel so deeply loved. You inspire me to be a better person every single day.

Thank you for being my greatest adventure, my safe harbor, and my home. I love you more than words could ever express.

Forever yours,
❤️`;

export const LoveLetter: React.FC<LoveLetterProps> = ({
  isVisible,
  onEdit,
}) => {
  const [letterText, setLetterText] = useState(DEFAULT_LETTER);
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterText(e.target.value);
    onEdit?.(e.target.value);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-40"
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={
        isVisible
          ? { opacity: 1, backdropFilter: 'blur(8px)' }
          : { opacity: 0, backdropFilter: 'blur(0px)' }
      }
      transition={{ duration: 1 }}
      style={{
        background: 'rgba(255, 228, 236, 0.1)',
      }}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {/* Floating background flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 60 + Math.random() * 100,
              height: 60 + Math.random() * 100,
              opacity: 0.1,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
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
                    fill="#FFB6D9"
                    opacity="0.5"
                    transform={`rotate(${(petal * 72 + 45).toFixed(0)} ${x} ${y})`}
                  />
                );
              })}
              <circle cx="50" cy="50" r="12" fill="#FFE4EC" opacity="0.6" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Letter Container */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={
          isVisible
            ? { scale: 1, opacity: 1, y: 0 }
            : { scale: 0.8, opacity: 0, y: 50 }
        }
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Paper */}
        <div
          className="relative p-12 rounded-lg shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 250, 0.98))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 228, 236, 0.5)',
            boxShadow:
              '0 20px 60px rgba(255, 182, 217, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            textureBackground:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23fff' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E\")",
          }}
        >
          {/* Decorative corners */}
          <div
            className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl opacity-20"
            style={{ borderColor: '#FFB6D9' }}
          />
          <div
            className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr opacity-20"
            style={{ borderColor: '#FFB6D9' }}
          />
          <div
            className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl opacity-20"
            style={{ borderColor: '#FFB6D9' }}
          />
          <div
            className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br opacity-20"
            style={{ borderColor: '#FFB6D9' }}
          />

          {/* Letter Content */}
          {!isEditing ? (
            <motion.div
              className="min-h-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p
                className="text-lg leading-relaxed whitespace-pre-wrap select-none"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: '#FFB6D9',
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  lineHeight: '1.8',
                }}
              >
                {letterText}
              </p>
            </motion.div>
          ) : (
            <textarea
              value={letterText}
              onChange={handleTextChange}
              className="w-full min-h-96 p-4 rounded font-serif text-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '1.5rem',
              }}
            />
          )}

          {/* Edit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
              style={{
                background: isEditing
                  ? 'linear-gradient(135deg, #FFB6D9, #FF99C8)'
                  : 'linear-gradient(135deg, #FFE4EC, #FFD4E5)',
                color: isEditing ? '#fff' : '#FF99C8',
                border: '1px solid',
                borderColor: isEditing ? '#FF99C8' : '#FFB6D9',
              }}
            >
              {isEditing ? 'Save' : 'Edit Letter'}
            </button>
          </div>
        </div>

        {/* Decorative seal */}
        <motion.div
          className="absolute -bottom-6 right-8 w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{
            background: 'linear-gradient(135deg, #FFB6D9, #FF99C8)',
            boxShadow: '0 4px 15px rgba(255, 182, 217, 0.4)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          💌
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoveLetter;
