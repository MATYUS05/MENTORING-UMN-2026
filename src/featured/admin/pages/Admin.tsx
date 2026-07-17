// src/featured/admin/pages/Admin.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { akunService } from '../../../lib/akunService';
import { pesertaService } from '../../../lib/pesertaService';
import { panitiaService } from '../../../lib/panitiaService';
import { kelompokService } from '../../../lib/kelompokService';
import { divisiService } from '../../../lib/divisiService';
import { fotoService } from '../../../lib/fotoService';
import type { Divisi } from '../../../shared/types/database';

const menuAdmin = [
  { label: 'Manajemen Team', deskripsi: 'Kelola kelompok mentoring & peserta', path: '/admin/team' },
  { label: 'Manajemen Divisi', deskripsi: 'Kelola divisi & panitia', path: '/admin/divisi' },
  { label: 'Manajemen Chatbot', deskripsi: 'Kelola kategori, intent, training & chat log', path: '/admin/chatbot' },
  { label: 'Manajemen FAQ', deskripsi: 'Kelola FAQ untuk halaman publik', path: '/admin/faq' },
  { label: 'Manajemen Galeri', deskripsi: 'Upload & kelola foto dokumentasi', path: '/admin/galeri' },
];

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-3 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';
const primaryButton =
  'rounded-lg bg-secondary-deep px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';

export default function Admin() {
  const { userData } = useAuth();
  const [username, setUsername] = useState(userData?.username ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [divisiSaya, setDivisiSaya] = useState<Divisi | null>(null);
  const [stats, setStats] = useState({
    peserta: null as number | null,
    panitia: null as number | null,
    kelompok: null as number | null,
    divisi: null as number | null,
    foto: null as number | null,
  });

  useEffect(() => {
    (async () => {
      const [peserta, panitia, kelompok, divisi, foto] = await Promise.all([
        pesertaService.ambilSemua(),
        panitiaService.ambilSemua(),
        kelompokService.ambilSemua(),
        divisiService.ambilSemua(),
        fotoService.ambilSemua(),
      ]);
      setStats({
        peserta: peserta.length,
        panitia: panitia.length,
        kelompok: kelompok.length,
        divisi: divisi.length,
        foto: foto.length,
      });
      const cocok = divisi.find((d) => d.namaDivisi.toLowerCase() === (userData?.divisi ?? '').toLowerCase());
      setDivisiSaya(cocok ?? null);
    })();
  }, [userData?.divisi]);

  const handleSimpan = async () => {
    if (!userData) return;
    setSaving(true);
    setSaved(false);
    await akunService.perbarui(userData.uid, { username });
    setSaving(false);
    setSaved(true);
  };

  const statItems = [
    { label: 'Peserta', value: stats.peserta },
    { label: 'Panitia', value: stats.panitia },
    { label: 'Kelompok', value: stats.kelompok },
    { label: 'Divisi', value: stats.divisi },
    { label: 'Foto Galeri', value: stats.foto },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Dashboard</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>
          Selamat datang, <span className="font-semibold text-neutral-charcoal dark:text-neutral-cream">{userData?.username}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`${cardBase} flex flex-col items-center justify-center p-5 hover:-translate-y-1 hover:border-secondary-deep/60 hover:shadow-md dark:hover:border-secondary-sky/50 transition-all duration-300`}
          >
            <p className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>{item.value ?? '...'}</p>
            <p className={`${font.caption} mt-1 font-medium text-neutral-stone`}>{item.label}</p>
          </div>
        ))}
      </div>

      <div className={`${cardBase} p-6`}>
        <h2 className={`${font.h3} mb-5 text-neutral-charcoal dark:text-neutral-cream`}>Profil Saya</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div>
              <label className={`${font.bodySmall} mb-2 block font-medium text-neutral-charcoal dark:text-neutral-cream`}>
                Email
              </label>
              <p className="rounded-lg border-2 border-neutral-stone/20 bg-neutral-cream px-4 py-3 font-body text-sm text-neutral-stone dark:border-neutral-stone/15 dark:bg-neutral-charcoal-deep">
                {userData?.email}
              </p>
            </div>
            <div>
              <label className={`${font.bodySmall} mb-2 block font-medium text-neutral-charcoal dark:text-neutral-cream`}>
                Username
              </label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputBase} />
            </div>
            <div>
              <label className={`${font.bodySmall} mb-2 block font-medium text-neutral-charcoal dark:text-neutral-cream`}>
                Divisi
              </label>
              <p className="rounded-lg border-2 border-neutral-stone/20 bg-neutral-cream px-4 py-3 font-body text-sm capitalize text-neutral-stone dark:border-neutral-stone/15 dark:bg-neutral-charcoal-deep">
                {userData?.divisi}
              </p>
            </div>
            <button onClick={handleSimpan} disabled={saving} className={primaryButton}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {saved && <p className="font-body text-sm text-success dark:text-success-light">Tersimpan.</p>}
          </div>
          <div className="flex h-full items-center justify-center md:col-span-1">
            <img
              src={divisiSaya?.fotoDivisiUrl || '/placeholder.webp'}
              alt={userData?.divisi ?? 'divisi'}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.webp';
              }}
              className="h-72 w-72 rounded-full border-2 border-neutral-stone/20 object-cover"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className={`${font.h3} mb-4 text-neutral-charcoal dark:text-neutral-cream`}>Menu Manajemen</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {menuAdmin.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${cardBase} p-5 hover:-translate-y-0.5 hover:border-secondary-deep/60 hover:shadow-md dark:hover:border-secondary-sky/50`}
            >
              <p className={`${font.body} font-semibold text-neutral-charcoal dark:text-neutral-cream`}>{item.label}</p>
              <p className={`${font.bodySmall} mt-1 text-neutral-stone`}>{item.deskripsi}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}