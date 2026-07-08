// src/featured/division/pages/Division.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { divisiService } from '../../../lib/divisiService';
import { panitiaService } from '../../../lib/panitiaService';
import type { Divisi, Panitia } from '../../../shared/types/database';

export default function Division() {
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [panitiaList, setPanitiaList] = useState<Panitia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivisi, setSelectedDivisi] = useState<Divisi | null>(null);

  useEffect(() => {
    (async () => {
      const [divisiData, panitiaData] = await Promise.all([
        divisiService.ambilSemua(),
        panitiaService.ambilSemua(),
      ]);
      setDivisiList(divisiData);
      setPanitiaList(panitiaData);
      setLoading(false);
    })();
  }, []);

  const anggotaDivisiTerpilih = useMemo(() => {
    if (!selectedDivisi) return { koordinator: [], anggota: [], executive: [] };

    const anggotaDivisi = panitiaList.filter((p) => p.divisiId === selectedDivisi.id);

    return {
      koordinator: anggotaDivisi.filter((p) => p.posisi === 'koordinator'),
      anggota: anggotaDivisi.filter((p) => p.posisi === 'anggota'),
      executive: anggotaDivisi.filter((p) => p.posisi === 'executive'),
    };
  }, [panitiaList, selectedDivisi]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className={`${font.h1} text-slate-900`}>Divisi</h1>
      <p className={`${font.body} mt-2 text-slate-500`}>
        Klik salah satu divisi untuk melihat daftar panitianya.
      </p>

      {loading && <p className="mt-8 text-slate-500">Memuat data divisi...</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {divisiList.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDivisi(d)}
            className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 text-left transition hover:border-emerald-300 hover:shadow-md"
          >
            <img
              src={d.fotoDivisiUrl || '/placeholder.webp'}
              alt={d.namaDivisi}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.webp';
              }}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-slate-900">{d.namaDivisi}</h2>
              <p className="mt-1 text-sm text-slate-500">{d.deskripsiDivisi}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedDivisi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setSelectedDivisi(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{selectedDivisi.namaDivisi}</h3>
              <button onClick={() => setSelectedDivisi(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {selectedDivisi.tipeExec ? (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700">Executive</h4>
                <ul className="mt-2 space-y-2">
                  {anggotaDivisiTerpilih.executive.map((p) => (
                    <li key={p.id} className="rounded-lg bg-slate-50 px-4 py-2">
                      <p className="font-medium text-slate-900">{p.namaLengkap}</p>
                      <p className="text-xs text-slate-500">{p.nim}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-700">Koordinator</h4>
                  <ul className="mt-2 space-y-2">
                    {anggotaDivisiTerpilih.koordinator.map((p) => (
                      <li key={p.id} className="rounded-lg bg-emerald-50 px-4 py-2">
                        <p className="font-medium text-slate-900">{p.namaLengkap}</p>
                        <p className="text-xs text-slate-500">{p.nim}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-700">Anggota</h4>
                  <ul className="mt-2 space-y-2">
                    {anggotaDivisiTerpilih.anggota.map((p) => (
                      <li key={p.id} className="rounded-lg bg-slate-50 px-4 py-2">
                        <p className="font-medium text-slate-900">{p.namaLengkap}</p>
                        <p className="text-xs text-slate-500">{p.nim}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}