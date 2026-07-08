// src/shared/types/database.ts

export type UserRole = 'admin' | 'superadmin';
export type DivisiAkun = 'executive' | 'website' | 'documentation' | 'visual' | 'insurer';

export interface UserAccount {
  uid: string;
  email: string;
  username: string;
  role: UserRole;
  divisi: DivisiAkun | null;
  createdAt: Date;
}

export interface Divisi {
  id: string;
  namaDivisi: string;
  fotoDivisiUrl: string;
  deskripsiDivisi: string;
  tipeExec: boolean;
  createdAt: Date;
}

export type PosisiPanitia = 'koordinator' | 'anggota' | 'executive';

export interface Panitia {
  id: string;
  namaLengkap: string;
  nim: string;
  divisiId: string;
  posisi: PosisiPanitia;
  createdAt: Date;
}

export type Sesi = 'pagi' | 'siang' | 'pengganti';

export interface Kelompok {
  id: string;
  namaKelompok: string;
  namaMentor: string;
  nimMentor: string;
  idLineMentor: string;
  fotoMentorUrl: string;
  sesi: Sesi;
  createdAt: Date;
}

export interface Peserta {
  id: string;
  namaLengkap: string;
  nim: string;
  jurusan: string;
  kelompokId: string;
  createdAt: Date;
}

export type Minggu = 'minggu-1' | 'minggu-2' | 'minggu-3';

export interface Foto {
  id: string;
  fotoUrl: string;
  publicId?: string;
  judul?: string;
  deskripsi?: string;
  sesi: Sesi;
  minggu: Minggu;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface FaqItem {
  id: string;
  pertanyaan: string;
  jawaban: string;
  kategori?: string;
}

export interface ChatbotConfig {
  id: string;
  isActive: boolean;
  greeting: string;
  faqs: FaqItem[];
  updatedAt: Date;
  updatedBy: string;
}

export type AksiLog = 'tambah' | 'perbarui' | 'hapus' | 'login_berhasil' | 'login_gagal';
export type EntitasLog = 'peserta' | 'panitia' | 'kelompok' | 'foto' | 'divisi' | 'chatbot' | 'faq' | 'akun' | 'auth';

export interface LogAktivitas {
  id: string;
  pelakuId: string;
  pelakuNama: string;
  aksi: AksiLog;
  entitas: EntitasLog;
  keterangan: string;
  waktu: Date;
}