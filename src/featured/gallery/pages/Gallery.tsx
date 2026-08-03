import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { fotoService } from '../../../lib/fotoService';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

import galeriBg from '../../../assets/galeri/galeri bg.png';
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
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
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

// function getFrameStyle(index: number) {
//   const variants = [
//     'row-span-1 [&_img]:h-[7rem] md:[&_img]:h-[8rem]',
//     'row-span-2 [&_img]:h-[10.5rem] md:[&_img]:h-[12rem]',
//     'row-span-1 [&_img]:h-[8rem] md:[&_img]:h-[9rem]',
//     'row-span-2 [&_img]:h-[11rem] md:[&_img]:h-[12.75rem]',
//     'row-span-1 [&_img]:h-[7.5rem] md:[&_img]:h-[8.5rem]',
//   ];

//   return variants[index % variants.length];
// }

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
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${galeriBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/65 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[1.8rem] border border-black/10 bg-white/92 p-4 shadow-sm md:p-5 lg:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-black/10 bg-[#f6f6f6] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-700">
                Gallery Mentoring
              </div>

              <h1 className={`${font.h1} text-slate-900`}>Gallery Mentoring</h1>

              <p className={`${font.body} mt-2 max-w-2xl text-slate-600`}>
                Dokumentasi kegiatan mentoring yang tersusun rapi berdasarkan sesi
                dan minggu, dengan fokus penuh pada foto tanpa teks di dalam frame.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
                  {filteredFoto.length} foto tampil
                </span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
                  {selectedSession.label}
                </span>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
                  {filterMinggu === 'semua'
                    ? 'Semua Minggu'
                    : weekOptions.find((week) => week.value === filterMinggu)?.label}
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-black/10 bg-[#fafafa] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white">
                  <img
                    src={selectedSession.image}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedSession.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    Filter sesi yang sedang aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/92 p-4 shadow-sm md:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Filter Sesi
              </p>

              <div className="flex flex-wrap gap-2">
                {sessionFilters.map((item) => {
                  const active = filterSesi === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilterSesi(item.value)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                        active
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-black/10 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="h-4 w-4 object-contain"
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Minggu
                </p>

                <button
                  type="button"
                  onClick={() => setFilterMinggu('semua')}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    filterMinggu === 'semua'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-black/10 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  Semua Minggu
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {weekOptions.map((week) => {
                  const active = filterMinggu === week.value;

                  return (
                    <button
                      key={week.value}
                      type="button"
                      onClick={() => setFilterMinggu(week.value)}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-black/10 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <p className="text-sm font-semibold">{week.label}</p>
                      <p
                        className={`mt-1 text-xs ${
                          active ? 'text-white/75' : 'text-slate-500'
                        }`}
                      >
                        {countdown.days} hari
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/92 px-6 py-10 text-center shadow-sm">
            <p className="text-slate-600">Memuat foto galeri...</p>
          </div>
        )}

        {!loading && filteredFoto.length === 0 && (
          <div className="mt-4 rounded-[1.8rem] border border-dashed border-black/15 bg-white/92 px-6 py-12 text-center shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Dokumentasi Mentoring
            </p>

            <div className="mx-auto mb-6 max-w-xs rounded-[1.5rem] border border-black/10 bg-[#fafafa] p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Countdown ke 1 September 2026
              </p>

              <div className="grid grid-cols-4 gap-2">
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-black/10 bg-white px-2 py-3 text-center"
                  >
                    <p className="text-lg font-bold text-slate-900 md:text-xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-semibold text-slate-800">
              Belum ada foto untuk filter ini.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Coba ganti sesi atau minggu untuk melihat dokumentasi lain.
            </p>
          </div>
        )}

        {!loading && filteredFoto.length > 0 && (
          <section className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/92 p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Dokumentasi Mentoring
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">
                  Gallery
                </h2>
              </div>
            </div>

            <div className="columns-2 gap-3 md:columns-4 lg:columns-5">
              {filteredFoto.map((foto) => (
                <figure
                  key={foto.id}
                  className="mb-3 break-inside-avoid overflow-hidden rounded-[1.2rem] border border-black/10 bg-white p-1.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-[0.95rem] bg-slate-100">
                    <img
                      src={foto.fotoUrl}
                      alt="Dokumentasi mentoring"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.webp';
                      }}
                      className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
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