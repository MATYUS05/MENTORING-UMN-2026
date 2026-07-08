// src/featured/gallery/pages/Gallery.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { fotoService } from '../../../lib/fotoService';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

type FilterSesi = 'semua' | Sesi;
type FilterMinggu = 'semua' | Minggu;

export default function Gallery() {
  const [fotoList, setFotoList] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSesi, setFilterSesi] = useState<FilterSesi>('semua');
  const [filterMinggu, setFilterMinggu] = useState<FilterMinggu>('semua');

  useEffect(() => {
    (async () => {
      const data = await fotoService.ambilSemua();
      setFotoList(data);
      setLoading(false);
    })();
  }, []);

  const filteredFoto = useMemo(() => {
    return fotoList.filter((f) => {
      const cocokSesi = filterSesi === 'semua' || f.sesi === filterSesi;
      const cocokMinggu = filterMinggu === 'semua' || f.minggu === filterMinggu;
      return cocokSesi && cocokMinggu;
    });
  }, [fotoList, filterSesi, filterMinggu]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className={`${font.h1} text-slate-900`}>Galeri</h1>
      <p className={`${font.body} mt-2 text-slate-500`}>
        Dokumentasi kegiatan mentoring, bisa difilter per sesi dan minggu.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <select
          value={filterSesi}
          onChange={(e) => setFilterSesi(e.target.value as FilterSesi)}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="semua">Semua Sesi</option>
          <option value="pagi">Pagi</option>
          <option value="siang">Siang</option>
          <option value="pengganti">Pengganti</option>
        </select>

        <select
          value={filterMinggu}
          onChange={(e) => setFilterMinggu(e.target.value as FilterMinggu)}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="semua">Semua Minggu</option>
          <option value="minggu-1">Minggu 1</option>
          <option value="minggu-2">Minggu 2</option>
          <option value="minggu-3">Minggu 3</option>
        </select>
      </div>

      {loading && <p className="mt-8 text-slate-500">Memuat foto...</p>}

      {!loading && filteredFoto.length === 0 && (
        <p className="mt-8 text-slate-500">Belum ada foto untuk filter ini.</p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredFoto.map((f) => (
          <figure key={f.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={f.fotoUrl}
              alt={f.judul ?? 'Dokumentasi mentoring'}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.webp';
              }}
              className="h-40 w-full object-cover"
            />
            <figcaption className="p-3 text-xs text-slate-500">
              {f.judul && <p className="font-medium text-slate-700">{f.judul}</p>}
              <span className="capitalize">{f.sesi}</span> · <span>{f.minggu}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}