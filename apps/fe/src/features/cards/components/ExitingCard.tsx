import { motion } from 'framer-motion';
import { CardItem } from './CardItem';
import type { ExitingCardState } from '../types';
import {
  BASE_CARD_SCALE,
  BACKGROUND_CARD_OPACITY_STEP,
  DECK_OFFSET_X,
  DECK_OFFSET_Y,
  DECK_ROTATE_STEP,
  DECK_SCALE_STEP,
  EXIT_ANIMATION_DURATION,
  MAX_VISIBLE_CARDS,
  Z_INDEX,
} from '../constants';

interface ExitingCardProps {
  exitingCard: ExitingCardState;
  totalCards: number;
  onAnimationComplete: () => void;
}

export function ExitingCard({ exitingCard, totalCards, onAnimationComplete }: ExitingCardProps) {
  // Calculate the exact depth where this card will end up
  const totalBackground = Math.min(MAX_VISIBLE_CARDS, totalCards - 1);
  const targetDepth = totalBackground;
  const targetX = targetDepth * DECK_OFFSET_X;
  const targetY = targetDepth * DECK_OFFSET_Y;
  const targetRotate = targetDepth * DECK_ROTATE_STEP;
  const targetScale = BASE_CARD_SCALE - targetDepth * DECK_SCALE_STEP;
  const targetOpacity = 1 - targetDepth * BACKGROUND_CARD_OPACITY_STEP;

  return (
    <motion.div
      key={`exiting-${exitingCard.card.id}`}
      className="absolute pointer-events-none"
      initial={{
        x: exitingCard.startX,
        y: exitingCard.startY,
        rotate: exitingCard.startRotate,
        scale: exitingCard.startScale,
        opacity: 1,
      }}
      animate={{
        x: targetX,
        y: targetY,
        rotate: targetRotate,
        scale: targetScale,
        opacity: targetOpacity,
      }}
      transition={{
        duration: EXIT_ANIMATION_DURATION,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onAnimationComplete}
      style={{ transformOrigin: 'bottom center', zIndex: Z_INDEX.exitingCard }}
    >
      <CardItem card={exitingCard.card} onEdit={() => {}} onDelete={() => {}} />
    </motion.div>
  );
}

