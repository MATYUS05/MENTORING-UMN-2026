// src/featured/admin/pages/AdminTeam.tsx
import { useEffect, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { kelompokService } from '../../../lib/kelompokService';
import { pesertaService } from '../../../lib/pesertaService';
import { logService } from '../../../lib/logService';
import { excelHelper } from '../../../lib/excelHelper';
import { uploadImage } from '../../../lib/cloudinary';
import DangerConfirmModal from '../../../shared/components/DangerConfirmModal';
import type { Kelompok, Peserta, Sesi } from '../../../shared/types/database';
const kelompokKosong = {
  namaKelompok: '',
  namaMentor: '',
  nimMentor: '',
  idLineMentor: '',
  fotoMentorUrl: '',
  sesi: 'pagi' as Sesi,
};
const pesertaKosong = {
  namaLengkap: '',
  nim: '',
  jurusan: '',
  kelompokId: '',
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
const SESI_VALID: Sesi[] = ['pagi', 'siang', 'pengganti'];
export default function AdminTeam() {
  const { userData } = useAuth();
  const [tab, setTab] = useState<'kelompok' | 'peserta' | 'data'>('kelompok');
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([]);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState('');
  const [importing, setImporting] = useState(false);
  const [showHapusSemua, setShowHapusSemua] = useState(false);
  const [menghapusSemua, setMenghapusSemua] = useState(false);
  const [formKelompok, setFormKelompok] = useState(kelompokKosong);
  const [editingKelompokId, setEditingKelompokId] = useState<string | null>(null);
  const [showFormKelompok, setShowFormKelompok] = useState(false);
  const [uploadingFotoMentor, setUploadingFotoMentor] = useState(false);
  const [formPeserta, setFormPeserta] = useState(pesertaKosong);
  const [editingPesertaId, setEditingPesertaId] = useState<string | null>(null);
  const [showFormPeserta, setShowFormPeserta] = useState(false);
  const muatUlang = async () => {
    const [kelompokData, pesertaData] = await Promise.all([
      kelompokService.ambilSemua(),
      pesertaService.ambilSemua(),
    ]);
    setKelompokList(kelompokData);
    setPesertaList(pesertaData);
    setLoading(false);
  };
  useEffect(() => {
    muatUlang();
  }, []);
  const catat = (aksi: 'tambah' | 'perbarui' | 'hapus', entitas: 'kelompok' | 'peserta', keterangan: string) => {
    if (!userData) return;
    logService.catat(userData.uid, userData.username, aksi, entitas, keterangan);
  };
  const handleUploadFotoMentor = async (file: File) => {
    setUploadingFotoMentor(true);
    try {
      const hasil = await uploadImage(file);
      setFormKelompok((prev) => ({ ...prev, fotoMentorUrl: hasil.url }));
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal mengunggah foto mentor. Silakan coba lagi.');
    } finally {
      setUploadingFotoMentor(false);
    }
  };
  const simpanKelompok = async () => {
    if (editingKelompokId) {
      await kelompokService.perbarui(editingKelompokId, formKelompok);
      catat('perbarui', 'kelompok', `Memperbarui kelompok: ${formKelompok.namaKelompok}`);
    } else {
      await kelompokService.tambah(formKelompok);
      catat('tambah', 'kelompok', `Menambah kelompok: ${formKelompok.namaKelompok}`);
    }
    setFormKelompok(kelompokKosong);
    setEditingKelompokId(null);
    setShowFormKelompok(false);
    await muatUlang();
  };
  const editKelompok = (k: Kelompok) => {
    setFormKelompok({
      namaKelompok: k.namaKelompok,
      namaMentor: k.namaMentor,
      nimMentor: k.nimMentor,
      idLineMentor: k.idLineMentor,
      fotoMentorUrl: k.fotoMentorUrl,
      sesi: k.sesi,
    });
    setEditingKelompokId(k.id);
    setShowFormKelompok(true);
  };
  const hapusKelompok = async (k: Kelompok) => {
    if (!confirm('Hapus kelompok ini?')) return;
    await kelompokService.hapus(k.id);
    catat('hapus', 'kelompok', `Menghapus kelompok: ${k.namaKelompok}`);
    await muatUlang();
  };
  const simpanPeserta = async () => {
    if (editingPesertaId) {
      await pesertaService.perbarui(editingPesertaId, formPeserta);
      catat('perbarui', 'peserta', `Memperbarui peserta: ${formPeserta.namaLengkap}`);
    } else {
      await pesertaService.tambah(formPeserta);
      catat('tambah', 'peserta', `Menambah peserta: ${formPeserta.namaLengkap}`);
    }
    setFormPeserta(pesertaKosong);
    setEditingPesertaId(null);
    setShowFormPeserta(false);
    await muatUlang();
  };
  const editPeserta = (p: Peserta) => {
    setFormPeserta({
      namaLengkap: p.namaLengkap,
      nim: p.nim,
      jurusan: p.jurusan,
      kelompokId: p.kelompokId,
    });
    setEditingPesertaId(p.id);
    setShowFormPeserta(true);
  };
  const hapusPeserta = async (p: Peserta) => {
    if (!confirm('Hapus peserta ini?')) return;
    await pesertaService.hapus(p.id);
    catat('hapus', 'peserta', `Menghapus peserta: ${p.namaLengkap}`);
    await muatUlang();
  };
  const namaKelompokDari = (id: string) => kelompokList.find((k) => k.id === id)?.namaKelompok ?? '-';
  const exportExcel = () => {
    excelHelper.export(
      [
        {
          name: 'kelompok',
          data: kelompokList.map((k) => ({
            id: k.id,
            namaKelompok: k.namaKelompok,
            namaMentor: k.namaMentor,
            nimMentor: k.nimMentor,
            idLineMentor: k.idLineMentor,
            fotoMentorUrl: k.fotoMentorUrl,
            sesi: k.sesi,
          })),
        },
        {
          name: 'peserta',
          data: pesertaList.map((p) => ({
            id: p.id,
            namaLengkap: p.namaLengkap,
            nim: p.nim,
            jurusan: p.jurusan,
            kelompokId: p.kelompokId,
            namaKelompok: namaKelompokDari(p.kelompokId),
          })),
        },
      ],
      'team-export.xlsx'
    );
  };
  const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const sheets = await excelHelper.read(file, ['kelompok', 'peserta']);
      const idKelompokLama = kelompokList.map((k) => k.id);
      let jumlahKelompok = 0;
      for (const row of sheets.kelompok) {
        const namaKelompok = String(row.namaKelompok ?? '').trim();
        if (!namaKelompok) continue;
        const data = {
          namaKelompok,
          namaMentor: String(row.namaMentor ?? '').trim(),
          nimMentor: String(row.nimMentor ?? '').trim(),
          idLineMentor: String(row.idLineMentor ?? '').trim(),
          fotoMentorUrl: String(row.fotoMentorUrl ?? '').trim(),
          sesi: (SESI_VALID.includes(String(row.sesi) as Sesi) ? String(row.sesi) : 'pagi') as Sesi,
        };
        const id = row.id ? String(row.id) : '';
        if (id && idKelompokLama.includes(id)) {
          await kelompokService.perbarui(id, data);
        } else {
          await kelompokService.tambah(data);
        }
        jumlahKelompok++;
      }
      const kelompokTerbaru = await kelompokService.ambilSemua();
      const cariIdKelompok = (row: Record<string, unknown>) => {
        const idDariSheet = row.kelompokId ? String(row.kelompokId) : '';
        if (idDariSheet && kelompokTerbaru.some((k) => k.id === idDariSheet)) return idDariSheet;
        const target = String(row.namaKelompok ?? '').trim().toLowerCase();
        return kelompokTerbaru.find((k) => k.namaKelompok.trim().toLowerCase() === target)?.id ?? '';
      };
      const idPesertaLama = pesertaList.map((p) => p.id);
      let jumlahPeserta = 0;
      for (const row of sheets.peserta) {
        const namaLengkap = String(row.namaLengkap ?? '').trim();
        if (!namaLengkap) continue;
        const data = {
          namaLengkap,
          nim: String(row.nim ?? '').trim(),
          jurusan: String(row.jurusan ?? '').trim(),
          kelompokId: cariIdKelompok(row),
        };
        const id = row.id ? String(row.id) : '';
        if (id && idPesertaLama.includes(id)) {
          await pesertaService.perbarui(id, data);
        } else {
          await pesertaService.tambah(data);
        }
        jumlahPeserta++;
      }
      setPesan(`Import selesai — ${jumlahKelompok} kelompok, ${jumlahPeserta} peserta.`);
      catat('tambah', 'kelompok', 'Import data team dari Excel');
    } catch {
      setPesan('Gagal membaca file Excel. Pastikan format sheet (kelompok, peserta) sesuai hasil export.');
    } finally {
      setImporting(false);
      e.target.value = '';
      await muatUlang();
    }
  };
  const hapusSemuaData = async () => {
    setMenghapusSemua(true);
    try {
      for (const p of pesertaList) {
        await pesertaService.hapus(p.id);
      }
      for (const k of kelompokList) {
        await kelompokService.hapus(k.id);
      }
      catat('hapus', 'kelompok', 'Menghapus seluruh data kelompok dan peserta');
      setPesan('Semua data kelompok dan peserta berhasil dihapus.');
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
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen Team</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>Kelola kelompok mentoring beserta pesertanya.</p>
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
          onClick={() => setTab('kelompok')}
          className={`px-4 py-3 font-body text-sm font-medium border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
            tab === 'kelompok'
              ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
              : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
          }`}
        >
          Kelompok
        </button>
        <button
          onClick={() => setTab('peserta')}
          className={`px-4 py-3 font-body text-sm font-medium border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
            tab === 'peserta'
              ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
              : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
          }`}
        >
          Peserta
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
      {!loading && tab === 'kelompok' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setFormKelompok(kelompokKosong);
              setEditingKelompokId(null);
              setShowFormKelompok(true);
            }}
            className={primaryButton}
          >
            + Tambah Kelompok
          </button>
          <div className={`overflow-x-auto ${cardBase}`}>
            <table className="w-full text-left font-body text-sm">
              <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
                <tr>
                  <th className="px-4 py-3">Nama Kelompok</th>
                  <th className="px-4 py-3">Mentor</th>
                  <th className="px-4 py-3">Sesi</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelompokList.map((k) => (
                  <tr
                    key={k.id}
                    className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{k.namaKelompok}</td>
                    <td className="px-4 py-3 text-neutral-stone">{k.namaMentor}</td>
                    <td className="px-4 py-3 capitalize text-neutral-stone">{k.sesi}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => editKelompok(k)} className={`mr-3 ${primaryLink}`}>
                        Edit
                      </button>
                      <button onClick={() => hapusKelompok(k)} className={dangerLink}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!loading && tab === 'peserta' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setFormPeserta(pesertaKosong);
              setEditingPesertaId(null);
              setShowFormPeserta(true);
            }}
            className={primaryButton}
          >
            + Tambah Peserta
          </button>
          <div className={`overflow-x-auto ${cardBase}`}>
            <table className="w-full text-left font-body text-sm">
              <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">Jurusan</th>
                  <th className="px-4 py-3">Kelompok</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesertaList.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{p.namaLengkap}</td>
                    <td className="px-4 py-3 text-neutral-stone">{p.nim}</td>
                    <td className="px-4 py-3 text-neutral-stone">{p.jurusan}</td>
                    <td className="px-4 py-3 text-neutral-stone">{namaKelompokDari(p.kelompokId)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => editPeserta(p)} className={`mr-3 ${primaryLink}`}>
                        Edit
                      </button>
                      <button onClick={() => hapusPeserta(p)} className={dangerLink}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!loading && tab === 'data' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Export Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Download semua kelompok dan peserta dalam format Excel.
              </p>
              <button onClick={exportExcel} className={`${primaryButton} mt-4`}>
                Download Excel
              </button>
            </div>
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Import Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Upload file Excel (.xlsx) dengan sheet{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">kelompok</code>,{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">peserta</code>. Kolom{' '}
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
              Menghapus seluruh kelompok dan peserta secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <button onClick={() => setShowHapusSemua(true)} className={`${dangerButton} mt-4`}>
              Hapus Semua Data
            </button>
          </div>
        </div>
      )}
      {showFormKelompok && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowFormKelompok(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingKelompokId ? 'Edit Kelompok' : 'Tambah Kelompok'}
            </h3>
            <input
              value={formKelompok.namaKelompok}
              onChange={(e) => setFormKelompok({ ...formKelompok, namaKelompok: e.target.value })}
              placeholder="Nama kelompok"
              className={inputBase}
            />
            <input
              value={formKelompok.namaMentor}
              onChange={(e) => setFormKelompok({ ...formKelompok, namaMentor: e.target.value })}
              placeholder="Nama mentor"
              className={inputBase}
            />
            <input
              value={formKelompok.nimMentor}
              onChange={(e) => setFormKelompok({ ...formKelompok, nimMentor: e.target.value })}
              placeholder="NIM mentor"
              className={inputBase}
            />
            <input
              value={formKelompok.idLineMentor}
              onChange={(e) => setFormKelompok({ ...formKelompok, idLineMentor: e.target.value })}
              placeholder="ID Line mentor"
              className={inputBase}
            />
            <div className="space-y-2">
              <label className="block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                Foto Mentor
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={formKelompok.fotoMentorUrl || '/placeholder.webp'}
                  alt="Preview foto mentor"
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
                    if (file) handleUploadFotoMentor(file);
                  }}
                  disabled={uploadingFotoMentor}
                  className="flex-1 cursor-pointer rounded-lg border-2 border-neutral-stone/40 font-body text-sm text-neutral-stone file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary-deep/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-deep file:transition-all file:duration-200 hover:file:scale-105 hover:file:bg-secondary-deep/20 dark:border-neutral-stone/25 dark:file:bg-secondary-sky/10 dark:file:text-secondary-sky"
                />
              </div>
              {uploadingFotoMentor && <p className="font-body text-xs text-neutral-stone">Mengunggah...</p>}
            </div>
            <select
              value={formKelompok.sesi}
              onChange={(e) => setFormKelompok({ ...formKelompok, sesi: e.target.value as Sesi })}
              className={inputBase}
            >
              <option value="pagi">Pagi</option>
              <option value="siang">Siang</option>
              <option value="pengganti">Pengganti</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormKelompok(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanKelompok} disabled={uploadingFotoMentor} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showFormPeserta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowFormPeserta(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingPesertaId ? 'Edit Peserta' : 'Tambah Peserta'}
            </h3>
            <input
              value={formPeserta.namaLengkap}
              onChange={(e) => setFormPeserta({ ...formPeserta, namaLengkap: e.target.value })}
              placeholder="Nama lengkap"
              className={inputBase}
            />
            <input
              value={formPeserta.nim}
              onChange={(e) => setFormPeserta({ ...formPeserta, nim: e.target.value })}
              placeholder="NIM"
              className={inputBase}
            />
            <input
              value={formPeserta.jurusan}
              onChange={(e) => setFormPeserta({ ...formPeserta, jurusan: e.target.value })}
              placeholder="Jurusan"
              className={inputBase}
            />
            <select
              value={formPeserta.kelompokId}
              onChange={(e) => setFormPeserta({ ...formPeserta, kelompokId: e.target.value })}
              className={inputBase}
            >
              <option value="">Pilih kelompok</option>
              {kelompokList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.namaKelompok}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormPeserta(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanPeserta} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showHapusSemua && (
        <DangerConfirmModal
          title="Hapus Semua Data Kelompok & Peserta"
          description={`Anda akan menghapus ${kelompokList.length} kelompok dan ${pesertaList.length} peserta secara permanen.`}
          loading={menghapusSemua}
          onCancel={() => setShowHapusSemua(false)}
          onConfirm={hapusSemuaData}
        />
      )}
    </div>
  );
}