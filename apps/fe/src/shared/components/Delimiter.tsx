type DelimiterProps = {
  className?: string;
};

export function Delimiter({ className = '' }: DelimiterProps) {
  return <div className={`h-full bg-white/20 w-[1px] flex-shrink-0 ${className}`} />;
}
