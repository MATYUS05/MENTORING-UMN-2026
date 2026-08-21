// src/featured/division/components/DivisionSelector.tsx
import React from 'react';
import type { Division } from '../types';
import shelfImg from '../../../assets/division/shelf_cropped.png';
import shelfMobileImg from '../../../assets/division/shelf_mobile.png';

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
  const topShelf = divisions.slice(0, 6);
  const bottomShelf = divisions.slice(6);

  const handleSelect = (originalIndex: number) => {
    onSelectDivision(originalIndex);
    // Smooth scroll up to envelope section on all screen sizes
    if (typeof window !== 'undefined') {
      const envelopeSection = document.getElementById('division-envelope-section');
      if (envelopeSection) {
        envelopeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderLogoButton = (division: Division, originalIndex: number, isMobile = false) => {
    const isActive = originalIndex === activeIndex;
    return (
      <button
        key={division.id || `div-${originalIndex}`}
        type="button"
        onClick={() => handleSelect(originalIndex)}
        aria-label={`Pilih Divisi ${division.name}`}
        className="group relative flex flex-col items-center justify-center shrink-0 transition-all duration-300 focus:outline-none"
      >
        {/* Division Name Tooltip (Shows On Hover Only) */}
        <div className="absolute -top-8 sm:-top-10 md:-top-11 z-40 whitespace-nowrap rounded-md border border-amber-600/80 bg-[#1c0e07]/95 px-2 py-0.5 sm:px-3 sm:py-1 font-heading text-[10px] sm:text-xs md:text-sm font-bold text-[#fde68a] backdrop-blur-md opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 shadow-lg">
          {division.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c0e07]" />
        </div>

        {/* Circular Logo Badge */}
        <div className={`relative flex ${isMobile ? 'h-24 w-24 xs:h-28 xs:w-28' : 'h-13 w-13 sm:h-18 sm:w-18 md:h-22 md:w-22 lg:h-26 lg:w-26'} items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-[#2b170c] ${isActive ? 'border-amber-400 bg-[#2b170c] ring-2 ring-amber-400/70 shadow-[0_0_18px_rgba(245,158,11,0.7)] scale-105' : 'border-[#4a2e1b]/80 bg-[#120804]/90'}`}>
          {division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? (
            <img
              src={division.logo}
              alt={division.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-2 sm:p-2 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`${isMobile ? 'text-4xl xs:text-5xl' : 'text-xl sm:text-3xl md:text-4xl lg:text-5xl'} ${division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? 'hidden' : ''}`}>
            {division.logo || '📜'}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="relative mx-auto mt-2 w-full max-w-6xl lg:max-w-7xl px-2 sm:px-4">
      {/* Hide Scrollbar Rules */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .touch-scroll {
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
        }
      `}</style>

      {/* Desktop 2-Row Wooden Shelf Frame (sm+) */}
      <div className="hidden sm:block relative w-full aspect-[3854/1726] min-h-[270px] md:min-h-[340px] overflow-visible">
        <img
          src={shelfImg}
          alt="Rak Divisi Wooden Shelf Desktop"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
        />

        {/* Row 1: Rak Atas (6 Divisi - Top Slot) */}
        <div className="absolute top-[24%] bottom-[43%] left-[4%] right-[4%] z-20 flex items-center justify-around px-1 sm:px-4 md:px-6">
          {topShelf.map((division, idx) => renderLogoButton(division, idx))}
        </div>

        {/* Row 2: Rak Bawah (5 Divisi - Bottom Slot) */}
        <div className="absolute top-[57%] bottom-[7%] left-[5%] right-[5%] z-20 flex items-center justify-around px-2 sm:px-6 md:px-8">
          {bottomShelf.map((division, idx) => renderLogoButton(division, idx + topShelf.length))}
        </div>
      </div>

      {/* Mobile 1-Column Vertical Wooden Shelf Frame (< sm) */}
      <div className="sm:hidden relative w-full max-w-[260px] xs:max-w-[290px] mx-auto aspect-[600/1200] min-h-[480px] max-h-[540px] overflow-hidden">
        <img
          src={shelfMobileImg}
          alt="Rak Divisi Wooden Shelf Mobile"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
        />

        {/* Mobile Single Vertical Column: All Divisions Scrollable Inside Wooden Frame */}
        <div className="absolute top-[13%] bottom-[5%] left-[8%] right-[8%] z-20 flex flex-col items-center justify-start gap-5 py-3 overflow-y-auto hide-scrollbar touch-scroll">
          {divisions.map((division, idx) => renderLogoButton(division, idx, true))}
        </div>
      </div>
    </div>
  );
};

