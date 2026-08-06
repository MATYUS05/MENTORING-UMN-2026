// src/featured/faq/pages/Faq.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { chatbotService } from '../../../lib/chatbotService';
import type { FaqItem } from '../../../shared/types/database';

import faqBg from '../../../assets/faq/faq bg.svg';
import maskotObor from '../../../assets/faq/maskot obor.png';
import tali from '../../../assets/faq/tali.png';

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const openChatbot = () => {
    window.dispatchEvent(new Event('open-chatbot'));
  };

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const unsubscribe = chatbotService.pantauKonfigurasi((config) => {
      setFaqs(config.faqs ?? []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return faqs;

    return faqs.filter((faq) =>
      `${faq.pertanyaan} ${faq.jawaban}`.toLowerCase().includes(keyword)
    );
  }, [faqs, search]);

  return (
    <section className="relative isolate -mt-32 pt-32 bg-[#fbfaf7]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${faqBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/35" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border-[3px] border-neutral-charcoal/90 bg-white/85 px-6 py-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm md:px-10 md:py-12">
            <p
              className={`${font.body} text-base font-medium uppercase tracking-[0.35em] text-neutral-stone/80 md:text-lg`}
            >
              Frequently Asked Questions
            </p>

            <h1 className={`${font.h1} mt-4 text-4xl text-neutral-charcoal md:text-6xl`}>
              Semua Jawaban Ada di Sini
            </h1>

            <p
              className={`${font.body} mx-auto mt-5 max-w-3xl text-base leading-8 text-neutral-stone md:text-xl`}
            >
              Temukan jawaban untuk pertanyaan yang paling sering ditanyakan tentang kegiatan mentoring.
              Gunakan kolom pencarian untuk menemukan topik yang kamu butuhkan dengan cepat.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-4xl px-2 sm:px-4 md:px-10">
            <img
              src={tali}
              alt=""
              className="pointer-events-none absolute left-[23%] top-[-3rem] z-0 h-16 -translate-x-1/2 sm:top-[-3.4rem] sm:h-20 md:left-[22%] md:top-[-4.5rem] md:h-28"
            />
            <img
              src={tali}
              alt=""
              className="pointer-events-none absolute right-[23%] top-[-3rem] z-0 h-16 translate-x-1/2 sm:top-[-3.4rem] sm:h-20 md:right-[22%] md:top-[-4.5rem] md:h-28"
            />

            <div className="relative z-10 rotate-[-3deg] rounded-[2rem] bg-[#d8d7d5]/95 px-4 py-5 shadow-[0_20px_45px_rgba(0,0,0,0.12)] sm:px-5 sm:py-6 md:px-8 md:py-7">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center text-neutral-charcoal sm:h-16 sm:w-16 md:h-20 md:w-20">
                  <svg
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.4"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <label className="block flex-1">
                  <span className="sr-only">Cari pertanyaan FAQ</span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Cari pertanyaan atau kata kunci..."
                    className="w-full rounded-[1.5rem] border-none bg-[#8f8a87] px-5 py-3 text-lg text-white placeholder:text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] outline-none transition focus:ring-2 focus:ring-white/70 sm:px-6 sm:py-4 sm:text-xl md:px-8 md:py-5 md:text-3xl"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[2rem] bg-[#d9d9d9]/80"
              />
            ))}
          </div>
        )}

        {!loading && filteredFaqs.length === 0 && (
          <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] border-2 border-dashed border-neutral-stone/35 bg-white/75 px-6 py-10 text-center shadow-sm backdrop-blur-sm">
            <h2 className={`${font.h2} text-3xl text-neutral-charcoal md:text-4xl`}>Oops!</h2>
            <p className={`${font.body} mt-3 text-lg text-neutral-stone md:text-xl`}>
              Tidak ada pertanyaan yang cocok.
            </p>
          </div>
        )}

        {!loading && filteredFaqs.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFaqs.map((faq, index) => (
              <article
                key={faq.id}
                className="group flex min-h-[15rem] flex-col rounded-[2rem] bg-[#d9d9d9]/95 px-6 py-5 text-neutral-charcoal shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(0,0,0,0.12)]"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="h-4 w-32 rounded-full bg-[#666666] md:w-40" />
                  <span
                    className={`${font.body} text-sm font-semibold uppercase tracking-[0.25em] text-neutral-stone/80`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h2 className={`${font.body} text-xl font-semibold leading-snug text-neutral-charcoal md:text-2xl`}>
                  {faq.pertanyaan}
                </h2>

                <p className={`${font.body} mt-4 text-base leading-8 text-neutral-stone md:text-lg`}>
                  {faq.jawaban}
                </p>
              </article>
            ))}
          </div>
        )}

        {!loading && faqs.length > 0 && (
          <p className={`${font.body} mt-10 text-center text-base text-neutral-stone md:text-lg`}>
            Menampilkan{' '}
            <span className="font-semibold text-neutral-charcoal">{filteredFaqs.length}</span> dari{' '}
            <span className="font-semibold text-neutral-charcoal">{faqs.length}</span> pertanyaan.
          </p>
        )}

        <div className="mx-auto mt-20 max-w-4xl px-6 pb-4 md:mt-24">
          <div className="rounded-[2rem] border-[3px] border-neutral-charcoal/85 bg-white/90 px-6 py-7 shadow-[0_18px_36px_rgba(0,0,0,0.12)] backdrop-blur-sm md:px-10 md:py-9">
            <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
              <button
                type="button"
                onClick={openChatbot}
                aria-label="Buka chatbot dari maskot Obor"
                className="shrink-0 rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-secondary-deep/20"
              >
                <img
                  src={maskotObor}
                  alt="Maskot Obor"
                  className="w-36 drop-shadow-[0_14px_26px_rgba(0,0,0,0.18)] sm:w-40 md:w-52"
                />
              </button>

              <div className="flex-1">
                <p
                  className={`${font.body} text-sm font-semibold uppercase tracking-[0.28em] text-neutral-stone/75 md:text-base`}
                >
                  Masih belum menemukan pertanyaannya? 
                </p>

                <button
                  type="button"
                  onClick={openChatbot}
                  className={`${font.body} mt-3 text-center text-xl font-semibold leading-relaxed text-neutral-charcoal underline decoration-neutral-charcoal/60 underline-offset-4 transition hover:text-[#7d7875] md:text-left md:text-3xl`}
                >  
                  Coba tanyakan ke Chatbot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}