// src/shared/components/StatCard.tsx
import type { LucideIcon } from 'lucide-react';
import { font } from '../typography/font';
import { formatWaktuUpdate } from '../utils/waktu';

/** Mengikuti warna utama masing-masing dashboard: Admin biru, Superadmin cokelat. */
export type StatAccent = 'secondary' | 'primary';

const LINGKARAN_IKON: Record<StatAccent, string> = {
  secondary: 'bg-secondary-deep/10 text-secondary-deep dark:bg-secondary-sky/15 dark:text-secondary-sky',
  primary: 'bg-primary-dark/10 text-primary-dark dark:bg-primary-light/15 dark:text-primary-light',
};

const ISI_PROGRESS: Record<StatAccent, string> = {
  secondary: 'bg-secondary-deep dark:bg-secondary-sky',
  primary: 'bg-primary-dark dark:bg-primary-light',
};

const HOVER_KARTU: Record<StatAccent, string> = {
  secondary: 'hover:border-secondary-deep/60 dark:hover:border-secondary-sky/50',
  primary: 'hover:border-primary-dark/60 dark:hover:border-primary-light/50',
};

const KARTU_DASAR =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';

export interface StatCardProgress {
  current: number;
  max: number;
  satuan: string;
}

interface StatCardProps {
  label: string;
  value: number | null;
  icon: LucideIcon;
  accent: StatAccent;
  /** Hanya diisi untuk kartu yang punya batas kapasitas, misalnya Divisi. */
  progress?: StatCardProgress;
  /**
   * Waktu dari field `updatedAt` koleksi terkait.
   * - `Date`      → ditampilkan sebagai waktu update.
   * - `null`      → koleksi belum punya `updatedAt`, ditampilkan "Belum tersedia".
   * - tidak diisi → bagian Last Update tidak dirender sama sekali.
   */
  lastUpdate?: Date | null;
}

export default function StatCard({
  label,
  value,
  icon: Ikon,
  accent,
  progress,
  lastUpdate,
}: StatCardProps) {
  const tampilkanLastUpdate = lastUpdate !== undefined;
  const persen =
    progress && progress.max > 0
      ? Math.min(100, Math.max(0, (progress.current / progress.max) * 100))
      : 0;

  return (
    <div
      className={`${KARTU_DASAR} ${HOVER_KARTU[accent]} flex flex-col items-center justify-center p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${LINGKARAN_IKON[accent]}`}
      >
        <Ikon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <p className={`${font.h3} mt-3 text-neutral-charcoal dark:text-neutral-cream`}>
        {value ?? '...'}
      </p>
      <p className={`${font.caption} mt-1 font-medium text-neutral-stone`}>{label}</p>

      {progress && (
        <div className="mt-3 w-full">
          <div
            role="progressbar"
            aria-valuenow={progress.current}
            aria-valuemin={0}
            aria-valuemax={progress.max}
            aria-label={`Kapasitas ${progress.satuan}`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-stone/20 dark:bg-neutral-stone/25"
          >
            <div
              className={`h-full rounded-full ${ISI_PROGRESS[accent]} transition-[width] duration-500`}
              style={{ width: `${persen}%` }}
            />
          </div>
          <p className="mt-1.5 text-center font-body text-[11px] text-neutral-stone">
            {progress.current} / {progress.max} {progress.satuan}
          </p>
        </div>
      )}

      {tampilkanLastUpdate && (
        <div className="mt-4 w-full border-t border-neutral-stone/20 pt-3 text-center dark:border-neutral-stone/15">
          <p className="font-body text-[11px] font-medium text-neutral-stone/70">Last Update</p>
          <p className="font-body text-[11px] text-neutral-stone">
            {lastUpdate ? formatWaktuUpdate(lastUpdate) : 'Belum tersedia'}
          </p>
        </div>
      )}
    </div>
  );
}
