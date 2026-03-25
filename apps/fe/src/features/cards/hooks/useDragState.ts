import { useState, useCallback } from 'react';
import { getRootElement } from '@/shared/store/useStore';
import type { Position } from '../types';

/**
 * Hook for managing drag-and-drop state for cards
 */
export function useDragState() {
  const [isDraggingToStacks, setIsDraggingToStacks] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [hoveredStackId, setHoveredStackId] = useState<string | null>(null);

  const startDragging = useCallback((cardId: string) => {
    setIsDraggingToStacks(true);
    setDraggingCardId(cardId);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDraggingToStacks(false);
    setDraggingCardId(null);
    setHoveredStackId(null);
  }, []);

  const updateHoveredStack = useCallback((stackId: string | null) => {
    setHoveredStackId(stackId);
  }, []);

  return {
    isDraggingToStacks,
    draggingCardId,
    hoveredStackId,
    startDragging,
    stopDragging,
    updateHoveredStack,
  };
}

/**
 * Helper to find stack ID at a given position from DOM
 * Supports both regular DOM and Shadow DOM (including closed shadow DOM)
 */
export function getStackIdAtPosition(position: Position): string | null {
  let elementAtPoint: Element | null = null;

  // If we have a root element reference, use its root node for Shadow DOM support
  const rootElement = getRootElement();
  if (rootElement) {
    const rootNode = rootElement.getRootNode();
    // Check if we're in a Shadow DOM (ShadowRoot has elementFromPoint method)
    if (rootNode instanceof ShadowRoot) {
      elementAtPoint = rootNode.elementFromPoint(position.x, position.y);
    }
  }

  // Fallback to document for regular DOM or if shadow root lookup failed
  if (!elementAtPoint) {
    elementAtPoint = document.elementFromPoint(position.x, position.y);
  }

  if (!elementAtPoint) return null;

  const stackElement = elementAtPoint.closest('[data-stack-id]');
  if (!stackElement) return null;

  return stackElement.getAttribute('data-stack-id');
}

