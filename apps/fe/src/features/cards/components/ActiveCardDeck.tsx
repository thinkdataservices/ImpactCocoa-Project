import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, lazy } from 'react';
import { useStackStore } from '@/features/stacks';
import { useCardStore } from '../store';
import { useModalStore } from '@/shared/store/useModalStore';
import { useCardHandlers } from '../hooks';
import type { Position } from '../types';

// Lazy load the SwipeableCardDeck to reduce initial bundle size
const SwipeableCardDeck = lazy(() =>
  import('./SwipeableCardDeck').then((mod) => ({ default: mod.SwipeableCardDeck })),
);

interface ActiveCardDeckProps {
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onDragEndWithPosition: (
    cardId: string,
    position: Position,
  ) => void;
  onDragPositionChange: (position: Position | null) => void;
  onCloseModal: () => void;
}

export function ActiveCardDeck({
  onDragStart,
  onDragEnd,
  onDragEndWithPosition,
  onDragPositionChange,
  onCloseModal,
}: ActiveCardDeckProps) {
  // Store selectors
  const activeStackId = useStackStore((state) => state.activeStackId);
  const cards = useCardStore((state) => state.cards);
  
  // Modal actions
  const { 
    openEditCard, 
    openViewDetail, 
    openShare 
  } = useModalStore();

  // Card handlers
  const { handleDeleteCard } = useCardHandlers({ onSuccess: onCloseModal });

  // Memoize active cards
  const activeCards = useMemo(
    () => cards.filter((c) => c.stackId === activeStackId), 
    [cards, activeStackId]
  );

  return (
    <AnimatePresence mode="wait">
      {activeStackId && (
        <motion.div
          key={activeStackId}
          className="fixed inset-0 z-40 pb-32"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <main className="max-w-7xl mx-auto px-4 py-8 h-full">
            <SwipeableCardDeck
              cards={activeCards}
              onEdit={openEditCard}
              onDelete={handleDeleteCard}
              onViewDetail={openViewDetail}
              onShare={openShare}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragEndWithPosition={onDragEndWithPosition}
              onDragPositionChange={onDragPositionChange}
            />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
