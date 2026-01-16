import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    // Destructive style overrides
    const isDestructive = variant === 'destructive';
    const confirmBtnClass = isDestructive
        ? 'bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
        : 'btn-primary-action'; // Use our new gold primary class

    return (
        <div className="modal-backdrop animate-fade-in" onClick={onCancel}>
            <div
                className="modal-content animate-scale-in border-l-4"
                style={{
                    borderColor: isDestructive ? 'var(--color-vermillion)' : 'var(--color-accent)',
                    maxWidth: '24rem'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        {isDestructive && <AlertTriangle size={20} className="text-red-500" />}
                        <h3 className={`font-display text-lg tracking-wide ${isDestructive ? 'text-red-400' : 'text-parchment-light'}`}>
                            {title}
                        </h3>
                    </div>
                    <button onClick={onCancel} className="modal-close">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <p className="text-parchment/90 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/10 flex gap-3 justify-end bg-black/20">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded text-sm text-muted hover:text-parchment hover:bg-white/5 transition-colors uppercase tracking-wider font-display"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 rounded font-display text-sm uppercase tracking-wider transition-all duration-200 ${confirmBtnClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
