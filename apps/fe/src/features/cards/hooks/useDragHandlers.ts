import { useCallback } from 'react';
import { useDragState, getStackIdAtPosition } from './useDragState';
import type { Position } from '../types';

interface UseDragHandlersOptions {
  activeStackId: string | null;
  onMoveCard: (cardId: string, targetStackId: string) => Promise<void>;
}

/**
 * Hook for managing drag-and-drop handlers for moving cards between stacks
 */
export function useDragHandlers({ activeStackId, onMoveCard }: UseDragHandlersOptions) {
  const {
    isDraggingToStacks,
    draggingCardId,
    hoveredStackId,
    startDragging,
    stopDragging,
    updateHoveredStack,
  } = useDragState();

  const handleMoveCard = useCallback(
    async (cardId: string, targetStackId: string) => {
      try {
        await onMoveCard(cardId, targetStackId);
        stopDragging();
      } catch (err) {
        console.error('Failed to move card:', err);
      }
    },
    [onMoveCard, stopDragging],
  );

  const handleDragEndWithPosition = useCallback(
    (cardId: string, position: Position) => {
      const targetStackId = getStackIdAtPosition(position);
      updateHoveredStack(null);

      if (!targetStackId || targetStackId === activeStackId) return;

      handleMoveCard(cardId, targetStackId);
    },
    [activeStackId, handleMoveCard, updateHoveredStack],
  );

  const handleDragPositionChange = useCallback(
    (position: Position | null) => {
      if (!position) {
        updateHoveredStack(null);
        return;
      }

      const stackId = getStackIdAtPosition(position);
      updateHoveredStack(stackId !== activeStackId ? stackId : null);
    },
    [activeStackId, updateHoveredStack],
  );

  const handleStackDrop = useCallback(
    (stackId: string) => {
      if (draggingCardId) {
        handleMoveCard(draggingCardId, stackId);
      }
    },
    [draggingCardId, handleMoveCard],
  );

  return {
    // State
    isDraggingToStacks,
    draggingCardId,
    hoveredStackId,
    // Actions
    startDragging,
    stopDragging,
    // Handlers
    handleDragEndWithPosition,
    handleDragPositionChange,
    handleStackDrop,
  };
}

