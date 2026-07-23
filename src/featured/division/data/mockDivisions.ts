// src/featured/division/data/mockDivisions.ts
import type { Division } from '../types';

export const DEFAULT_DIVISIONS: Division[] = [
  {
    id: 'programming',
    name: 'Programming',
    logo: '💻',
    description: 'Divisi Arsitek Kode & Pengembang Sistem Digital Mentoring UMN 2026. Bertanggung jawab atas pembangunan platform web, infrastruktur data, serta pengalaman digital para peserta.',
    members: [
      { id: 'p1', name: 'Arya Wijaya', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', nim: '00000081234' },
      { id: 'p2', name: 'Bintang Nusantara', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', nim: '00000081235' },
      { id: 'p3', name: 'Cinta Lestari', position: 'Staff Lead Frontend', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', nim: '00000081236' }
    ]
  },
  {
    id: 'design',
    name: 'Design',
    logo: '🎨',
    description: 'Divisi Visual & Identitas Estetika. Merancang karya seni, maskot, palet warna, serta ornamen bertema Majapahit modern yang mempercantik seluruh lini kegiatan Mentoring.',
    members: [
      { id: 'd1', name: 'Gita Saraswati', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300', nim: '00000082001' },
      { id: 'd2', name: 'Hadi Pramana', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', nim: '00000082002' }
    ]
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    logo: '🎬',
    description: 'Divisi Sinematografi, Audio Visual, & Animasi. Mengabadikan momen magis Mentoring UMN 2026 dalam teaser sinematik, recap video, serta konten gerak dinamis.',
    members: [
      { id: 'm1', name: 'Kevin Tanujaya', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300', nim: '00000083001' },
      { id: 'm2', name: 'Laras Wibowo', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', nim: '00000083002' }
    ]
  },
  {
    id: 'event',
    name: 'Event',
    logo: '🏛️',
    description: 'Divisi Perencana Acara & Konseptor Utama. Merancang rangkaian acara interaktif, rundown kepanitiaan, hingga sesi utama Mentoring UMN 2026 agar berkesan.',
    members: [
      { id: 'e1', name: 'Oktavian Putra', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300', nim: '00000084001' },
      { id: 'e2', name: 'Priscillia Ang', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300', nim: '00000084002' }
    ]
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship',
    logo: '📜',
    description: 'Divisi Kemitraan & Hubungan Eksternal. Menjalin kerja sama strategis dengan mitra dan sponsor untuk mendukung keberlangsungan seluruh agenda Mentoring.',
    members: [
      { id: 's1', name: 'Tegar Pratama', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', nim: '00000085001' },
      { id: 's2', name: 'Utari Wulandari', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', nim: '00000085002' }
    ]
  },
  {
    id: 'executive',
    name: 'Executive',
    logo: '👑',
    description: 'Badan Pengurus Harian & Nahkoda Utama Kepanitiaan Mentoring UMN 2026. Mengawasi, mengarahkan, serta menyelaraskan seluruh divisi demi tercapainya visi organisasi.',
    members: [
      { id: 'ex1', name: 'Rangga Daniswara', position: 'Ketua Mentoring UMN 2026', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', nim: '00000080001' },
      { id: 'ex2', name: 'Annisa Maharani', position: 'Wakil Ketua Mentoring', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', nim: '00000080002' }
    ]
  },
  {
    id: 'website',
    name: 'Website',
    logo: '🌐',
    description: 'Divisi Pengelola Web Portal Mentoring. Mengembangkan serta memelihara fungsionalitas fitur interaktif portal utama peserta.',
    members: [
      { id: 'w1', name: 'Farhan Rizky', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300', nim: '00000086001' },
      { id: 'w2', name: 'Jessica Aurelia', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', nim: '00000086002' }
    ]
  },
  {
    id: 'documentation',
    name: 'Documentation',
    logo: '📷',
    description: 'Divisi Fotografi & Arsip Dokumentasi. Mendokumentasikan setiap momen berharga kepanitiaan dan peserta secara profesional.',
    members: [
      { id: 'dc1', name: 'Rian Hidayat', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', nim: '00000087001' },
      { id: 'dc2', name: 'Sania Putri', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', nim: '00000087002' }
    ]
  },
  {
    id: 'visual',
    name: 'Visual',
    logo: '👁️',
    description: 'Divisi Tata Visual & Grafis Media. Menangani desain publikasi, media sosial, banner, serta identitas cetak acara.',
    members: [
      { id: 'v1', name: 'Bagas Prasetyo', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', nim: '00000088001' },
      { id: 'v2', name: 'Clara Shinta', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300', nim: '00000088002' }
    ]
  },
  {
    id: 'insurer',
    name: 'Insurer',
    logo: '🛡️',
    description: 'Divisi Keamanan & Penjamin Keselamatan. Memastikan ketertiban, kenyamanan, serta protokol keamanan selama acara berlangsung.',
    members: [
      { id: 'i1', name: 'Deni Kurniawan', position: 'Koordinator Divisi', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', nim: '00000089001' },
      { id: 'i2', name: 'Elsa Mayori', position: 'Wakil Koordinator', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', nim: '00000089002' }
    ]
  }
];
