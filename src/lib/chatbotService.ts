// src/lib/chatbotService.ts

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { ChatbotConfig } from '../shared/types/database';

const COLLECTION = 'chatbotConfig';
const DOC_ID = 'main-config';

export const chatbotService = {
  async ambilKonfigurasi(): Promise<ChatbotConfig> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      const defaultConfig: ChatbotConfig = {
        id: DOC_ID,
        isActive: true,
        greeting: 'Hai! Ada yang bisa saya bantu seputar mentoring?',
        faqs: [],
        updatedAt: new Date(),
        updatedBy: '',
      };
      await setDoc(ref, defaultConfig);
      return defaultConfig;
    }

    return { id: snapshot.id, ...snapshot.data() } as ChatbotConfig;
  },

  async perbaruiKonfigurasi(data: Partial<Omit<ChatbotConfig, 'id'>>, updatedBy: string) {
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { ...data, updatedBy, updatedAt: new Date() }, { merge: true });
  },
};