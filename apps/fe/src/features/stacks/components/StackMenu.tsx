import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ThreeDotsSvg from '~/public/icons/three-dots.svg?react';

type StackMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export function StackMenu({ onEdit, onDelete }: StackMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      setPosition({ x: centerX, y: rect.top });
    }
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (callback?: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    callback?.();
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="absolute bottom-[10.5px] -right-[6.5px] p-0.5 rounded hover:bg-white/20 transition-colors"
        aria-label="Stack menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <ThreeDotsSvg className="w-[10px] h-[10px] text-white/90" aria-hidden="true" />
      </button>

      {isOpen && position && createPortal(
        <AnimatePresence>
          <motion.div
            role="menu"
            aria-label="Stack actions"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed w-28 z-[100]"
            style={{ left: position.x - 56, top: position.y - 80,  }}
          >
            {/* Glass Background - Light mode: light glass, Dark mode: dark glass */}
            <div className="absolute inset-0 bg-white/80 dark:bg-black/85 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.15),0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1px_0px_rgba(255,255,255,0.2),0_0_30px_rgba(0,0,0,0.5),0_10px_40px_rgba(0,0,0,0.4)]" />

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 dark:from-white/10 via-transparent to-transparent opacity-70 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tl from-gray-100/30 dark:from-white/5 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />

            {/* Menu Content */}
            <div className="relative p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleItemClick(onEdit)}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-white hover:bg-gray-100/80 dark:hover:bg-white/20 transition-colors font-medium rounded-xl"
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleItemClick(onDelete)}
                className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/25 transition-colors font-medium rounded-xl"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

