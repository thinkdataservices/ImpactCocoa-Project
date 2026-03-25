import { Button } from './Buttons';
import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-white/80 text-sm">{message}</p>
        <div className="flex gap-3">
          <Button type="button" onClick={onClose} className="flex-1 py-3">
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            highlight={variant === 'danger' ? undefined : '1'}
            className={`flex-1 py-3 ${variant === 'danger' ? 'bg-red-500/30 hover:bg-red-500/50 border-red-400/50' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

