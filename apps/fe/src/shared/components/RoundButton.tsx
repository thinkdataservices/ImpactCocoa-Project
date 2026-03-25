import { type ButtonProps, highlightColors } from './Buttons';

export function RoundButton({ className = '', children, highlight = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center align-middle select-none text-white w-8 h-8 text-sm 
        font-sans font-medium text-center antialiased rounded-full before:rounded-full after:rounded-full
        transition-all duration-300 relative hover:bg-white/10 hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),0_0_9px_rgba(0,0,0,0.07),0_3px_8px_rgba(0,0,0,0.05)] 

        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:via-transparent before:to-transparent before:pointer-events-none before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-50
        
        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/50 after:via-transparent after:to-transparent after:pointer-events-none after:transition-all after:duration-300 after:opacity-0 hover:after:opacity-50
        
        ${highlightColors[highlight]}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
