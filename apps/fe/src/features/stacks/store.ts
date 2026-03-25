import { create } from 'zustand';
import type { Stack } from './types';
import { stackApi } from './api';

export interface StackState {
  stacks: Stack[];
  activeStackId: string | null;

  // Actions
  setStacks: (stacks: Stack[]) => void;
  createStack: (name: string, cover: string) => Promise<void>;
  updateStack: (id: string, updates: Partial<Stack>) => Promise<void>;
  deleteStack: (id: string) => Promise<void>;
  setActiveStack: (id: string | null) => void;
  getStackById: (id: string) => Stack | undefined;

  // Internal actions for cross-store updates
  updateStackCardCount: (stackId: string, delta: number) => void;
  removeCardsFromStack: (stackId: string) => void;
}

export const useStackStore = create<StackState>((set, get) => ({
  stacks: [],
  activeStackId: null,

  setStacks: (stacks: Stack[]) => {
    set({ stacks });
  },

  createStack: async (name: string, cover: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticStack: Stack = {
      id: tempId,
      name,
      cover,
      cardCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    
    set((state) => ({
      stacks: [optimisticStack, ...state.stacks],
    }));

    try {
      const newStack = await stackApi.create(name, cover);
      set((state) => ({
        stacks: state.stacks.map((s) => (s.id === tempId ? newStack : s)),
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        stacks: state.stacks.filter((s) => s.id !== tempId),
      }));
      throw error;
    }
  },

  updateStack: async (id: string, updates: Partial<Stack>) => {
    const previousStacks = get().stacks;

    // Optimistic update
    set((state) => ({
      stacks: state.stacks.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      ),
    }));

    try {
      await stackApi.update(id, updates);
    } catch (error) {
      // Rollback on error
      set({ stacks: previousStacks });
      throw error;
    }
  },

  deleteStack: async (id: string) => {
    const previousStacks = get().stacks;

    // Optimistic update
    set((state) => ({
      stacks: state.stacks.filter((s) => s.id !== id),
      activeStackId: state.activeStackId === id ? state.stacks[0]?.id || null : state.activeStackId,
    }));

    try {
      await stackApi.delete(id);
    } catch (error) {
      // Rollback on error
      set({ stacks: previousStacks });
      throw error;
    }
  },

  setActiveStack: (id: string | null) => {
    set({ activeStackId: id });
  },

  getStackById: (id: string) => {
    return get().stacks.find((s) => s.id === id);
  },

  updateStackCardCount: (stackId: string, delta: number) => {
    set((state) => ({
      stacks: state.stacks.map((s) =>
        s.id === stackId ? { ...s, cardCount: s.cardCount + delta } : s
      ),
    }));
  },

  removeCardsFromStack: (_stackId: string) => {
    // This is a placeholder - actual card removal is handled by card store
    // This can be used for any stack-side cleanup if needed
  },
}));