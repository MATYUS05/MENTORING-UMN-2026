// src/featured/faq/pages/Faq.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { chatbotService } from '../../../lib/chatbotService';
import ChatbotCard from '../components/ChatbotCard';
import type { FaqItem } from '../../../shared/types/database';

import faqBg from '../../../assets/faq/faq bg.png';
import mascotObor from '../../../assets/faq/maskot obor.png';
import tali from '../../../assets/faq/tali.png';

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      try {
        const config = await chatbotService.ambilKonfigurasi();

        if (config?.faqs) {
          setFaqs(config.faqs);
        }
      } catch (error) {
        console.error('Gagal mengambil data FAQ:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return faqs;

    return faqs.filter((f) =>
      f.pertanyaan.toLowerCase().includes(keyword)
    );
  }, [faqs, search]);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="relative overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: `url(${faqBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* TALI KIRI */}
      <img
        src={tali}
        alt=""
          className="
            pointer-events-none
            absolute
            left-2
            top-0
            z-0
            h-40
            rotate-6
            opacity-60
            block
            md:left-5
            md:h-64
          "
      />

      {/* TALI KANAN */}
      <img
        src={tali}
        alt=""
          className="
            pointer-events-none
            absolute
            right-2
            top-0
            z-0
            h-44
            -scale-x-100
            -rotate-6
            opacity-60
            block
            md:right-5
            md:h-72
          "
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">

        {/* HEADER */}
        <div className="relative flex items-start justify-between gap-6">

          <div>
            <h1 className={`${font.h1} text-slate-900`}>
              FAQ
            </h1>

            <p className={`${font.body} mt-2 text-slate-500`}>
              Pertanyaan yang sering ditanyakan seputar mentoring.
              Kalau belum ketemu, coba tanyakan ke chatbot di bawah.
            </p>
          </div>

          <img
            src={mascotObor}
            alt="Maskot"
            className="
              
              w-24
              rotate-12
              transition-transform
              duration-300
              hover:rotate-0
              hover:scale-110
              md:block
            "
          />
        </div>

        {/* SEARCH */}
        <div className="relative mt-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari pertanyaan..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white/90
              py-3
              pl-11
              pr-4
              text-slate-900
              shadow-sm
              backdrop-blur-sm
              outline-none
              transition
              focus:border-emerald-500
              focus:ring-1
              focus:ring-emerald-500
            "
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredFaqs.length === 0 && (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-200 py-6 text-center text-slate-500 backdrop-blur-sm">
            Tidak ada pertanyaan yang cocok.
          </p>
        )}

        {/* FAQ LIST */}
        <div className="mt-6 space-y-4">
          {!loading &&
            filteredFaqs.map((f) => {
              const isOpen = openId === f.id;

              return (
                <div
                  key={f.id}
                  className={`
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-white/90
                    shadow-sm
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? 'border-emerald-500 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(f.id)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="pr-4 font-medium text-slate-900">
                      {f.pertanyaan}
                    </span>

                    <span
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                        transition-all
                        duration-300
                        ${
                          isOpen
                            ? 'rotate-180 bg-emerald-100 text-emerald-700'
                            : ''
                        }
                      `}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-600">
                      {f.jawaban}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* CHATBOT */}
        <div className="relative mt-16">

          <img
            src={mascotObor}
            alt=""
            className="
              pointer-events-none
              absolute
              -right-5
              -top-12
              
              w-20
              rotate-12
              opacity-90
              lg:block
            "
          />

          <p className="mb-3 text-sm text-slate-500">
            Masih belum ketemu jawabannya?
          </p>

          <ChatbotCard />
        </div>
      </div>
    </div>
  );
}