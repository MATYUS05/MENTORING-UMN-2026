// src/featured/teams/theme.ts

import type { Sesi } from '../../shared/types/database';
import pagiIcon from '../../assets/teams/pagi-icon.png';
import siangIcon from '../../assets/teams/siang-icon.png';
import penggantiIcon from '../../assets/teams/pengganti-icon.png';
import textureKayu from '../../assets/teams/texture-kayu.png';
import searchBar from '../../assets/teams/Search Bar.png';
import mading from '../../assets/teams/Mading.webp';
import extendedPaper from '../../assets/teams/Extended Paper.webp';

export const sesiIcon: Record<Sesi, string> = {
  pagi: pagiIcon,
  siang: siangIcon,
  pengganti: penggantiIcon,
};

export const kayuStyle = {
  backgroundImage: `url(${textureKayu})`,
  backgroundSize: '280px',
};

// Kelas ditulis utuh sebagai string literal supaya tetap terbaca pemindai Tailwind.
export const kelasKartu = 'rounded-xl border-4 border-[#595959] bg-[#FDF3E6] shadow-md';
export const kelasTombolPapan =
  'flex items-center gap-2 rounded-lg border-2 border-[#595959] px-4 py-2 font-body text-sm font-semibold transition sm:text-base';

export const TINGGI_SEARCH_BAR = 56;

const k = TINGGI_SEARCH_BAR / 254;
const px = (n: number) => `${(n * k).toFixed(3)}px`;

export const gayaSearchBar = {
  position: 'absolute',
  top: `-${px(127)}`,
  bottom: `-${px(119)}`,
  left: `-${px(118)}`,
  right: `-${px(447)}`,
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderWidth: `${px(127)} ${px(574)} ${px(119)} ${px(245)}`,
  borderImageSource: `url(${searchBar})`,
  borderImageSlice: '127 574 119 245 fill',
  borderImageRepeat: 'stretch',
  pointerEvents: 'none',
} as const;

export const gayaAsetTombol = {
  width: '219.298%',
  height: '219.298%',
  left: '-59.649%',
  top: '-58.333%',
  maxWidth: 'none',
};

const cq = (n: number) => `${((n * 100) / 1335).toFixed(4)}cqw`;

export const gayaMading = {
  position: 'absolute',
  top: `-${cq(513)}`,
  left: `-${cq(53)}`,
  right: `-${cq(52)}`,
  bottom: 0,
  zIndex: -1,
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderWidth: `${cq(633)} ${cq(132)} ${cq(300)} ${cq(133)}`,
  borderImageSource: `url(${mading})`,
  borderImageSlice: '633 132 300 133 fill',
  borderImageRepeat: 'stretch',
  pointerEvents: 'none',
} as const;

const hiasanPantai = (x0: number, y0: number, w: number, h: number) =>
  ({
    position: 'absolute',
    width: `${((1440 / w) * 100).toFixed(2)}%`,
    height: `${((2400 / h) * 100).toFixed(2)}%`,
    left: `${((-x0 / w) * 100).toFixed(2)}%`,
    top: `${((-y0 / h) * 100).toFixed(2)}%`,
    maxWidth: 'none',
  }) as const;

export const gayaPelampung = hiasanPantai(0, 2084, 404, 316);
export const gayaShellStar = hiasanPantai(488, 2211, 453, 169);
export const gayaJangkar = hiasanPantai(1097, 1950, 343, 450);

const cqKertas = (n: number) => `${((n * 100) / 2062).toFixed(4)}cqw`;

export const gayaKertasModal = {
  position: 'absolute',
  top: `-${cqKertas(87)}`,
  right: `-${cqKertas(168)}`,
  bottom: `-${cqKertas(163)}`,
  left: `-${cqKertas(170)}`,
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderWidth: `${cqKertas(177)} ${cqKertas(258)} ${cqKertas(253)} ${cqKertas(260)}`,
  borderImageSource: `url(${extendedPaper})`,
  borderImageSlice: '177 258 253 260 fill',
  borderImageRepeat: 'stretch',
  pointerEvents: 'none',
} as const;

export const kelasBaut =
  'absolute h-2.5 w-2.5 rounded-full bg-[#E8C49A] shadow-[inset_0_-1px_1px_rgba(92,67,39,0.45)] ring-2 ring-[#7A4A24]/70 sm:h-3 sm:w-3';
