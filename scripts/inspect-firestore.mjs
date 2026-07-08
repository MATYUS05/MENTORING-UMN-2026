// scripts/inspect-firestore.mjs

import { readFileSync, writeFileSync } from 'fs';
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

function inferType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Timestamp) return 'timestamp';
  return typeof value;
}

async function main() {
  console.log('Membaca struktur Firestore...');

  const collections = await db.listCollections();

  if (collections.length === 0) {
    writeFileSync(
      path.join(__dirname, '..', 'FIRESTORE_STRUCTURE.md'),
      `# Firestore Structure\n\nGenerated: ${new Date().toISOString()}\n\nFirestore masih kosong, belum ada collection.\n`
    );
    console.log('Firestore masih kosong. File FIRESTORE_STRUCTURE.md sudah dibuat.');
    process.exit(0);
  }

  let output = `# Firestore Structure\n\nGenerated: ${new Date().toISOString()}\n\n`;
  output += `Total collections ditemukan: ${collections.length}\n\n`;

  for (const col of collections) {
    const snapshot = await col.limit(5).get();
    const countSnapshot = await col.count().get();

    output += `## Collection: \`${col.id}\`\n\n`;
    output += `Total documents: ${countSnapshot.data().count}\n\n`;

    if (snapshot.empty) {
      output += `_Collection ada tapi belum ada document di dalamnya._\n\n`;
      continue;
    }

    const fieldMap = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      Object.entries(data).forEach(([key, value]) => {
        if (!fieldMap[key]) fieldMap[key] = new Set();
        fieldMap[key].add(inferType(value));
      });
    });

    output += `**Fields yang terdeteksi (dari sample ${snapshot.size} dokumen):**\n\n`;
    output += `| Field | Type(s) |\n|---|---|\n`;
    Object.entries(fieldMap).forEach(([key, types]) => {
      output += `| ${key} | ${[...types].join(', ')} |\n`;
    });

    output += `\n**Contoh dokumen (id: ${snapshot.docs[0].id}):**\n\n`;
    output += '```json\n' + JSON.stringify(snapshot.docs[0].data(), null, 2) + '\n```\n\n---\n\n';
  }

  writeFileSync(path.join(__dirname, '..', 'FIRESTORE_STRUCTURE.md'), output);
  console.log('Selesai. Struktur Firestore tersimpan di FIRESTORE_STRUCTURE.md');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
