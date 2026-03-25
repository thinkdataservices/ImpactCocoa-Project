import { create } from 'zustand';
import type { Card } from './types';
import { cardApi } from './api';
import { useStackStore } from '@/features/stacks/store';

export interface CardState {
  cards: Card[];

  // Actions
  setCards: (cards: Card[]) => void;
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (cardId: string, targetStackId: string) => Promise<void>;
  removeCardsByStackId: (stackId: string) => void;

  // Utility
  getActiveCards: () => Card[];
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],

  setCards: (cards: Card[]) => {
    set({ cards });
  },

  createCard: async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticCard: Card = {
      ...card,
      id: tempId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic update - place new card at the beginning
    set((state) => ({
      cards: [optimisticCard, ...state.cards],
    }));

    // Update stack card count
    useStackStore.getState().updateStackCardCount(card.stackId, 1);

    try {
      const newCard = await cardApi.create(card);
      set((state) => ({
        cards: state.cards.map((c) => (c.id === tempId ? newCard : c)),
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        cards: state.cards.filter((c) => c.id !== tempId),
      }));
      useStackStore.getState().updateStackCardCount(card.stackId, -1);
      throw error;
    }
  },

  updateCard: async (id: string, updates: Partial<Card>) => {
    const previousCards = get().cards;

    // Optimistic update
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      ),
    }));

    try {
      await cardApi.update(id, updates);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards });
      throw error;
    }
  },

  deleteCard: async (id: string) => {
    const previousCards = get().cards;
    const card = get().cards.find((c) => c.id === id);

    // Optimistic update
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
    }));

    if (card) {
      useStackStore.getState().updateStackCardCount(card.stackId, -1);
    }

    try {
      await cardApi.delete(id);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards });
      if (card) {
        useStackStore.getState().updateStackCardCount(card.stackId, 1);
      }
      throw error;
    }
  },

  moveCard: async (cardId: string, targetStackId: string) => {
    const previousCards = get().cards;
    const card = get().cards.find((c) => c.id === cardId);

    if (!card) return;

    const sourceStackId = card.stackId;

    // Optimistic update
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, stackId: targetStackId, updatedAt: Date.now() } : c
      ),
    }));

    // Update stack card counts
    useStackStore.getState().updateStackCardCount(sourceStackId, -1);
    useStackStore.getState().updateStackCardCount(targetStackId, 1);

    try {
      await cardApi.move(cardId, targetStackId);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards });
      useStackStore.getState().updateStackCardCount(sourceStackId, 1);
      useStackStore.getState().updateStackCardCount(targetStackId, -1);
      throw error;
    }
  },

  removeCardsByStackId: (stackId: string) => {
    set((state) => ({
      cards: state.cards.filter((c) => c.stackId !== stackId),
    }));
  },

  getActiveCards: () => {
    const { cards } = get();
    const { activeStackId } = useStackStore.getState();
    return cards.filter((c) => c.stackId === activeStackId);
  },
}));

