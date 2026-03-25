import { useCallback } from 'react';
import { useCardStore } from '../store';
import type { Card } from '../types';

interface CardFormData {
  name: string;
  description: string;
  cover: string;
  stackId: string;
}

interface UseCardHandlersOptions {
  onSuccess?: () => void;
}

/**
 * Hook for managing card CRUD operations with error handling
 */
export function useCardHandlers(options: UseCardHandlersOptions = {}) {
  const { onSuccess } = options;

  const createCard = useCardStore((state) => state.createCard);
  const updateCard = useCardStore((state) => state.updateCard);
  const deleteCard = useCardStore((state) => state.deleteCard);
  const moveCard = useCardStore((state) => state.moveCard);
  const getActiveCards = useCardStore((state) => state.getActiveCards);

  const handleCreateCard = useCallback(
    async (data: CardFormData) => {
      try {
        await createCard(data);
        onSuccess?.();
      } catch (err) {
        console.error('Failed to create card:', err);
      }
    },
    [createCard, onSuccess],
  );

  const handleUpdateCard = useCallback(
    async (cardId: string, data: CardFormData) => {
      try {
        await updateCard(cardId, data);
        onSuccess?.();
      } catch (err) {
        console.error('Failed to update card:', err);
      }
    },
    [updateCard, onSuccess],
  );

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      try {
        await deleteCard(cardId);
      } catch (err) {
        console.error('Failed to delete card:', err);
      }
    },
    [deleteCard],
  );

  const handleMoveCard = useCallback(
    async (cardId: string, targetStackId: string) => {
      try {
        await moveCard(cardId, targetStackId);
      } catch (err) {
        console.error('Failed to move card:', err);
      }
    },
    [moveCard],
  );

  return {
    activeCards: getActiveCards(),
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    handleMoveCard,
  };
}

export type { CardFormData, Card };

