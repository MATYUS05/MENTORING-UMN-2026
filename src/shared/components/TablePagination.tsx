// src/shared/components/TablePagination.tsx
import { nomorHalaman } from '../utils/pagination';

/** Mengikuti warna utama dashboard: Admin biru (secondary), Superadmin cokelat (primary). */
type PaginationAccent = 'secondary' | 'primary';

const KELAS_AKTIF: Record<PaginationAccent, string> = {
  secondary:
    'border-secondary-deep/40 bg-secondary-deep/15 text-secondary-deep dark:border-secondary-sky/40 dark:bg-secondary-sky/20 dark:text-secondary-sky',
  primary:
    'border-primary-dark/40 bg-primary-dark/15 text-primary-dark dark:border-primary-light/40 dark:bg-primary-light/20 dark:text-primary-light',
};

const TOMBOL_DASAR =
  'min-w-9 rounded-lg border-2 px-3 py-1.5 font-body text-sm transition-all duration-200';
const TOMBOL_NONAKTIF =
  'border-neutral-stone/40 text-neutral-stone hover:border-neutral-stone/60 hover:text-neutral-charcoal dark:border-neutral-stone/30 dark:hover:text-neutral-cream';

interface TablePaginationProps {
  halaman: number;
  perHalaman: number;
  /** Jumlah data setelah search/filter, bukan jumlah data mentah. */
  totalData: number;
  /** Satuan untuk teks keterangan, misalnya "kelompok". */
  satuan: string;
  accent?: PaginationAccent;
  onPindah: (halaman: number) => void;
}

/**
 * Navigasi halaman untuk tabel dashboard, lengkap dengan keterangan
 * "Menampilkan 1–10 dari 100 kelompok". Seluruh angka diturunkan dari
 * `halaman`, `perHalaman`, dan `totalData` supaya tidak bisa berbeda
 * dengan isi tabel yang sedang ditampilkan.
 */
export default function TablePagination({
  halaman,
  perHalaman,
  totalData,
  satuan,
  accent = 'secondary',
  onPindah,
}: TablePaginationProps) {
  const totalHalaman = Math.max(1, Math.ceil(totalData / perHalaman));
  const dari = totalData === 0 ? 0 : (halaman - 1) * perHalaman + 1;
  const sampai = Math.min(halaman * perHalaman, totalData);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="font-body text-sm text-neutral-stone">
        Menampilkan {dari}–{sampai} dari {totalData} {satuan}
      </p>

      {totalHalaman > 1 && (
        <nav
          aria-label={`Navigasi halaman ${satuan}`}
          className="flex flex-wrap items-center justify-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => onPindah(halaman - 1)}
            disabled={halaman === 1}
            className={`${TOMBOL_DASAR} ${TOMBOL_NONAKTIF} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-stone/40 disabled:hover:text-neutral-stone`}
          >
            ‹ Sebelumnya
          </button>

          {nomorHalaman(halaman, totalHalaman).map((n, i) =>
            n === 'jeda' ? (
              <span key={`jeda-${i}`} aria-hidden className="px-1 font-body text-sm text-neutral-stone">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPindah(n)}
                aria-current={n === halaman ? 'page' : undefined}
                className={`${TOMBOL_DASAR} ${
                  n === halaman ? `${KELAS_AKTIF[accent]} font-semibold` : TOMBOL_NONAKTIF
                }`}
              >
                {n}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPindah(halaman + 1)}
            disabled={halaman === totalHalaman}
            className={`${TOMBOL_DASAR} ${TOMBOL_NONAKTIF} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-stone/40 disabled:hover:text-neutral-stone`}
          >
            Berikutnya ›
          </button>
        </nav>
      )}
    </div>
  );
}
