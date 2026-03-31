import { motion } from 'framer-motion';

const highlightColors: Record<string, string> = {
  '1': 'bg-violet-500/30 hover:bg-violet-500/40',
  '2': 'bg-blue-500/30 hover:bg-blue-500/40',
  '3': 'bg-green-500/30 hover:bg-green-500/40',
  '4': 'bg-red-500/30 hover:bg-red-500/40',
  '5': 'bg-yellow-500/30 hover:bg-yellow-500/40',
};

type StackProps = {
  name: React.ReactNode;
  cover?: React.ReactNode;
  cardCount?: number;
  active?: boolean;
  hovered?: boolean;
  highlight?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function StackItem({
  name,
  cover,
  cardCount = 0,
  highlight,
  active,
  hovered,
  className = '',
  ...props
}: StackProps) {
  return (
    <div
      className={`flex flex-col gap-1 relative items-center w-14 transition-all duration-300 ${active || hovered ? ' scale-[110%]' : ''} ${className}`}
      {...props}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white border border-white/20 transition-all ${active ? 'ring-1 ring-white' : ''} ${highlight ? highlightColors[highlight] || '' : 'bg-white/10'}`}>
        {cover || name}
      </div>
      <span className="text-[10px] text-white text-center w-full line-clamp-2 leading-tight h-[24px] flex items-start justify-center">
        {name}
      </span>
      {cardCount > 0 && (
        <div
          className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[9px] rounded-full min-w-[20px] h-4 px-1 flex items-center justify-center font-bold shadow-lg border-1 border-white/30"
          aria-label={`${cardCount} card${cardCount === 1 ? '' : 's'}`}
        >
          <span aria-hidden="true">{cardCount > 9 ? '9+' : cardCount}</span>
        </div>
      )}
     
      {hovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow:
              '0 0 20px 8px rgba(255, 255, 255, 0.4), 0 0 40px 16px rgba(255, 255, 255, 0.2)',
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
}
