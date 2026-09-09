// src/featured/teams/pages/Teams.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { font } from '../../../shared/typography/font';
import { kelompokService } from '../../../lib/kelompokService';
import { pesertaService } from '../../../lib/pesertaService';
import type { Kelompok, Peserta, Sesi } from '../../../shared/types/database';
import sky from '../../../assets/teams/Sky.webp';
import pasir from '../../../assets/teams/Pasir.webp';
import pelampung from '../../../assets/teams/Pelampung.png';
import shellStar from '../../../assets/teams/Shell + Star.png';
import jangkar from '../../../assets/teams/Jangkar.png';
import zachy from '../../../assets/teams/Zachy.png';
import {
  TINGGI_SEARCH_BAR,
  gayaAsetTombol,
  gayaJangkar,
  gayaMading,
  gayaPelampung,
  gayaSearchBar,
  gayaShellStar,
  kayuStyle,
  kelasBaut,
  sesiIcon,
} from '../theme';
import searchButtonImg from '../../../assets/teams/Search Button.png';
import filterButtonImg from '../../../assets/teams/Filter Button.png';
import KelompokCard from '../components/KelompokCard';
import KelompokModal from '../components/KelompokModal';
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

const KELOMPOK_PER_HALAMAN = 6;
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
  const [modalKelompokId, setModalKelompokId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saranTampil, setSaranTampil] = useState(false);
  const [saranSorot, setSaranSorot] = useState(-1);
  const [filterTerbuka, setFilterTerbuka] = useState(false);
  const [layarKecil, setLayarKecil] = useState(false);
  const [kartuAktif, setKartuAktif] = useState(0);

  const kotakCariRef = useRef<HTMLDivElement>(null);
  const kotakFilterRef = useRef<HTMLDivElement>(null);
  const daftarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sesuaikan = () => setLayarKecil(mq.matches);
    sesuaikan();
    mq.addEventListener('change', sesuaikan);
    return () => mq.removeEventListener('change', sesuaikan);
  }, []);

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

  const modalKelompok = modalKelompokId
    ? (kelompokList.find((k) => k.id === modalKelompokId) ?? null)
    : null;

  function handleOpenModal(k: Kelompok) {
    setModalKelompokId(k.id);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setTimeout(() => setModalKelompokId(null), 300);
  }

  function jalankanPencarian() {
    setSearch(searchInput);
    setHalaman(1);
    setSaranTampil(false);
    setSaranSorot(-1);
  }

  function pilihSaran(saran: Saran) {
    setSearchInput(saran.label);
    setSearch(saran.label);
    setHalaman(1);
    setSaranTampil(false);
    setSaranSorot(-1);
  }

  function onKeyDownCari(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!saranTampil || saranList.length === 0) {
      if (e.key === 'Enter') jalankanPencarian();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSaranSorot((i) => (i + 1) % saranList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSaranSorot((i) => (i <= 0 ? saranList.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (saranSorot >= 0) pilihSaran(saranList[saranSorot]);
      else jalankanPencarian();
    } else if (e.key === 'Escape') {
      setSaranTampil(false);
      setSaranSorot(-1);
    }
  }

  function pindahHalaman(tujuan: number) {
    setHalaman(Math.min(Math.max(tujuan, 1), totalHalaman));
    if (daftarRef.current) daftarRef.current.scrollLeft = 0;
    setKartuAktif(0);
    daftarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="relative -mt-[132px] flex min-h-screen flex-col pt-[132px]">
      <div className="fixed inset-0 -z-[30] bg-[#61DAE3]" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-[20] overflow-hidden" aria-hidden>
        <img src={sky} alt="" className="absolute inset-x-0 top-0 w-full" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="relative" style={{ containerType: 'inline-size' }}>
          <div style={gayaMading} aria-hidden />
          <div className="relative px-[8cqw] pt-[6cqw] pb-[22cqw]">
            <div className="relative z-30 mx-auto max-w-4xl rounded-3xl border-2 border-[#A97043] bg-[#C27F4F] px-4 py-5 shadow-[inset_0_3px_10px_rgba(74,51,32,0.28),inset_0_1px_0_rgba(255,228,196,0.35)] sm:px-8 sm:py-7">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-30 mix-blend-multiply"
                style={kayuStyle}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 -z-10 rounded-[1.25rem] border border-[#7A4A24]/25 sm:inset-3"
              />
              <span aria-hidden className={kelasBaut + ' top-2.5 left-2.5 sm:top-3.5 sm:left-3.5'} />
              <span aria-hidden className={kelasBaut + ' top-2.5 right-2.5 sm:top-3.5 sm:right-3.5'} />
              <span aria-hidden className={kelasBaut + ' bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5'} />
              <span aria-hidden className={kelasBaut + ' bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5'} />
              <h1 className={`${font.h1} text-center text-[#4A3320]`}>Teams</h1>

              <p className="mx-auto mt-3 max-w-xl text-center font-body text-sm leading-snug font-semibold text-[#5C4327] sm:mt-4 sm:text-base">
                Cari kelompok mentoring berdasarkan nama kelompok, mentor, nama peserta, atau
                NIM.
              </p>

              <div className="mt-4 flex items-center gap-3 sm:mt-5">
                <div ref={kotakCariRef} className="relative flex-1">
                  <div className="relative w-full" style={{ height: TINGGI_SEARCH_BAR }}>
                    <div style={gayaSearchBar} aria-hidden />

                    <input
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setSaranTampil(true);
                        setSaranSorot(-1);
                      }}
                      onFocus={() => setSaranTampil(true)}
                      onKeyDown={onKeyDownCari}
                      placeholder={
                        layarKecil
                          ? 'Cari kelompok...'
                          : 'Cari kelompok, mentor, nama peserta, atau NIM...'
                      }
                      role="combobox"
                      aria-expanded={saranTampil && saranList.length > 0}
                      aria-controls="saran-pencarian"
                      aria-autocomplete="list"
                      className="relative h-full w-full bg-transparent pr-14 pl-4 font-body text-xs font-bold text-[#5C3A1E] placeholder-[#A2683C] outline-none sm:pr-20 sm:pl-7 sm:text-base"
                    />

                    <button
                      type="button"
                      onClick={jalankanPencarian}
                      aria-label="Cari"
                      className="absolute top-1/2 right-3 h-11 w-11 -translate-y-1/2 transition active:scale-95"
                    >
                      <img
                        src={searchButtonImg}
                        alt=""
                        aria-hidden
                        style={gayaAsetTombol}
                        className="pointer-events-none absolute select-none"
                      />
                    </button>
                  </div>

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

                <div ref={kotakFilterRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterTerbuka((prev) => !prev);
                      setSaranTampil(false);
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={filterTerbuka}
                    aria-label={
                      filterSesi === 'semua'
                        ? 'Filter sesi'
                        : `Filter sesi: ${SESI_OPTIONS.find((o) => o.value === filterSesi)?.label}`
                    }
                    className="relative shrink-0 transition hover:-translate-y-0.5 active:scale-95"
                    style={{ height: TINGGI_SEARCH_BAR, width: TINGGI_SEARCH_BAR }}
                  >
                    <img
                      src={filterButtonImg}
                      alt=""
                      aria-hidden
                      style={gayaAsetTombol}
                      className="pointer-events-none absolute select-none"
                    />
                    {filterSesi !== 'semua' && (
                      <img
                        src={sesiIcon[filterSesi]}
                        alt=""
                        aria-hidden
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-50 object-contain ring-2 ring-[#9A6236]"
                      />
                    )}
                  </button>

                  {filterTerbuka && (
                    <ul
                      role="listbox"
                      aria-label="Filter sesi"
                      className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-lg border-2 border-[#595959] bg-amber-50 py-1 shadow-xl"
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
            </div>

            {loading && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div
                  role="status"
                  aria-label="Memuat data kelompok"
                  className="h-12 w-12 animate-spin rounded-full border-4 border-[#7A4A24]/25 border-t-[#7A4A24]"
                />
                <p className="font-body font-medium text-[#5C4327]">Memuat data kelompok...</p>
              </div>
            )}

            {!loading && filteredKelompok.length === 0 && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-center font-body font-medium text-[#5C4327]">
                  Tidak ada kelompok yang cocok.
                </p>
                <img
                  src={zachy}
                  alt=""
                  aria-hidden
                  className="mt-2 w-40 max-w-[60%] object-contain sm:w-52"
                />
              </div>
            )}

            <div
              ref={daftarRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const lebar = el.scrollWidth / Math.max(kelompokHalamanIni.length, 1);
                setKartuAktif(Math.round(el.scrollLeft / lebar));
              }}
              className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-mt-24 pb-1 [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
            >
              {kelompokHalamanIni.map((k) => (
                <KelompokCard
                  key={k.id}
                  kelompok={k}
                  keyword={search.trim()}
                  onClick={() => handleOpenModal(k)}
                />
              ))}
            </div>

            {kelompokHalamanIni.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
                {kelompokHalamanIni.map((k, i) => (
                  <span
                    key={k.id}
                    aria-hidden
                    className={`h-1.5 rounded-full transition-all ${
                      i === kartuAktif ? 'w-4 bg-[#7A4A24]' : 'w-1.5 bg-[#7A4A24]/35'
                    }`}
                  />
                ))}
              </div>
            )}

            {!loading && filteredKelompok.length > 0 && (
              <p className="mt-5 text-center font-body text-xs text-[#6B5233] sm:text-sm">
                Menampilkan {awalIndeks + 1}–{awalIndeks + kelompokHalamanIni.length} dari{' '}
                {filteredKelompok.length} kelompok
              </p>
            )}

            <Pagination
              halaman={halamanAman}
              totalHalaman={totalHalaman}
              onPindah={pindahHalaman}
            />
          </div>
        </div>

        <KelompokModal
          kelompok={modalKelompok}
          peserta={modalKelompok ? (pesertaPerKelompok.get(modalKelompok.id) ?? []) : []}
          keyword={search.trim()}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>

      <div className="pointer-events-none relative -z-10 -mb-45 min-h-50 w-full flex-1 overflow-hidden bg-[#FEE384]">
        <div className="absolute inset-x-0 top-0 aspect-[1439/565] w-full overflow-hidden">
          <img src={pasir} alt="" aria-hidden className="absolute -bottom-0.5 w-full" />
        </div>

        <div
          className="absolute bottom-0 left-0 aspect-[404/316] overflow-hidden"
          style={{ width: 'min(28.06%, 143px)' }}
        >
          <img src={pelampung} alt="" aria-hidden style={gayaPelampung} />
        </div>

        <div
          className="absolute bottom-[3.5%] left-[49.6%] aspect-[453/169] -translate-x-1/2 overflow-hidden"
          style={{ width: 'min(31.46%, 161px)' }}
        >
          <img src={shellStar} alt="" aria-hidden style={gayaShellStar} />
        </div>

        <div
          className="absolute right-0 bottom-0 aspect-[343/450] overflow-hidden"
          style={{ width: 'min(23.82%, 122px)' }}
        >
          <img src={jangkar} alt="" aria-hidden style={gayaJangkar} />
        </div>
      </div>
    </div>
  );
}
