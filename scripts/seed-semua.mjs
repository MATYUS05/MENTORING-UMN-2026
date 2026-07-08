// scripts/seed-semua.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
} catch {
  console.error('Tidak menemukan scripts/serviceAccountKey.json. Lihat FIREBASE_SETUP_GUIDE.md.');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const divisiList = [
  {
    id: 'div-exc',
    namaDivisi: 'Executive',
    fotoDivisiUrl: '',
    deskripsiDivisi: 'Tim inti pengambil keputusan strategis organisasi.',
    tipeExec: true,
  },
  {
    id: 'div-website',
    namaDivisi: 'Website',
    fotoDivisiUrl: '',
    deskripsiDivisi: 'Bertanggung jawab membangun dan memelihara aplikasi web organisasi.',
    tipeExec: false,
  },
  {
    id: 'div-documentation',
    namaDivisi: 'Documentation',
    fotoDivisiUrl: '',
    deskripsiDivisi: 'Mendokumentasikan seluruh kegiatan organisasi dalam bentuk foto dan video.',
    tipeExec: false,
  },
  {
    id: 'div-visual',
    namaDivisi: 'Visual',
    fotoDivisiUrl: '',
    deskripsiDivisi: 'Bertanggung jawab atas desain visual dan branding organisasi.',
    tipeExec: false,
  },
  {
    id: 'div-insurer',
    namaDivisi: 'Insurer',
    fotoDivisiUrl: '',
    deskripsiDivisi: 'Mengelola keamanan dan ketertiban jalannya acara.',
    tipeExec: false,
  },
];

const panitiaList = [
  { namaLengkap: 'Nama Executive 1', nim: '00000000001', divisiId: 'div-exc', posisi: 'executive' },
  { namaLengkap: 'Nama Executive 2', nim: '00000000002', divisiId: 'div-exc', posisi: 'executive' },
  { namaLengkap: 'Nama Executive 3', nim: '00000000003', divisiId: 'div-exc', posisi: 'executive' },
  { namaLengkap: 'Nama Koordinator 1', nim: '00000000004', divisiId: 'div-website', posisi: 'koordinator' },
  { namaLengkap: 'Nama Koordinator 2', nim: '00000000005', divisiId: 'div-website', posisi: 'koordinator' },
  { namaLengkap: 'Nama Anggota 1', nim: '00000000006', divisiId: 'div-website', posisi: 'anggota' },
  { namaLengkap: 'Nama Koordinator 1', nim: '00000000007', divisiId: 'div-documentation', posisi: 'koordinator' },
  { namaLengkap: 'Nama Koordinator 2', nim: '00000000008', divisiId: 'div-documentation', posisi: 'koordinator' },
  { namaLengkap: 'Nama Anggota 1', nim: '00000000009', divisiId: 'div-documentation', posisi: 'anggota' },
  { namaLengkap: 'Nama Koordinator 1', nim: '00000000010', divisiId: 'div-visual', posisi: 'koordinator' },
  { namaLengkap: 'Nama Koordinator 2', nim: '00000000011', divisiId: 'div-visual', posisi: 'koordinator' },
  { namaLengkap: 'Nama Anggota 1', nim: '00000000012', divisiId: 'div-visual', posisi: 'anggota' },
  { namaLengkap: 'Nama Koordinator 1', nim: '00000000013', divisiId: 'div-insurer', posisi: 'koordinator' },
  { namaLengkap: 'Nama Koordinator 2', nim: '00000000014', divisiId: 'div-insurer', posisi: 'koordinator' },
  { namaLengkap: 'Nama Anggota 1', nim: '00000000015', divisiId: 'div-insurer', posisi: 'anggota' },
];

const kelompokList = [
  {
    id: 'kelompok-pagi-1',
    namaKelompok: 'Kelompok Pagi 1',
    namaMentor: 'Nama Mentor Pagi 1',
    nimMentor: '00000000101',
    idLineMentor: '@mentorpagi1',
    fotoMentorUrl: '',
    sesi: 'pagi',
  },
  {
    id: 'kelompok-siang-1',
    namaKelompok: 'Kelompok Siang 1',
    namaMentor: 'Nama Mentor Siang 1',
    nimMentor: '00000000102',
    idLineMentor: '@mentorsiang1',
    fotoMentorUrl: '',
    sesi: 'siang',
  },
  {
    id: 'kelompok-pengganti-1',
    namaKelompok: 'Kelompok Pengganti 1',
    namaMentor: 'Nama Mentor Pengganti 1',
    nimMentor: '00000000103',
    idLineMentor: '@mentorpengganti1',
    fotoMentorUrl: '',
    sesi: 'pengganti',
  },
];

const pesertaList = [
  { namaLengkap: 'Nama Peserta 1', nim: '00000001001', jurusan: 'Sistem Informasi', kelompokId: 'kelompok-pagi-1' },
  { namaLengkap: 'Nama Peserta 2', nim: '00000001002', jurusan: 'Sistem Informasi', kelompokId: 'kelompok-pagi-1' },
  { namaLengkap: 'Nama Peserta 3', nim: '00000001003', jurusan: 'Teknik Informatika', kelompokId: 'kelompok-siang-1' },
  { namaLengkap: 'Nama Peserta 4', nim: '00000001004', jurusan: 'Teknik Informatika', kelompokId: 'kelompok-siang-1' },
  { namaLengkap: 'Nama Peserta 5', nim: '00000001005', jurusan: 'Sistem Informasi', kelompokId: 'kelompok-pengganti-1' },
];

const fotoList = [
  { fotoUrl: 'https://picsum.photos/seed/mentoring1/600/400', judul: 'Sesi Pagi Minggu 1', sesi: 'pagi', minggu: 'minggu-1' },
  { fotoUrl: 'https://picsum.photos/seed/mentoring2/600/400', judul: 'Sesi Siang Minggu 1', sesi: 'siang', minggu: 'minggu-1' },
  { fotoUrl: 'https://picsum.photos/seed/mentoring3/600/400', judul: 'Sesi Pagi Minggu 2', sesi: 'pagi', minggu: 'minggu-2' },
  { fotoUrl: 'https://picsum.photos/seed/mentoring4/600/400', judul: 'Sesi Pengganti Minggu 3', sesi: 'pengganti', minggu: 'minggu-3' },
];

const chatbotConfig = {
  isActive: true,
  greeting: 'Hai! Ada yang bisa saya bantu seputar mentoring?',
  faqs: [
    { id: 'faq-1', pertanyaan: 'Apa itu mentoring UMN?', jawaban: 'Mentoring UMN adalah program pembinaan mahasiswa baru.', kategori: 'umum' },
    { id: 'faq-2', pertanyaan: 'Bagaimana cara bergabung sebagai mentor?', jawaban: 'Pendaftaran mentor dibuka lewat pengumuman resmi organisasi.', kategori: 'umum' },
    { id: 'faq-3', pertanyaan: 'Apakah mentoring wajib untuk mahasiswa baru?', jawaban: 'Ya, mentoring adalah bagian dari program orientasi mahasiswa baru.', kategori: 'umum' },
  ],
  updatedBy: 'seeder',
};

async function main() {
  const batch = db.batch();
  const now = Timestamp.now();

  divisiList.forEach((divisi) => {
    const { id, ...data } = divisi;
    batch.set(db.collection('divisi').doc(id), { ...data, createdAt: now });
  });

  panitiaList.forEach((panitia) => {
    batch.set(db.collection('panitia').doc(), { ...panitia, createdAt: now });
  });

  kelompokList.forEach((kelompok) => {
    const { id, ...data } = kelompok;
    batch.set(db.collection('kelompok').doc(id), { ...data, createdAt: now });
  });

  pesertaList.forEach((peserta) => {
    batch.set(db.collection('peserta').doc(), { ...peserta, createdAt: now });
  });

  fotoList.forEach((foto) => {
    batch.set(db.collection('gallery').doc(), { ...foto, uploadedBy: 'seeder', uploadedAt: now });
  });

  batch.set(db.collection('chatbotConfig').doc('main-config'), { ...chatbotConfig, updatedAt: now });

  await batch.commit();
  console.log(
    `Berhasil seed: ${divisiList.length} divisi, ${panitiaList.length} panitia, ${kelompokList.length} kelompok, ${pesertaList.length} peserta, ${fotoList.length} foto, 1 konfigurasi chatbot.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('Error seeding:', err.message);
  process.exit(1);
});
