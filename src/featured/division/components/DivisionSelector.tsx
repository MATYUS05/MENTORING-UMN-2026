// src/featured/division/components/DivisionSelector.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import type { Division } from '../types';
import shelfImg from '../../../assets/division/shelf_cropped.png';

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
  const topShelf = useMemo(() => divisions.slice(0, 6), [divisions]);
  const bottomShelf = useMemo(() => divisions.slice(6), [divisions]);

  // Mobile horizontal scroll references for Row 1 & Row 2
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const isInteracting1Ref = useRef(false);
  const isInteracting2Ref = useRef(false);
  const isDragging1Ref = useRef(false);
  const isDragging2Ref = useRef(false);
  const startX1Ref = useRef(0);
  const startX2Ref = useRef(0);
  const startScroll1Ref = useRef(0);
  const startScroll2Ref = useRef(0);
  const hasDraggedRef = useRef(false);
  const resumeTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollPos1Ref = useRef<number>(0);
  const scrollPos2Ref = useRef<number>(0);

  // Tripled lists for seamless infinite loop on mobile (6 top, 5 bottom)
  const duplicatedTop = useMemo(() => {
    if (!topShelf || topShelf.length === 0) return [];
    return [...topShelf, ...topShelf, ...topShelf];
  }, [topShelf]);

  const duplicatedBottom = useMemo(() => {
    if (!bottomShelf || bottomShelf.length === 0) return [];
    return [...bottomShelf, ...bottomShelf, ...bottomShelf];
  }, [bottomShelf]);

  // Pointer drag & touch interaction handlers for Row 1
  const handlePointerDown1 = (e: React.PointerEvent) => {
    isDragging1Ref.current = true;
    isInteracting1Ref.current = true;
    hasDraggedRef.current = false;
    startX1Ref.current = e.clientX;
    if (row1Ref.current) {
      startScroll1Ref.current = row1Ref.current.scrollLeft;
      scrollPos1Ref.current = row1Ref.current.scrollLeft;
    }
    if (resumeTimer1Ref.current) clearTimeout(resumeTimer1Ref.current);
  };

  const handlePointerMove1 = (e: React.PointerEvent) => {
    if (!isDragging1Ref.current || !row1Ref.current) return;
    const dx = e.clientX - startX1Ref.current;
    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }
    row1Ref.current.scrollLeft = startScroll1Ref.current - dx;
    scrollPos1Ref.current = row1Ref.current.scrollLeft;
  };

  const handlePointerUp1 = () => {
    isDragging1Ref.current = false;
    if (row1Ref.current) scrollPos1Ref.current = row1Ref.current.scrollLeft;
    if (resumeTimer1Ref.current) clearTimeout(resumeTimer1Ref.current);
    // 0.5 second idle delay before resuming auto-scroll
    resumeTimer1Ref.current = setTimeout(() => {
      if (row1Ref.current) scrollPos1Ref.current = row1Ref.current.scrollLeft;
      isInteracting1Ref.current = false;
      hasDraggedRef.current = false;
    }, 500);
  };

  const handleWheel1 = () => {
    isInteracting1Ref.current = true;
    if (row1Ref.current) scrollPos1Ref.current = row1Ref.current.scrollLeft;
    if (resumeTimer1Ref.current) clearTimeout(resumeTimer1Ref.current);
    resumeTimer1Ref.current = setTimeout(() => {
      if (row1Ref.current) scrollPos1Ref.current = row1Ref.current.scrollLeft;
      isInteracting1Ref.current = false;
    }, 500);
  };

  // Pointer drag & touch interaction handlers for Row 2
  const handlePointerDown2 = (e: React.PointerEvent) => {
    isDragging2Ref.current = true;
    isInteracting2Ref.current = true;
    hasDraggedRef.current = false;
    startX2Ref.current = e.clientX;
    if (row2Ref.current) {
      startScroll2Ref.current = row2Ref.current.scrollLeft;
      scrollPos2Ref.current = row2Ref.current.scrollLeft;
    }
    if (resumeTimer2Ref.current) clearTimeout(resumeTimer2Ref.current);
  };

  const handlePointerMove2 = (e: React.PointerEvent) => {
    if (!isDragging2Ref.current || !row2Ref.current) return;
    const dx = e.clientX - startX2Ref.current;
    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }
    row2Ref.current.scrollLeft = startScroll2Ref.current - dx;
    scrollPos2Ref.current = row2Ref.current.scrollLeft;
  };

  const handlePointerUp2 = () => {
    isDragging2Ref.current = false;
    if (row2Ref.current) scrollPos2Ref.current = row2Ref.current.scrollLeft;
    if (resumeTimer2Ref.current) clearTimeout(resumeTimer2Ref.current);
    // 0.5 second idle delay before resuming auto-scroll
    resumeTimer2Ref.current = setTimeout(() => {
      if (row2Ref.current) scrollPos2Ref.current = row2Ref.current.scrollLeft;
      isInteracting2Ref.current = false;
      hasDraggedRef.current = false;
    }, 500);
  };

  const handleWheel2 = () => {
    isInteracting2Ref.current = true;
    if (row2Ref.current) scrollPos2Ref.current = row2Ref.current.scrollLeft;
    if (resumeTimer2Ref.current) clearTimeout(resumeTimer2Ref.current);
    resumeTimer2Ref.current = setTimeout(() => {
      if (row2Ref.current) scrollPos2Ref.current = row2Ref.current.scrollLeft;
      isInteracting2Ref.current = false;
    }, 500);
  };

  // Continuous horizontal auto-scroll loop (30% slower speed: 0.52px/frame)
  // Row 1 drifts LEFT, Row 2 drifts RIGHT
  useEffect(() => {
    const el1 = row1Ref.current;
    const el2 = row2Ref.current;
    if (divisions.length === 0) return;

    let animationFrameId: number;
    const speed = 0.52; // 30% slower, smooth synchronized speed

    if (el1) scrollPos1Ref.current = el1.scrollLeft;
    if (el2) {
      const singleSetWidth2 = el2.scrollWidth / 3;
      if (el2.scrollLeft === 0 && singleSetWidth2 > 0) {
        el2.scrollLeft = singleSetWidth2;
        scrollPos2Ref.current = singleSetWidth2;
      } else {
        scrollPos2Ref.current = el2.scrollLeft;
      }
    }

    const scrollLoop = () => {
      // Row 1: Rak Atas (Meluncur ke Kiri ←)
      if (!isInteracting1Ref.current && el1) {
        const singleSetWidth1 = el1.scrollWidth / 3;
        if (singleSetWidth1 > 0) {
          scrollPos1Ref.current += speed;
          if (scrollPos1Ref.current >= singleSetWidth1 * 2) {
            scrollPos1Ref.current -= singleSetWidth1;
          }
          el1.scrollLeft = scrollPos1Ref.current;
        }
      }

      // Row 2: Rak Bawah (Meluncur ke Kanan →)
      if (!isInteracting2Ref.current && el2) {
        const singleSetWidth2 = el2.scrollWidth / 3;
        if (singleSetWidth2 > 0) {
          if (scrollPos2Ref.current <= 0) {
            scrollPos2Ref.current = singleSetWidth2;
          }
          scrollPos2Ref.current -= speed;
          if (scrollPos2Ref.current <= 0) {
            scrollPos2Ref.current += singleSetWidth2;
          }
          el2.scrollLeft = scrollPos2Ref.current;
        }
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimer1Ref.current) clearTimeout(resumeTimer1Ref.current);
      if (resumeTimer2Ref.current) clearTimeout(resumeTimer2Ref.current);
    };
  }, [divisions]);

  const handleSelect = (originalIndex: number) => {
    if (hasDraggedRef.current) return;
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

  const renderLogoButton = (division: Division, originalIndex: number, isMobile = false, keyPrefix = '') => {
    const isActive = originalIndex === activeIndex;
    return (
      <button
        key={`${keyPrefix}-${division.id || originalIndex}`}
        type="button"
        onClick={() => handleSelect(originalIndex)}
        aria-label={`Pilih Divisi ${division.name}`}
        className="group relative flex flex-col items-center justify-center shrink-0 transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 active:outline-none border-none rounded-full cursor-pointer select-none [-webkit-tap-highlight-color:transparent]"
      >
        {/* Division Name Tooltip (Shows On Hover Only) */}
        <div className="absolute -top-8 sm:-top-10 md:-top-11 z-40 whitespace-nowrap rounded-md border border-amber-600/80 bg-[#1c0e07]/95 px-2 py-0.5 sm:px-3 sm:py-1 font-heading text-[10px] sm:text-xs md:text-sm font-bold text-[#fde68a] backdrop-blur-md opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 shadow-lg">
          {division.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1c0e07]" />
        </div>

        {/* Circular Logo Badge */}
        <div className={`relative flex ${isMobile ? 'h-16 w-16 xs:h-20 xs:w-20' : 'h-13 w-13 sm:h-18 sm:w-18 md:h-22 md:w-22 lg:h-26 lg:w-26'} items-center justify-center rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-transparent ${isActive ? 'border-amber-400 bg-transparent ring-2 ring-amber-400/70 shadow-[0_0_18px_rgba(245,158,11,0.7)] scale-105' : 'border-transparent bg-transparent'}`}>
          {division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? (
            <img
              src={division.logo}
              alt={division.name}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain p-0 rounded-full border-none outline-none pointer-events-none select-none"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`${isMobile ? 'text-2xl xs:text-3xl' : 'text-xl sm:text-3xl md:text-4xl lg:text-5xl'} ${division.logo && (division.logo.startsWith('http') || division.logo.startsWith('/')) ? 'hidden' : ''} select-none pointer-events-none`}>
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
          touch-action: pan-x !important;
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
          {topShelf.map((division, idx) => renderLogoButton(division, idx, false, 'desktop-top'))}
        </div>

        {/* Row 2: Rak Bawah (5 Divisi - Bottom Slot) */}
        <div className="absolute top-[62%] bottom-[7%] left-[5%] right-[5%] z-20 flex items-center justify-around px-2 sm:px-6 md:px-8">
          {bottomShelf.map((division, idx) => renderLogoButton(division, idx + topShelf.length, false, 'desktop-bottom'))}
        </div>
      </div>

      {/* Mobile 2-Row Horizontal Auto-scrolling Wooden Shelf Frame (< sm) */}
      <div className="sm:hidden relative w-full max-w-[390px] xs:max-w-[440px] mx-auto aspect-[3854/2200] min-h-[280px] xs:min-h-[310px] overflow-hidden">
        <img
          src={shelfImg}
          alt="Rak Divisi Wooden Shelf Mobile"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
        />

        {/* Row 1: Rak Atas (6 Divisi - Top Slot, Auto-scroll to LEFT) */}
        <div
          ref={row1Ref}
          onPointerDown={handlePointerDown1}
          onPointerMove={handlePointerMove1}
          onPointerUp={handlePointerUp1}
          onPointerLeave={handlePointerUp1}
          onPointerCancel={handlePointerUp1}
          onWheel={handleWheel1}
          className="absolute top-[25%] bottom-[42%] left-[4%] right-[4%] z-20 flex items-center gap-6 overflow-x-auto hide-scrollbar touch-scroll will-change-scroll px-3 cursor-grab active:cursor-grabbing select-none"
        >
          {duplicatedTop.map((division, idx) => {
            const originalIndex = idx % topShelf.length;
            return renderLogoButton(division, originalIndex, true, `mob-top-${idx}`);
          })}
        </div>

        {/* Row 2: Rak Bawah (5 Divisi - Bottom Slot, Auto-scroll to RIGHT) */}
        <div
          ref={row2Ref}
          onPointerDown={handlePointerDown2}
          onPointerMove={handlePointerMove2}
          onPointerUp={handlePointerUp2}
          onPointerLeave={handlePointerUp2}
          onPointerCancel={handlePointerUp2}
          onWheel={handleWheel2}
          className="absolute top-[62%] bottom-[8%] left-[5%] right-[5%] z-20 flex items-center gap-6 overflow-x-auto hide-scrollbar touch-scroll will-change-scroll px-3 cursor-grab active:cursor-grabbing select-none"
        >
          {duplicatedBottom.map((division, idx) => {
            const originalIndex = (idx % bottomShelf.length) + topShelf.length;
            return renderLogoButton(division, originalIndex, true, `mob-bot-${idx}`);
          })}
        </div>
      </div>
    </div>
  );
};




