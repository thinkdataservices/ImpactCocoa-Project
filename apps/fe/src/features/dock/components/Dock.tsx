import { StackItem, StackMenu } from '@/features/stacks/components';
import { Button, RoundButton } from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import CollapseSvg from '~/public/icons/collapse.svg?react';
import MagnifierSvg from '~/public/icons/magnifier.svg?react';
import PlusSvg from '~/public/icons/plus.svg?react';
import { CollapsedDock } from './CollapsedDock';
import { MemoizedHorizontalScroller } from './HorizontalScroller';
import { Logo } from './Logo';
import { MenuBar } from './MenuBar';
import { StackSearch } from './StackSearch';
import { useStackStore, useStackHandlers } from '@/features/stacks';
import { useModalStore } from '@/shared/store/useModalStore';

// Highlight colors to cycle through for stacks
const HIGHLIGHT_COLORS: Array<'1' | '2' | '3' | '4' | '5'> = ['1', '2', '3', '4', '5'];

type DockProps = {
  isDraggingCard: boolean;
  hoveredStackId?: string | null;
  onStackDrop?: (stackId: string) => void;
};

export function Dock({
  isDraggingCard,
  hoveredStackId,
  onStackDrop,
}: DockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stacks = useStackStore((state) => state.stacks);
  const activeStackId = useStackStore((state) => state.activeStackId);
  const getStackById = useStackStore((state) => state.getStackById);
  const { handleStackSelect, handleCollapse } = useStackHandlers();
  const { openCreateMenu, openEditStack, openDeleteStack } = useModalStore();

  const activeStackIdSafe = activeStackId || null;

  const visibleStacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stacks;
    return stacks.filter((stack) => stack.name.toLowerCase().includes(query));
  }, [stacks, searchQuery]);

  const handleStackDragOver = (event: React.DragEvent<HTMLElement>) => {
    if (isDraggingCard) {
      event.preventDefault();
    }
  };

  const handleStackDrop = (event: React.DragEvent<HTMLElement>, stackId: string) => {
    event.preventDefault();
    if (isDraggingCard && onStackDrop) {
      onStackDrop(stackId);
    }
  };

  const onStackEdit = (stackId: string) => {
    const stack = getStackById(stackId);
    if (stack) openEditStack(stack);
  };

  const onStackDelete = (stackId: string) => {
    const stack = getStackById(stackId);
    if (stack) openDeleteStack(stack);
  };

  useHotkeys('ctrl+f', () => {
    console.log('ctrl+f');
    setIsSearchOpen(true);
  });

  return (
    <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center pointer-events-none min-w-[360px]">
      <AnimatePresence initial={false} mode="wait">
        {isCollapsed ? (
          <CollapsedDock expandDock={() => setIsCollapsed(false)} stacksCount={stacks.length} />
        ) : (
          <motion.div
            key="expanded"
            className="flex flex-col items-center gap-3 pointer-events-auto w-fit px-2 max-w-full"
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Search / filter bar */}
            <StackSearch
              isOpen={isSearchOpen}
              query={searchQuery}
              onQueryChange={(value) => setSearchQuery(value)}
              setCloseSearch={() => setIsSearchOpen(false)}
            />

            {/* Dock Container with MenuBar */}
            <MenuBar className="p-3 pe-1 items-end w-full" aria-label="Main navigation dock">
              <Logo />
              <MemoizedHorizontalScroller>
                {visibleStacks.map((stack, index) => {
                  const isActive = activeStackIdSafe === stack.id;
                  const isHovered = hoveredStackId === stack.id;
                  const highlight = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];

                  return (
                    <motion.div
                      key={stack.id}
                      data-stack-id={stack.id}
                      onClick={(e) => {
                        const element = e.target as HTMLElement;
                        element.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                          inline: 'center',
                        });
                        handleStackSelect(stack.id);
                      }}
                      onDragOver={handleStackDragOver}
                      onDrop={(e) => handleStackDrop(e, stack.id)}
                      className="cursor-pointer relative flex-shrink-0 bg-transparent border-none p-0"
                      aria-label={`${stack.name} stack${stack.cardCount ? `, ${stack.cardCount} card${stack.cardCount === 1 ? '' : 's'}` : ''}${isActive ? ', selected' : ''}`}
                      aria-pressed={isActive}
                    >
                      <StackItem
                        name={stack.name}
                        cover={
                          <span className="text-lg font-bold" aria-hidden="true">
                            {stack.name.charAt(0).toUpperCase()}
                          </span>
                        }
                        cardCount={stack.cardCount}
                        highlight={highlight}
                        active={isActive}
                        hovered={isHovered}
                      />
                      <StackMenu
                        onEdit={() => onStackEdit(stack.id)}
                        onDelete={() => onStackDelete(stack.id)}
                      />
                    </motion.div>
                  );
                })}
              </MemoizedHorizontalScroller>

              {/* Create Button - wrapped to align with stacks */}
              <div className="flex flex-col gap-1 items-center w-14 border-l border-white/15 ps-2 ms-auto">
                <Button
                  className="w-12 h-12"
                  highlight="1"
                  onClick={openCreateMenu}
                  aria-label="Create new card or stack"
                >
                  <motion.div whileHover={{ rotate: 90, scale: 1.2 }}>
                    <PlusSvg className="w-6 h-6" aria-hidden="true" />
                  </motion.div>
                </Button>
                <span className="h-[24px]" aria-hidden="true" />
              </div>

              {/* Action Buttons */}
              <div className="items-end flex gap-1 self-start flex-col">
                <RoundButton
                  onClick={() => {
                    setIsSearchOpen((previous) => {
                      const next = !previous;
                      return next;
                    });
                  }}
                  aria-label="Search"
                >
                  <MagnifierSvg className="w-3 h-3" />
                </RoundButton>
                <RoundButton
                  onClick={() => {
                    setIsCollapsed(true);
                    handleCollapse();
                  }}
                  aria-label="Minimize dock"
                >
                  <CollapseSvg className="w-3 h-3" />
                </RoundButton>
              </div>
            </MenuBar>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
