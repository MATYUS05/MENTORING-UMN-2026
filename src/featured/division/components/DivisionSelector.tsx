// src/featured/division/components/DivisionSelector.tsx
import React from 'react';
import type { Division } from '../types';
import rakDesktop from '../../../assets/division/rak_division_desktop.png';
import rakMobile from '../../../assets/division/rak_division_mobile.png';

interface DivisionSelectorProps {
  divisions: Division[];
  activeIndex: number;
  onSelectDivision: (index: number) => void;
}

export const DivisionSelector: React.FC<DivisionSelectorProps> = ({
  divisions,
  activeIndex,
  onSelectDivision,
}) => {
  const topShelf = divisions.slice(0, 5);
  const bottomShelf = divisions.slice(5, 10);

  const handleSelect = (originalIndex: number) => {
    onSelectDivision(originalIndex);
    // Smooth scroll up to envelope section on all screen sizes (Desktop & Mobile)
    if (typeof window !== 'undefined') {
      const envelopeSection = document.getElementById('division-envelope-section');
      if (envelopeSection) {
        envelopeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderLogoButton = (division: Division, originalIndex: number) => {
    return (
      <button
        key={division.id || `div-${originalIndex}`}
        type="button"
        onClick={() => handleSelect(originalIndex)}
        aria-label={`Pilih Divisi ${division.name}`}
        className="group relative flex flex-col items-center justify-center shrink-0 transition-all duration-300 focus:outline-none"
      >
        {/* Division Name Tooltip (Shows On Hover Only) */}
        <div className="absolute -top-9 sm:-top-10 md:-top-11 z-40 whitespace-nowrap rounded-md border border-amber-600/80 bg-[#1c0e07]/95 px-3 py-1 font-heading text-xs sm:text-sm font-bold text-[#fde68a] backdrop-blur-md opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1">
          {division.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c0e07]" />
        </div>

        {/* Circular Logo Badge (Enlarged Mobile Size, Desktop Reverted) */}
        <div className="relative flex h-25 w-25 items-center justify-center rounded-full border border-[#4a2e1b]/70 bg-[#120804]/90 transition-all duration-300 sm:h-18 sm:w-18 md:h-20 md:w-20 lg:h-22 lg:w-22 group-hover:scale-110 group-hover:border-amber-600/80 group-hover:bg-[#2b170c]">
          {division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? (
            <img
              src={division.logo}
              alt={division.name}
              className="h-full w-full object-contain p-1.5 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`text-2xl sm:text-3xl md:text-4xl ${division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? 'hidden' : ''}`}>
            {division.logo || '📜'}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="relative mx-auto mt-2 w-full max-w-6xl sm:max-w-7xl px-2 sm:px-4 lg:px-8">
      {/* Hide Scrollbar Rules */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Desktop Rak Frame (1440x500 Aspect Ratio 2.88 - 2 Horizontal Shelves) */}
      <div className="hidden sm:block relative w-full aspect-[1440/500] min-h-[280px] md:min-h-[340px] rounded-3xl overflow-hidden border-2 border-amber-900/60 bg-[#140a04]">
        <img
          src={rakDesktop}
          alt="Rak Divisi Wooden Shelf Desktop"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Desktop Row 1: Rak Atas (5 Divisi - Top Slot) */}
        <div className="absolute top-[13.5%] bottom-[48%] left-[5.5%] right-[5.5%] z-20 flex items-center justify-around px-6">
          {topShelf.map((division, idx) => renderLogoButton(division, idx))}
        </div>

        {/* Desktop Row 2: Rak Bawah (5 Divisi - Bottom Slot) */}
        <div className="absolute top-[54%] bottom-[11.5%] left-[5.5%] right-[5.5%] z-20 flex items-center justify-around px-6">
          {bottomShelf.map((division, idx) => renderLogoButton(division, idx + 5))}
        </div>
      </div>

      {/* Mobile Rak Frame (1 Straight Vertical Line Column - Matching rak_division_mobile.png) */}
      <div className="sm:hidden relative w-full max-w-xs mx-auto aspect-[1/2] min-h-[440px] rounded-2xl overflow-hidden border-2 border-amber-900/60 bg-[#140a04]">
        <img
          src={rakMobile}
          alt="Rak Divisi Wooden Shelf Mobile"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />

        {/* Mobile Single Vertical Column: All 10 Divisions Trimmed Safely Inside Wooden Shelf Frame */}
        <div className="absolute top-[5%] bottom-[5%] left-[10%] right-[10%] z-20 flex flex-col items-center justify-start gap-4 py-2 overflow-y-auto hide-scrollbar">
          {divisions.map((division, idx) => renderLogoButton(division, idx))}
        </div>
      </div>
    </div>
  );
};
