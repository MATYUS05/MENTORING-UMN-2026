// src/featured/super-admin/pages/SuperAdminAkun.tsx
import { useEffect, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { akunService } from '../../../lib/akunService';
import { logService } from '../../../lib/logService';
import type { DivisiAkun, UserAccount, UserRole } from '../../../shared/types/database';

const akunKosong = {
  email: '',
  username: '',
  role: 'admin' as UserRole,
  divisi: 'website' as DivisiAkun,
};

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 overflow-hidden dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-primary-dark disabled:bg-neutral-cream dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-primary-light dark:disabled:bg-neutral-charcoal';
const primaryButton =
  'rounded-lg bg-primary-dark px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(180,124,91,0.45)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-primary-light dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(231,196,140,0.5)]';
const primaryLink =
  'text-primary-dark transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(180,124,91,0.5)] dark:text-primary-light dark:hover:drop-shadow-[0_0_6px_rgba(231,196,140,0.5)]';
const dangerLink =
  'text-accent-red transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(176,44,32,0.6)] dark:text-accent-red-light dark:hover:drop-shadow-[0_0_6px_rgba(226,88,74,0.6)]';
const neutralLink = 'text-neutral-stone transition-all duration-200 hover:underline hover:text-neutral-charcoal dark:hover:text-neutral-cream';

export default function SuperAdminAkun() {
  const { userData } = useAuth();
  const [akunList, setAkunList] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(akunKosong);
  const [password, setPassword] = useState('');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const muatUlang = async () => {
    const data = await akunService.ambilSemua();
    setAkunList(data);
    setLoading(false);
  };
  useEffect(() => {
    muatUlang();
  }, []);

  const simpan = async () => {
    setError('');
    setSaving(true);
    try {
      if (editingUid) {
        await akunService.perbarui(editingUid, form);
        if (userData) {
          logService.catat(userData.uid, userData.username, 'perbarui', 'akun', `Memperbarui akun: ${form.username}`);
        }
      } else {
        if (password.length < 6) {
          setError('Password minimal 6 karakter.');
          setSaving(false);
          return;
        }
        await akunService.tambah(form, password);
        if (userData) {
          logService.catat(userData.uid, userData.username, 'tambah', 'akun', `Menambah akun: ${form.username}`);
        }
      }
      setForm(akunKosong);
      setPassword('');
      setEditingUid(null);
      setShowForm(false);
      await muatUlang();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan akun.');
    } finally {
      setSaving(false);
    }
  };

  const editAkun = (a: UserAccount) => {
    setForm({
      email: a.email,
      username: a.username,
      role: a.role,
      divisi: (a.divisi ?? 'website') as DivisiAkun,
    });
    setEditingUid(a.uid);
    setShowForm(true);
  };
  const hapusAkun = async (a: UserAccount) => {
    if (!confirm('Hapus data akun ini dari Firestore? Login Firebase Auth-nya tidak otomatis terhapus.')) return;
    await akunService.hapus(a.uid);
    if (userData) {
      logService.catat(userData.uid, userData.username, 'hapus', 'akun', `Menghapus akun: ${a.username}`);
    }
    await muatUlang();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen Akun</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>Kelola akun admin dan superadmin.</p>
      </div>

      <button
        onClick={() => {
          setForm(akunKosong);
          setPassword('');
          setEditingUid(null);
          setShowForm(true);
        }}
        className={primaryButton}
      >
        + Tambah Akun
      </button>

      {loading && <p className="font-body text-neutral-stone">Memuat akun...</p>}

      <div className={`overflow-x-auto ${cardBase}`}>
        <table className="w-full text-left font-body text-sm">
          <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Divisi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {akunList.map((a) => (
              <tr
                key={a.uid}
                className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
              >
                <td className="px-4 py-3 font-medium text-neutral-charcoal dark:text-neutral-cream">{a.username}</td>
                <td className="px-4 py-3 text-neutral-stone">{a.email}</td>
                <td className="px-4 py-3 capitalize text-neutral-stone">{a.role}</td>
                <td className="px-4 py-3 capitalize text-neutral-stone">{a.divisi ?? '-'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => editAkun(a)} className={`mr-3 ${primaryLink}`}>
                    Edit
                  </button>
                  <button onClick={() => hapusAkun(a)} className={dangerLink}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingUid ? 'Edit Akun' : 'Tambah Akun'}
            </h3>
            {error && (
              <p className="rounded-lg border-2 border-accent-red/30 bg-accent-red/10 px-4 py-2 font-body text-sm text-accent-red dark:border-accent-red/25 dark:bg-accent-red/20 dark:text-accent-red-light">
                {error}
              </p>
            )}
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              className={inputBase}
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              disabled={!!editingUid}
              className={inputBase}
            />
            {!editingUid && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (minimal 6 karakter)"
                className={inputBase}
              />
            )}
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className={inputBase}>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <select
              value={form.divisi}
              onChange={(e) => setForm({ ...form, divisi: e.target.value as DivisiAkun })}
              className={inputBase}
            >
              <option value="executive">Executive</option>
              <option value="website">Website</option>
              <option value="documentation">Documentation</option>
              <option value="visual">Visual</option>
              <option value="insurer">Insurer</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpan} disabled={saving} className={primaryButton}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}