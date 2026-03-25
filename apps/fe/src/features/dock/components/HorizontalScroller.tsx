import type React from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ChevronLeftSvg from '~/public/icons/chevron-left.svg?react';
import ChevronRightSvg from '~/public/icons/chevron-right.svg?react';

type HorizontalScrollerProps = React.PropsWithChildren;

type OverflowState = {
  isOverflow: boolean;
  isScrollLeft: boolean;
  isScrollRight: boolean;
};

function HorizontalScroller({ children }: HorizontalScrollerProps) {
  const stacksContainerRef = useRef<HTMLDivElement>(null);

  const [overflowState, setOverflowState] = useState<OverflowState>({
    isOverflow: false,
    isScrollLeft: false,
    isScrollRight: false,
  });

  const checkOverflow = useCallback(() => {
    if (!stacksContainerRef.current) return;
    const { scrollWidth, clientWidth, scrollLeft } = stacksContainerRef.current;
    setOverflowState({
      isOverflow: scrollWidth > clientWidth + 2, // navigate margin from buttons
      isScrollLeft: scrollLeft > 0,
      isScrollRight: scrollLeft < scrollWidth - clientWidth,
    });
  }, []);

  const checkOverflowDebounced = useDebouncedCallback(checkOverflow, 200, { leading: true });

  const handleScroll = useCallback(
    (toRight = true) => {
      const container = stacksContainerRef.current;
      if (!container) return;
      const offset = toRight ? container.clientWidth : -container.clientWidth;
      console.log('offset', offset);
      container.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
      setTimeout(() => {
        // wait for render completed
        checkOverflowDebounced();
      }, 300);
    },
    [checkOverflowDebounced],
  );

  const handleScrollDebounced = useDebouncedCallback(handleScroll, 200, { leading: true });

  useEffect(() => {
    const handleResize = () => {
      checkOverflowDebounced();
    };
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      checkOverflowDebounced();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkOverflowDebounced]);

  return (
    <>
      {/* Scroll Left Button */}
      {overflowState.isOverflow && (
        <button
          type="button"
          onClick={() => handleScrollDebounced(false)}
          className={`flex items-center justify-center w-8 h-12 transition-all self-start -ml-2 ${
            overflowState.isScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeftSvg className="w-4 h-4" />
        </button>
      )}

      {/* Stack Items Container */}
      <div
        ref={stacksContainerRef}
        className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide py-2 -my-2 px-2 -mx-2 min-w-[120px]"
        onScroll={() => checkOverflowDebounced()}
      >
        {children}
      </div>

      {/* Scroll Right Button */}
      {overflowState.isOverflow && (
        <button
          type="button"
          onClick={() => handleScrollDebounced()}
          className={`flex items-center justify-center w-8 h-12 transition-all self-start -mr-2 ${
            overflowState.isScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRightSvg className="w-4 h-4" />
        </button>
      )}
    </>
  );
}

export const MemoizedHorizontalScroller = memo(HorizontalScroller);
