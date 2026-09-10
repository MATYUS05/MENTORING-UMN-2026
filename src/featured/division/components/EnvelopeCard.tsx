// src/featured/division/components/EnvelopeCard.tsx
import React, { useEffect, useState } from 'react';
import type { Division } from '../types';
import amplopImg from '../../../assets/division/envelope_cropped.webp';
import envelopeAndScrollImg from '../../../assets/division/Envelope and scroll.webp';

interface EnvelopeCardProps {
  division: Division;
  onClick: () => void;
  /** Modal lagi terbuka atau tidak, dipakai buat tahu kapan amplop boleh kembali normal. */
  isModalOpen: boolean;
}

/**
 * Waktu jeda agar pengguna dapat melihat amplop terbuka dengan gulungan perkamen
 * di posisinya dengan ukuran yang sama persis sebelum modal perkamen interaktif dibuka.
 */
const JEDA_ANIMASI_BUKA_MS = 500;

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ division, onClick, isModalOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  // Preload asset animasi pembuka agar instan saat diklik
  useEffect(() => {
    const img = new Image();
    img.src = envelopeAndScrollImg;
  }, []);

  const handleClick = () => {
    if (isOpening || isModalOpen) return;
    setIsOpening(true);
    setTimeout(() => {
      onClick();
    }, JEDA_ANIMASI_BUKA_MS);
  };

  useEffect(() => {
    if (!isModalOpen) {
      // Kembalikan amplop ke state normal dengan jeda halus setelah modal tertutup
      const timeout = setTimeout(() => {
        setIsOpening(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  return (
    <div className="relative mx-auto w-full max-w-[540px] sm:max-w-[620px] md:max-w-[700px] lg:max-w-[760px] aspect-[2891/1597] flex items-center justify-center">
      {/* Interactive Envelope Body */}
      <div
        onClick={handleClick}
        className={`
          group relative w-full h-full cursor-pointer select-none
          transition-all duration-300 ease-out will-change-transform
          hover:-translate-y-2 active:scale-[0.98]
          ${isOpening ? 'scale-[1.02] -translate-y-1' : ''}
        `}
      >
        {/* 1. Closed Envelope Asset */}
        <img
          src={amplopImg}
          alt="Amplop Majapahit Tertutup"
          decoding="async"
          className={`
            absolute inset-0 w-full h-full object-contain
            transition-all duration-300 ease-out
            ${isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]'}
          `}
        />

        {/* 2. Opened Envelope & Scroll Asset (Identical size and placement in-place) */}
        <img
          src={envelopeAndScrollImg}
          alt="Amplop dan Perkamen Terbuka"
          decoding="async"
          className={`
            absolute inset-0 w-full h-full object-contain pointer-events-none
            transition-all duration-300 ease-out
            ${isOpening ? 'opacity-100 scale-250 -translate-y-[25%] drop-shadow-[0_0_28px_rgba(245,158,11,0.7)]' : 'opacity-0 scale-95 pointer-events-none'}
          `}
        />

        {/* Content Centered Over Closed Envelope Body (Fades out when opening) */}
        <div
          className={`
            absolute inset-0 z-10
            transition-all duration-300 ease-out
            ${isOpening ? '-translate-y-6 opacity-0 pointer-events-none scale-95' : 'group-hover:-translate-y-1 opacity-100'}
          `}
        >
          {/* Nama Divisi */}
          <div className="absolute top-[36%] sm:top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] text-center flex flex-col items-center justify-center space-y-1 sm:space-y-1.5">
            <span className="font-heading text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.3em] font-extrabold text-[#7a4120] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              DIVISI
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#2b1408] line-clamp-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              {division.name}
            </h2>
          </div>

          {/* Logo Divisi Emblem (Tepat di Tengah Lingkaran Segel Merah: x=49.4%, y=73.7%) */}
          <div className="absolute top-[73%] left-[49.9%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div
              className={`
                relative flex w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22
                items-center justify-center rounded-full overflow-hidden p-0
                shadow-[0_0_12px_rgba(180,30,30,0.6)]
                transition-all duration-300 ease-out
                group-hover:scale-110
              `}
            >
              {division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? (
                <img
                  src={division.logo}
                  alt={division.name}
                  className="h-full w-full object-cover scale-[1.45] rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? 'hidden' : ''}`}>
                {division.logo || '📜'}
              </span>
            </div>
          </div>

          {/* Click to Open Callout Badge */}
          <div
            className={`
              absolute -bottom-10 sm:-bottom-10 left-1/2 -translate-x-1/2 z-20 font-heading
              inline-flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border-2 border-[#d4af37]/80
              bg-gradient-to-r from-[#231107] via-[#3c1d0e] to-[#231107] px-4 py-1.5 sm:px-6 sm:py-2
              text-xs sm:text-sm md:text-base font-bold tracking-wider text-[#fde68a]
              transition-all duration-300 ease-out
              group-hover:scale-105 group-hover:border-[#fde68a] group-hover:via-[#4e2613]
            `}
          >
            <span className="text-amber-400 text-xs sm:text-sm transition-transform duration-300 group-hover:rotate-45">✦</span>
            <span>CLICK TO OPEN</span>
            <svg className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-amber-300 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};






