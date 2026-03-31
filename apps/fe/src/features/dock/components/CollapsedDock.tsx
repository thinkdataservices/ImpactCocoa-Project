import { motion } from 'framer-motion';
import ExpandSvg from '~/public/icons/expand.svg?react';
import LogoSvg from '~/public/icons/logo.svg?react';
import { MenuBar } from './MenuBar';

type CollapsedDockProps = {
  expandDock: () => void;
  stacksCount: number;
};

export const CollapsedDock = ({ expandDock, stacksCount }: CollapsedDockProps) => {
  const label = `${stacksCount} stack${stacksCount === 1 ? '' : 's'}`;

  return (
    <motion.div
      key="collapsed"
      className="pointer-events-auto"
      initial={{ opacity: 0, y: 24, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.85 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <MenuBar className="w-60 h-10 py-2 ps-3 items-center cursor-pointer" onClick={expandDock}>
        <LogoSvg className="w-14 drop-shadow-[0_6px_18px_rgba(15,23,42,0.9)]" />
        <div className="w-px bg-white/20 h-[50%]" />
        <span className="text-left text-xs text-slate-100/80 truncate">{label}</span>

        <button type="button" className="ms-auto flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" aria-label="Expand dock">
          <ExpandSvg className="w-3 h-3" />
        </button>
      </MenuBar>
    </motion.div>
  );
};
