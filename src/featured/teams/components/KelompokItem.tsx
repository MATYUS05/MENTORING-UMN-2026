// src/featured/teams/components/KelompokItem.tsx

import { useState } from 'react';
import type { Kelompok, Peserta } from '../../../shared/types/database';
import { kayuStyle, kelasKartu, sesiIcon } from '../theme';
import Highlight from './Highlight';

type Props = {
  kelompok: Kelompok;
  peserta: Peserta[];
  keyword: string;
  terbuka: boolean;
  onToggle: () => void;
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(value);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1500);
    } catch {
      setTersalin(false);
    }
  }

  return (
    <button
      type="button"
      onClick={salin}
      title={tersalin ? 'Tersalin' : label}
      aria-label={label}
      className="pointer-events-auto shrink-0 rounded p-0.5 text-[#a3835f] transition hover:bg-[#EFD9BC] hover:text-[#7A4A24]"
    >
      {tersalin ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-[#4E8F6A]"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      )}
    </button>
  );
}

export default function KelompokItem({
  kelompok,
  peserta,
  keyword,
  terbuka,
  onToggle,
}: Props) {
  const idPanel = `peserta-${kelompok.id}`;

  const pesertaTerurut = [...peserta].sort(
    (a, b) =>
      a.jurusan.localeCompare(b.jurusan) || a.namaLengkap.localeCompare(b.namaLengkap),
  );

  return (
    <article className={`overflow-hidden ${kelasKartu}`}>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={terbuka}
          aria-controls={idPanel}
          className="absolute inset-0 z-0 h-full w-full cursor-pointer"
        >
          <span className="sr-only">
            {terbuka ? 'Tutup' : 'Buka'} daftar peserta {kelompok.namaKelompok}
          </span>
        </button>

        <div
          className="pointer-events-none relative z-10 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
          style={kayuStyle}
        >
          <img
            src={kelompok.fotoMentorUrl || '/placeholder.webp'}
            alt={kelompok.namaMentor}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.webp';
            }}
            className="h-20 w-20 shrink-0 rounded-xl border-2 border-[#595959] bg-white object-cover"
          />

          <div className="min-w-0 flex-1">
            <h2 className="font-body text-base font-bold break-words text-[#7A4A24] sm:text-lg">
              <Highlight text={kelompok.namaKelompok} keyword={keyword} />
            </h2>

            <p className="flex items-center gap-1.5 font-body text-sm text-[#5C4327]">
              <span className="break-words">
                Mentor: <Highlight text={kelompok.namaMentor} keyword={keyword} />
              </span>
              <CopyButton
                value={kelompok.namaMentor}
                label={`Salin nama mentor ${kelompok.namaMentor}`}
              />
            </p>

            <p className="flex items-center gap-1.5 font-body text-sm text-[#5C4327]">
              <span className="break-words">Id Line: {kelompok.idLineMentor || '-'}</span>
              {kelompok.idLineMentor && (
                <CopyButton
                  value={kelompok.idLineMentor}
                  label={`Salin ID Line ${kelompok.idLineMentor}`}
                />
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
            <img
              src={sesiIcon[kelompok.sesi]}
              alt=""
              aria-hidden
              className="h-6 w-6 object-contain"
            />
            <span className="font-body text-sm font-bold capitalize text-[#7A4A24]">
              Sesi {kelompok.sesi}
            </span>
          </div>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`absolute top-1 right-1 h-6 w-6 shrink-0 text-[#7A4A24] transition-transform duration-200 sm:static ${
              terbuka ? 'rotate-180' : ''
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {terbuka && (
        <div id={idPanel} className="border-t-4 border-dashed border-[#C9793E]/60 p-4">
          {pesertaTerurut.length === 0 ? (
            <p className="font-body text-sm text-[#a3835f]">
              Belum ada peserta di kelompok ini.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center font-body text-sm">
                <thead>
                  <tr className="bg-[#F7E2C6] text-[#7A4A24]">
                    <th className="border-2 border-[#C9793E]/60 px-4 py-2 font-semibold">
                      Nama Lengkap
                    </th>
                    <th className="border-2 border-[#C9793E]/60 px-4 py-2 font-semibold">
                      NIM
                    </th>
                    <th className="border-2 border-[#C9793E]/60 px-4 py-2 font-semibold">
                      Jurusan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pesertaTerurut.map((p) => (
                    <tr key={p.id} className="text-[#5C4327] transition hover:bg-[#FBEAD5]">
                      <td className="border-2 border-[#C9793E]/40 px-4 py-2">
                        <Highlight text={p.namaLengkap} keyword={keyword} />
                      </td>
                      <td className="border-2 border-[#C9793E]/40 px-4 py-2">
                        <Highlight text={p.nim} keyword={keyword} />
                      </td>
                      <td className="border-2 border-[#C9793E]/40 px-4 py-2">{p.jurusan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
