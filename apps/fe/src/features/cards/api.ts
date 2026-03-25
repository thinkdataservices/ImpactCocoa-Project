import { client } from '@/open-api';
import type { components } from '@/open-api/generated/api';
import type { Card } from './types';

type ApiCard = components['schemas']['Card'];

function toNumberId(id: string): number {
  const num = Number(id);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid numeric id: ${id}`);
  }
  return num;
}

function mapCard(card: ApiCard): Card {
  const now = Date.now();
  const createdAt = card.createdAt ? Date.parse(card.createdAt) : now;
  return {
    id: card.id !== undefined ? String(card.id) : '',
    name: card.name ?? 'Untitled card',
    description: card.description ?? undefined,
    cover: card.cover ?? getPlaceholderImage(card.name ?? 'Card'),
    stackId: card.stackId !== undefined ? String(card.stackId) : '',
    createdAt,
    updatedAt: now,
  };
}

export const cardApi = {
  async fetchAll(): Promise<Card[]> {
    const res = await client['/api/cards'].GET();
    if (!res.response.ok || !res.data) {
      throw new Error('Failed to load cards');
    }
    return res.data.map(mapCard);
  },

  async create(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    const res = await client['/api/stacks/{stackId}/cards'].POST({
      params: { path: { stackId: toNumberId(card.stackId) } },
      body: {
        name: card.name,
        cover: card.cover,
        description: card.description || undefined,
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to create card');
    }

    return mapCard(res.data);
  },

  async update(id: string, updates: Partial<Card>): Promise<Card> {
    const res = await client['/api/cards/{id}'].PUT({
      params: { path: { id: toNumberId(id) } },
      body: {
        name: updates.name,
        cover: updates.cover,
        description: updates.description,
        stackId: updates.stackId ? toNumberId(updates.stackId) : undefined,
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to update card');
    }

    return mapCard(res.data);
  },

  async delete(id: string): Promise<void> {
    const res = await client['/api/cards/{id}'].DELETE({
      params: { path: { id: toNumberId(id) } },
    });

    if (!res.response.ok) {
      throw new Error('Failed to delete card');
    }
  },

  async move(cardId: string, targetStackId: string): Promise<void> {
    const res = await client['/api/cards/{id}/move'].PATCH({
      params: { path: { id: toNumberId(cardId) } },
      body: { stackId: toNumberId(targetStackId) },
    });

    if (!res.response.ok) {
      throw new Error('Failed to move card');
    }
  },
};

// Helper to get placeholder image
export const getPlaceholderImage = (text: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&size=400&background=random`;
};

