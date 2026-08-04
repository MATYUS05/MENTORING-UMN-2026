// src/featured/division/components/DivisionCarousel.tsx
import React, { useState, useRef } from 'react';
import type { Division } from '../types';
import { EnvelopeCard } from './EnvelopeCard';
import { NavigationButton } from './NavigationButton';

interface DivisionCarouselProps {
  divisions: Division[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenModal: (division: Division) => void;
}

export const DivisionCarousel: React.FC<DivisionCarouselProps> = ({
  divisions,
  activeIndex,
  onActiveIndexChange,
  onOpenModal,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const containerRef = useRef<HTMLDivElement>(null);

  if (!divisions || divisions.length === 0) return null;

  const currentDivision = divisions[activeIndex] || divisions[0];

  const handlePrev = () => {
    setDirection('left');
    const newIdx = activeIndex === 0 ? divisions.length - 1 : activeIndex - 1;
    onActiveIndexChange(newIdx);
  };

  const handleNext = () => {
    setDirection('right');
    const newIdx = activeIndex === divisions.length - 1 ? 0 : activeIndex + 1;
    onActiveIndexChange(newIdx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl sm:max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="relative flex items-center justify-between gap-2 sm:gap-8">
        {/* Desktop Left Navigation Button */}
        <div className="hidden sm:block shrink-0 z-20">
          <NavigationButton direction="left" onClick={handlePrev} />
        </div>

        {/* Envelope Container (Full Width on Mobile, Touch Swipe Enabled) */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 overflow-hidden py-2 sm:py-4"
        >
          <div
            key={currentDivision.id}
            className={`
              w-full transform transition-all duration-500 ease-out
              ${direction === 'right' ? 'animate-slideLeft' : 'animate-slideRight'}
            `}
          >
            <EnvelopeCard
              division={currentDivision}
              onClick={() => onOpenModal(currentDivision)}
            />
          </div>
        </div>

        {/* Desktop Right Navigation Button */}
        <div className="hidden sm:block shrink-0 z-20">
          <NavigationButton direction="right" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};
