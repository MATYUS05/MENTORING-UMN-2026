// scripts/bersihkan-foto-cloudinary.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
} catch {
  console.error('Tidak menemukan scripts/serviceAccountKey.json. Lihat FIREBASE_SETUP_GUIDE.md.');
  process.exit(1);
}

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    'Tambahkan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET di file .env (tanpa prefix VITE_).'
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const modeHapus = process.argv.includes('--hapus');

async function ambilSemuaPublicIdCloudinary() {
  const hasil = [];
  let cursor;

  do {
    const respon = await cloudinary.api.resources({
      max_results: 500,
      next_cursor: cursor,
    });
    hasil.push(...respon.resources.map((r) => r.public_id));
    cursor = respon.next_cursor;
  } while (cursor);

  return hasil;
}

async function main() {
  const snapshot = await db.collection('gallery').get();
  const publicIdTerpakai = new Set(
    snapshot.docs.map((doc) => doc.data().publicId).filter(Boolean)
  );

  const publicIdCloudinary = await ambilSemuaPublicIdCloudinary();
  const yatim = publicIdCloudinary.filter((id) => !publicIdTerpakai.has(id));

  if (yatim.length === 0) {
    console.log('Tidak ada foto yatim di Cloudinary. Semua sudah tercatat di Firestore.');
    process.exit(0);
  }

  console.log(`Ditemukan ${yatim.length} foto di Cloudinary yang tidak tercatat di Firestore:`);
  yatim.forEach((id) => console.log(`- ${id}`));

  if (!modeHapus) {
    console.log('\nIni baru mode cek (dry run). Jalankan ulang dengan --hapus untuk benar-benar menghapusnya:');
    console.log('  node scripts/bersihkan-foto-cloudinary.mjs --hapus');
    process.exit(0);
  }

  await cloudinary.api.delete_resources(yatim);
  console.log(`\nBerhasil menghapus ${yatim.length} foto yatim dari Cloudinary.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
