'use client';

import React from 'react';

interface RibbonProps {
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (distance: number) => void;
  onPull?: (distance: number) => void;
  isReleased?: boolean;
  isOpening?: boolean;
}

// Ribbon component is now integrated into GiftBox
// This component is kept for API compatibility
export const Ribbon: React.FC<RibbonProps> = ({
  isDragging,
  onDragStart,
  onDragEnd,
  onPull,
  isReleased,
  isOpening,
}) => {
  // All ribbon functionality is now handled inside GiftBox
  // This is a placeholder component for backward compatibility
  return null;
};

export default Ribbon;
