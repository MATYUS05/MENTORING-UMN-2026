// src/lib/divisiService.ts

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Divisi } from '../shared/types/database';

const COLLECTION = 'divisi';

export const divisiService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Divisi[];
  },

  async tambah(data: Omit<Divisi, 'id' | 'createdAt'>) {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: new Date() });
    return ref.id;
  },

  async perbarui(id: string, data: Partial<Divisi>) {
    await updateDoc(doc(db, COLLECTION, id), data);
  },

  async hapus(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};