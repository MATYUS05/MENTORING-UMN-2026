// src/featured/division/components/DivisionModal.tsx
import React, { useEffect } from 'react';
import type { Division } from '../types';
import { DivisionMember } from './DivisionMember';
import scrollImg from '../../../assets/division/scroll_cropped.png';

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
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  if (!isOpen || !division) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn"
      onClick={onClose}
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

      {/* Dark Blurred Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-none" />

      {/* Close Button on top-right */}
      <button
        onClick={onClose}
        aria-label="Tutup Modal"
        className="absolute top-4 right-4 z-50 rounded-full bg-[#2b170c]/80 p-2 text-amber-300 border border-amber-600/60 hover:bg-[#3a2012] hover:text-amber-100 transition-colors shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal Parchment Container (Aspect ratio 2210/1575 ~ 1.403 on Desktop) */}
      <div
        className="relative z-10 w-[95vw] max-w-[480px] sm:max-w-4xl md:max-w-5xl aspect-[4/5] sm:aspect-[2210/1575] max-h-[90vh] flex flex-col my-auto text-[#3a2012] overflow-hidden"
      >
        {/* Parchment Scroll Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={scrollImg}
            alt="Parchment Scroll Background"
            className="w-full h-full object-fill filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Scrollable Content Body (Clicking inside content prevents closing, clicking outside closes) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[12%] bottom-[12%] left-[12%] right-[12%] sm:top-[12%] sm:bottom-[12%] sm:left-[14%] sm:right-[14%] z-10 overflow-y-auto sm:overflow-hidden sm:flex sm:flex-col hide-scrollbar touch-scroll px-1 sm:px-4 py-1 space-y-2 sm:space-y-4"
        >
          {/* Header Info Section */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-2.5 sm:gap-5 border-b border-[#4a2e1b]/30 pb-2 sm:pb-4 sm:shrink-0">
            {/* Division Logo Emblem */}
            <div className="shrink-0 relative">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#4a2e1b]/80 bg-[#1f1008] p-1 shadow-sm sm:h-16 sm:w-16 md:h-18 md:w-18">
                {division.logo.startsWith('http') || division.logo.startsWith('/') ? (
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
                <span className={`text-xl sm:text-3xl ${division.logo.startsWith('http') || division.logo.startsWith('/') ? 'hidden' : ''}`}>
                  {division.logo || '📜'}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex-1 space-y-0.5 sm:space-y-1 pt-0.5 sm:pt-1">
              <h3 className="font-heading text-base font-bold text-[#2b170c] sm:text-xl md:text-2xl drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                Divisi {division.name}
              </h3>
              <p className="font-body text-[11px] sm:text-xs md:text-sm leading-relaxed text-[#4a2e1b] font-medium">
                {division.description}
              </p>
            </div>
          </div>

          {/* Members List Section */}
          <div className="pb-2 sm:flex sm:min-h-0 sm:flex-1 sm:flex-col sm:pb-0">
            {/* Judul "Susunan Anggota" */}
            <div className="mb-2 flex items-center justify-between border-b border-[#4a2e1b]/20 pb-1 sm:shrink-0">
              <h4 className="font-heading text-xs sm:text-sm md:text-base font-bold text-[#2b170c] flex items-center gap-1.5">
                <span>Susunan Anggota ({division.members.length})</span>
              </h4>
            </div>

            {division.members.length === 0 ? (
              <div className="py-4 text-center text-[#4a2e1b] font-medium text-xs sm:text-sm font-body">
                Belum ada data anggota untuk divisi ini.
              </div>
            ) : (
              <div className="grid gap-1.5 sm:gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 sm:min-h-0 sm:flex-1 sm:content-start sm:overflow-y-auto hide-scrollbar sm:pb-2">
                {division.members.map((member) => (
                  <DivisionMember key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

