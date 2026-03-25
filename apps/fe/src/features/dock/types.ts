import type { Stack } from '@/features/stacks/types';

export type DockProps = {
  stacks: Stack[];
  activeStackId: string | null;
  onStackSelect: (stackId: string) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  isDraggingCard: boolean;
  hoveredStackId?: string | null;
  onStackDrop?: (stackId: string) => void;
  onCollapse?: () => void;
  onStackEdit?: (stackId: string) => void;
  onStackDelete?: (stackId: string) => void;
};
