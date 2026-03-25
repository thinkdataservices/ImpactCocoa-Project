import type { Card } from '@/features/cards/types';

interface CardDetailProps {
  card: Card;
}

export function CardDetail({ card }: CardDetailProps) {
  return (
    <div className="flex flex-col gap-4">
      <img
        src={card.cover}
        alt={card.name}
        className="w-full h-64 object-cover rounded-xl"
      />
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">{card.name}</h2>
        {card.description && (
          <p className="text-white/70 text-sm leading-relaxed">{card.description}</p>
        )}
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-white/50">
            Created: {new Date(card.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-white/50">
            Updated: {new Date(card.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

