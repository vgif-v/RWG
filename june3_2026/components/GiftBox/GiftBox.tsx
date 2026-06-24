'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface GiftBoxProps {
  isOpening?: boolean;
  onOpeningStart?: () => void;
  onRibbonPull?: (distance: number) => void;
  onRibbonRelease?: (distance: number) => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({
  isOpening = false,
  onOpeningStart,
  onRibbonPull,
  onRibbonRelease,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const ribbonTailRef = useRef<HTMLDivElement>(null);
  const [isDraggingRibbon, setIsDraggingRibbon] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ribbonTail = ribbonTailRef.current;
    if (!ribbonTail || isOpening) return;

    let isCurrentlyDragging = false;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isCurrentlyDragging = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      currentPos.current = { x: 0, y: 0 };
      setIsDraggingRibbon(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isCurrentlyDragging) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      currentPos.current = { x: deltaX, y: deltaY };

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      onRibbonPull?.(distance);

      // Rotate ribbon tail based on drag angle
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      gsap.to(ribbonTail, {
        x: deltaX * 0.9,
        y: deltaY * 0.9,
        rotation: angle,
        duration: 0.1,
        overwrite: 'auto',
      });
    };

    const handleMouseUp = () => {
      if (!isCurrentlyDragging) return;
      isCurrentlyDragging = false;
      setIsDraggingRibbon(false);

      const distance = Math.sqrt(
        currentPos.current.x ** 2 + currentPos.current.y ** 2
      );
      onRibbonRelease?.(distance);

      // Spring back animation
      gsap.to(ribbonTail, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    };

    ribbonTail.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      ribbonTail.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onRibbonPull, onRibbonRelease, isOpening]);

  useEffect(() => {
    if (isOpening && onOpeningStart) {
      onOpeningStart();

      // Shake animation
      gsap.to(boxRef.current, {
        x: Math.sin(Date.now() / 100) * 2,
        duration: 0.1,
        repeat: 10,
      });

      // Lid opening animation
      setTimeout(() => {
        gsap.to(lidRef.current, {
          rotationX: 90,
          y: -80,
          duration: 2,
          ease: 'power2.inOut',
        });
      }, 600);
    }
  }, [isOpening, onOpeningStart]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective">
      <motion.div
        ref={boxRef}
        className="relative"
        initial={{ y: 0 }}
        animate={{
          y: isOpening ? 20 : [0, -10, 0],
        }}
        transition={{
          duration: isOpening ? 0.3 : 2,
          repeat: isOpening ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        style={{
          perspective: 1000,
          width: '220px',
          height: '220px',
        }}
      >
        {/* Box Bottom */}
        <motion.div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, #FFB6D9 0%, #FFC0D9 50%, #FFD4E5 100%)',
            boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.1), 0 20px 60px rgba(255, 182, 217, 0.4)',
          }}
        >
          {/* Glossy highlights on box */}
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-40 blur-xl bg-white" />
          <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full opacity-20 blur-2xl bg-white" />
        </motion.div>

        {/* Box Lid */}
        <motion.div
          ref={lidRef}
          className="absolute inset-0 rounded-t-lg rounded-b-none"
          style={{
            background:
              'linear-gradient(135deg, #FFB6D9 0%, #FFC0D9 50%, #FFD4E5 100%)',
            boxShadow:
              'inset -4px 0 15px rgba(0,0,0,0.08), 0 10px 30px rgba(255, 182, 217, 0.3)',
            transformStyle: 'preserve-3d',
            originY: 1,
          }}
          animate={
            !isOpening
              ? {
                  rotationX: [0, -2, 0],
                }
              : undefined
          }
          transition={
            !isOpening
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        >
          {/* Glossy effect on lid */}
          <div className="absolute top-2 left-4 w-12 h-12 rounded-full opacity-50 blur-lg bg-white" />
        </motion.div>

        {/* HORIZONTAL RIBBON STRIPE - Attached to Gift */}
        <div
          className="absolute top-1/2 left-0 w-full h-12 transform -translate-y-1/2 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #FF99C8 0%, #FFB6D9 25%, #FFC0D9 50%, #FFB6D9 75%, #FF99C8 100%)',
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)',
          }}
        />

        {/* VERTICAL RIBBON STRIPE - Attached to Gift */}
        <div
          className="absolute top-0 left-1/2 w-12 h-full transform -translate-x-1/2 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #FF99C8 0%, #FFB6D9 25%, #FFC0D9 50%, #FFB6D9 75%, #FF99C8 100%)',
            boxShadow:
              'inset 2px 0 4px rgba(255,255,255,0.4), inset -2px 0 4px rgba(0,0,0,0.15), 4px 0 12px rgba(0,0,0,0.2)',
          }}
        />

        {/* BOW CENTER - Knot */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="w-10 h-10 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFE4EC 0%, #FFB6D9 50%, #FF99C8 100%)',
              boxShadow:
                'inset -2px -2px 6px rgba(0,0,0,0.15), 0 6px 18px rgba(255, 182, 217, 0.7)',
            }}
          />
        </motion.div>

        {/* LEFT BOW LOOP */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-12 h-10 rounded-full transform -translate-y-1/2 pointer-events-none z-25"
          style={{
            background: 'linear-gradient(135deg, #FFB6D9 0%, #FFC0D9 50%, #FFD4E5 100%)',
            boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.1), 2px 4px 10px rgba(0,0,0,0.2)',
          }}
          animate={{
            rotateZ: [-12, 12, -12],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* RIGHT BOW LOOP */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-12 h-10 rounded-full transform -translate-y-1/2 pointer-events-none z-25"
          style={{
            background: 'linear-gradient(135deg, #FFC0D9 0%, #FFD4E5 50%, #FFB6D9 100%)',
            boxShadow: 'inset 1px -1px 3px rgba(0,0,0,0.1), -2px 4px 10px rgba(0,0,0,0.2)',
          }}
          animate={{
            rotateZ: [12, -12, 12],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* INTERACTIVE BOW TAIL - DRAGGABLE - VERY PROMINENT */}
        <motion.div
          ref={ribbonTailRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing select-none pointer-events-auto"
          style={{
            width: '95px',
            height: '120px',
            background: 'linear-gradient(135deg, #FFB6D9 0%, #FFC0D9 50%, #FF99C8 100%)',
            borderRadius: '12px 28px 28px 12px',
            boxShadow:
              'inset -3px -3px 10px rgba(0,0,0,0.15), 6px 14px 28px rgba(0,0,0,0.25)',
            transformOrigin: 'center center',
          }}
          whileHover={{
            scale: 1.12,
            boxShadow:
              'inset -3px -3px 10px rgba(0,0,0,0.15), 8px 18px 35px rgba(0,0,0,0.3)',
          }}
          initial={{ x: 0, y: 0, rotation: 0 }}
        >
          {/* Ribbon tail shine/highlight */}
          <div className="absolute top-4 left-4 w-12 h-6 rounded-full opacity-60 blur-md bg-white" />
          
          {/* DRAG INSTRUCTION - Make it Very Clear */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              ⬇️
            </motion.div>
            <motion.div
              className="text-white text-xs font-bold mt-1 tracking-widest text-center"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              PULL
            </motion.div>
          </div>
        </motion.div>
        {isOpening && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(255, 228, 236, 0.8), transparent)',
              boxShadow:
                'inset 0 0 40px rgba(255, 182, 217, 0.6), 0 0 60px rgba(255, 182, 217, 0.4)',
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default GiftBox;
