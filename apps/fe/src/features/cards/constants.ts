/**
 * Constants for Cards feature
 * Centralized configuration for card deck animations and behavior
 */

// Card scaling
export const BASE_CARD_SCALE = 1;
export const MIN_DRAG_SCALE = 0.85;

// Swipe thresholds
export const SWIPE_THRESHOLD = 100;
export const SWIPE_VELOCITY_THRESHOLD = 400;
export const SWIPE_COMPLETE_PROGRESS = 0.5;

// Delete zone thresholds
export const DELETE_OFFSET_THRESHOLD = -180;
export const MAX_DELETE_HORIZONTAL_OFFSET = 120;

// Vertical drag settings
export const VERTICAL_DRAG_THRESHOLD = 50;
export const THUMBNAIL_SCALE = 0.3;
export const DIRECTION_LOCK_THRESHOLD = 10;

// Deck stack layout
export const DECK_OFFSET_X = 15;
export const DECK_OFFSET_Y = 0;
export const DECK_SCALE_STEP = 0.04;
export const DECK_ROTATE_STEP = 4;
export const MAX_VISIBLE_CARDS = 4;

// Animation durations (in seconds)
export const EXIT_ANIMATION_DURATION = 0.6;

// Motion transform ranges
export const ROTATION_INPUT_RANGE = [-200, 200];
export const ROTATION_OUTPUT_RANGE = [-25, 25];
export const OPACITY_INPUT_RANGE = [-200, -100, 0, 100, 200];
export const OPACITY_OUTPUT_RANGE = [0.5, 1, 1, 1, 0.5];

// Spring animation config
export const SPRING_CONFIG = {
  stiffness: 400,
  damping: 30,
};

// Z-index layers
export const Z_INDEX = {
  backgroundCard: 10,
  exitingCard: 5,
  currentCard: 20,
  currentCardSwiping: 15,
  nextCardRising: 25,
  thumbnail: 100,
  deleteZone: 50,
} as const;

// Opacity settings
export const BACKGROUND_CARD_OPACITY_STEP = 0.08;
export const GHOST_CARD_OPACITY = 0.3;

