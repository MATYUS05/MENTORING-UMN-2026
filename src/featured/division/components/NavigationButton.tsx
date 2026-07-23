// src/featured/division/components/NavigationButton.tsx
import React from 'react';

interface NavigationButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  disabled = false,
  ariaLabel,
}) => {
  const isLeft = direction === 'left';
  const label = ariaLabel || (isLeft ? 'Divisi Sebelumnya' : 'Divisi Selanjutnya');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`
        group relative flex h-10 w-10 items-center justify-center rounded-full
        border-2 border-amber-800/60 bg-[#1c0e07]/80
        text-[#fde68a] shadow-lg backdrop-blur-sm
        transition-all duration-300 hover:scale-110 hover:border-[#d4af37] hover:bg-[#3a2012]/90
        active:scale-95 disabled:pointer-events-none disabled:opacity-40
        sm:h-14 sm:w-14
      `}
    >
      <span className="absolute inset-0 rounded-full border border-amber-600/30 group-hover:border-amber-400/50" />
      {isLeft ? (
        <svg
          className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 sm:h-7 sm:w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      ) : (
        <svg
          className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 sm:h-7 sm:w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}
    </button>
  );
};
