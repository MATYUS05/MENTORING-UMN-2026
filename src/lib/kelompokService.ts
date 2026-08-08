// src/lib/kelompokService.ts

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Kelompok } from '../shared/types/database';

const COLLECTION = 'kelompok';

export const kelompokService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Kelompok[];
  },

  async tambah(data: Omit<Kelompok, 'id' | 'createdAt' | 'updatedAt'>) {
    const sekarang = new Date();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    return ref.id;
  },

  // createdAt sengaja tidak bisa dikirim pemanggil supaya waktu pembuatan tidak tertimpa.
  async perbarui(id: string, data: Partial<Omit<Kelompok, 'id' | 'createdAt' | 'updatedAt'>>) {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: new Date() });
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};