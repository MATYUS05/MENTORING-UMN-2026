// src/featured/division/components/EnvelopeCard.tsx
import React, { useEffect, useState } from 'react';
import type { Division } from '../types';
import amplopImg from '../../../assets/division/envelope_cropped.png';

interface EnvelopeCardProps {
  division: Division;
  onClick: () => void;
  /** Modal lagi terbuka atau tidak, dipakai buat tahu kapan amplop boleh kembali normal. */
  isModalOpen: boolean;
}

/**
 * Jeda antara klik dan munculnya modal, yaitu waktu yang diberikan agar animasi
 * amplop terbuka sempat terlihat.
 */
const JEDA_ANIMASI_BUKA_MS = 180;

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ division, onClick, isModalOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(onClick, JEDA_ANIMASI_BUKA_MS);
  };

  useEffect(() => {
    if (!isModalOpen) setIsOpening(false);
  }, [isModalOpen]);

  return (
    <div className="relative mx-auto w-full max-w-[540px] sm:max-w-[620px] md:max-w-[700px] lg:max-w-[760px] aspect-[2891/1597] flex items-center justify-center">
      {/* Interactive Envelope Body */}
      <div
        onClick={handleClick}
        className={`
          group relative w-full h-full cursor-pointer select-none
          transition-all duration-500 hover:-translate-y-2 active:scale-98
          ${isOpening ? 'scale-105 opacity-90' : ''}
        `}
      >
        {/* The Envelope Asset */}
        <img
          src={amplopImg}
          alt="Amplop Majapahit"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Content Centered Over Envelope Body */}
        <div
          className={`
            absolute inset-0 z-10
            transition-transform duration-500
            ${isOpening ? '-translate-y-6 opacity-0' : 'group-hover:-translate-y-1'}
          `}
        >
          {/* 1. Nama Divisi (Dinaikkan ke area segitiga amplop yang lebih lebar agar tidak terpotong) */}
          <div className="absolute top-[36%] sm:top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] text-center flex flex-col items-center justify-center space-y-1 sm:space-y-1.5">
            <span className="font-heading text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.3em] font-extrabold text-[#7a4120] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              DIVISI
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#2b1408] line-clamp-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              {division.name}
            </h2>
          </div>

          {/* 2. Logo Divisi Emblem (Tepat di Tengah Lingkaran Segel Merah: x=49.4%, y=73.7%) */}
          <div className="absolute top-[73%] left-[49.9%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="relative flex w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 items-center justify-center rounded-full border-2 border-amber-400/80 bg-[#1c0d06]/85 p-1 sm:p-1.5 shadow-[0_0_12px_rgba(180,30,30,0.6)] group-hover:scale-110 group-hover:border-amber-300 transition-transform duration-300">
              {division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? (
                <img
                  src={division.logo}
                  alt={division.name}
                  className="h-full w-full object-contain rounded-full"
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

          {/* 3. Click to Open Callout Badge (Tanpa shadow) */}
          <div className="absolute -bottom-3.5 sm:-bottom-5 left-1/2 -translate-x-1/2 z-20 font-heading inline-flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border-2 border-[#d4af37]/80 bg-gradient-to-r from-[#231107] via-[#3c1d0e] to-[#231107] px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm md:text-base font-bold tracking-wider text-[#fde68a] transition-all duration-300 group-hover:scale-105 group-hover:border-[#fde68a] group-hover:via-[#4e2613]">
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


