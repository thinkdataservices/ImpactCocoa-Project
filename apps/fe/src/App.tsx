import { useCardHandlers, useDragHandlers } from '@/features/cards';
import { ActiveCardDeck } from '@/features/cards/components';
import { Dock } from '@/features/dock';
import { useStackStore } from '@/features/stacks';
import { AppModals, CreateMenu, ErrorToast } from '@/shared';
import { useModalStore } from '@/shared/store/useModalStore';
import { useEffect, useRef } from 'react';
import { useAppStore } from './shared/store/useStore';

type AppProps = {
  theme?: string;
};

export default function App({ theme = 'light' }: AppProps) {
  // Global Setup
  const { loadInitialData, setRootElement } = useAppStore();
  const rootRef = useRef<HTMLElement>(null);
  const { theme: currentTheme, switchTheme } = useAppStore();

  useEffect(() => {
    // Set root element reference for Shadow DOM support in drag handlers
    if (rootRef.current) {
      setRootElement(rootRef.current);
    }
    return () => setRootElement(null);
  }, [setRootElement]);

  useEffect(() => {
    if (!currentTheme) {
      switchTheme(theme);
    } else if (currentTheme && rootRef.current) {
      for (const className of rootRef.current.classList) {
        rootRef.current.classList.remove(className);
      }
      rootRef.current.classList.add(currentTheme);
    }
  }, [currentTheme, theme, switchTheme]);

  // Modal State
  const { closeModal } = useModalStore();

  // Data & Handlers
  const activeStackId = useStackStore((state) => state.activeStackId);
  
  const { handleMoveCard } = useCardHandlers({ onSuccess: closeModal });

  // Drag handlers
  const {
    isDraggingToStacks,
    hoveredStackId,
    startDragging,
    stopDragging,
    handleDragEndWithPosition,
    handleDragPositionChange,
    handleStackDrop,
  } = useDragHandlers({ activeStackId, onMoveCard: handleMoveCard });

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <main ref={rootRef}>
      {/* Card Deck - Only shown when a stack is selected */}
      <ActiveCardDeck
        onDragStart={startDragging}
        onDragEnd={stopDragging}
        onDragEndWithPosition={handleDragEndWithPosition}
        onDragPositionChange={handleDragPositionChange}
        onCloseModal={closeModal}
      />

      {/* Error Toast with Liquid Glass Effect */}
      <ErrorToast />

      {/* Bottom Navigation - Always visible */}
      <Dock
        isDraggingCard={isDraggingToStacks}
        hoveredStackId={hoveredStackId}
        onStackDrop={handleStackDrop}
      />

      {/* Create Menu */}
      <CreateMenu />

      {/* App Modals */}
      <AppModals />
    </main>
  );
}
