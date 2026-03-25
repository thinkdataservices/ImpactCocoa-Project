export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  highlight?: '1' | '2' | '3' | '4' | '5' | '';
};

export function Button({ className = '', children, highlight = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center align-middle select-none px-4 py-2 text-white text-sm rounded-lg 
        font-sans font-medium text-center antialiased before:rounded-lg after:rounded-lg
        transition-all duration-300 
        border border-white/50
        bg-white/2.5 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.55),0_0_9px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)] 

        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:via-transparent before:to-transparent before:pointer-events-none before:transition-all before:duration-300 before:opacity-30 hover:before:opacity-100 

        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/50 after:via-transparent after:to-transparent after:pointer-events-none after:transition-all after:duration-300 after:opacity-10 hover:after:opacity-50

        ${highlightColors[highlight]}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const highlightColors = {
  '1': 'bg-gradient-to-br from-violet-500/40 to-fuchsia-600/40',
  '2': 'bg-gradient-to-br from-blue-500/40 to-cyan-600/40',
  '3': 'bg-gradient-to-br from-green-500/40 to-lime-600/40',
  '4': 'bg-gradient-to-br from-red-500/40 to-pink-600/40',
  '5': 'bg-gradient-to-br from-yellow-500/40 to-orange-600/40',
  '': '',
};
