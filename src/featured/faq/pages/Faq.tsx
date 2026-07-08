// src/featured/faq/pages/Faq.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { chatbotService } from '../../../lib/chatbotService';
import ChatbotCard from '../components/ChatbotCard';
import type { FaqItem } from '../../../shared/types/database';

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      const config = await chatbotService.ambilKonfigurasi();
      setFaqs(config.faqs);
      setLoading(false);
    })();
  }, []);

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (keyword === '') return faqs;
    return faqs.filter((f) => f.pertanyaan.toLowerCase().includes(keyword));
  }, [faqs, search]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className={`${font.h1} text-slate-900`}>FAQ</h1>
      <p className={`${font.body} mt-2 text-slate-500`}>
        Pertanyaan yang sering ditanyakan seputar mentoring. Kalau gak ketemu, tanya chatbot di pojok kanan bawah.
      </p>

      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Cari pertanyaan..."
        className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
      />

      {loading && <p className="mt-8 text-slate-500">Memuat FAQ...</p>}

      {!loading && filteredFaqs.length === 0 && (
        <p className="mt-8 text-slate-500">Tidak ada pertanyaan yang cocok.</p>
      )}

      <div className="mt-6 space-y-4">
        {filteredFaqs.map((f) => (
          <details key={f.id} className="group rounded-xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none">
              {f.pertanyaan}
            </summary>
            <p className="mt-3 text-sm text-slate-600">{f.jawaban}</p>
          </details>
        ))}
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm text-slate-500">Masih belum ketemu jawabannya?</p>
        <ChatbotCard />
      </div>
    </div>
  );
}