import { StackItem } from '@/features/stacks/components/StackItem';
import { useAppStore } from '@/shared/store/useStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import LogoSvg from '~/public/icons/logo.svg?react';
import StarSvg from '~/public/icons/star.svg?react';

export const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { switchTheme } = useAppStore();

  return (
    <div
      className="border-r border-white/15 pe-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StackItem
        onClick={() => switchTheme()}
        name={<LogoSvg className="w-12" aria-label="Plugilo logo" />}
        cover={
          <motion.div
            animate={
              isHovered
                ? {
                    y: [0, -8, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'loop',
                      duration: 0.8,
                      ease: 'easeInOut',
                    },
                  }
                : { y: 0 }
            }
            className="text-white dark:text-black"
          >
            <StarSvg className="w-4 h-4" aria-hidden="true" />
          </motion.div>
        }
        aria-label="Plugilo home"
      />
    </div>
  );
};
