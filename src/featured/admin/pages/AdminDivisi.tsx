// src/featured/admin/pages/AdminDivisi.tsx
import { useEffect, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { divisiService } from '../../../lib/divisiService';
import { panitiaService } from '../../../lib/panitiaService';
import { logService } from '../../../lib/logService';
import { uploadImage } from '../../../lib/cloudinary';
import { excelHelper } from '../../../lib/excelHelper';
import DangerConfirmModal from '../../../shared/components/DangerConfirmModal';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import type { Divisi, Panitia, PosisiPanitia } from '../../../shared/types/database';
const divisiKosong = {
  namaDivisi: '',
  fotoDivisiUrl: '',
  deskripsiDivisi: '',
  tipeExec: false,
};
const panitiaKosong = {
  namaLengkap: '',
  nim: '',
  divisiId: '',
  posisi: 'anggota' as PosisiPanitia,
};
const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 overflow-hidden dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';
const primaryButton =
  'rounded-lg bg-secondary-deep px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';
const dangerButton =
  'rounded-lg bg-accent-red px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(176,44,32,0.45)] dark:bg-accent-red-light dark:text-neutral-charcoal-deep';
const primaryLink =
  'text-secondary-deep transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(40,100,174,0.5)] dark:text-secondary-sky dark:hover:drop-shadow-[0_0_6px_rgba(78,171,238,0.5)]';
const dangerLink =
  'text-accent-red transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(176,44,32,0.6)] dark:text-accent-red-light dark:hover:drop-shadow-[0_0_6px_rgba(226,88,74,0.6)]';
const neutralLink = 'text-neutral-stone transition-all duration-200 hover:underline hover:text-neutral-charcoal dark:hover:text-neutral-cream';
const POSISI_VALID: PosisiPanitia[] = ['koordinator', 'anggota', 'executive'];
const keBoolean = (v: unknown) => v === true || String(v).trim().toLowerCase() === 'true' || String(v).trim() === '1';
export default function AdminDivisi() {
  const { userData } = useAuth();
  const [tab, setTab] = useState<'divisi' | 'panitia' | 'data'>('divisi');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [panitiaList, setPanitiaList] = useState<Panitia[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState('');
  const [importing, setImporting] = useState(false);
  const [showHapusSemua, setShowHapusSemua] = useState(false);
  const [menghapusSemua, setMenghapusSemua] = useState(false);
  const [filterDivisi, setFilterDivisi] = useState('semua');
  const [deletingDivisi, setDeletingDivisi] = useState<Divisi | null>(null);
  const [deletingPanitia, setDeletingPanitia] = useState<Panitia | null>(null);
  const [formDivisi, setFormDivisi] = useState(divisiKosong);
  const [editingDivisiId, setEditingDivisiId] = useState<string | null>(null);
  const [showFormDivisi, setShowFormDivisi] = useState(false);
  const [uploadingFotoDivisi, setUploadingFotoDivisi] = useState(false);
  const [formPanitia, setFormPanitia] = useState(panitiaKosong);
  const [editingPanitiaId, setEditingPanitiaId] = useState<string | null>(null);
  const [showFormPanitia, setShowFormPanitia] = useState(false);
  const muatUlang = async () => {
    const [divisiData, panitiaData] = await Promise.all([divisiService.ambilSemua(), panitiaService.ambilSemua()]);
    setDivisiList(divisiData);
    setPanitiaList(panitiaData);
    setLoading(false);
  };
  useEffect(() => {
    muatUlang();
  }, []);
  const catat = (aksi: 'tambah' | 'perbarui' | 'hapus', entitas: 'divisi' | 'panitia', keterangan: string) => {
    if (!userData) return;
    logService.catat(userData.uid, userData.username, aksi, entitas, keterangan);
  };
  const handleUploadFotoDivisi = async (file: File) => {
    setUploadingFotoDivisi(true);
    try {
      const hasil = await uploadImage(file);
      setFormDivisi((prev) => ({ ...prev, fotoDivisiUrl: hasil.url }));
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal mengunggah foto divisi. Silakan coba lagi.');
    } finally {
      setUploadingFotoDivisi(false);
    }
  };
  const simpanDivisi = async () => {
    if (editingDivisiId) {
      await divisiService.perbarui(editingDivisiId, formDivisi);
      catat('perbarui', 'divisi', `Memperbarui divisi: ${formDivisi.namaDivisi}`);
    } else {
      await divisiService.tambah(formDivisi);
      catat('tambah', 'divisi', `Menambah divisi: ${formDivisi.namaDivisi}`);
    }
    setFormDivisi(divisiKosong);
    setEditingDivisiId(null);
    setShowFormDivisi(false);
    await muatUlang();
  };
  const editDivisi = (d: Divisi) => {
    setFormDivisi({
      namaDivisi: d.namaDivisi,
      fotoDivisiUrl: d.fotoDivisiUrl,
      deskripsiDivisi: d.deskripsiDivisi,
      tipeExec: d.tipeExec,
    });
    setEditingDivisiId(d.id);
    setShowFormDivisi(true);
  };
  const hapusDivisi = (d: Divisi) => {
    setDeletingDivisi(d);
  };
  const confirmHapusDivisi = async () => {
    if (!deletingDivisi) return;
    await divisiService.hapus(deletingDivisi.id);
    catat('hapus', 'divisi', `Menghapus divisi: ${deletingDivisi.namaDivisi}`);
    setDeletingDivisi(null);
    await muatUlang();
  };
  const simpanPanitia = async () => {
    if (editingPanitiaId) {
      await panitiaService.perbarui(editingPanitiaId, formPanitia);
      catat('perbarui', 'panitia', `Memperbarui panitia: ${formPanitia.namaLengkap}`);
    } else {
      await panitiaService.tambah(formPanitia);
      catat('tambah', 'panitia', `Menambah panitia: ${formPanitia.namaLengkap}`);
    }
    setFormPanitia(panitiaKosong);
    setEditingPanitiaId(null);
    setShowFormPanitia(false);
    await muatUlang();
  };
  const editPanitia = (p: Panitia) => {
    setFormPanitia({
      namaLengkap: p.namaLengkap,
      nim: p.nim,
      divisiId: p.divisiId,
      posisi: p.posisi,
    });
    setEditingPanitiaId(p.id);
    setShowFormPanitia(true);
  };
  const hapusPanitia = (p: Panitia) => {
    setDeletingPanitia(p);
  };
  const confirmHapusPanitia = async () => {
    if (!deletingPanitia) return;
    await panitiaService.hapus(deletingPanitia.id);
    catat('hapus', 'panitia', `Menghapus panitia: ${deletingPanitia.namaLengkap}`);
    setDeletingPanitia(null);
    await muatUlang();
  };
  const namaDivisiDari = (id: string) => divisiList.find((d) => d.id === id)?.namaDivisi ?? '-';

  const q = searchQuery.trim().toLowerCase();
  const filteredDivisi = divisiList.filter(
    (d) => d.namaDivisi.toLowerCase().includes(q) || d.deskripsiDivisi.toLowerCase().includes(q)
  );
  const filteredPanitia = panitiaList.filter((p) => {
    const matchSearch =
      p.namaLengkap.toLowerCase().includes(q) ||
      p.nim.toLowerCase().includes(q) ||
      p.posisi.toLowerCase().includes(q) ||
      namaDivisiDari(p.divisiId).toLowerCase().includes(q);
    const matchFilter = filterDivisi === 'semua' || p.divisiId === filterDivisi;
    return matchSearch && matchFilter;
  });
  const exportExcel = () => {
    excelHelper.export(
      [
        {
          name: 'divisi',
          data: divisiList.map((d) => ({
            id: d.id,
            namaDivisi: d.namaDivisi,
            fotoDivisiUrl: d.fotoDivisiUrl,
            deskripsiDivisi: d.deskripsiDivisi,
            tipeExec: d.tipeExec,
          })),
        },
        {
          name: 'panitia',
          data: panitiaList.map((p) => ({
            id: p.id,
            namaLengkap: p.namaLengkap,
            nim: p.nim,
            divisiId: p.divisiId,
            namaDivisi: namaDivisiDari(p.divisiId),
            posisi: p.posisi,
          })),
        },
      ],
      'divisi-export.xlsx'
    );
  };
  const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const sheets = await excelHelper.read(file, ['divisi', 'panitia']);
      const idDivisiLama = divisiList.map((d) => d.id);
      let jumlahDivisi = 0;
      for (const row of sheets.divisi) {
        const namaDivisi = String(row.namaDivisi ?? '').trim();
        if (!namaDivisi) continue;
        const data = {
          namaDivisi,
          fotoDivisiUrl: String(row.fotoDivisiUrl ?? '').trim(),
          deskripsiDivisi: String(row.deskripsiDivisi ?? '').trim(),
          tipeExec: keBoolean(row.tipeExec),
        };
        const id = row.id ? String(row.id) : '';
        if (id && idDivisiLama.includes(id)) {
          await divisiService.perbarui(id, data);
        } else {
          await divisiService.tambah(data);
        }
        jumlahDivisi++;
      }
      const divisiTerbaru = await divisiService.ambilSemua();
      const cariIdDivisi = (row: Record<string, unknown>) => {
        const idDariSheet = row.divisiId ? String(row.divisiId) : '';
        if (idDariSheet && divisiTerbaru.some((d) => d.id === idDariSheet)) return idDariSheet;
        const target = String(row.namaDivisi ?? '').trim().toLowerCase();
        return divisiTerbaru.find((d) => d.namaDivisi.trim().toLowerCase() === target)?.id ?? '';
      };
      const idPanitiaLama = panitiaList.map((p) => p.id);
      let jumlahPanitia = 0;
      for (const row of sheets.panitia) {
        const namaLengkap = String(row.namaLengkap ?? '').trim();
        if (!namaLengkap) continue;
        const data = {
          namaLengkap,
          nim: String(row.nim ?? '').trim(),
          divisiId: cariIdDivisi(row),
          posisi: (POSISI_VALID.includes(String(row.posisi) as PosisiPanitia) ? String(row.posisi) : 'anggota') as PosisiPanitia,
        };
        const id = row.id ? String(row.id) : '';
        if (id && idPanitiaLama.includes(id)) {
          await panitiaService.perbarui(id, data);
        } else {
          await panitiaService.tambah(data);
        }
        jumlahPanitia++;
      }
      setPesan(`Import selesai — ${jumlahDivisi} divisi, ${jumlahPanitia} panitia.`);
      catat('tambah', 'divisi', 'Import data divisi dari Excel');
    } catch {
      setPesan('Gagal membaca file Excel. Pastikan format sheet (divisi, panitia) sesuai hasil export.');
    } finally {
      setImporting(false);
      e.target.value = '';
      await muatUlang();
    }
  };
  const hapusSemuaData = async () => {
    setMenghapusSemua(true);
    try {
      for (const p of panitiaList) {
        await panitiaService.hapus(p.id);
      }
      for (const d of divisiList) {
        await divisiService.hapus(d.id);
      }
      catat('hapus', 'divisi', 'Menghapus seluruh data divisi dan panitia');
      setPesan('Semua data divisi dan panitia berhasil dihapus.');
      setShowHapusSemua(false);
    } catch {
      setPesan('Sebagian data gagal dihapus. Silakan periksa kembali lalu coba lagi.');
    } finally {
      setMenghapusSemua(false);
      await muatUlang();
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen Divisi</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>Kelola divisi beserta panitianya.</p>
      </div>
      {pesan && (
        <div className="flex items-center justify-between rounded-lg border-2 border-accent-gold/60 bg-accent-gold/25 px-4 py-3 font-body text-sm text-neutral-charcoal dark:border-accent-gold/40 dark:bg-accent-gold/10 dark:text-accent-gold">
          <span>{pesan}</span>
          <button onClick={() => setPesan('')} className="text-neutral-stone transition-transform duration-200 hover:scale-110 hover:text-neutral-charcoal dark:hover:text-neutral-cream">
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2 border-b-2 border-neutral-stone/30 dark:border-neutral-stone/20">
        <button
          onClick={() => setTab('divisi')}
          className={`px-4 py-3 font-body text-sm font-medium border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
            tab === 'divisi'
              ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
              : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
          }`}
        >
          Divisi
        </button>
        <button
          onClick={() => setTab('panitia')}
          className={`px-4 py-3 font-body text-sm font-medium border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
            tab === 'panitia'
              ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
              : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
          }`}
        >
          Panitia
        </button>
        <button
          onClick={() => setTab('data')}
          className={`px-4 py-3 font-body text-sm font-medium border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
            tab === 'data'
              ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
              : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
          }`}
        >
          Data
        </button>
      </div>
      {loading && <p className="font-body text-neutral-stone">Memuat data...</p>}
      {!loading && tab === 'divisi' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setFormDivisi(divisiKosong);
                setEditingDivisiId(null);
                setShowFormDivisi(true);
              }}
              className={`shrink-0 ${primaryButton}`}
            >
              + Tambah Divisi
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama divisi atau tipe..."
              className={inputBase}
            />
          </div>
          {filteredDivisi.length === 0 ? (
            <p className="font-body text-neutral-stone">Tidak ada data yang sesuai dengan pencarian.</p>
          ) : (
            <div className={`overflow-x-auto ${cardBase}`}>
            <table className="w-full text-left font-body text-sm">
              <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
                <tr>
                  <th className="px-4 py-3">Nama Divisi</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDivisi.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{d.namaDivisi}</td>
                    <td className="px-4 py-3 text-neutral-stone">{d.tipeExec ? 'Executive' : 'Reguler'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => editDivisi(d)} className={`mr-3 ${primaryLink}`}>
                        Edit
                      </button>
                      <button onClick={() => hapusDivisi(d)} className={dangerLink}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}
      {!loading && tab === 'panitia' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => {
                setFormPanitia(panitiaKosong);
                setEditingPanitiaId(null);
                setShowFormPanitia(true);
              }}
              className={`shrink-0 ${primaryButton}`}
            >
              + Tambah Panitia
            </button>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, atau divisi..."
                className={inputBase}
              />
              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className={`${inputBase} shrink-0 sm:w-64`}
              >
                <option value="semua">Semua Divisi</option>
                {divisiList.map(d => (
                  <option key={d.id} value={d.id}>{d.namaDivisi}</option>
                ))}
              </select>
            </div>
          </div>
          {filteredPanitia.length === 0 ? (
            <p className="font-body text-neutral-stone">Tidak ada data yang sesuai dengan pencarian.</p>
          ) : (
            <div className={`overflow-x-auto ${cardBase}`}>
            <table className="w-full text-left font-body text-sm">
              <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">Divisi</th>
                  <th className="px-4 py-3">Posisi</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPanitia.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{p.namaLengkap}</td>
                    <td className="px-4 py-3 text-neutral-stone">{p.nim}</td>
                    <td className="px-4 py-3 text-neutral-stone">{namaDivisiDari(p.divisiId)}</td>
                    <td className="px-4 py-3 capitalize text-neutral-stone">{p.posisi}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => editPanitia(p)} className={`mr-3 ${primaryLink}`}>
                        Edit
                      </button>
                      <button onClick={() => hapusPanitia(p)} className={dangerLink}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}
      {!loading && tab === 'data' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Export Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Download semua divisi dan panitia dalam format Excel.
              </p>
              <button onClick={exportExcel} className={`${primaryButton} mt-4`}>
                Download Excel
              </button>
            </div>
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Import Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Upload file Excel (.xlsx) dengan sheet{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">divisi</code>,{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">panitia</code>. Kolom{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">id</code> kosong = data baru,
                diisi = update data yang cocok.
              </p>
              <input
                type="file"
                accept=".xlsx"
                onChange={importExcel}
                disabled={importing}
                className="mt-4 cursor-pointer rounded-lg border-2 border-neutral-stone/40 font-body text-sm text-neutral-stone file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary-deep/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-deep file:transition-all file:duration-200 hover:file:scale-105 hover:file:bg-secondary-deep/20 dark:border-neutral-stone/25 dark:file:bg-secondary-sky/10 dark:file:text-secondary-sky"
              />
              {importing && <p className="mt-2 font-body text-sm text-neutral-stone">Mengimpor...</p>}
            </div>
          </div>
          <div className={`${cardBase} border-accent-red/40 p-6 dark:border-accent-red/30`}>
            <h2 className={`${font.h3} text-accent-red dark:text-accent-red-light`}>Zona Berbahaya</h2>
            <p className={`${font.body} mt-2 text-neutral-stone`}>
              Menghapus seluruh divisi dan panitia secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <button onClick={() => setShowHapusSemua(true)} className={`${dangerButton} mt-4`}>
              Hapus Semua Data
            </button>
          </div>
        </div>
      )}
      {showFormDivisi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowFormDivisi(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingDivisiId ? 'Edit Divisi' : 'Tambah Divisi'}
            </h3>
            <input
              value={formDivisi.namaDivisi}
              onChange={(e) => setFormDivisi({ ...formDivisi, namaDivisi: e.target.value })}
              placeholder="Nama divisi"
              className={inputBase}
            />
            <div className="space-y-2">
              <label className="block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                Foto Divisi
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={formDivisi.fotoDivisiUrl || '/placeholder.webp'}
                  alt="Preview foto divisi"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.webp';
                  }}
                  className="h-16 w-16 shrink-0 rounded-full border-2 border-neutral-stone/20 object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFotoDivisi(file);
                  }}
                  disabled={uploadingFotoDivisi}
                  className="flex-1 cursor-pointer rounded-lg border-2 border-neutral-stone/40 font-body text-sm text-neutral-stone file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary-deep/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-deep file:transition-all file:duration-200 hover:file:scale-105 hover:file:bg-secondary-deep/20 dark:border-neutral-stone/25 dark:file:bg-secondary-sky/10 dark:file:text-secondary-sky"
                />
              </div>
              {uploadingFotoDivisi && <p className="font-body text-xs text-neutral-stone">Mengunggah...</p>}
            </div>
            <textarea
              value={formDivisi.deskripsiDivisi}
              onChange={(e) => setFormDivisi({ ...formDivisi, deskripsiDivisi: e.target.value })}
              placeholder="Deskripsi divisi"
              className={inputBase}
            />
            <label className="flex items-center gap-2 font-body text-sm text-neutral-stone">
              <input
                type="checkbox"
                checked={formDivisi.tipeExec}
                onChange={(e) => setFormDivisi({ ...formDivisi, tipeExec: e.target.checked })}
              />
              Divisi Executive (semua anggota posisi "executive")
            </label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormDivisi(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanDivisi} disabled={uploadingFotoDivisi} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showFormPanitia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowFormPanitia(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingPanitiaId ? 'Edit Panitia' : 'Tambah Panitia'}
            </h3>
            <input
              value={formPanitia.namaLengkap}
              onChange={(e) => setFormPanitia({ ...formPanitia, namaLengkap: e.target.value })}
              placeholder="Nama lengkap"
              className={inputBase}
            />
            <input
              value={formPanitia.nim}
              onChange={(e) => setFormPanitia({ ...formPanitia, nim: e.target.value })}
              placeholder="NIM"
              className={inputBase}
            />
            <select
              value={formPanitia.divisiId}
              onChange={(e) => setFormPanitia({ ...formPanitia, divisiId: e.target.value })}
              className={inputBase}
            >
              <option value="">Pilih divisi</option>
              {divisiList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.namaDivisi}
                </option>
              ))}
            </select>
            <select
              value={formPanitia.posisi}
              onChange={(e) => setFormPanitia({ ...formPanitia, posisi: e.target.value as PosisiPanitia })}
              className={inputBase}
            >
              <option value="koordinator">Koordinator</option>
              <option value="anggota">Anggota</option>
              <option value="executive">Executive</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormPanitia(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanPanitia} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showHapusSemua && (
        <DangerConfirmModal
          title="Hapus Semua Data Divisi & Panitia"
          description={`Anda akan menghapus ${divisiList.length} divisi dan ${panitiaList.length} panitia secara permanen.`}
          loading={menghapusSemua}
          onCancel={() => setShowHapusSemua(false)}
          onConfirm={hapusSemuaData}
        />
      )}
      {deletingDivisi && (
        <ConfirmModal
          title="Hapus Divisi"
          description={`Apakah Anda yakin ingin menghapus divisi "${deletingDivisi.namaDivisi}"? Tindakan ini tidak dapat dibatalkan.`}
          onCancel={() => setDeletingDivisi(null)}
          onConfirm={confirmHapusDivisi}
        />
      )}
      {deletingPanitia && (
        <ConfirmModal
          title="Hapus Panitia"
          description={`Apakah Anda yakin ingin menghapus panitia "${deletingPanitia.namaLengkap}"? Tindakan ini tidak dapat dibatalkan.`}
          onCancel={() => setDeletingPanitia(null)}
          onConfirm={confirmHapusPanitia}
        />
      )}
    </div>
  );
}