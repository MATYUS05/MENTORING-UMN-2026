// src/lib/panitiaService.ts

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Panitia } from '../shared/types/database';

const COLLECTION = 'panitia';

export const panitiaService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Panitia[];
  },

  async tambah(data: Omit<Panitia, 'id' | 'createdAt'>) {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: new Date() });
    return ref.id;
  },

  async perbarui(id: string, data: Partial<Panitia>) {
    await updateDoc(doc(db, COLLECTION, id), data);
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};