import CardCreateSvg from '~/public/icons/card-create.svg?react';
import StackCreateSvg from '~/public/icons/stack-create.svg?react';
import { highlightColors } from './Buttons';
import { Modal } from './Modal';
import { useModalStore } from '../store/useModalStore';

function IconBox({
  highlight,
  children,
}: {
  highlight: keyof typeof highlightColors;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`
        inline-flex items-center justify-center align-middle select-none w-12 h-12 text-white text-sm rounded-lg 
        font-sans font-medium text-center antialiased before:rounded-lg after:rounded-lg
        transition-all duration-300 relative
        border border-white/50
        bg-white/2.5 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.55),0_0_9px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)] 
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:via-transparent before:to-transparent before:pointer-events-none before:opacity-30
        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/50 after:via-transparent after:to-transparent after:pointer-events-none after:opacity-10
        ${highlightColors[highlight]}
      `}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export function CreateMenu() {
  const { showCreateMenu, closeCreateMenu, openCreateCard, openCreateStack } = useModalStore();
  
  return (
    <Modal isOpen={showCreateMenu} onClose={closeCreateMenu} title="Create New">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            closeCreateMenu();
            openCreateCard();
          }}
          aria-label="Create a new card - Add a new item to your collection"
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(139,92,246,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <IconBox highlight="1">
              <CardCreateSvg className="w-6 h-6 text-white" aria-hidden="true" />
            </IconBox>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                Create Card
              </h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                Add a new item to your collection
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            closeCreateMenu();
            openCreateStack();
          }}
          aria-label="Create a new stack - Organize cards into a new collection"
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(236,72,153,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <IconBox highlight="4">
              <StackCreateSvg className="w-6 h-6 text-white" aria-hidden="true" />
            </IconBox>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                Create Stack
              </h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                Organize cards into a new collection
              </p>
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
}
