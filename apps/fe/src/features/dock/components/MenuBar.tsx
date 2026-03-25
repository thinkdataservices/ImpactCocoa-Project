type MenuBarProps = React.HTMLAttributes<HTMLDivElement>;

export function MenuBar({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<MenuBarProps>) {
  return (
    <nav
      className={`flex gap-2 bg-black/25 dark:bg-black/70 backdrop-blur-sm border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] text-white relative rounded-3xl before:rounded-3xl after:rounded-3xl
        hover:bg-black/20 dark:hover:bg-black/65 transition-all duration-300

        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none

        after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none

      ${className}`}
      {...props}
    >
      {children}
    </nav>
  );
}
