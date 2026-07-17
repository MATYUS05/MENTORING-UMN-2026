// src/shared/components/ConfirmModal.tsx
import { font } from '../typography/font';

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel = 'Hapus',
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 backdrop-blur-sm dark:bg-black/70 transition-all"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md space-y-4 rounded-2xl border-2 border-accent-red/40 bg-white p-6 shadow-lg dark:border-accent-red/30 dark:bg-neutral-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`${font.h3} text-accent-red dark:text-accent-red-light`}>{title}</h3>
        <p className={`${font.body} text-neutral-stone`}>{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 font-body text-sm font-medium text-neutral-stone transition-all duration-200 hover:text-neutral-charcoal disabled:opacity-50 dark:hover:text-neutral-cream"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-accent-red px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(176,44,32,0.45)] disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-accent-red-light dark:text-neutral-charcoal-deep"
          >
            {loading ? 'Menghapus...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
