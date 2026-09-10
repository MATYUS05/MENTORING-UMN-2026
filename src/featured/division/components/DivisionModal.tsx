import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Division } from '../types';
import { DivisionMember } from './DivisionMember';
import scrollImg from '../../../assets/division/scroll_cropped.webp';

interface DivisionModalProps {
  division: Division | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DivisionModal: React.FC<DivisionModalProps> = ({
  division,
  isOpen,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(division);

  // Sync division data while maintaining state during close animation
  useEffect(() => {
    if (division) {
      setCurrentDivision(division);
    }
  }, [division]);

  // Smooth open and exit animation lifecycle
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setIsRendered(true);
      // Small frame delay to ensure browser registers initial hidden CSS before animating in
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else if (isRendered) {
      setIsVisible(false);
      // Wait for exit transition duration (260ms) before unmounting from DOM
      timer = setTimeout(() => {
        setIsRendered(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Handle ESC key press and scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isRendered || !currentDivision) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden pointer-events-auto"
    >
      {/* Hide Scrollbar & Touch Scroll Rules */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .touch-scroll {
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-y !important;
          overscroll-behavior-y: contain;
        }
      `}</style>

      {/* Dark Blurred Backdrop Overlay (Non-clickable to close) */}
      <div
        className={`
          fixed inset-0 bg-black/80 backdrop-blur-sm pointer-events-none
          transition-opacity duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Modal Parchment Container */}
      <div
        className={`
          relative z-10 w-[94vw] max-w-[360px] xs:max-w-[400px] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl
          aspect-[4/5] sm:aspect-[2210/1575] max-h-[85vh] sm:max-h-[88vh] flex flex-col mx-auto my-auto
          text-[#3a2012] overflow-hidden will-change-transform
          transition-all duration-350 cubic-bezier(0.16, 1, 0.3, 1)
          ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.88] translate-y-6'}
        `}
      >
        {/* Parchment Scroll Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={scrollImg}
            alt="Parchment Scroll Background"
            className="w-full h-full object-fill filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Scrollable Content Body (Strict Safe Area Insets to avoid wooden rolls & upward curved bottom edge across all devices) */}
        <div
          className={`
            absolute top-[13%] bottom-[22%] left-[16%] right-[16%]
            sm:top-[12%] sm:bottom-[20%] sm:left-[14%] sm:right-[14%]
            md:bottom-[19%]
            z-10 overflow-y-auto sm:flex sm:flex-col
            hide-scrollbar touch-scroll px-0.5 sm:px-4 py-0.5 space-y-1.5 sm:space-y-3
            transition-all duration-300 delay-75 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
        >
          {/* Header Info Section (Centered Logo, Title & Description) */}
          <div className="relative flex flex-col items-center text-center gap-1 sm:gap-2 border-b border-[#4a2e1b]/30 pb-2 sm:pb-3.5 sm:shrink-0 px-8 sm:px-12">
            {/* Division Logo Emblem */}
            <div className="shrink-0 relative">
              <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full overflow-hidden p-0 shadow-sm">
                {currentDivision.logo.startsWith('http') || currentDivision.logo.startsWith('/') ? (
                  <img
                    src={currentDivision.logo}
                    alt={currentDivision.name}
                    className="h-full w-full object-contain rounded-full border-none outline-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`text-xl sm:text-2xl md:text-3xl ${currentDivision.logo.startsWith('http') || currentDivision.logo.startsWith('/') ? 'hidden' : ''}`}>
                  {currentDivision.logo || '📜'}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="w-full text-center space-y-0.5 sm:space-y-1">
              <h3 className="font-heading text-sm sm:text-xl md:text-2xl font-bold text-[#2b170c] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                Divisi {currentDivision.name}
              </h3>
              <p className="font-body text-[10.5px] sm:text-xs md:text-sm leading-relaxed text-[#4a2e1b] font-medium max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
                {currentDivision.description}
              </p>
            </div>

            {/* Close Button Inside Scroll Header (Absolute Top-Right) */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Tutup Modal"
              className="absolute top-0 right-0 sm:top-1 sm:right-1 rounded-full bg-[#2b170c]/90 p-1 sm:p-2 text-amber-300 border border-amber-600/70 hover:bg-[#3a2012] hover:text-amber-100 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md cursor-pointer z-20"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Members List Section */}
          <div className="pb-4 sm:flex sm:min-h-0 sm:flex-1 sm:flex-col sm:pb-0">
            {/* Judul "Susunan Anggota" */}
            <div className="mb-1.5 sm:mb-2 flex items-center justify-between border-b border-[#4a2e1b]/20 pb-1 sm:shrink-0">
              <h4 className="font-heading text-[11px] sm:text-sm md:text-base font-bold text-[#2b170c] flex items-center gap-1.5">
                <span>Susunan Anggota ({currentDivision.members.length})</span>
              </h4>
            </div>

            {currentDivision.members.length === 0 ? (
              <div className="py-3 sm:py-4 text-center text-[#4a2e1b] font-medium text-[11px] sm:text-sm font-body">
                Belum ada data anggota untuk divisi ini.
              </div>
            ) : (
              <div className="grid gap-1.5 sm:gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:min-h-0 sm:flex-1 sm:content-start sm:overflow-y-auto hide-scrollbar pb-3 sm:pb-2">
                {currentDivision.members.map((member) => (
                  <DivisionMember key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


