import { CardItem } from './CardItem';
import type { Card } from '../types';
import { GHOST_CARD_OPACITY } from '../constants';

interface GhostCardProps {
  card: Card;
}

/**
 * Semi-transparent ghost card shown at original position during vertical drag
 */
export function GhostCard({ card }: GhostCardProps) {
  return (
    <div className="absolute" style={{ opacity: GHOST_CARD_OPACITY }}>
      <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

