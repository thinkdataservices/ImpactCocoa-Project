import { RoundButton } from '@/shared/components/RoundButton';
import { useEffect, useRef, useState } from 'react';
import ThreeDotsSvg from '~/public/icons/three-dots.svg?react';
import type { Card } from '../types';

interface CardItemProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail?: () => void;
  onShare?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function CardItem({
  card,
  onEdit,
  onDelete,
  onViewDetail,
  onShare,
  style,
  className = '',
}: CardItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    action();
  };

  return (
    <div
      className={`
        flex flex-col bg-black/20 backdrop-blur-lg border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] p-2 text-white relative rounded-2xl before:rounded-2xl after:rounded-2xl
        hover:bg-black/10 transition-all duration-300 w-[226px] h-[359px] will-change-transform select-none

        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none

        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none
      ${className}`}
      style={style}
    >
      <div className="w-full h-[250px] rounded-xl rounded-b-none bg-white flex items-center justify-center border-b border-gray-100/75">
        <img
          src={card.cover}
          alt={card.name}
          className=" pointer-events-none select-none object-scale-down"
          draggable={false}
        />
      </div>

      <div className="flex flex-col gap-1 p-3 bg-white rounded-xl rounded-t-none flex-1 pointer-events-none">
        <div className="flex gap-2 items-center">
          <h3 className="text-base font-bold text-gray-900 flex-1 truncate">{card.name}</h3>
          <div className="relative pointer-events-auto" ref={menuRef}>
            <RoundButton
              className="flex-shrink-0"
              onClick={handleMenuClick}
              aria-label="Card options menu"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <ThreeDotsSvg className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </RoundButton>
            {isMenuOpen && (
              <div
                role="menu"
                aria-label="Card actions"
                className="absolute right-0 top-full mt-1 w-36 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleMenuItemClick(onViewDetail || (() => {}))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  View Detail
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleMenuItemClick(onEdit)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleMenuItemClick(onShare || (() => {}))}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
        {card.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{card.description}</p>
        )}
      </div>
    </div>
  );
}
