// src/lib/akunService.ts

import { deleteApp, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserAccount } from '../shared/types/database';

const COLLECTION = 'users';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const akunService = {
  async ambilSemua() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })) as UserAccount[];
  },

  async tambah(data: Omit<UserAccount, 'uid' | 'createdAt'>, password: string) {
    const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const credential = await createUserWithEmailAndPassword(secondaryAuth, data.email, password);
      const uid = credential.user.uid;

      await setDoc(doc(db, COLLECTION, uid), {
        ...data,
        createdAt: new Date(),
      });

      await signOut(secondaryAuth);
      return uid;
    } finally {
      await deleteApp(secondaryApp);
    }
  },

  async perbarui(uid: string, data: Partial<UserAccount>) {
    await updateDoc(doc(db, COLLECTION, uid), data);
  },

  async hapus(uid: string) {
    await deleteDoc(doc(db, COLLECTION, uid));
  },
};