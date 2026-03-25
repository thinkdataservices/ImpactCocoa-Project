import { motion } from 'framer-motion';
import { CardItem } from './CardItem';
import type { Card, VerticalDragState } from '../types';
import { THUMBNAIL_SCALE, Z_INDEX } from '../constants';

interface ThumbnailPreviewProps {
  card: Card;
  verticalDragMode: VerticalDragState;
}

export function ThumbnailPreview({ card, verticalDragMode }: ThumbnailPreviewProps) {
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: verticalDragMode.pointerX,
        top: verticalDragMode.pointerY,
        x: '-50%',
        y: '-50%',
        zIndex: Z_INDEX.thumbnail,
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: THUMBNAIL_SCALE, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
    </motion.div>
  );
}

