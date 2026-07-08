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

  async tambah(data: Omit<Peserta, 'id' | 'createdAt'>) {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: new Date() });
    return ref.id;
  },

  async perbarui(id: string, data: Partial<Peserta>) {
    await updateDoc(doc(db, COLLECTION, id), data);
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};