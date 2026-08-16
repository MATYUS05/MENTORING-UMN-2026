// src/featured/gallery/pages/Gallery.tsx
import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { fotoService } from '../../../lib/fotoService';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

import galeriBg from '../../../assets/galeri/galeri bg.svg';
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

type WeekConfig = {
  value: Minggu;
  label: string;
  revealDate: Date;
};

const countdown: 'off' | 'on' = 'on';
//const countdown: 'on' | 'off' = 'off';

const WEEK_CONFIG: WeekConfig[] = [
  { value: 'minggu-1', label: 'Minggu 1', revealDate: new Date('2026-09-01T00:00:00+07:00') },
  { value: 'minggu-2', label: 'Minggu 2', revealDate: new Date('2026-09-08T00:00:00+07:00') },
  { value: 'minggu-3', label: 'Minggu 3', revealDate: new Date('2026-09-15T00:00:00+07:00') },
];

const sessionFilters: SessionFilterOption[] = [
  { value: 'semua', label: 'Semua Sesi', image: gemAll },
  { value: 'pagi', label: 'Sesi Pagi', image: gemPagi },
  { value: 'siang', label: 'Sesi Siang', image: gemSiang },
  { value: 'pengganti', label: 'Sesi Pengganti', image: gemPengganti },
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

function isWeekRevealed(week: Minggu, now: Date): boolean {
  if (countdown === 'off') return true;
  const cfg = WEEK_CONFIG.find((w) => w.value === week);
  if (!cfg) return true;
  return now.getTime() >= cfg.revealDate.getTime();
}

function findNearestUpcomingWeek(now: Date): WeekConfig | null {
  if (countdown === 'off') return null;
  return (
    WEEK_CONFIG.filter((w) => now.getTime() < w.revealDate.getTime()).sort(
      (a, b) => a.revealDate.getTime() - b.revealDate.getTime(),
    )[0] ?? null
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
    const interval = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const nearestUpcomingWeek = useMemo(() => findNearestUpcomingWeek(currentTime), [currentTime]);

  const filteredFoto = useMemo(() => {
    return fotoList.filter((foto) => {
      const sesiMatch = filterSesi === 'semua' || foto.sesi === filterSesi;
      const mingguDipilihMatch = filterMinggu === 'semua' || foto.minggu === filterMinggu;
      return sesiMatch && mingguDipilihMatch && isWeekRevealed(foto.minggu, currentTime);
    });
  }, [fotoList, filterSesi, filterMinggu, currentTime]);

  const selectedSession =
    sessionFilters.find((item) => item.value === filterSesi) ?? sessionFilters[0];

  const weekLock = useMemo<WeekConfig | null>(() => {
    if (countdown === 'off') return null;

    if (filterMinggu !== 'semua') {
      const cfg = WEEK_CONFIG.find((w) => w.value === filterMinggu);
      return cfg && !isWeekRevealed(cfg.value, currentTime) ? cfg : null;
    }

    const adaMingguTerbuka = WEEK_CONFIG.some((w) => isWeekRevealed(w.value, currentTime));
    return adaMingguTerbuka ? null : nearestUpcomingWeek;
  }, [filterMinggu, currentTime, nearestUpcomingWeek]);

  const lockCountdown = weekLock ? formatCountdown(weekLock.revealDate, currentTime) : null;
  const lockCountdownItems = lockCountdown
    ? [
        { label: 'Hari', value: lockCountdown.days },
        { label: 'Jam', value: lockCountdown.hours },
        { label: 'Menit', value: lockCountdown.minutes },
        { label: 'Detik', value: lockCountdown.seconds },
      ]
    : [];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${galeriBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-white/50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[1.8rem] border border-black/10 bg-white/92 p-4 shadow-sm md:p-5 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="inline-block">
              <h1 className={`${font.h1} text-slate-900`}>Gallery Mentoring</h1>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-[250px_290px]">
                <div className="flex h-40.75 flex-col items-center justify-center gap-2 rounded-3xl border border-black/10 bg-[#f6f6f6] px-6 text-center">
                  <img src={selectedSession.image} alt="" className="h-14 w-14 object-contain" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700">
                    {selectedSession.label}
                  </span>
                </div>

                <div className="flex h-40.75 flex-col justify-center rounded-3xl border border-black/10 bg-[#fafafa] px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Total Ditampilkan
                  </p>
                  <p className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-slate-900">{filteredFoto.length}</span>
                    <span className="text-sm text-slate-600">foto</span>
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-slate-500">
                    {filterSesi === 'semua' && filterMinggu === 'semua'
                      ? 'Menampilkan semua dokumentasi yang sudah terbuka.'
                      : `Menampilkan dokumentasi ${selectedSession.label}${
                          filterMinggu === 'semua'
                            ? ''
                            : ` · ${WEEK_CONFIG.find((w) => w.value === filterMinggu)?.label}`
                        }.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-105">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
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
                        className={`flex h-11 w-full items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition
                        ${
                          active
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-black/10 bg-white text-slate-700 hover:border-slate-400'
                        }`}
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
                  {WEEK_CONFIG.map((week) => {
                    const active = filterMinggu === week.value;
                    const revealed = isWeekRevealed(week.value, currentTime);
                    const sisaHari = formatCountdown(week.revealDate, currentTime).days;
                    const statusText = revealed
                      ? 'Sudah dibuka'
                      : sisaHari === '00'
                        ? 'Buka hari ini'
                        : `${sisaHari} hari lagi`;

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
                        <p className={`mt-1 text-xs ${active ? 'text-white/75' : 'text-slate-500'}`}>
                          {statusText}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/92 px-6 py-10 text-center shadow-sm">
            <p className="text-slate-600">Memuat foto galeri...</p>
          </div>
        )}

        {!loading && weekLock && (
          <div className="mt-4 rounded-[1.8rem] border border-dashed border-black/15 bg-white/92 px-6 py-12 text-center shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Dokumentasi {weekLock.label}
            </p>

            <div className="mx-auto mb-6 max-w-xs rounded-3xl border border-black/10 bg-[#fafafa] p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Terbuka pada{' '}
                {weekLock.revealDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <div className="grid grid-cols-4 gap-2">
                {lockCountdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-black/10 bg-white px-2 py-3 text-center"
                  >
                    <p className="text-lg font-bold text-slate-900 md:text-xl">{item.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-semibold text-slate-800">
              Foto {weekLock.label} belum bisa dilihat.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Nantikan dokumentasinya begitu hitung mundur di atas selesai.
            </p>
          </div>
        )}

        {!loading && !weekLock && filteredFoto.length === 0 && (
          <div className="mt-4 rounded-[1.8rem] border border-dashed border-black/15 bg-white/92 px-6 py-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">Belum ada foto untuk filter ini.</p>
            <p className="mt-2 text-sm text-slate-500">
              Coba ganti sesi atau minggu untuk melihat dokumentasi lain.
            </p>
          </div>
        )}

        {!loading && !weekLock && filteredFoto.length > 0 && (
          <section className="mt-4 rounded-[1.8rem] border border-black/10 bg-white/92 p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Dokumentasi Mentoring
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">Gallery</h2>
              </div>
            </div>

            {nearestUpcomingWeek && filterMinggu === 'semua' && (
              <div className="mb-4 rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-slate-600">
                Foto <span className="font-semibold text-slate-900">{nearestUpcomingWeek.label}</span> akan
                terbuka dalam{' '}
                <span className="font-semibold text-slate-900">
                  {formatCountdown(nearestUpcomingWeek.revealDate, currentTime).days} hari
                </span>
                .
              </div>
            )}

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