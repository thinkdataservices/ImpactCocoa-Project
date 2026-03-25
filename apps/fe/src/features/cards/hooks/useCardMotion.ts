import { useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  MIN_DRAG_SCALE,
  OPACITY_INPUT_RANGE,
  OPACITY_OUTPUT_RANGE,
  ROTATION_INPUT_RANGE,
  ROTATION_OUTPUT_RANGE,
} from '../constants';
import type { DragDirection } from '../types';

/**
 * Hook for managing card motion values and transforms
 */
export function useCardMotion(cardId: string | undefined) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragDirectionRef = useRef<DragDirection>(null);

  // Transform x position to rotation for natural card tilt
  const rotate = useTransform(x, ROTATION_INPUT_RANGE, ROTATION_OUTPUT_RANGE);

  // Transform x position to opacity for fade effect
  const opacity = useTransform(x, OPACITY_INPUT_RANGE, OPACITY_OUTPUT_RANGE);

  // Transform drag distance to scale - only for horizontal swipes
  const scale = useTransform(() => {
    if (dragDirectionRef.current === 'vertical') return 1;

    const xVal = Math.abs(x.get());
    const yVal = Math.abs(y.get());

    const distance = Math.sqrt(xVal * xVal + yVal * yVal);
    const scaleRange = 1 - MIN_DRAG_SCALE;
    const progress = Math.min(distance / 150, 1);
    return 1 - progress * scaleRange;
  });

  // Reset motion values when card changes
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [cardId, x, y]);

  const resetMotionValues = () => {
    x.set(0);
    y.set(0);
  };

  const resetDragDirection = () => {
    dragDirectionRef.current = null;
  };

  return {
    x,
    y,
    rotate,
    opacity,
    scale,
    dragDirectionRef,
    resetMotionValues,
    resetDragDirection,
  };
}

