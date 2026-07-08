// src/lib/logService.ts

import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { AksiLog, EntitasLog, LogAktivitas } from '../shared/types/database';

const COLLECTION = 'activityLogs';

export const logService = {
  async catat(pelakuId: string, pelakuNama: string, aksi: AksiLog, entitas: EntitasLog, keterangan: string) {
    await addDoc(collection(db, COLLECTION), {
      pelakuId,
      pelakuNama,
      aksi,
      entitas,
      keterangan,
      waktu: new Date(),
    });
  },

  async ambilSemua() {
    const q = query(collection(db, COLLECTION), orderBy('waktu', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as LogAktivitas[];
  },
};