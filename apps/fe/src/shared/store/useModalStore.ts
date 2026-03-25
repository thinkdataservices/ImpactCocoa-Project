import { create } from 'zustand';
import { Card } from '@/features/cards/types';
import { Stack } from '@/features/stacks/types';
import { ModalType } from '../types';

interface ModalState {
  modalType: ModalType;
  editingCard: Card | null;
  viewingCard: Card | null;
  sharingCard: Card | null;
  editingStack: Stack | null;
  deletingStack: Stack | null;
  showCreateMenu: boolean;

  openCreateCard: () => void;
  openCreateStack: () => void;
  openEditCard: (card: Card) => void;
  openEditStack: (stack: Stack) => void;
  openDeleteStack: (stack: Stack) => void;
  openViewDetail: (card: Card) => void;
  openShare: (card: Card) => void;
  closeModal: () => void;
  openCreateMenu: () => void;
  closeCreateMenu: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  editingCard: null,
  viewingCard: null,
  sharingCard: null,
  editingStack: null,
  deletingStack: null,
  showCreateMenu: false,

  openCreateCard: () => set({ modalType: 'create-card' }),
  openCreateStack: () => set({ modalType: 'create-stack' }),
  openEditCard: (card) => set({ editingCard: card, modalType: 'edit-card' }),
  openEditStack: (stack) => set({ editingStack: stack, modalType: 'edit-stack' }),
  openDeleteStack: (stack) => set({ deletingStack: stack, modalType: 'delete-stack' }),
  openViewDetail: (card) => set({ viewingCard: card, modalType: 'view-detail' }),
  openShare: (card) => set({ sharingCard: card, modalType: 'share' }),
  
  closeModal: () => set({
    modalType: null,
    editingCard: null,
    viewingCard: null,
    sharingCard: null,
    editingStack: null,
    deletingStack: null,
  }),

  openCreateMenu: () => set({ showCreateMenu: true }),
  closeCreateMenu: () => set({ showCreateMenu: false }),
}));
