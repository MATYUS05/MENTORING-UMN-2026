// src/featured/teams/pages/Teams.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { font } from '../../../shared/typography/font';
import { kelompokService } from '../../../lib/kelompokService';
import { pesertaService } from '../../../lib/pesertaService';
import type { Kelompok, Peserta, Sesi } from '../../../shared/types/database';
import teamsLangit from '../../../assets/teams/teams-langit.png';
import teamsPasir from '../../../assets/teams/teams-pasir.png';
import { kayuStyle, kelasTombolPapan, sesiIcon } from '../theme';
import KelompokItem from '../components/KelompokItem';
import Pagination from '../components/Pagination';

type FilterSesi = 'semua' | Sesi;

type Saran = {
  kunci: string;
  label: string;
  keterangan: string;
};

const SESI_OPTIONS: { value: FilterSesi; label: string }[] = [
  { value: 'semua', label: 'Semua Sesi' },
  { value: 'pagi', label: 'Pagi' },
  { value: 'siang', label: 'Siang' },
  { value: 'pengganti', label: 'Pengganti' },
];

const KELOMPOK_PER_HALAMAN = 10;
/** Saran baru muncul setelah keyword sepanjang ini. */
const MIN_KARAKTER_SARAN = 3;
const MAKS_SARAN = 8;

export default function Teams() {
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterSesi, setFilterSesi] = useState<FilterSesi>('semua');
  const [halaman, setHalaman] = useState(1);
  const [terbuka, setTerbuka] = useState<Record<string, boolean>>({});
  const [saranTampil, setSaranTampil] = useState(false);
  const [saranSorot, setSaranSorot] = useState(-1);
  const [filterTerbuka, setFilterTerbuka] = useState(false);

  const kotakCariRef = useRef<HTMLDivElement>(null);
  const kotakFilterRef = useRef<HTMLDivElement>(null);
  const daftarRef = useRef<HTMLDivElement>(null);

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

  // Tutup dropdown saran / filter saat klik di luar kotaknya masing-masing.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!kotakCariRef.current?.contains(e.target as Node)) setSaranTampil(false);
      if (!kotakFilterRef.current?.contains(e.target as Node)) setFilterTerbuka(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const pesertaPerKelompok = useMemo(() => {
    const peta = new Map<string, Peserta[]>();
    for (const p of pesertaList) {
      const daftar = peta.get(p.kelompokId);
      if (daftar) daftar.push(p);
      else peta.set(p.kelompokId, [p]);
    }
    return peta;
  }, [pesertaList]);

  const namaKelompokById = useMemo(() => {
    const peta = new Map<string, string>();
    for (const k of kelompokList) peta.set(k.id, k.namaKelompok);
    return peta;
  }, [kelompokList]);

  const filteredKelompok = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return kelompokList.filter((k) => {
      if (filterSesi !== 'semua' && k.sesi !== filterSesi) return false;
      if (keyword === '') return true;

      if (
        k.namaKelompok.toLowerCase().includes(keyword) ||
        k.namaMentor.toLowerCase().includes(keyword) ||
        k.nimMentor.toLowerCase().includes(keyword)
      ) {
        return true;
      }

      return (pesertaPerKelompok.get(k.id) ?? []).some(
        (p) =>
          p.namaLengkap.toLowerCase().includes(keyword) ||
          p.nim.toLowerCase().includes(keyword),
      );
    });
  }, [kelompokList, search, filterSesi, pesertaPerKelompok]);

  const saranList = useMemo<Saran[]>(() => {
    const keyword = searchInput.trim().toLowerCase();
    if (keyword.length < MIN_KARAKTER_SARAN) return [];

    // Saran adalah kata kunci, bukan baris data: label yang sama digabung
    // jadi satu entri supaya nama populer tidak memenuhi seluruh daftar.
    const kandidat = new Map<string, { label: string; tipe: string; konteks: Set<string> }>();

    function tambah(label: string, tipe: string, konteks?: string) {
      const kunci = `${tipe}|${label.toLowerCase()}`;
      let entri = kandidat.get(kunci);
      if (!entri) {
        entri = { label, tipe, konteks: new Set<string>() };
        kandidat.set(kunci, entri);
      }
      if (konteks) entri.konteks.add(konteks);
    }

    for (const k of kelompokList) {
      if (k.namaKelompok.toLowerCase().includes(keyword)) tambah(k.namaKelompok, 'Kelompok');
      if (k.namaMentor.toLowerCase().includes(keyword))
        tambah(k.namaMentor, 'Mentor', k.namaKelompok);
    }

    for (const p of pesertaList) {
      const namaKelompok = namaKelompokById.get(p.kelompokId) ?? 'Tanpa kelompok';
      if (p.namaLengkap.toLowerCase().includes(keyword))
        tambah(p.namaLengkap, 'Peserta', namaKelompok);
      if (p.nim.toLowerCase().includes(keyword)) tambah(p.nim, 'NIM', p.namaLengkap);
    }

    return [...kandidat.values()].slice(0, MAKS_SARAN).map((entri) => {
      const konteks = [...entri.konteks];
      const keterangan =
        konteks.length === 0
          ? entri.tipe
          : konteks.length === 1
            ? `${entri.tipe} · ${konteks[0]}`
            : `${entri.tipe} · ${konteks.length} hasil`;

      return { kunci: `${entri.tipe}|${entri.label}`, label: entri.label, keterangan };
    });
  }, [searchInput, kelompokList, pesertaList, namaKelompokById]);

  const totalHalaman = Math.max(
    1,
    Math.ceil(filteredKelompok.length / KELOMPOK_PER_HALAMAN),
  );
  const halamanAman = Math.min(halaman, totalHalaman);
  const awalIndeks = (halamanAman - 1) * KELOMPOK_PER_HALAMAN;
  const kelompokHalamanIni = filteredKelompok.slice(
    awalIndeks,
    awalIndeks + KELOMPOK_PER_HALAMAN,
  );

  const adaPencarian = search.trim() !== '';
  // Saat mencari, panel dibuka otomatis agar nama yang ter-highlight langsung terlihat.
  const cekTerbuka = (id: string) =>
    adaPencarian ? terbuka[id] !== false : terbuka[id] === true;

  function pilihSaran(saran: Saran) {
    setSearchInput(saran.label);
    setSearch(saran.label);
    setHalaman(1);
    setSaranTampil(false);
    setSaranSorot(-1);
  }

  function onKeyDownCari(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!saranTampil || saranList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSaranSorot((i) => (i + 1) % saranList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSaranSorot((i) => (i <= 0 ? saranList.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      if (saranSorot >= 0) {
        e.preventDefault();
        pilihSaran(saranList[saranSorot]);
      }
    } else if (e.key === 'Escape') {
      setSaranTampil(false);
      setSaranSorot(-1);
    }
  }

  function pindahHalaman(tujuan: number) {
    setHalaman(Math.min(Math.max(tujuan, 1), totalHalaman));
    daftarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
            Cari kelompok mentoring berdasarkan nama kelompok, mentor, nama peserta, atau
            NIM.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div ref={kotakCariRef} className="relative sm:flex-1">
              <input
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setHalaman(1);
                  setSaranTampil(true);
                  setSaranSorot(-1);
                }}
                onFocus={() => setSaranTampil(true)}
                onKeyDown={onKeyDownCari}
                placeholder="Cari kelompok, mentor, nama peserta, atau NIM..."
                role="combobox"
                aria-expanded={saranTampil && saranList.length > 0}
                aria-controls="saran-pencarian"
                aria-autocomplete="list"
                className="w-full rounded-lg border-2 border-[#595959] bg-amber-50 px-4 py-3 font-body text-[#4A3320] placeholder-[#a3835f] outline-none transition focus:bg-white"
              />

              {saranTampil && saranList.length > 0 && (
                <ul
                  id="saran-pencarian"
                  role="listbox"
                  className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-lg border-2 border-[#595959] bg-amber-50 py-1 shadow-xl"
                >
                  {saranList.map((saran, i) => (
                    <li key={saran.kunci} role="option" aria-selected={i === saranSorot}>
                      <button
                        type="button"
                        onMouseEnter={() => setSaranSorot(i)}
                        onClick={() => pilihSaran(saran)}
                        className={`flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left font-body transition ${
                          i === saranSorot ? 'bg-[#F7E2C6]' : 'hover:bg-[#F7E2C6]'
                        }`}
                      >
                        <span className="truncate text-sm font-semibold text-[#4A3320]">
                          {saran.label}
                        </span>
                        <span className="shrink-0 text-xs text-[#a3835f]">
                          {saran.keterangan}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filter sesi: satu dropdown di samping search (sebelumnya 4 tombol sejajar).
                Opsi, label, ikon, dan logic filter tetap sama persis. */}
            <div ref={kotakFilterRef} className="relative shrink-0 sm:w-56">
              <button
                type="button"
                onClick={() => {
                  setFilterTerbuka((prev) => !prev);
                  setSaranTampil(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={filterTerbuka}
                className={`${kelasTombolPapan} h-full w-full justify-between ${
                  filterSesi !== 'semua'
                    ? 'bg-amber-50 text-[#4A3320] shadow-inner'
                    : 'bg-white/50 text-[#6b5233] hover:bg-amber-50/80'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {filterSesi !== 'semua' && (
                    <img
                      src={sesiIcon[filterSesi]}
                      alt=""
                      aria-hidden
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                  )}
                  <span className="truncate">
                    {filterSesi === 'semua'
                      ? 'Filter Sesi'
                      : SESI_OPTIONS.find((o) => o.value === filterSesi)?.label}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden
                  className={`h-4 w-4 shrink-0 transition-transform ${filterTerbuka ? 'rotate-180' : ''}`}
                />
              </button>

              {filterTerbuka && (
                <ul
                  role="listbox"
                  aria-label="Filter sesi"
                  className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border-2 border-[#595959] bg-amber-50 py-1 shadow-xl"
                >
                  {SESI_OPTIONS.map((opsi) => {
                    const aktif = filterSesi === opsi.value;
                    return (
                      <li key={opsi.value} role="option" aria-selected={aktif}>
                        <button
                          type="button"
                          onClick={() => {
                            setFilterSesi(opsi.value);
                            setHalaman(1);
                            setFilterTerbuka(false);
                          }}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-left font-body text-sm font-semibold text-[#4A3320] transition sm:text-base ${
                            aktif ? 'bg-[#F7E2C6]' : 'hover:bg-[#F7E2C6]'
                          }`}
                        >
                          {opsi.value === 'semua' ? (
                            <span aria-hidden className="h-5 w-5 shrink-0" />
                          ) : (
                            <img
                              src={sesiIcon[opsi.value]}
                              alt=""
                              aria-hidden
                              className="h-5 w-5 shrink-0 object-contain"
                            />
                          )}
                          <span className="flex-1 truncate">{opsi.label}</span>
                          {aktif && <Check aria-hidden className="h-4 w-4 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {loading && (
            <p className="mt-8 text-center font-body font-medium text-[#5C4327]">
              Memuat data kelompok...
            </p>
          )}

          {!loading && filteredKelompok.length === 0 && (
            <p className="mt-8 text-center font-body font-medium text-[#5C4327]">
              Tidak ada kelompok yang cocok.
            </p>
          )}

          {!loading && filteredKelompok.length > 0 && (
            <p className="mt-8 text-center font-body text-sm text-[#5C4327]">
              Menampilkan {awalIndeks + 1}–{awalIndeks + kelompokHalamanIni.length} dari{' '}
              {filteredKelompok.length} kelompok
            </p>
          )}

          <div ref={daftarRef} className="mt-4 flex scroll-mt-24 flex-col gap-4">
            {kelompokHalamanIni.map((k) => (
              <KelompokItem
                key={k.id}
                kelompok={k}
                peserta={pesertaPerKelompok.get(k.id) ?? []}
                keyword={search.trim()}
                terbuka={cekTerbuka(k.id)}
                onToggle={() =>
                  setTerbuka((prev) => ({ ...prev, [k.id]: !cekTerbuka(k.id) }))
                }
              />
            ))}
          </div>

          <Pagination
            halaman={halamanAman}
            totalHalaman={totalHalaman}
            onPindah={pindahHalaman}
          />
        </div>

        {/* Kaki papan */}
        <div className="relative -z-[1] mx-auto -mt-3 -mb-6 hidden max-w-4xl justify-between px-16 sm:flex">
          <div className="h-16 w-9 rounded-b-md border-4 border-[#595959] bg-[#EF9950]" />
          <div className="h-16 w-9 rounded-b-md border-4 border-[#595959] bg-[#EF9950]" />
        </div>
      </div>
    </div>
  );
}
