import { cardApi } from '@/features/cards/api';
import { useCardStore } from '@/features/cards/store';
import { stackApi } from '@/features/stacks/api';
import { useStackStore } from '@/features/stacks/store';
import { create } from 'zustand';

export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: string;
  rootElement: HTMLElement | null;

  // Data loading
  loadInitialData: () => Promise<void>;
  setError: (error: string | null) => void;
  switchTheme: (theme?: string) => void;
  setRootElement: (element: HTMLElement | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: false,
  error: null,
  theme: '',
  rootElement: null,

  loadInitialData: async () => {
    const theme = localStorage.getItem('plugilo-theme') || 'light';
    set({ isLoading: true, error: null, theme });
    try {
      const [stacks, cards] = await Promise.all([stackApi.fetchAll(), cardApi.fetchAll()]);

      // Update feature stores
      useStackStore.getState().setStacks(stacks);
      useCardStore.getState().setCards(cards);

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  switchTheme: (theme?: string) => {
    const nextTheme = theme || (get().theme === 'dark' ? 'light' : 'dark');
    set({ theme: nextTheme });
    localStorage.setItem('plugilo-theme', nextTheme);
  },

  setRootElement: (element: HTMLElement | null) => {
    set({ rootElement: element });
  },
}));

/**
 * Get the root element for Shadow DOM support
 * Can be used outside of React components
 */
export function getRootElement(): HTMLElement | null {
  return useAppStore.getState().rootElement;
}

// Re-export feature stores for convenience
export { useStackStore } from '@/features/stacks/store';
export { useCardStore } from '@/features/cards/store';
