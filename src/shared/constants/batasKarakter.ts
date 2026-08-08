// src/shared/constants/batasKarakter.ts

/**
 * Batas maksimal karakter untuk input teks pada form admin.
 *
 * Catatan: sebelumnya project ini tidak punya batas karakter sama sekali —
 * baik di form, di service (kelompokService/pesertaService hanya meneruskan
 * data ke Firestore), maupun di backend (functions/index.js hanya menangani
 * hapusFoto). Angka di bawah adalah batas baru, dipilih agar tidak memotong
 * data yang sudah ada di scripts/seed-semua.mjs:
 *
 *   namaKelompok  30 — data terpanjang "Kelompok Pengganti 1" (20 karakter)
 *   namaMentor    50 — menampung nama lengkap beserta gelar
 *   nimMentor     11 — format NIM UMN, seluruh data seed konsisten 11 digit
 *   idLineMentor  30 — ID Line maksimal 20 karakter, diberi kelonggaran
 *   namaLengkap   50 — sama dengan namaMentor
 *   nim           11 — sama dengan nimMentor
 *   jurusan       50 — data terpanjang "Teknik Informatika" (18 karakter)
 *
 * Ubah di sini kalau batasnya perlu disesuaikan; seluruh form ikut berubah.
 */
export const BATAS_KELOMPOK = {
  namaKelompok: 30,
  namaMentor: 50,
  nimMentor: 11,
  idLineMentor: 30,
} as const;

export const BATAS_PESERTA = {
  namaLengkap: 50,
  nim: 11,
  jurusan: 50,
} as const;
