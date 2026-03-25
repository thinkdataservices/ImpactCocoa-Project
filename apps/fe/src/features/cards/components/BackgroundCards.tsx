import { motion } from 'framer-motion';
import { CardItem } from './CardItem';
import type { Card, ExitingCardState } from '../types';
import {
  BASE_CARD_SCALE,
  BACKGROUND_CARD_OPACITY_STEP,
  DECK_OFFSET_X,
  DECK_OFFSET_Y,
  DECK_ROTATE_STEP,
  DECK_SCALE_STEP,
  MAX_VISIBLE_CARDS,
} from '../constants';

interface BackgroundCardsProps {
  cards: Card[];
  currentIndex: number;
  exitingCard: ExitingCardState | null;
  riseProgress: number;
  isOver50: boolean;
}

export function BackgroundCards({
  cards,
  currentIndex,
  exitingCard,
  riseProgress,
  isOver50,
}: BackgroundCardsProps) {
  const totalBackground = Math.min(MAX_VISIBLE_CARDS, cards.length - 1);
  if (totalBackground <= 0) return null;

  return (
    <>
      {Array.from({ length: totalBackground }, (_, i) => {
        const depth = totalBackground - i;
        const cardIndex = (currentIndex + depth) % cards.length;
        const card = cards[cardIndex];
        const isNextCard = depth === 1;

        // Skip rendering if this card is currently animating as exitingCard
        if (exitingCard && exitingCard.card.id === card.id) {
          return null;
        }

        // Default positions
        let translateX = depth * DECK_OFFSET_X;
        let translateY = depth * DECK_OFFSET_Y;
        let cardRotate = depth * DECK_ROTATE_STEP;
        let cardScale = BASE_CARD_SCALE - depth * DECK_SCALE_STEP;
        let cardOpacity = 1 - depth * BACKGROUND_CARD_OPACITY_STEP;

        // Next card rises up when swiping past 50%
        if (isNextCard && riseProgress > 0) {
          translateX = DECK_OFFSET_X * (1 - riseProgress);
          translateY = DECK_OFFSET_Y * (1 - riseProgress);
          cardRotate = DECK_ROTATE_STEP * (1 - riseProgress);
          cardScale = BASE_CARD_SCALE - DECK_SCALE_STEP + DECK_SCALE_STEP * riseProgress;
          cardOpacity = 1;
        }

        const cardZIndex = isNextCard && isOver50 ? 25 : 10 - depth;

        return (
          <motion.div
            key={card.id}
            className="absolute pointer-events-none"
            initial={false}
            animate={{
              x: translateX,
              y: translateY,
              rotate: cardRotate,
              scale: cardScale,
              opacity: cardOpacity,
            }}
            transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom center', zIndex: cardZIndex }}
          >
            <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
          </motion.div>
        );
      })}
    </>
  );
}

