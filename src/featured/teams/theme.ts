// src/featured/teams/theme.ts

import type { Sesi } from '../../shared/types/database';
import pagiIcon from '../../assets/teams/pagi-icon.png';
import siangIcon from '../../assets/teams/siang-icon.png';
import penggantiIcon from '../../assets/teams/pengganti-icon.png';
import textureKayu from '../../assets/teams/texture-kayu.png';

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
