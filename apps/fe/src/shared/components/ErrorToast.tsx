import { useAppStore } from '../store/useStore';

export function ErrorToast() {
  const error = useAppStore((state) => state.error);

  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed top-20 right-4 z-50 animate-slide-in"
    >
      <div className="relative px-6 py-3 rounded-2xl text-white backdrop-blur-xl border border-red-400/30 bg-red-500/20 shadow-[inset_0_1px_0px_rgba(255,255,255,0.2),0_0_20px_rgba(239,68,68,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-transparent to-transparent rounded-2xl pointer-events-none" />
        <span className="relative">{error}</span>
      </div>
    </div>
  );
}
