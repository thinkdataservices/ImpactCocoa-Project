import type { Card } from '@/features/cards/types';
import { useState } from 'react';

interface ShareCardProps {
  card: Card;
}

export function ShareCard({ card }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://example.com/card/${card.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/70 text-sm">
        Share this card with others by copying the link below:
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
        />
        <button type="button" onClick={handleCopy} className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {copied && <p className="text-green-400 text-sm">Link copied to clipboard!</p>}
    </div>
  );
}
