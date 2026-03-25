import { useState } from 'react';
import type { ExitingCardState, VerticalDragState } from '../types';

/**
 * Hook for managing swipe-related state
 */
export function useSwipeState() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [isOverDeleteIcon, setIsOverDeleteIcon] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [exitingCard, setExitingCard] = useState<ExitingCardState | null>(null);
  const [verticalDragMode, setVerticalDragMode] = useState<VerticalDragState>({
    active: false,
    pointerX: 0,
    pointerY: 0,
  });

  const resetSwipeState = () => {
    setShowDeleteZone(false);
    setIsOverDeleteIcon(false);
    setSwipeProgress(0);
  };

  const resetVerticalDragMode = () => {
    setVerticalDragMode({ active: false, pointerX: 0, pointerY: 0 });
  };

  const advanceToNextCard = (totalCards: number) => {
    setCurrentIndex((i) => (i + 1) % totalCards);
  };

  const resetToFirstIfNeeded = (totalCards: number) => {
    setCurrentIndex((i) => (i >= totalCards - 1 ? 0 : i));
  };

  return {
    // Index state
    currentIndex,
    setCurrentIndex,
    advanceToNextCard,
    resetToFirstIfNeeded,

    // Delete zone state
    showDeleteZone,
    setShowDeleteZone,
    isOverDeleteIcon,
    setIsOverDeleteIcon,

    // Swipe progress
    swipeProgress,
    setSwipeProgress,

    // Exiting card animation
    exitingCard,
    setExitingCard,

    // Vertical drag mode
    verticalDragMode,
    setVerticalDragMode,

    // Reset functions
    resetSwipeState,
    resetVerticalDragMode,
  };
}

