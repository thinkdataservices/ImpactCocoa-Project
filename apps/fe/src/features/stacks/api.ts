import { client } from '@/open-api';
import type { components } from '@/open-api/generated/api';
import type { Stack } from './types';

type ApiStack = components['schemas']['Stack'];
type ApiCover = components['schemas']['Cover'];

function toNumberId(id: string): number {
  const num = Number(id);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid numeric id: ${id}`);
  }
  return num;
}

function mapCover(cover?: ApiCover): string {
  console.log(cover)
  if (!cover) return getRandomColor();
  return cover.value ?? getRandomColor();
}

function mapStack(stack: ApiStack): Stack {
  const createdAt = stack.createdAt ? Date.parse(stack.createdAt) : Date.now();
  return {
    id: stack.id !== undefined ? String(stack.id) : '',
    name: stack.name ?? 'Untitled stack',
    cover: mapCover(stack.cover),
    cardCount: stack.cardCount ?? 0,
    createdAt,
    // Backend doesn't expose updatedAt; approximate with createdAt
    updatedAt: createdAt,
  };
}

export const stackApi = {
  async fetchAll(): Promise<Stack[]> {
    const res = await client['/api/stacks'].GET();
    if (!res.response.ok || !res.data) {
      throw new Error('Failed to load stacks');
    }
    return res.data.map(mapStack);
  },

  async create(name: string, cover: string): Promise<Stack> {
    const res = await client['/api/stacks'].POST({
      body: {
        name,
        cover: {
          type: 'gradient',
          value: cover,
        },
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to create stack');
    }

    return mapStack(res.data);
  },

  async update(id: string, updates: Partial<Stack>): Promise<Stack> {
    const body: { name?: string; cover?: ApiCover } = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.cover !== undefined) {
      body.cover = {
        type: 'gradient',
        value: updates.cover,
      };
    }

    const res = await client['/api/stacks/{id}'].PUT({
      params: { path: { id: toNumberId(id) } },
      body,
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to update stack');
    }

    return mapStack(res.data);
  },

  async delete(id: string): Promise<void> {
    const res = await client['/api/stacks/{id}'].DELETE({
      params: { path: { id: toNumberId(id) } },
    });

    if (!res.response.ok) {
      throw new Error('Failed to delete stack');
    }
  },
};

// Helper to get random color gradient
export function getRandomColor(): string {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
    'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

