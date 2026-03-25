import { useCallback } from 'react';
import { useStackStore } from '../store';

interface StackFormData {
  name: string;
  cover: string;
}

interface UseStackHandlersOptions {
  onSuccess?: () => void;
}

/**
 * Hook for managing stack operations with error handling
 */
export function useStackHandlers(options: UseStackHandlersOptions = {}) {
  const { onSuccess } = options;

  const stacks = useStackStore((state) => state.stacks);
  const activeStackId = useStackStore((state) => state.activeStackId);
  const createStack = useStackStore((state) => state.createStack);
  const updateStack = useStackStore((state) => state.updateStack);
  const deleteStack = useStackStore((state) => state.deleteStack);
  const setActiveStack = useStackStore((state) => state.setActiveStack);
  const getStackById = useStackStore((state) => state.getStackById);

  const handleCreateStack = useCallback(
    async (data: StackFormData) => {
      try {
        await createStack(data.name, data.cover);
        onSuccess?.();
      } catch (err) {
        console.error('Failed to create stack:', err);
      }
    },
    [createStack, onSuccess],
  );

  const handleUpdateStack = useCallback(
    async (stackId: string, data: StackFormData) => {
      try {
        await updateStack(stackId, { name: data.name, cover: data.cover });
        onSuccess?.();
      } catch (err) {
        console.error('Failed to update stack:', err);
      }
    },
    [updateStack, onSuccess],
  );

  const handleDeleteStack = useCallback(
    async (stackId: string) => {
      try {
        await deleteStack(stackId);
        onSuccess?.();
      } catch (err) {
        console.error('Failed to delete stack:', err);
      }
    },
    [deleteStack, onSuccess],
  );

  const handleStackSelect = useCallback(
    (stackId: string) => {
      setActiveStack(activeStackId === stackId ? null : stackId);
    },
    [activeStackId, setActiveStack],
  );

  const handleCollapse = useCallback(() => {
    setActiveStack(null);
  }, [setActiveStack]);

  return {
    stacks,
    activeStackId,
    getStackById,
    handleCreateStack,
    handleUpdateStack,
    handleDeleteStack,
    handleStackSelect,
    handleCollapse,
  };
}

export type { StackFormData };

