// src/featured/teams/components/Pagination.tsx

type Props = {
  halaman: number;
  totalHalaman: number;
  onPindah: (halaman: number) => void;
};

/** Nomor halaman di sekitar halaman aktif, dengan '...' bila terpotong. */
function daftarNomor(halaman: number, totalHalaman: number): (number | 'jeda')[] {
  if (totalHalaman <= 7) {
    return Array.from({ length: totalHalaman }, (_, i) => i + 1);
  }

  const nomor = new Set<number>([1, totalHalaman, halaman]);
  if (halaman - 1 > 1) nomor.add(halaman - 1);
  if (halaman + 1 < totalHalaman) nomor.add(halaman + 1);

  const terurut = [...nomor].sort((a, b) => a - b);
  const hasil: (number | 'jeda')[] = [];

  terurut.forEach((n, i) => {
    if (i > 0 && n - terurut[i - 1] > 1) hasil.push('jeda');
    hasil.push(n);
  });

  return hasil;
}

const kelasDasar =
  'min-w-10 rounded-lg border-2 border-[#595959] px-3 py-2 font-body text-sm font-semibold transition';

export default function Pagination({ halaman, totalHalaman, onPindah }: Props) {
  if (totalHalaman <= 1) return null;

  return (
    <nav
      aria-label="Navigasi halaman kelompok"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPindah(halaman - 1)}
        disabled={halaman === 1}
        className={`${kelasDasar} bg-white/60 text-[#6b5233] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/60`}
      >
        ‹ Sebelumnya
      </button>

      {daftarNomor(halaman, totalHalaman).map((n, i) =>
        n === 'jeda' ? (
          <span
            key={`jeda-${i}`}
            aria-hidden
            className="px-1 font-body text-sm text-[#6b5233]"
          >
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onPindah(n)}
            aria-current={n === halaman ? 'page' : undefined}
            className={`${kelasDasar} ${
              n === halaman
                ? 'bg-amber-50 text-[#4A3320] shadow-inner'
                : 'bg-white/60 text-[#6b5233] hover:bg-amber-50'
            }`}
          >
            {n}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPindah(halaman + 1)}
        disabled={halaman === totalHalaman}
        className={`${kelasDasar} bg-white/60 text-[#6b5233] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/60`}
      >
        Berikutnya ›
      </button>
    </nav>
  );
}
