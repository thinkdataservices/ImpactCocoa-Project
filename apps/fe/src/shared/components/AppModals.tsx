import { CardForm, CardDetail, ShareCard } from '@/features/cards/components';
import { StackForm } from '@/features/stacks';
import { ConfirmModal } from './ConfirmModal';
import { Modal } from './Modal';
import { useModalStore } from '../store/useModalStore';
import { useStackHandlers } from '@/features/stacks';
import { useCardHandlers } from '@/features/cards';
import { useStackStore } from '@/features/stacks';

/**
 * Component that renders all application modals
 */
export function AppModals() {
  const {
    modalType,
    editingCard,
    viewingCard,
    sharingCard,
    editingStack,
    deletingStack,
    closeModal,
  } = useModalStore();

  const { handleCreateStack, handleUpdateStack, handleDeleteStack } = useStackHandlers({
    onSuccess: closeModal,
  });

  const { handleCreateCard, handleUpdateCard } = useCardHandlers({
    onSuccess: closeModal,
  });

  const stacks = useStackStore((state) => state.stacks);

  return (
    <>
      {/* Create Card Modal */}
      <Modal isOpen={modalType === 'create-card'} onClose={closeModal} title="Create Card">
        <CardForm stacks={stacks} onSubmit={handleCreateCard} onCancel={closeModal} />
      </Modal>

      {/* Edit Card Modal */}
      <Modal isOpen={modalType === 'edit-card'} onClose={closeModal} title="Edit Card">
        <CardForm
          card={editingCard || undefined}
          stacks={stacks}
          onSubmit={(data) => editingCard && handleUpdateCard(editingCard.id, data)}
          onCancel={closeModal}
        />
      </Modal>

      {/* Create Stack Modal */}
      <Modal isOpen={modalType === 'create-stack'} onClose={closeModal} title="Create Stack">
        <StackForm onSubmit={handleCreateStack} onCancel={closeModal} />
      </Modal>

      {/* Edit Stack Modal */}
      <Modal isOpen={modalType === 'edit-stack'} onClose={closeModal} title="Edit Stack">
        <StackForm
          stack={editingStack || undefined}
          onSubmit={(data) => editingStack && handleUpdateStack(editingStack.id, data)}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Stack Confirmation Modal */}
      <ConfirmModal
        isOpen={modalType === 'delete-stack'}
        onClose={closeModal}
        onConfirm={() => deletingStack && handleDeleteStack(deletingStack.id)}
        title="Delete Stack"
        message={`Are you sure you want to delete "${deletingStack?.name || 'this stack'}"? This will also delete all cards in this stack. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* View Detail Modal */}
      <Modal isOpen={modalType === 'view-detail'} onClose={closeModal} title="Card Details">
        {viewingCard && <CardDetail card={viewingCard} />}
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={modalType === 'share'} onClose={closeModal} title="Share Card">
        {sharingCard && <ShareCard card={sharingCard} />}
      </Modal>
    </>
  );
}

