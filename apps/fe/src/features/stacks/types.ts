export interface Stack {
  id: string;
  name: string;
  cover: string;
  cardCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateStackForm {
  name: string;
  cover: string;
}
