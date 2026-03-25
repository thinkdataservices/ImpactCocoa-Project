import { motion } from 'framer-motion';
import TrashSvg from '~/public/icons/trash.svg?react';

interface DeleteZoneProps {
  isOverDeleteIcon: boolean;
}

export function DeleteZone({ isOverDeleteIcon }: DeleteZoneProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="absolute top-8 left-1/2 -translate-x-1/2 z-50"
      aria-label="Delete zone - drag card here to delete"
      aria-live="polite"
    >
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-red-400/50 blur-xl"
          animate={
            isOverDeleteIcon
              ? { scale: [1.1, 1.35, 1.1], opacity: [0.8, 1, 0.8] }
              : { scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }
          }
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Delete button */}
        <motion.div
          animate={
            isOverDeleteIcon
              ? { y: [0, -6, 0], scale: [1.1, 1.25, 1.1] }
              : { y: [0, -10, 0], scale: [1, 1.1, 1] }
          }
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, ease: 'easeInOut' }}
          className={`relative bg-red-500/80 text-white p-4 rounded-full backdrop-blur-xl shadow-[0_0_40px_rgba(248,113,113,0.7)] border ${
            isOverDeleteIcon
              ? 'border-white/80 ring-4 ring-white/70'
              : 'border-white/30 ring-2 ring-white/30'
          }`}
          aria-hidden="true"
        >
          <TrashSvg className="w-6 h-6" aria-hidden="true" />
        </motion.div>
        <span className="sr-only">
          {isOverDeleteIcon ? 'Release to delete card' : 'Drag card here to delete'}
        </span>
      </div>
    </motion.section>
  );
}
