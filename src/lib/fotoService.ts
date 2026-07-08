// src/lib/fotoService.ts

import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import type { Foto } from '../shared/types/database';

const COLLECTION = 'gallery';

export const fotoService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Foto[];
  },

  async tambah(data: Omit<Foto, 'id' | 'uploadedAt'>) {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, uploadedAt: new Date() });
    return ref.id;
  },

  async perbarui(id: string, data: Partial<Foto>) {
    await updateDoc(doc(db, COLLECTION, id), data);
  },

  async hapus(id: string) {
    const hapusFoto = httpsCallable(functions, 'hapusFoto');
    await hapusFoto({ fotoId: id });
  },
};