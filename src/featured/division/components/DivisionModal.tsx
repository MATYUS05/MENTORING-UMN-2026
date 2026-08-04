// src/featured/division/components/DivisionModal.tsx
import React, { useEffect } from 'react';
import type { Division } from '../types';
import { DivisionMember } from './DivisionMember';
import scrollImg from '../../../assets/division/scroll.png';

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

      {/* Modal Parchment Container (Expanded Vertical aspect-[2/3] on Mobile, Landscape aspect-[3/2] on Desktop) */}
      <div
        className="relative z-10 w-[90vw] max-w-[420px] sm:max-w-5xl aspect-[2/3] sm:aspect-[3/2] max-h-[86vh] sm:max-h-[92vh] flex flex-col my-auto text-[#3a2012] overflow-hidden"
      >
        {/* Mobile Parchment Scroll Background Image (Rotated 90deg - Expanded) */}
        <div className="sm:hidden absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={scrollImg}
            alt="Parchment Scroll Background Mobile"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[66.7%] rotate-90 object-fill filter brightness-95 contrast-105"
          />
        </div>

        {/* Desktop Parchment Scroll Background Image (Landscape Original) */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
          <img
            src={scrollImg}
            alt="Parchment Scroll Background Desktop"
            className="w-full h-full object-fill filter brightness-95 contrast-105"
          />
        </div>

        {/* Scrollable Content Body (Clicking inside content prevents closing, clicking outside closes, Touch Scroll Enabled) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[26%] bottom-[26%] left-[18%] right-[18%] sm:top-[18%] sm:bottom-[18%] sm:left-[10%] sm:right-[10%] z-10 overflow-y-auto hide-scrollbar touch-scroll px-1 sm:px-8 py-2 space-y-3 sm:space-y-5"
        >
          {/* Header Info Section */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-3 sm:gap-6 border-b border-[#4a2e1b]/20 pb-3 sm:pb-5">
            {/* Division Logo Emblem */}
            <div className="shrink-0 relative">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#4a2e1b]/80 bg-[#1f1008] p-1.5 shadow-sm sm:h-20 sm:w-20">
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
                <span className={`text-2xl sm:text-4xl ${division.logo.startsWith('http') || division.logo.startsWith('/') ? 'hidden' : ''}`}>
                  {division.logo || '📜'}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex-1 space-y-1 pt-1 sm:pt-3 lg:pt-4">
              <h3 className="font-heading text-lg font-bold text-[#2b170c] sm:text-2xl lg:text-3xl">
                Divisi {division.name}
              </h3>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-[#4a2e1b] font-medium">
                {division.description}
              </p>
            </div>
          </div>

          {/* Members List Section */}
          <div className="pb-4">
            <div className="mb-3 flex items-center justify-between border-b border-[#4a2e1b]/20 pb-1.5">
              <h4 className="font-heading text-xs sm:text-lg font-bold text-[#2b170c] flex items-center gap-2">
                <span></span>Susunan Anggota ({division.members.length})
              </h4>
            </div>

            {division.members.length === 0 ? (
              <div className="py-6 text-center text-[#4a2e1b] font-medium text-sm font-body">
                Belum ada data anggota untuk divisi ini.
              </div>
            ) : (
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
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
