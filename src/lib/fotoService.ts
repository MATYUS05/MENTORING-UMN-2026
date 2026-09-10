// src/lib/fotoService.ts

import { addDoc, collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Foto } from '../shared/types/database';

const COLLECTION = 'gallery';

export const fotoService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Foto[];
  },

  async tambah(data: Omit<Foto, 'id' | 'uploadedAt' | 'updatedAt'>) {
    const sekarang = new Date();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      uploadedAt: sekarang,
      updatedAt: sekarang,
    });
    return ref.id;
  },

  // uploadedAt (waktu pembuatan koleksi ini) sengaja tidak bisa dikirim pemanggil.
  async perbarui(id: string, data: Partial<Omit<Foto, 'id' | 'uploadedAt' | 'updatedAt'>>) {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: new Date() });
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};