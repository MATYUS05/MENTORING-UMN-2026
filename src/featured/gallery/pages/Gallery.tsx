import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { fotoService } from '../../../lib/fotoService';
import PageBackground from '../../../shared/components/PageBackground';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

import galeriBg from '../../../assets/galeri/Gallery_BG.png';
import gemAll from '../../../assets/galeri/gem_all.png';
import gemPagi from '../../../assets/galeri/gem_pagi.png';
import gemSiang from '../../../assets/galeri/gem_siang.png';
import gemPengganti from '../../../assets/galeri/gem_pengganti.png';

type FilterSesi = 'semua' | Sesi;
type FilterMinggu = 'semua' | Minggu;

type SessionFilterOption = {
  value: FilterSesi;
  label: string;
  image: string;
};

type WeekOption = {
  value: Minggu;
  label: string;
};

const TARGET_DATE = new Date('2026-09-01T23:59:59+07:00');

// Tema: peta pelayaran tua. Palet & tekstur dipusatkan di sini biar konsisten.
const THEME = {
  parchment: '#EDE0C3',
  parchmentDeep: '#E1D2A8',
  parchmentEdge: '#C9B384',
  ink: '#1F3347', // navy laut dalam, untuk judul
  inkSoft: '#4A3826', // coklat tinta, untuk body text
  brass: '#B8862F',
  brassSoft: '#D4A94A',
  wax: '#8C2E1E',
  ocean: '#0B2B3D',
};

// Tekstur noise halus (SVG data URI) supaya panel parchment tidak terasa flat/digital.
const INNER_SHADOW =
  'inset -3px 3px 6px 0 rgba(0,0,0,0.35), inset 4px -4px 8px 0 rgba(255,255,255,1)';
const INNER_SHADOW_ACTIVE = 'inset -3px 3px 6px 0 rgba(0,0,0,0.35)';

const PAPER_GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E";

const sessionFilters: SessionFilterOption[] = [
  { value: 'semua', label: 'Semua Sesi', image: gemAll },
  { value: 'pagi', label: 'Sesi Pagi', image: gemPagi },
  { value: 'siang', label: 'Sesi Siang', image: gemSiang },
  { value: 'pengganti', label: 'Sesi Pengganti', image: gemPengganti },
];

const weekOptions: WeekOption[] = [
  { value: 'minggu-1', label: 'Minggu 1' },
  { value: 'minggu-2', label: 'Minggu 2' },
  { value: 'minggu-3', label: 'Minggu 3' },
];

function formatCountdown(targetDate: Date, now: Date) {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

// Kompas kecil sebagai signature element di sebelah judul.
function CompassRose({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="21" stroke={THEME.brass} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="15.5" stroke={THEME.brass} strokeWidth="0.75" opacity="0.6" />
      <path d="M24 4 L27 24 L24 44 L21 24 Z" fill={THEME.wax} opacity="0.85" />
      <path d="M4 24 L24 21 L44 24 L24 27 Z" fill={THEME.brass} opacity="0.85" />
      <circle cx="24" cy="24" r="2.5" fill={THEME.ink} />
    </svg>
  );
}

export default function Gallery() {
  const [fotoList, setFotoList] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSesi, setFilterSesi] = useState<FilterSesi>('semua');
  const [filterMinggu, setFilterMinggu] = useState<FilterMinggu>('semua');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const data = await fotoService.ambilSemua();
        setFotoList(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredFoto = useMemo(() => {
    return fotoList.filter((foto) => {
      const sesiMatch = filterSesi === 'semua' || foto.sesi === filterSesi;
      const mingguMatch = filterMinggu === 'semua' || foto.minggu === filterMinggu;

      return sesiMatch && mingguMatch;
    });
  }, [filterMinggu, filterSesi, fotoList]);

  const selectedSession =
    sessionFilters.find((item) => item.value === filterSesi) ?? sessionFilters[0];

  const countdown = formatCountdown(TARGET_DATE, currentTime);

  const countdownItems = [
    { label: 'Hari', value: countdown.days },
    { label: 'Jam', value: countdown.hours },
    { label: 'Menit', value: countdown.minutes },
    { label: 'Detik', value: countdown.seconds },
  ];

  return (
    <div className="relative">
      {/* Peta latar, ditempel lewat portal ke <body> supaya menutupi seluruh
          halaman termasuk di belakang navbar dan footer, dan tetap ikut scroll */}
      <PageBackground src={galeriBg} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-10">
        {/* ===== Cartouche header ===== */}
        <div
          className="rounded-[1.8rem] p-[3px] shadow-[0_10px_30px_-12px_rgba(11,43,61,0.45)]"
          style={{
            background: `linear-gradient(to bottom left, ${THEME.brass}, #5C4318)`,
          }}
        >
        <section
          className="relative rounded-[calc(1.8rem-3px)] p-4 md:p-5 lg:p-6"
          style={{
            backgroundColor: THEME.parchment,
            backgroundImage: `url(${PAPER_GRAIN})`,
            boxShadow:
              'inset 8px -8px 16px 0 rgba(0,0,0,0.55), inset -8px 8px 16px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-[6px] rounded-[1.4rem] border"
            style={{ borderColor: `${THEME.wax}33` }}
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="inline-block">
              <div className="flex items-center gap-3">
                <CompassRose className="h-9 w-9 shrink-0 sm:h-11 sm:w-11 md:h-14 md:w-14 lg:h-16 lg:w-16" />
                <h1 className={`${font.h1}`} style={{ color: THEME.ink }}>
                  Gallery Mentoring
                </h1>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-[250px_290px]">
                <div
                  className="flex h-[163px] flex-col items-center justify-center gap-2 rounded-[1.5rem] border px-6 text-center"
                  style={{
                    borderColor: THEME.parchmentEdge,
                    backgroundColor: '#F7EFDD',
                    boxShadow: INNER_SHADOW,
                  }}
                >
                  <img
                    src={selectedSession.image}
                    alt=""
                    className="h-[109px] w-[109px] object-contain"
                  />
                </div>

                <div
                  className="flex h-[163px] flex-col items-center justify-center rounded-[1.5rem] border px-5 py-5 text-center"
                  style={{
                    borderColor: THEME.parchmentEdge,
                    backgroundColor: '#F7EFDD',
                    boxShadow: INNER_SHADOW,
                  }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: THEME.brass }}
                  >
                    Total Ditemukan
                  </p>
                  <p
                    className={`${font.h1} mt-1.5`}
                    style={{ color: THEME.ink }}
                  >
                    {filteredFoto.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-[420px]">
              <div>
                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]"
                  style={{ color: THEME.brass }}
                >
                  Filter Sesi
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {sessionFilters.map((item) => {
                    const active = filterSesi === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFilterSesi(item.value)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition"
                        style={
                          active
                            ? {
                                borderColor: THEME.wax,
                                backgroundColor: THEME.wax,
                                color: '#FBF3E1',
                                boxShadow: INNER_SHADOW_ACTIVE,
                              }
                            : {
                                borderColor: THEME.parchmentEdge,
                                backgroundColor: '#F7EFDD',
                                color: THEME.inkSoft,
                                boxShadow: INNER_SHADOW,
                              }
                        }
                      >
                        <img src={item.image} alt="" className="h-4 w-4 object-contain" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.28em]"
                    style={{ color: THEME.brass }}
                  >
                    Rute Minggu
                  </p>

                  <button
                    type="button"
                    onClick={() => setFilterMinggu('semua')}
                    className="rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                    style={
                      filterMinggu === 'semua'
                        ? {
                            borderColor: THEME.wax,
                            backgroundColor: THEME.wax,
                            color: '#FBF3E1',
                            boxShadow: INNER_SHADOW_ACTIVE,
                          }
                        : {
                            borderColor: THEME.parchmentEdge,
                            backgroundColor: '#F7EFDD',
                            color: THEME.inkSoft,
                            boxShadow: INNER_SHADOW,
                          }
                    }
                  >
                    Semua Minggu
                  </button>
                </div>

                {/* Garis rute putus-putus di belakang, seolah menghubungkan pelabuhan */}
                <div className="relative">
                  <div
                    className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed"
                    style={{ borderColor: `${THEME.wax}55` }}
                  />
                  <div className="relative grid grid-cols-3 gap-2">
                    {weekOptions.map((week) => {
                      const active = filterMinggu === week.value;

                      return (
                        <button
                          key={week.value}
                          type="button"
                          onClick={() => setFilterMinggu(week.value)}
                          className="rounded-2xl border px-3 py-3 text-left transition"
                          style={
                            active
                              ? {
                                  borderColor: THEME.wax,
                                  backgroundColor: THEME.ink,
                                  color: '#FBF3E1',
                                  boxShadow: INNER_SHADOW,
                                }
                              : {
                                  borderColor: THEME.parchmentEdge,
                                  backgroundColor: '#F7EFDD',
                                  color: THEME.inkSoft,
                                  boxShadow: INNER_SHADOW,
                                }
                          }
                        >
                          <p className="text-sm font-semibold">{week.label}</p>
                          <p
                            className="mt-1 text-xs"
                            style={{ color: active ? '#FBF3E199' : THEME.brass }}
                          >
                            {countdown.days} hari
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* ===== Loading ===== */}
        {loading && (
          <div
            className="mt-4 rounded-[1.8rem] border px-6 py-10 text-center shadow-sm"
            style={{ borderColor: THEME.parchmentEdge, backgroundColor: THEME.parchment }}
          >
            <p style={{ color: THEME.inkSoft }}>Sedang memuat peta dokumentasi...</p>
          </div>
        )}

        {/* ===== Empty state ===== */}
        {!loading && filteredFoto.length === 0 && (
          <div
            className="mt-4 rounded-[1.8rem] border border-dashed px-6 py-12 text-center shadow-sm"
            style={{ borderColor: `${THEME.wax}55`, backgroundColor: THEME.parchment }}
          >
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: THEME.brass }}
            >
              Dokumentasi Mentoring
            </p>

            <div
              className="mx-auto mb-6 max-w-xs rounded-[1.5rem] border p-4"
              style={{ borderColor: THEME.parchmentEdge, backgroundColor: '#F7EFDD' }}
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: THEME.inkSoft }}>
                Hitung Mundur ke 1 September 2026
              </p>

              <div className="grid grid-cols-4 gap-2">
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border px-2 py-3 text-center"
                    style={{ borderColor: THEME.brass, backgroundColor: THEME.ink }}
                  >
                    <p className="text-lg font-bold md:text-xl" style={{ color: '#FBF3E1' }}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: THEME.brassSoft }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-semibold" style={{ color: THEME.ink }}>
              Belum ada titik peta untuk rute ini.
            </p>
            <p className="mt-2 text-sm" style={{ color: THEME.inkSoft }}>
              Coba ganti sesi atau minggu untuk menjelajah dokumentasi lain.
            </p>
          </div>
        )}

        {/* ===== Gallery grid ===== */}
        {!loading && filteredFoto.length > 0 && (
          <section className="mt-4">
            <div className="columns-2 gap-3 md:columns-4 lg:columns-5">
              {filteredFoto.map((foto, idx) => (
                <figure
                  key={foto.id}
                  className={`group relative mb-3 break-inside-avoid overflow-hidden rounded-sm border p-2 pb-4 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:z-10 ${
                    idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
                  }`}
                  style={{ borderColor: THEME.parchmentEdge, backgroundColor: '#F7EFDD' }}
                >
                  <span
                    className="absolute -top-1.5 left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full shadow-sm"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${THEME.brassSoft}, ${THEME.wax})` }}
                  />
                  <div className="overflow-hidden bg-slate-100">
                    <img
                      src={foto.fotoUrl}
                      alt="Dokumentasi mentoring"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.webp';
                      }}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                      style={{ filter: 'sepia(0.12) saturate(1.05) contrast(1.03)' }}
                      loading="lazy"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}