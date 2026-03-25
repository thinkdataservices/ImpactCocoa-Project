export interface Card {
  id: string;
  name: string;
  description?: string;
  cover: string;
  stackId: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateCardForm {
  name: string;
  description: string;
  cover: string;
  stackId: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface SwipeableCardDeckProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onViewDetail?: (card: Card) => void;
  onShare?: (card: Card) => void;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onDragEndWithPosition?: (cardId: string, position: Position) => void;
  onDragPositionChange?: (position: Position | null) => void;
}

export interface ExitingCardState {
  card: Card;
  startX: number;
  startY: number;
  startRotate: number;
  startScale: number;
}

export interface VerticalDragState {
  active: boolean;
  pointerX: number;
  pointerY: number;
}

export type DragDirection = 'horizontal' | 'vertical' | null;
