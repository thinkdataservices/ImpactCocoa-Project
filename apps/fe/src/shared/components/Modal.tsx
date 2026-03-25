import { RoundButton, useKeyPressed } from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import CloseSvg from '~/public/icons/close.svg?react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useKeyPressed('Escape', () => {
    if (isOpen) {
      onClose();
    }
  });

  useEffect(() => {
    // Prevent background scroll
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <dialog
          open
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 w-screen h-screen bg-transparent"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal with Liquid Glass Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative max-w-lg w-full max-h-[90vh] flex flex-col rounded-3xl"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_30px_rgba(0,0,0,0.3),0_10px_40px_rgba(0,0,0,0.25)]" />

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-70 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />

            {/* Content Container */}
            <div className="relative flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-white/20">
                <h2 id="modal-title" className="text-2xl font-bold text-white drop-shadow-sm">
                  {title}
                </h2>
                <RoundButton onClick={onClose} aria-label="Close modal">
                  <CloseSvg className="w-4 h-4" aria-hidden="true" />
                </RoundButton>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>

              {/* Footer - Fixed */}
              {footer && (
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/20">{footer}</div>
              )}
            </div>
          </motion.div>
        </dialog>
      )}
    </AnimatePresence>
  );
}
