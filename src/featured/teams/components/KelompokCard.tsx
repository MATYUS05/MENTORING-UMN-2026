import type { Kelompok } from '../../../shared/types/database';
import { sesiIcon } from '../theme';
import paperIcon from '../../../assets/teams/Paper Icon.webp';
import Highlight from './Highlight';

type Props = {
  kelompok: Kelompok;
  keyword: string;
  onClick: () => void;
};

export default function KelompokCard({ kelompok, keyword, onClick }: Props) {
  return (
    <div className="ayun-paku w-full shrink-0 snap-center sm:w-auto sm:shrink">
      <button
        type="button"
        onClick={onClick}
        className="relative aspect-square w-full transition hover:-translate-y-1 active:scale-95"
      >
        <img
          src={paperIcon}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
        />

        <div className="absolute top-[14%] right-[24%] bottom-[18%] left-[24%] flex flex-col items-center justify-center gap-2 text-center">
          <img
            src={kelompok.fotoMentorUrl || '/placeholder.webp'}
            alt={kelompok.namaMentor}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.webp';
            }}
            loading="lazy"
            className="aspect-square w-[62%] shrink-0 rounded-lg border-2 border-[#595959] bg-white object-cover"
          />

          <div className="min-w-0 w-full">
            <h2 className="font-body text-sm font-bold break-words text-[#7A4A24]">
              <Highlight text={kelompok.namaKelompok} keyword={keyword} />
            </h2>
            <p className="break-words font-body text-xs text-[#5C4327]">
              <Highlight text={kelompok.namaMentor} keyword={keyword} />
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <img
              src={sesiIcon[kelompok.sesi]}
              alt=""
              aria-hidden
              className="h-4 w-4 object-contain"
            />
            <span className="font-body text-xs font-bold capitalize text-[#7A4A24]">
              {kelompok.sesi}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
