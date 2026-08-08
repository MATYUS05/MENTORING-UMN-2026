// src/shared/utils/waktu.ts

const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** Dikunci ke Asia/Jakarta supaya label "WIB" tetap benar walau perangkat berada di zona lain. */
const formatterJakarta = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** Firestore mengembalikan Timestamp, bukan Date, jadi keduanya perlu ditangani. */
function keDate(nilai: unknown): Date | null {
  if (nilai instanceof Date) return Number.isNaN(nilai.getTime()) ? null : nilai;
  if (typeof nilai === 'object' && nilai !== null && 'toDate' in nilai) {
    const hasil = (nilai as { toDate: () => Date }).toDate();
    return hasil instanceof Date && !Number.isNaN(hasil.getTime()) ? hasil : null;
  }
  if (typeof nilai === 'string' || typeof nilai === 'number') {
    const hasil = new Date(nilai);
    return Number.isNaN(hasil.getTime()) ? null : hasil;
  }
  return null;
}

/**
 * Waktu update terbaru dari sekumpulan dokumen, dibaca dari field `updatedAt`.
 *
 * Field dibaca langsung dari dokumen Firestore, bukan dari tipe TypeScript,
 * sehingga koleksi yang nanti mulai menulis `updatedAt` langsung terbaca
 * tanpa perlu mengubah kode di sini.
 *
 * Mengembalikan null kalau tidak ada satu pun dokumen yang punya `updatedAt` —
 * dan null itu berarti "belum tersedia", bukan diganti waktu fetch.
 */
export function waktuUpdateTerakhir(data: unknown[]): Date | null {
  let terbaru: Date | null = null;
  for (const item of data) {
    const waktu = keDate((item as { updatedAt?: unknown })?.updatedAt);
    if (waktu && (!terbaru || waktu > terbaru)) terbaru = waktu;
  }
  return terbaru;
}

/** Contoh: "07 Agu 2026 • 15:42 WIB" */
export function formatWaktuLengkap(waktu: Date): string {
  const bagian = formatterJakarta.formatToParts(waktu);
  const ambil = (tipe: Intl.DateTimeFormatPartTypes) =>
    bagian.find((b) => b.type === tipe)?.value ?? '';

  const bulan = BULAN_SINGKAT[Number(ambil('month')) - 1] ?? ambil('month');
  return `${ambil('day')} ${bulan} ${ambil('year')} • ${ambil('hour')}:${ambil('minute')} WIB`;
}

/**
 * Format yang dipakai seluruh card: relatif untuk kejadian dalam 24 jam terakhir
 * ("2 menit lalu"), selebihnya tanggal lengkap supaya tetap jelas.
 */
export function formatWaktuUpdate(waktu: Date): string {
  const selisihDetik = Math.floor((Date.now() - waktu.getTime()) / 1000);

  if (selisihDetik < 0) return formatWaktuLengkap(waktu);
  if (selisihDetik < 60) return 'baru saja';
  if (selisihDetik < 3600) return `${Math.floor(selisihDetik / 60)} menit lalu`;
  if (selisihDetik < 86400) return `${Math.floor(selisihDetik / 3600)} jam lalu`;
  return formatWaktuLengkap(waktu);
}
