// src/featured/super-admin/pages/SuperAdminLogs.tsx
import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { logService } from '../../../lib/logService';
import type { AksiLog, EntitasLog, LogAktivitas } from '../../../shared/types/database';

type FilterAksi = 'semua' | AksiLog;
type FilterEntitas = 'semua' | EntitasLog;

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 overflow-hidden dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const selectBase =
  'rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-primary-dark dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-primary-light';

export default function SuperAdminLogs() {
  const [logs, setLogs] = useState<LogAktivitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAksi, setFilterAksi] = useState<FilterAksi>('semua');
  const [filterEntitas, setFilterEntitas] = useState<FilterEntitas>('semua');
  const [filterPelaku, setFilterPelaku] = useState('semua');

  useEffect(() => {
    (async () => {
      const data = await logService.ambilSemua();
      setLogs(data);
      setLoading(false);
    })();
  }, []);

  const daftarPelaku = useMemo(() => {
    const unik = new Set(logs.map((l) => l.pelakuNama));
    return Array.from(unik);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const cocokAksi = filterAksi === 'semua' || l.aksi === filterAksi;
      const cocokEntitas = filterEntitas === 'semua' || l.entitas === filterEntitas;
      const cocokPelaku = filterPelaku === 'semua' || l.pelakuNama === filterPelaku;
      return cocokAksi && cocokEntitas && cocokPelaku;
    });
  }, [logs, filterAksi, filterEntitas, filterPelaku]);

  const formatWaktu = (waktu: Date) => {
    const tanggal = waktu instanceof Date ? waktu : new Date((waktu as unknown as { seconds: number }).seconds * 1000);
    return tanggal.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Logs Aktivitas</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>
          Riwayat aktivitas admin & percobaan login, hanya bisa dilihat superadmin.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <select value={filterEntitas} onChange={(e) => setFilterEntitas(e.target.value as FilterEntitas)} className={selectBase}>
          <option value="semua">Semua Modul</option>
          <option value="peserta">Peserta</option>
          <option value="panitia">Panitia</option>
          <option value="kelompok">Kelompok</option>
          <option value="divisi">Divisi</option>
          <option value="foto">Foto</option>
          <option value="chatbot">Chatbot</option>
          <option value="faq">FAQ</option>
          <option value="akun">Akun</option>
          <option value="auth">Login</option>
        </select>
        <select value={filterAksi} onChange={(e) => setFilterAksi(e.target.value as FilterAksi)} className={selectBase}>
          <option value="semua">Semua Aksi</option>
          <option value="tambah">Tambah</option>
          <option value="perbarui">Perbarui</option>
          <option value="hapus">Hapus</option>
          <option value="login_berhasil">Login Berhasil</option>
          <option value="login_gagal">Login Gagal</option>
        </select>
        <select value={filterPelaku} onChange={(e) => setFilterPelaku(e.target.value)} className={selectBase}>
          <option value="semua">Semua Pelaku</option>
          {daftarPelaku.map((nama) => (
            <option key={nama} value={nama}>
              {nama}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="font-body text-neutral-stone">Memuat logs...</p>}
      {!loading && filteredLogs.length === 0 && <p className="font-body text-neutral-stone">Tidak ada log yang cocok.</p>}

      <div className={`overflow-x-auto ${cardBase}`}>
        <table className="w-full text-left font-body text-sm">
          <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Pelaku</th>
              <th className="px-4 py-3">Modul</th>
              <th className="px-4 py-3">Aksi</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l) => (
              <tr
                key={l.id}
                className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
              >
                <td className="whitespace-nowrap px-4 py-3 text-neutral-stone">{formatWaktu(l.waktu)}</td>
                <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{l.pelakuNama}</td>
                <td className="px-4 py-3 capitalize text-neutral-stone">{l.entitas}</td>
                <td className="px-4 py-3 capitalize text-neutral-stone">{l.aksi.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-neutral-stone">{l.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}