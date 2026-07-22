// src/featured/division/pages/Division.tsx
import { useEffect, useState } from 'react';
import { divisiService } from '../../../lib/divisiService';
import { panitiaService } from '../../../lib/panitiaService';
import type { Division, Member } from '../types';
import { DEFAULT_DIVISIONS } from '../data/mockDivisions';
import { DivisionCarousel } from '../components/DivisionCarousel';
import { DivisionSelector } from '../components/DivisionSelector';
import { DivisionModal } from '../components/DivisionModal';
import bgImage from '../../../assets/division/divisions bg.png';
import type { Divisi, Panitia } from '../../../shared/types/database';

export default function DivisionPage() {
  const [divisions, setDivisions] = useState<Division[]>(DEFAULT_DIVISIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalDivision, setModalDivision] = useState<Division | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Firestore data and merge with fallback / ensure 10 items
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [divisiData, panitiaData] = await Promise.all([
          divisiService.ambilSemua(),
          panitiaService.ambilSemua(),
        ]);

        if (isMounted && divisiData && divisiData.length > 0) {
          let mappedDivisions: Division[] = divisiData.map((d: Divisi) => {
            const members: Member[] = panitiaData
              .filter((p: Panitia) => p.divisiId === d.id)
              .map((p: Panitia) => ({
                id: p.id,
                name: p.namaLengkap,
                position: p.posisi === 'koordinator' ? 'Koordinator Divisi' : p.posisi === 'executive' ? 'Executive' : 'Staff Divisi',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                nim: p.nim,
              }));

            return {
              id: d.id,
              name: d.namaDivisi,
              logo: d.fotoDivisiUrl || '📜',
              description: d.deskripsiDivisi || 'Divisi Mentoring UMN 2026.',
              members,
            };
          });

          // Ensure exactly 10 divisions by filling up with default/dummy divisions if Firestore has fewer than 10
          if (mappedDivisions.length < 10) {
            const extraDummies = DEFAULT_DIVISIONS.slice(mappedDivisions.length, 10);
            mappedDivisions = [...mappedDivisions, ...extraDummies];
          }

          setDivisions(mappedDivisions);
        }
      } catch (error) {
        console.warn('Firestore fetch fallback to default divisions:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard Left / Right Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === 0 ? divisions.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === divisions.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [divisions.length, isModalOpen]);

  const handleOpenModal = (div: Division) => {
    setModalDivision(div);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalDivision(null);
    }, 300);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full text-[#f8ebd0] select-none font-body flex flex-col justify-between overflow-hidden">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(35px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-35px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideLeft { animation: slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideRight { animation: slideRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Clean Background Image (Scoped ONLY to Division Page bounds) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        />
      </div>

      {/* Main Page Container (Fills viewport height & pushes global Footer to bottom) */}
      <div className="relative z-10 mx-auto flex max-w-7xl w-full flex-1 flex-col items-center justify-between px-4 pt-6 pb-6 sm:px-6 sm:pt-8 lg:px-8">
        {/* Top Header Title */}
        <header className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[#3a2012] drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)]">
            DIVISION
          </h1>
          <p className="font-body mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#2b170c] font-bold drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)] mx-auto">
            Pilih divisi melalui carousel atau rak logo di bawah untuk melihat rincian tugas serta jajaran panitia dalam bentuk amplop kuno Majapahit.
          </p>
        </header>

        {/* Center Hero Carousel */}
        <section id="division-envelope-section" className="w-full flex-1 flex flex-col items-center justify-center my-2">
          <DivisionCarousel
            divisions={divisions}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onOpenModal={handleOpenModal}
          />
        </section>

        {/* Bottom Division Selector Rak */}
        <section className="w-full pb-2">
          <DivisionSelector
            divisions={divisions}
            activeIndex={activeIndex}
            onSelectDivision={(idx) => setActiveIndex(idx)}
          />
        </section>
      </div>

      {/* Division Detail Modal */}
      <DivisionModal
        division={modalDivision}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}