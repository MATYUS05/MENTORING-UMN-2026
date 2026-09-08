// src/featured/faq/pages/Faq.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { chatbotService } from '../../../lib/chatbotService';
import PageBackground from '../../../shared/components/PageBackground';
import type { FaqItem } from '../../../shared/types/database';

import faqBg from '../../../assets/faq/faq bg.png';
import maskotObor from '../../../assets/faq/maskot obor.png';

// Tema disamakan dengan halaman Gallery: peta pelayaran tua.
const THEME = {
  parchment: '#EDE0C3',
  parchmentDeep: '#E1D2A8',
  parchmentEdge: '#C9B384',
  ink: '#1F3347',
  inkSoft: '#4A3826',
  brass: '#B8862F',
  brassSoft: '#D4A94A',
  wax: '#8C2E1E',
  ocean: '#0B2B3D',
  cardBorderDark: '#2A241F',
  cardBorderLight: '#8C7B68',
};

const PAPER_GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E";

// Serat kayu: turbulence dengan frekuensi rendah di sumbu-x dan tinggi di
// sumbu-y menghasilkan garis-garis panjang horizontal bergelombang, lalu diwarnai coklat.
const WOOD_GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='720'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.4' numOctaves='3' seed='7' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix in='noise' type='matrix' values='0 0 0 0 0.32  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 1 0' result='tinted'/%3E%3CfeComponentTransfer in='tinted'%3E%3CfeFuncA type='linear' slope='0.5' intercept='-0.08'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)'/%3E%3C/svg%3E";

// Mata kayu / pusaran serat: turbulence "turbulence" (bukan fractalNoise)
// menghasilkan pola melingkar-organik yang meniru simpul dan lingkaran tahun pada kayu.
const WOOD_KNOT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900'%3E%3Cfilter id='knot'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.007' numOctaves='2' seed='23' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix in='noise' type='matrix' values='0 0 0 0 0.25  0 0 0 0 0.16  0 0 0 0 0.08  0 0 0 1 0' result='tinted'/%3E%3CfeComponentTransfer in='tinted'%3E%3CfeFuncA type='linear' slope='0.35' intercept='-0.06'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23knot)'/%3E%3C/svg%3E";

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
    <div className="relative">
      {/* Peta latar, ditempel lewat portal ke <body> supaya menutupi seluruh
          halaman termasuk di belakang navbar dan footer, dan tetap ikut scroll */}
      <PageBackground src={faqBg} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-10">
        {/* ===== Cartouche header ===== */}
        <div
          className="relative rounded-[1.8rem] p-1"
          style={{
            backgroundImage: `linear-gradient(to bottom left, ${THEME.cardBorderDark}, ${THEME.cardBorderLight}, ${THEME.cardBorderDark})`,
            boxShadow: '0 10px 30px -12px rgba(11,43,61,0.45)',
          }}
        >
        <section
          className="relative rounded-[1.6rem] p-5 text-center md:p-8"
          style={{
            backgroundColor: THEME.parchment,
            backgroundImage: `url(${PAPER_GRAIN})`,
            boxShadow: 'inset 0 0 50px 10px rgba(0,0,0,0.4)',
          }}
        >
          <h1 className={`${font.h1} mt-3 text-4xl md:text-6xl`} style={{ color: THEME.ink }}>
            Frequently Asked Questions
          </h1>

          <p
            className={`${font.body} mx-auto mt-4 max-w-3xl text-base leading-8 md:text-xl`}
            style={{ color: THEME.inkSoft }}
          >
            Gunakan kolom pencarian untuk menemukan topik yang dibutuhkan dengan cepat.
          </p>

          <div className="mx-auto mt-6 max-w-2xl">
            <label
              className="flex items-center gap-3 rounded-full border px-5 py-3 md:px-6 md:py-4"
              style={{
                borderColor: THEME.parchmentEdge,
                backgroundColor: '#F7EFDD',
                boxShadow: 'inset 0 0 14px 4px rgba(0,0,0,0.35)',
              }}
            >
              <span className="sr-only">Cari pertanyaan FAQ</span>
              <svg
                className="h-5 w-5 shrink-0 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke={THEME.brass}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari pertanyaan atau kata kunci..."
                className="w-full bg-transparent text-base outline-none placeholder:opacity-60 md:text-lg"
                style={{ color: THEME.inkSoft }}
              />
            </label>
          </div>
        </section>
        </div>

        {/* ===== Loading ===== */}
        {loading && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[1.5rem] border"
                style={{ borderColor: THEME.parchmentEdge, backgroundColor: THEME.parchmentDeep }}
              />
            ))}
          </div>
        )}

        {/* ===== Empty state ===== */}
        {!loading && filteredFaqs.length === 0 && (
          <div
            className="mt-4 rounded-[1.8rem] border border-dashed px-6 py-12 text-center shadow-sm"
            style={{ borderColor: `${THEME.wax}55`, backgroundColor: THEME.parchment }}
          >
            <h2 className={`${font.h2} text-3xl md:text-4xl`} style={{ color: THEME.ink }}>
              Oops!
            </h2>
            <p className={`${font.body} mt-3 text-lg md:text-xl`} style={{ color: THEME.inkSoft }}>
              Tidak ada pertanyaan yang cocok.
            </p>
          </div>
        )}

        {/* ===== FAQ grid ===== */}
        {!loading && filteredFaqs.length > 0 && (
          <section className="mt-6">
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="group relative origin-center rounded-[1.5rem] p-1 transition duration-300 hover:-translate-y-1"
                  style={{
                    transform: `scale(0.9) rotate(${index % 2 === 0 ? '-0.6deg' : '0.6deg'})`,
                    backgroundImage: `linear-gradient(to bottom left, ${THEME.cardBorderDark}, ${THEME.cardBorderLight}, ${THEME.cardBorderDark})`,
                    boxShadow: '0 10px 24px -10px rgba(11,43,61,0.4)',
                  }}
                >
                  <article
                    className="relative flex min-h-[13.25rem] flex-col overflow-hidden rounded-[1.2rem] p-4"
                    style={{
                      backgroundColor: '#E9D3A3',
                      backgroundImage: `url("${WOOD_GRAIN}"), url("${WOOD_KNOT}"), linear-gradient(100deg, #EFDCB0, #E3C892 45%, #EFDCB0)`,
                      backgroundSize: '720px 720px, 900px 900px, auto',
                      backgroundBlendMode: 'multiply, multiply, normal',
                      boxShadow: 'inset 0 0 50px 10px rgba(0,0,0,0.4)',
                    }}
                  >
                    <h3 className={`${font.body} text-xl font-semibold leading-snug md:text-2xl`} style={{ color: THEME.ink }}>
                      {faq.pertanyaan}
                    </h3>

                    <p className={`${font.body} mt-3 text-base leading-8 md:text-lg`} style={{ color: THEME.inkSoft }}>
                      {faq.jawaban}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && faqs.length > 0 && (
          <p className={`${font.body} mt-6 text-center text-base md:text-lg`} style={{ color: THEME.inkSoft }}>
            Menampilkan{' '}
            <span className="font-semibold" style={{ color: THEME.ink }}>{filteredFaqs.length}</span> dari{' '}
            <span className="font-semibold" style={{ color: THEME.ink }}>{faqs.length}</span> pertanyaan.
          </p>
        )}

        {/* ===== CTA chatbot ===== */}
        <div className="mx-auto mt-6 flex max-w-5xl flex-col items-center gap-6 md:flex-row md:items-center md:gap-0">
          {/* Maskot: 1/2 wilayah, di luar kartu, dengan glow coklat */}
          <div className="relative flex w-full shrink-0 items-center justify-center md:w-1/2">
            <div
              className="pointer-events-none absolute h-40 w-40 rounded-full blur-3xl sm:h-48 sm:w-48 md:h-56 md:w-56"
              style={{ background: `radial-gradient(circle, ${THEME.brass}88, ${THEME.wax}33 60%, transparent 75%)` }}
            />
            <button
              type="button"
              onClick={openChatbot}
              aria-label="Buka chatbot dari maskot Obor"
              className="relative shrink-0 rounded-[1.5rem] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none"
            >
              <img
                src={maskotObor}
                alt="Maskot Obor"
                className="w-32 sm:w-40 md:w-48"
                style={{ filter: `drop-shadow(0 0 22px ${THEME.brass}99) drop-shadow(0 0 46px ${THEME.wax}66) drop-shadow(0 14px 26px rgba(0,0,0,0.3))` }}
              />
            </button>
          </div>

          {/* Kartu teks: 1/2 wilayah */}
          <div className="w-full md:w-1/2">
            <div
              className="relative rounded-[1.8rem] p-1"
              style={{
                backgroundImage: `linear-gradient(to bottom left, ${THEME.cardBorderDark}, ${THEME.cardBorderLight}, ${THEME.cardBorderDark})`,
                boxShadow: '0 10px 30px -12px rgba(11,43,61,0.45)',
              }}
            >
              <section
                className="relative rounded-[1.6rem] p-5 text-center md:p-8 md:text-left"
                style={{
                  backgroundColor: THEME.parchment,
                  backgroundImage: `url(${PAPER_GRAIN})`,
                  boxShadow: 'inset 0 0 50px 10px rgba(0,0,0,0.4)',
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
                  style={{ color: THEME.brass }}
                >
                  Masih belum menemukan pertanyaannya?
                </p>

                <button
                  type="button"
                  onClick={openChatbot}
                  className={`${font.body} mt-3 text-center text-xl font-semibold leading-relaxed underline underline-offset-4 transition md:text-left md:text-3xl`}
                  style={{ color: THEME.ink, textDecorationColor: `${THEME.ink}66` }}
                >
                  Coba tanyakan ke Chatbot
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
