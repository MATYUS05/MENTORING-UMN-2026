// src/lib/pesertaService.ts

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Peserta } from '../shared/types/database';

const COLLECTION = 'peserta';

export const pesertaService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Peserta[];
  },

  async tambah(data: Omit<Peserta, 'id' | 'createdAt' | 'updatedAt'>) {
    const sekarang = new Date();
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    return ref.id;
  },

  // createdAt sengaja tidak bisa dikirim pemanggil supaya waktu pembuatan tidak tertimpa.
  async perbarui(id: string, data: Partial<Omit<Peserta, 'id' | 'createdAt' | 'updatedAt'>>) {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: new Date() });
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};