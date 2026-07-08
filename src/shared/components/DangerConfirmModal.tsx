// src/shared/components/DangerConfirmModal.tsx
import { useState } from 'react';
import { font } from '../typography/font';
interface DangerConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
const buatKodeAcak = () => {
  const huruf = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let kode = '';
  for (let i = 0; i < 4; i++) kode += huruf[Math.floor(Math.random() * huruf.length)];
  return kode;
};
export default function DangerConfirmModal({
  title,
  description,
  confirmLabel = 'Hapus Semua',
  loading = false,
  onCancel,
  onConfirm,
}: DangerConfirmModalProps) {
  const [kode] = useState(buatKodeAcak);
  const [input, setInput] = useState('');
  const cocok = input.trim().toUpperCase() === kode;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md space-y-4 rounded-2xl border-2 border-accent-red/40 bg-white p-6 dark:border-accent-red/30 dark:bg-neutral-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`${font.h3} text-accent-red dark:text-accent-red-light`}>{title}</h3>
        <p className={`${font.body} text-neutral-stone`}>{description}</p>
        <div className="rounded-lg border-2 border-accent-red/30 bg-accent-red/10 px-4 py-3 dark:border-accent-red/25 dark:bg-accent-red/15">
          <p className={`${font.caption} text-neutral-stone`}>Ketik kode berikut untuk melanjutkan:</p>
          <p className="mt-1 select-none font-mono text-2xl font-bold tracking-[0.3em] text-accent-red dark:text-accent-red-light">
            {kode}
          </p>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4}
          placeholder="Masukkan 4 huruf"
          autoComplete="off"
          className="w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 text-center font-mono text-sm uppercase tracking-[0.3em] text-neutral-charcoal outline-none transition-colors focus:border-accent-red dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-accent-red-light"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 font-body text-sm text-neutral-stone transition-all duration-200 hover:underline hover:text-neutral-charcoal disabled:opacity-50 dark:hover:text-neutral-cream"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={!cocok || loading}
            className="rounded-lg bg-accent-red px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(176,44,32,0.45)] disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-accent-red-light dark:text-neutral-charcoal-deep"
          >
            {loading ? 'Menghapus...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}