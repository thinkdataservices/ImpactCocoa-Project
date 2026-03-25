import type { Stack } from '@/features/stacks/types';
import { Button } from '@/shared';
import { useState } from 'react';
import ImagePlaceholderSvg from '~/public/icons/image-placeholder.svg?react';
import { getPlaceholderImage } from '../api';
import type { Card } from '../types';

interface CardFormProps {
  card?: Card;
  stacks: Stack[];
  onSubmit: (data: { name: string; description: string; cover: string; stackId: string }) => void;
  onCancel: () => void;
}

const inputClassName = `w-full px-4 py-2.5 text-white text-sm bg-white/5 border border-white/20 backdrop-blur-sm rounded-xl
  shadow-[inset_0_1px_0px_rgba(255,255,255,0.1)] placeholder:text-white/40
  focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300`;

export function CardForm({ card, stacks, onSubmit, onCancel }: CardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [description, setDescription] = useState(card?.description || '');
  const [cover, setCover] = useState(card?.cover || '');
  const [stackId, setStackId] = useState(card?.stackId || stacks[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !stackId) return;

    const finalCover = cover || getPlaceholderImage(name);
    onSubmit({ name, description, cover: finalCover, stackId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cover Preview */}
      <div className="space-y-2">
        <label htmlFor="card-cover" className="block text-sm font-medium text-white/80">
          Cover Image
        </label>
        <div
          className="relative h-48 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-[inset_0_1px_0px_rgba(255,255,255,0.1)]"
          role="img"
          aria-label="Cover image preview"
        >
          {cover || name ? (
            <img
              src={cover || getPlaceholderImage(name)}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white/30"
              aria-hidden="true"
            >
              <ImagePlaceholderSvg className="w-16 h-16" />
            </div>
          )}
        </div>
        <input
          id="card-cover"
          type="url"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          placeholder="Enter image URL (optional - will auto-generate if empty)"
          aria-describedby="cover-hint"
          className={inputClassName}
        />
        <span id="cover-hint" className="sr-only">
          Leave empty to auto-generate an image
        </span>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="card-name" className="block text-sm font-medium text-white/80">
          Name *
        </label>
        <input
          id="card-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter card name"
          required
          aria-required="true"
          className={inputClassName}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="card-description" className="block text-sm font-medium text-white/80">
          Description
        </label>
        <textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          rows={3}
          className={`${inputClassName} resize-none`}
        />
      </div>

      {/* Stack Selector */}
      <div className="space-y-2">
        <label htmlFor="card-stack" className="block text-sm font-medium text-white/80">
          Stack *
        </label>
        <select
          id="card-stack"
          value={stackId}
          onChange={(e) => setStackId(e.target.value)}
          required
          aria-required="true"
          className={inputClassName}
        >
          {stacks.map((stack) => (
            <option key={stack.id} value={stack.id} className="bg-slate-800">
              {stack.name} ({stack.cardCount} cards)
            </option>
          ))}
        </select>
      </div>

      {/* Actions - Sticky at bottom */}
      <div className="flex gap-3 pt-4 sticky bottom-0 -mx-6 px-6 -mb-6 pb-6">
        <Button type="button" onClick={onCancel} className="flex-1 py-3">
          Cancel
        </Button>
        <Button type="submit" highlight="1" className="flex-1 py-3">
          {card ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
