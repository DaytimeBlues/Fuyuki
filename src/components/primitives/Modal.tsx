import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content animate-scale-in">
        <div className="modal-header">
          <h3 className="font-display text-lg text-text">{title}</h3>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
