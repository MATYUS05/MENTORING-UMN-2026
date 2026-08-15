import { useEffect, useState } from 'react';
import type { Kelompok, Peserta } from '../../../shared/types/database';
import { kayuStyle, kelasKartu, sesiIcon } from '../theme';
import Highlight from './Highlight';

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
      className="shrink-0 rounded p-0.5 text-[#a3835f] transition hover:bg-[#EFD9BC] hover:text-[#7A4A24]"
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

type Props = {
  kelompok: Kelompok | null;
  peserta: Peserta[];
  keyword: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function KelompokModal({ kelompok, peserta, keyword, isOpen, onClose }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !kelompok) return null;

  const pesertaTerurut = [...peserta].sort(
    (a, b) => a.jurusan.localeCompare(b.jurusan) || a.namaLengkap.localeCompare(b.namaLengkap),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={`flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden animate-[popIn_0.18s_cubic-bezier(0.16,1,0.3,1)] ${kelasKartu}`}
      >
        <div className="flex items-start gap-4 p-5" style={kayuStyle}>
          <img
            src={kelompok.fotoMentorUrl || '/placeholder.webp'}
            alt={kelompok.namaMentor}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.webp';
            }}
            className="h-20 w-20 shrink-0 rounded-xl border-2 border-[#595959] bg-white object-cover"
          />

          <div className="min-w-0 flex-1">
            <h2 className="font-body text-lg font-bold break-words text-[#7A4A24]">
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

            <div className="mt-1 flex items-center gap-2">
              <img src={sesiIcon[kelompok.sesi]} alt="" aria-hidden className="h-5 w-5 object-contain" />
              <span className="font-body text-sm font-bold capitalize text-[#7A4A24]">
                Sesi {kelompok.sesi}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-full border-2 border-[#595959] bg-white/70 p-1.5 text-[#7A4A24] transition hover:bg-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto border-t-4 border-dashed border-[#C9793E]/60 p-4">
          {pesertaTerurut.length === 0 ? (
            <p className="font-body text-sm text-[#a3835f]">
              Belum ada peserta di kelompok ini.
            </p>
          ) : (
            <table className="w-full border-collapse text-center font-body text-sm">
              <thead>
                <tr className="bg-[#F7E2C6] text-[#7A4A24]">
                  <th className="border-2 border-[#C9793E]/60 px-4 py-2 font-semibold">
                    Nama Lengkap
                  </th>
                  <th className="border-2 border-[#C9793E]/60 px-4 py-2 font-semibold">NIM</th>
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
          )}
        </div>
      </div>
    </div>
  );
}
