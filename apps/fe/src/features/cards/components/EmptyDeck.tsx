import InboxSvg from '~/public/icons/inbox.svg?react';

export function EmptyDeck() {
  return (
    <div className="relative h-[600px] w-full max-w-sm mx-auto flex items-center justify-center text-gray-500">
      <div
        className={`
        flex flex-col items-center justify-center bg-black/20 backdrop-blur-lg border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] px-2 py-3 text-white relative rounded-xl before:rounded-xl after:rounded-xl 
        hover:bg-black/10 transition-all duration-300 
        
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none 
        
        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none
        
        w-[226px] h-[359px]
      `}
      >
        <InboxSvg className="w-20 h-20 mx-auto mb-4 opacity-60" />
        <p className="text-base font-bold mt-8">No cards in this stack</p>
      </div>
    </div>
  );
}
