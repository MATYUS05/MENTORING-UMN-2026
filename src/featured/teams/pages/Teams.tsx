// src/featured/teams/pages/Teams.tsx

import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { kelompokService } from '../../../lib/kelompokService';
import { pesertaService } from '../../../lib/pesertaService';
import type { Kelompok, Peserta, Sesi } from '../../../shared/types/database';
import teamsLangit from '../../../assets/teams/teams-langit.png';
import teamsPasir from '../../../assets/teams/teams-pasir.png';
import textureKayu from '../../../assets/teams/texture-kayu.png';
import pagiIcon from '../../../assets/teams/pagi-icon.png';
import siangIcon from '../../../assets/teams/siang-icon.png';
import penggantiIcon from '../../../assets/teams/pengganti-icon.png';

type FilterSesi = 'semua' | Sesi;

const sesiIcon: Record<Sesi, string> = {
  pagi: pagiIcon,
  siang: siangIcon,
  pengganti: penggantiIcon,
};

const SESI_OPTIONS: { value: FilterSesi; label: string }[] = [
  { value: 'semua', label: 'Semua Sesi' },
  { value: 'pagi', label: 'Pagi' },
  { value: 'siang', label: 'Siang' },
  { value: 'pengganti', label: 'Pengganti' },
];

const kayuStyle = {
  backgroundImage: `url(${textureKayu})`,
  backgroundSize: '280px',
};

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
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-20 bg-[#ccffff]" aria-hidden />
      <img
        src={teamsLangit}
        alt=""
        aria-hidden
        className="fixed inset-x-0 top-0 -z-10 w-full"
      />
      <img
        src={teamsPasir}
        alt=""
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 max-h-24 w-full border-t-[6px] border-[#595959] object-cover"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Papan oranye berisi seluruh konten */}
        <div className="rounded-2xl border-[6px] border-[#595959] bg-[#F2A15D] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] sm:p-10">
          <div
            className="mx-auto w-fit rounded-xl border-4 border-[#595959] px-8 py-2 shadow-md sm:px-12 sm:py-3"
            style={kayuStyle}
          >
            <h1 className={`${font.h1} text-center text-[#4A3320]`}>Teams</h1>
          </div>

          <p className={`${font.body} mt-4 text-center font-medium text-[#5C4327]`}>
            Cari kelompok mentoring berdasarkan nama kelompok atau nama mentor.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama kelompok atau mentor..."
              className="w-full rounded-lg border-2 border-[#595959] bg-amber-50 px-4 py-3 text-[#4A3320] placeholder-[#a3835f] outline-none transition focus:bg-white"
            />

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {SESI_OPTIONS.map((opsi) => {
                const aktif = filterSesi === opsi.value;
                return (
                  <button
                    key={opsi.value}
                    onClick={() => setFilterSesi(opsi.value)}
                    className={`flex items-center gap-2 rounded-lg border-2 border-[#595959] px-4 py-2 text-sm font-semibold transition sm:text-base ${
                      aktif
                        ? 'bg-amber-50 text-[#4A3320] shadow-inner'
                        : 'bg-white/50 text-[#6b5233] hover:bg-amber-50/80'
                    }`}
                  >
                    {opsi.value !== 'semua' && (
                      <img
                        src={sesiIcon[opsi.value]}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    )}
                    {opsi.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading && (
            <p className="mt-8 text-center font-medium text-[#5C4327]">
              Memuat data kelompok...
            </p>
          )}

          {!loading && filteredKelompok.length === 0 && (
            <p className="mt-8 text-center font-medium text-[#5C4327]">
              Tidak ada kelompok yang cocok.
            </p>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredKelompok.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKelompok(k)}
                className="flex flex-col items-start gap-3 rounded-xl border-4 border-[#595959] p-5 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                style={kayuStyle}
              >
                <img
                  src={k.fotoMentorUrl || '/placeholder.webp'}
                  alt={k.namaMentor}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.webp';
                  }}
                  className="h-16 w-16 rounded-full border-2 border-[#595959] bg-white object-cover"
                />
                <div>
                  <h2 className="font-semibold text-[#3F2E1C]">{k.namaKelompok}</h2>
                  <p className="text-sm text-[#6b5233]">Mentor: {k.namaMentor}</p>
                  <span className="mt-1 inline-block rounded-full border border-[#595959]/50 bg-white/70 px-2 py-0.5 text-xs font-medium capitalize text-[#4A3320]">
                    {k.sesi}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kaki papan */}
        <div className="relative -z-[1] mx-auto -mt-3 -mb-6 hidden max-w-4xl justify-between px-16 sm:flex">
          <div className="h-16 w-9 rounded-b-md border-4 border-[#595959] bg-[#EF9950]" />
          <div className="h-16 w-9 rounded-b-md border-4 border-[#595959] bg-[#EF9950]" />
        </div>
      </div>

      {selectedKelompok && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedKelompok(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border-4 border-[#595959] bg-amber-50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#3F2E1C]">
                {selectedKelompok.namaKelompok}
              </h3>
              <button
                onClick={() => setSelectedKelompok(null)}
                className="text-[#a3835f] hover:text-[#4A3320]"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <img
                src={sesiIcon[selectedKelompok.sesi]}
                alt={selectedKelompok.sesi}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-medium capitalize text-[#6b5233]">
                Sesi {selectedKelompok.sesi}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#6b5233]">
              Mentor: {selectedKelompok.namaMentor}
            </p>

            <h4 className="mt-6 text-sm font-semibold text-[#4A3320]">
              Peserta ({pesertaKelompokTerpilih.length})
            </h4>

            {pesertaKelompokTerpilih.length === 0 ? (
              <p className="mt-2 text-sm text-[#a3835f]">
                Belum ada peserta di kelompok ini.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pesertaKelompokTerpilih.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-[#595959]/20 bg-white/80 px-4 py-2"
                  >
                    <p className="font-medium text-[#3F2E1C]">{p.namaLengkap}</p>
                    <p className="text-xs text-[#6b5233]">
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
