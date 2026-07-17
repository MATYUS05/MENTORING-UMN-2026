// functions/index.js

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryCloudName = defineSecret('CLOUDINARY_CLOUD_NAME');
const cloudinaryApiKey = defineSecret('CLOUDINARY_API_KEY');
const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET');

initializeApp();
const db = getFirestore();

async function pastikanAdmin(auth) {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Harus login.');
  }

  const userDoc = await db.collection('users').doc(auth.uid).get();
  const role = userDoc.data()?.role;

  if (role !== 'admin' && role !== 'superadmin') {
    throw new HttpsError('permission-denied', 'Hanya admin yang boleh melakukan aksi ini.');
  }
}

export const hapusFoto = onCall(
  { secrets: [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret] },
  async (request) => {
    console.log('[BACKEND] Cloud Function hapusFoto terpanggil');
    try {
      console.log('[BACKEND] Memanggil pastikanAdmin');
      await pastikanAdmin(request.auth);
      console.log('[BACKEND] pastikanAdmin berhasil lolos');

      const { fotoId } = request.data;
      console.log('[BACKEND] fotoId yang diterima:', fotoId);
      if (!fotoId) {
        throw new HttpsError('invalid-argument', 'fotoId wajib diisi.');
      }

      console.log('[BACKEND] Mengambil fotoRef dari Firestore');
      const fotoRef = db.collection('gallery').doc(fotoId);
      const fotoSnap = await fotoRef.get();

      console.log('[BACKEND] fotoSnap exists?', fotoSnap.exists);
      if (!fotoSnap.exists) {
        throw new HttpsError('not-found', 'Foto tidak ditemukan.');
      }

      const publicId = fotoSnap.data().publicId;
      console.log('[BACKEND] publicId foto:', publicId);

      if (publicId) {
        cloudinary.config({
          cloud_name: cloudinaryCloudName.value(),
          api_key: cloudinaryApiKey.value(),
          api_secret: cloudinaryApiSecret.value(),
        });

        console.log('[BACKEND] Menghapus foto dari Cloudinary');
        await cloudinary.uploader.destroy(publicId);
        console.log('[BACKEND] Berhasil menghapus dari Cloudinary');
      }

      console.log('[BACKEND] Menghapus dokumen dari Firestore');
      await fotoRef.delete();
      console.log('[BACKEND] Berhasil menghapus dokumen dari Firestore');

      return { berhasil: true };
    } catch (error) {
      console.error('[BACKEND] Terjadi error di Cloud Function hapusFoto:', error);
      throw error;
    }
  }
);