// src/featured/teams/pages/Teams.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { kelompokService } from '../../../lib/kelompokService';
import { pesertaService } from '../../../lib/pesertaService';
import type { Kelompok, Peserta, Sesi } from '../../../shared/types/database';

type FilterSesi = 'semua' | Sesi;

export default function Teams() {
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterSesi, setFilterSesi] = useState<FilterSesi>('semua');
  const [selectedKelompok, setSelectedKelompok] = useState<Kelompok | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      const [kelompokData, pesertaData] = await Promise.all([
        kelompokService.ambilSemua(),
        pesertaService.ambilSemua(),
      ]);
      setKelompokList(kelompokData);
      setPesertaList(pesertaData);
      setLoading(false);
    })();
  }, []);

  const filteredKelompok = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return kelompokList.filter((k) => {
      const cocokSesi = filterSesi === 'semua' || k.sesi === filterSesi;
      const cocokKeyword =
        keyword === '' ||
        k.namaKelompok.toLowerCase().includes(keyword) ||
        k.namaMentor.toLowerCase().includes(keyword);

      return cocokSesi && cocokKeyword;
    });
  }, [kelompokList, search, filterSesi]);

  const pesertaKelompokTerpilih = useMemo(() => {
    if (!selectedKelompok) return [];
    return pesertaList.filter((p) => p.kelompokId === selectedKelompok.id);
  }, [pesertaList, selectedKelompok]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className={`${font.h1} text-slate-900`}>Teams</h1>
      <p className={`${font.body} mt-2 text-slate-500`}>
        Cari kelompok mentoring berdasarkan nama kelompok atau nama mentor.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama kelompok atau mentor..."
          className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
        />

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
      </div>

      {loading && <p className="mt-8 text-slate-500">Memuat data kelompok...</p>}

      {!loading && filteredKelompok.length === 0 && (
        <p className="mt-8 text-slate-500">Tidak ada kelompok yang cocok.</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredKelompok.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKelompok(k)}
            className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-emerald-300 hover:shadow-md"
          >
            <img
              src={k.fotoMentorUrl || '/placeholder.webp'}
              alt={k.namaMentor}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.webp';
              }}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-slate-900">{k.namaKelompok}</h2>
              <p className="text-sm text-slate-500">Mentor: {k.namaMentor}</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium capitalize text-emerald-700">
                {k.sesi}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedKelompok && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setSelectedKelompok(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{selectedKelompok.namaKelompok}</h3>
              <button
                onClick={() => setSelectedKelompok(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="mt-1 text-sm text-slate-500">Mentor: {selectedKelompok.namaMentor}</p>

            <h4 className="mt-6 text-sm font-semibold text-slate-700">
              Peserta ({pesertaKelompokTerpilih.length})
            </h4>

            {pesertaKelompokTerpilih.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Belum ada peserta di kelompok ini.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pesertaKelompokTerpilih.map((p) => (
                  <li key={p.id} className="rounded-lg bg-slate-50 px-4 py-2">
                    <p className="font-medium text-slate-900">{p.namaLengkap}</p>
                    <p className="text-xs text-slate-500">
                      {p.nim} · {p.jurusan}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}