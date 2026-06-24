
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GiftBox from '@/components/GiftBox/GiftBox';
import FlowerBurst from '@/components/FlowerBurst/FlowerBurst';
import LoveLetter from '@/components/LoveLetter/LoveLetter';
import FloatingFlowers from '@/components/FloatingFlowers/FloatingFlowers';
import Sparkles from '@/components/Sparkles/Sparkles';
import FloatingHearts from '@/components/FloatingHearts/FloatingHearts';

export default function HomePage() {
  const [isGiftBoxOpen, setIsGiftBoxOpen] = useState(false);
  const [showFlowerBurst, setShowFlowerBurst] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [ribbonPullDistance, setRibbonPullDistance] = useState(0);
  const [ribbonReleased, setRibbonReleased] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ribbonPullAudioRef = useRef<HTMLAudioElement>(null);
  const openAudioRef = useRef<HTMLAudioElement>(null);
  const burstAudioRef = useRef<HTMLAudioElement>(null);

  const PULL_THRESHOLD = 150; // Distance needed to trigger opening

  const handleRibbonDragStart = () => {
    // Subtle ribbon pull sound could go here
  };

  const handleRibbonPull = (distance: number) => {
    setRibbonPullDistance(distance);

    if (distance > PULL_THRESHOLD && !isGiftBoxOpen) {
      setIsGiftBoxOpen(true);
      setShowFlowerBurst(true);
    }
  };

  const handleRibbonDragEnd = (distance: number) => {
    setRibbonReleased(true);
    setTimeout(() => setRibbonReleased(false), 600);
  };

  const handleFlowerBurstComplete = () => {
    setTimeout(() => {
      setShowFlowerBurst(false);
      setShowLetter(true);
    }, 500);
  };

  return (
    <main className="w-full h-screen overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FFE4EC 0%, #FFF0F5 50%, #FFF8F8 100%)',
        }}
      />

      {/* Ambient sparkles - background layer */}
      <Sparkles count={20} active={!showFlowerBurst && !showLetter} />

      {/* Floating flowers - background decoration */}
      <FloatingFlowers count={5} active={!showFlowerBurst} />

      {/* Floating hearts - romantic touch */}
      <FloatingHearts active={!showFlowerBurst && !showLetter} />

      {/* Main Gift Opening Page */}
      {!showLetter && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-30"
          animate={{ opacity: showFlowerBurst ? 0 : 1 }}
          transition={{ duration: 1.5 }}
          pointerEvents={showFlowerBurst ? 'none' : 'auto'}
        >
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-light mb-12 text-center"
            style={{
              color: '#FFB6D9',
              fontFamily: "'Great Vibes', cursive",
              textShadow: '0 2px 8px rgba(255, 182, 217, 0.2)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A Gift For You
          </motion.h1>

          {/* Gift Box Container */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <GiftBox
              isOpening={isGiftBoxOpen}
              onOpeningStart={() => {
                // Could play sound here
              }}
              onRibbonPull={handleRibbonPull}
              onRibbonRelease={handleRibbonDragEnd}
            />
          </div>

          {/* Instructions */}
          <motion.p
            className="mt-16 text-center text-sm md:text-base"
            style={{
              color: '#FFB6D9',
              fontWeight: '300',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            ✨ Drag the ribbon to open the gift ✨
          </motion.p>

          {/* Pull indicator */}
          <motion.div
            className="mt-8 h-1 rounded-full"
            style={{
              width: `${Math.min(ribbonPullDistance / PULL_THRESHOLD * 100, 100)}%`,
              background:
                'linear-gradient(90deg, #FFB6D9, #FF99C8)',
              boxShadow: '0 0 10px rgba(255, 182, 217, 0.5)',
            }}
          />
        </motion.div>
      )}

      {/* Flower Burst Animation */}
      <FlowerBurst
        isActive={showFlowerBurst}
        onComplete={handleFlowerBurstComplete}
      />

      {/* Love Letter Page */}
      <LoveLetter isVisible={showLetter} />

      {/* Audio elements */}
      <audio ref={audioRef} />
      <audio ref={ribbonPullAudioRef} />
      <audio ref={openAudioRef} />
      <audio ref={burstAudioRef} />
    </main>
  );
}