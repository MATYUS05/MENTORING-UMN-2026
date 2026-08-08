// src/shared/utils/pagination.ts

/**
 * Nomor halaman di sekitar halaman aktif, dengan 'jeda' ('…') bila terpotong.
 * Sampai 7 halaman ditampilkan seluruhnya; lebih dari itu hanya halaman
 * pertama, terakhir, dan tetangga halaman aktif.
 */
export function nomorHalaman(halaman: number, totalHalaman: number): (number | 'jeda')[] {
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
