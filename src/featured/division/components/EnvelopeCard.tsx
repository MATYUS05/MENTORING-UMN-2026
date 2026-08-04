// src/featured/division/components/EnvelopeCard.tsx
import React, { useState } from 'react';
import type { Division } from '../types';
import amplopImg from '../../../assets/division/amplop.png';

interface EnvelopeCardProps {
  division: Division;
  onClick: () => void;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ division, onClick }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onClick();
      setIsOpening(false);
    }, 450);
  };

  return (
    <div className="relative mx-auto w-full max-w-[520px] sm:max-w-[560px] md:max-w-[620px] aspect-[3/2] flex items-center justify-center">
      {/* Interactive Envelope Body */}
      <div
        onClick={handleClick}
        className={`
          group relative w-full h-full cursor-pointer select-none
          transition-all duration-500 hover:-translate-y-2 active:scale-98
          ${isOpening ? 'scale-105 opacity-90' : ''}
        `}
      >
        {/* The Envelope Asset (900x600 aspect 3/2) */}
        <img
          src={amplopImg}
          alt="Amplop Majapahit"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Content Centered Over Envelope Body (Order: Nama -> Logo -> Click to Open) */}
        <div
          className={`
            absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 sm:gap-10 md:gap-11 px-6 pt-5 pb-4 sm:px-10 sm:pt-8 sm:pb-6 text-center
            transition-transform duration-500
            ${isOpening ? '-translate-y-6 opacity-0' : 'group-hover:-translate-y-1'}
          `}
        >
          {/* 1. Nama Divisi (Atas Logo) */}
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#3a2012] line-clamp-2 max-w-[85%] sm:text-2xl md:text-3xl lg:text-4xl">
            {division.name}
          </h2>

          {/* 2. Logo Divisi Emblem (Tengah) */}
          <div className="relative -translate-y-2.5 sm:-translate-y-2 md:-translate-y-5">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#4a2e1b]/80 bg-[#1f1008] p-1.5 sm:h-18 sm:w-18 md:h-24 md:w-24">
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
              <span className={`text-3xl sm:text-4xl md:text-5xl ${division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? 'hidden' : ''}`}>
                {division.logo || '📜'}
              </span>
            </div>
          </div>

          {/* 3. Click to Open Callout Badge (Bawah Logo) */}
          <div className="font-body inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-900/90 bg-[#3a2012] px-4 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest text-[#fde68a] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#4d2915] group-hover:border-amber-500">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400 animate-ping" />
            <span>CLICK TO OPEN</span>
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
