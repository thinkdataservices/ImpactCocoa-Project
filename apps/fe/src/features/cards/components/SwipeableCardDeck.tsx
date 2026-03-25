import { type PanInfo, animate, motion } from 'framer-motion';
import { CardItem } from './CardItem';
import { BackgroundCards } from './BackgroundCards';
import { DeleteZone } from './DeleteZone';
import { EmptyDeck } from './EmptyDeck';
import { ExitingCard } from './ExitingCard';
import { GhostCard } from './GhostCard';
import { ThumbnailPreview } from './ThumbnailPreview';
import {
  DELETE_OFFSET_THRESHOLD,
  DIRECTION_LOCK_THRESHOLD,
  MAX_DELETE_HORIZONTAL_OFFSET,
  MIN_DRAG_SCALE,
  SPRING_CONFIG,
  SWIPE_COMPLETE_PROGRESS,
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY_THRESHOLD,
  VERTICAL_DRAG_THRESHOLD,
  Z_INDEX,
} from '../constants';
import { useCardMotion, useSwipeState } from '../hooks';
import type { SwipeableCardDeckProps } from '../types';

export function SwipeableCardDeck({
  cards,
  onEdit,
  onDelete,
  onViewDetail,
  onShare,
  onDragStart,
  onDragEnd,
  onDragEndWithPosition,
  onDragPositionChange,
}: SwipeableCardDeckProps) {
  const {
    currentIndex,
    advanceToNextCard,
    resetToFirstIfNeeded,
    showDeleteZone,
    setShowDeleteZone,
    isOverDeleteIcon,
    setIsOverDeleteIcon,
    swipeProgress,
    setSwipeProgress,
    exitingCard,
    setExitingCard,
    verticalDragMode,
    setVerticalDragMode,
    resetSwipeState,
    resetVerticalDragMode,
  } = useSwipeState();

  const currentCard = cards[currentIndex];

  const { x, y, rotate, opacity, scale, dragDirectionRef, resetMotionValues, resetDragDirection } =
    useCardMotion(currentCard?.id);

  const resetAll = () => {
    resetSwipeState();
    resetDragDirection();
  };

  // Handle drag start - reset direction lock
  const handleDragStart = () => {
    resetDragDirection();
  };

  // Handle drag movement
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, point } = info;

    // Determine drag direction ONCE at the start
    if (dragDirectionRef.current === null) {
      const absX = Math.abs(offset.x);
      const absY = Math.abs(offset.y);

      if (absX > DIRECTION_LOCK_THRESHOLD || absY > DIRECTION_LOCK_THRESHOLD) {
        dragDirectionRef.current = absY > absX ? 'vertical' : 'horizontal';
      }
    }

    if (dragDirectionRef.current === null) return;

    // VERTICAL DRAG MODE
    if (dragDirectionRef.current === 'vertical') {
      setVerticalDragMode({ active: true, pointerX: point.x, pointerY: point.y });
      onDragPositionChange?.({ x: point.x, y: point.y });

      if (offset.y < -VERTICAL_DRAG_THRESHOLD) {
        setShowDeleteZone(true);
        if (currentCard) onDragStart(currentCard.id);

        const isOver =
          offset.y < DELETE_OFFSET_THRESHOLD &&
          Math.abs(offset.x) < MAX_DELETE_HORIZONTAL_OFFSET;
        setIsOverDeleteIcon(isOver);
      } else if (offset.y > VERTICAL_DRAG_THRESHOLD) {
        if (currentCard) onDragStart(currentCard.id);
        setShowDeleteZone(false);
        setIsOverDeleteIcon(false);
      } else {
        setShowDeleteZone(false);
        setIsOverDeleteIcon(false);
      }
    }
    // HORIZONTAL SWIPE MODE
    else {
      onDragPositionChange?.(null);
      const progress = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);
      setSwipeProgress(progress);
    }
  };

  // Handle drag end
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity, point } = info;

    // Handle vertical drag mode ending
    if (dragDirectionRef.current === 'vertical') {
      const isDeleteAttempt = showDeleteZone && isOverDeleteIcon;

      if (isDeleteAttempt && currentCard) {
        onDelete(currentCard.id);
        resetToFirstIfNeeded(cards.length);
      } else if (offset.y > VERTICAL_DRAG_THRESHOLD && currentCard && onDragEndWithPosition) {
        onDragEndWithPosition(currentCard.id, { x: point.x, y: point.y });
      }

      resetVerticalDragMode();
      resetAll();
      resetMotionValues();
      onDragEnd();
      return;
    }

    // Check for swipe completion
    const shouldSwipe =
      swipeProgress >= SWIPE_COMPLETE_PROGRESS || Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD;

    if (shouldSwipe && currentCard) {
      if (cards.length > 1) {
        // Calculate current scale based on drag distance
        const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
        const scaleRange = 1 - MIN_DRAG_SCALE;
        const progress = Math.min(distance / 150, 1);
        const currentScale = 1 - progress * scaleRange;
        const currentRotation = (offset.x / 200) * 25;

        setExitingCard({
          card: currentCard,
          startX: offset.x,
          startY: offset.y,
          startRotate: currentRotation,
          startScale: currentScale,
        });

        advanceToNextCard(cards.length);
        resetAll();
        resetMotionValues();
        onDragEnd();
        return;
      }

      // Single card - animate back
      animate(x, 0, { type: 'spring', ...SPRING_CONFIG });
      animate(y, 0, { type: 'spring', ...SPRING_CONFIG });
      resetAll();
      onDragEnd();
      return;
    }

    // Return to original position
    animate(x, 0, { type: 'spring', ...SPRING_CONFIG });
    animate(y, 0, { type: 'spring', ...SPRING_CONFIG });
    resetAll();
    onDragEnd();
  };

  // Early return for empty deck
  if (!currentCard) {
    return <EmptyDeck />;
  }

  const isOver50 = swipeProgress > SWIPE_COMPLETE_PROGRESS;
  const riseProgress = isOver50 ? (swipeProgress - SWIPE_COMPLETE_PROGRESS) * 2 : 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Delete Zone */}
      {showDeleteZone && <DeleteZone isOverDeleteIcon={isOverDeleteIcon} />}

      {/* Card Deck */}
      <div className="relative h-[600px] w-full max-w-sm mx-auto flex items-center justify-center">
        <BackgroundCards
          cards={cards}
          currentIndex={currentIndex}
          exitingCard={exitingCard}
          riseProgress={riseProgress}
          isOver50={isOver50}
        />

        {/* Exiting card animation */}
        {exitingCard && (
          <ExitingCard
            exitingCard={exitingCard}
            totalCards={cards.length}
            onAnimationComplete={() => setExitingCard(null)}
          />
        )}

        {/* Ghost card during vertical drag */}
        {verticalDragMode.active && <GhostCard card={currentCard} />}

        {/* Current draggable card */}
        <motion.div
          key={currentCard.id}
          className="absolute cursor-grab active:cursor-grabbing touch-none"
          style={{
            x,
            y,
            rotate,
            opacity: verticalDragMode.active ? 0 : opacity,
            scale,
            transformOrigin: 'center center',
            zIndex: isOver50 ? Z_INDEX.currentCardSwiping : Z_INDEX.currentCard,
          }}
          drag
          dragElastic={0.8}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
          initial={false}
        >
          <CardItem
            card={currentCard}
            onEdit={() => onEdit(currentCard)}
            onDelete={() => onDelete(currentCard.id)}
            onViewDetail={onViewDetail ? () => onViewDetail(currentCard) : undefined}
            onShare={onShare ? () => onShare(currentCard) : undefined}
          />
        </motion.div>
      </div>

      {/* Thumbnail during vertical drag */}
      {verticalDragMode.active && currentCard && (
        <ThumbnailPreview card={currentCard} verticalDragMode={verticalDragMode} />
      )}
    </div>
  );
}

