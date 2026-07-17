// src/featured/admin/pages/AdminGaleri.tsx
import { useEffect, useState, useRef } from 'react';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { fotoService } from '../../../lib/fotoService';
import { uploadImage } from '../../../lib/cloudinary';
import { logService } from '../../../lib/logService';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';
const primaryButton =
  'rounded-lg bg-secondary-deep px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';
const dangerLink =
  'text-accent-red transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(176,44,32,0.6)] dark:text-accent-red-light dark:hover:drop-shadow-[0_0_6px_rgba(226,88,74,0.6)]';

export default function AdminGaleri() {
  const { userData } = useAuth();
  const [fotoList, setFotoList] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pesan, setPesan] = useState('');
  const [judul, setJudul] = useState('');
  const [sesi, setSesi] = useState<Sesi>('pagi');
  const [minggu, setMinggu] = useState<Minggu>('minggu-1');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const muatUlang = async () => {
    const data = await fotoService.ambilSemua();
    setFotoList(data);
    setLoading(false);
  };
  useEffect(() => {
    muatUlang();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const hasil = await uploadImage(file);
      await fotoService.tambah({
        fotoUrl: hasil.url,
        publicId: hasil.publicId,
        judul,
        sesi,
        minggu,
        uploadedBy: userData?.uid ?? '',
      });
      if (userData) {
        await logService.catat(userData.uid, userData.username, 'tambah', 'foto', `Mengunggah foto: ${judul || '(tanpa judul)'}`);
      }
      setJudul('');
      setSesi('pagi');
      setMinggu('minggu-1');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPesan('Foto berhasil diunggah.');
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal mengunggah foto. Silakan coba lagi.');
    } finally {
      setUploading(false);
      await muatUlang();
    }
  };

  const hapusFoto = async (f: Foto) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await fotoService.hapus(f.id);
      if (userData) {
        await logService.catat(userData.uid, userData.username, 'hapus', 'foto', `Menghapus foto: ${f.judul || '(tanpa judul)'}`);
      }
      setPesan('Foto berhasil dihapus.');
    } catch {
      setPesan('Gagal menghapus foto. Silakan coba lagi.');
    } finally {
      await muatUlang();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen Galeri</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>Upload dan kelola foto dokumentasi mentoring.</p>
      </div>

      {pesan && (
        <div className="flex items-center justify-between rounded-lg border-2 border-accent-gold/60 bg-accent-gold/25 px-4 py-3 font-body text-sm text-neutral-charcoal dark:border-accent-gold/40 dark:bg-accent-gold/10 dark:text-accent-gold">
          <span>{pesan}</span>
          <button onClick={() => setPesan('')} className="text-neutral-stone transition-transform duration-200 hover:scale-110 hover:text-neutral-charcoal dark:hover:text-neutral-cream">
            ✕
          </button>
        </div>
      )}

      <div className={`${cardBase} space-y-4 p-6`}>
        <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Upload Foto Baru</h2>
        <input
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul foto (opsional)"
          className={`w-full ${inputBase}`}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <select value={sesi} onChange={(e) => setSesi(e.target.value as Sesi)} className={inputBase}>
            <option value="pagi">Pagi</option>
            <option value="siang">Siang</option>
            <option value="pengganti">Pengganti</option>
          </select>
          <select value={minggu} onChange={(e) => setMinggu(e.target.value as Minggu)} className={inputBase}>
            <option value="minggu-1">Minggu 1</option>
            <option value="minggu-2">Minggu 2</option>
            <option value="minggu-3">Minggu 3</option>
          </select>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="flex-1 cursor-pointer rounded-lg border-2 border-neutral-stone/40 font-body text-sm text-neutral-stone file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary-deep/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-deep file:transition-all file:duration-200 hover:file:scale-105 hover:file:bg-secondary-deep/20 dark:border-neutral-stone/25 dark:file:bg-secondary-sky/10 dark:file:text-secondary-sky"
          />
        </div>
        <button onClick={handleUpload} disabled={!file || uploading} className={primaryButton}>
          {uploading ? 'Mengunggah...' : 'Upload Foto'}
        </button>
      </div>

      {loading && <p className="font-body text-neutral-stone">Memuat foto...</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {fotoList.map((f) => (
          <div key={f.id} className={cardBase}>
            <img
              src={f.fotoUrl}
              alt={f.judul ?? 'foto'}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.webp';
              }}
              className="h-32 w-full object-cover"
            />
            <div className="p-3">
              <p className="font-body text-xs capitalize text-neutral-stone">
                {f.sesi} · {f.minggu}
              </p>
              <button onClick={() => hapusFoto(f)} className={`mt-2 text-xs ${dangerLink}`}>
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}