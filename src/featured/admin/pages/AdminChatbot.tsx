// src/featured/admin/pages/AdminChatbot.tsx
import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { logService } from '../../../lib/logService';
import DangerConfirmModal from '../../../shared/components/DangerConfirmModal';
const BACKEND_URL = import.meta.env.VITE_CHATBOT_URL as string;
type Emotion = 'neutral' | 'happy' | 'serious' | 'cheerful' | 'shy' | 'angry';
const EMOTIONS: Emotion[] = ['neutral', 'happy', 'serious', 'cheerful', 'shy', 'angry'];
interface Kategori {
  id: number;
  name: string;
  question_count?: number;
}
interface Intent {
  id: number;
  category_id: number;
  name: string;
  response: string;
  emotion: Emotion;
  question_count?: number;
}
interface PertanyaanTraining {
  id: number;
  intent_id: number;
  question: string;
}
interface ChatLog {
  id: number;
  user_message: string;
  bot_response: string;
  matched_intent_id: number | null;
  confidence_score: number | null;
  is_correct: number | null;
}
const kategoriKosong = { name: '' };
const intentKosong = { category_id: '', name: '', response: '', emotion: 'neutral' as Emotion };
const pertanyaanKosong = { intent_id: '', question: '' };
const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 overflow-hidden dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';
const primaryButton =
  'rounded-lg bg-secondary-deep px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';
const dangerButton =
  'rounded-lg bg-accent-red px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(176,44,32,0.45)] dark:bg-accent-red-light dark:text-neutral-charcoal-deep';
const dangerLink =
  'text-accent-red transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(176,44,32,0.6)] dark:text-accent-red-light dark:hover:drop-shadow-[0_0_6px_rgba(226,88,74,0.6)]';
const primaryLink =
  'text-secondary-deep transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(40,100,174,0.5)] dark:text-secondary-sky dark:hover:drop-shadow-[0_0_6px_rgba(78,171,238,0.5)]';
const neutralLink =
  'text-neutral-stone transition-all duration-200 hover:underline hover:text-neutral-charcoal dark:hover:text-neutral-cream';
const successLink =
  'text-success transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(78,143,106,0.6)] dark:text-success-light';
export default function AdminChatbot() {
  const { userData } = useAuth();
  const [tab, setTab] = useState<'dashboard' | 'training' | 'logs' | 'data'>('dashboard');
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [intentList, setIntentList] = useState<Intent[]>([]);
  const [pertanyaanList, setPertanyaanList] = useState<PertanyaanTraining[]>([]);
  const [logList, setLogList] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState('');
  const [expandedKategori, setExpandedKategori] = useState<Record<number, boolean>>({});
  const [expandedIntent, setExpandedIntent] = useState<Record<number, boolean>>({});
  const [formKategori, setFormKategori] = useState(kategoriKosong);
  const [editingKategoriId, setEditingKategoriId] = useState<number | null>(null);
  const [showFormKategori, setShowFormKategori] = useState(false);
  const [formIntent, setFormIntent] = useState(intentKosong);
  const [editingIntentId, setEditingIntentId] = useState<number | null>(null);
  const [showFormIntent, setShowFormIntent] = useState(false);
  const [formPertanyaan, setFormPertanyaan] = useState(pertanyaanKosong);
  const [editingPertanyaanId, setEditingPertanyaanId] = useState<number | null>(null);
  const [showFormPertanyaan, setShowFormPertanyaan] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showHapusSemua, setShowHapusSemua] = useState(false);
  const [menghapusSemua, setMenghapusSemua] = useState(false);
  const catat = (aksi: 'tambah' | 'perbarui' | 'hapus', keterangan: string) => {
    if (!userData) return;
    logService.catat(userData.uid, userData.username, aksi, 'chatbot', keterangan);
  };
  const muatUlang = async () => {
    setLoading(true);
    try {
      const [logRes, katRes, intentRes, pertanyaanRes] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/logs`),
        fetch(`${BACKEND_URL}/admin/categories`),
        fetch(`${BACKEND_URL}/admin/intents`),
        fetch(`${BACKEND_URL}/admin/questions`),
      ]);
      setLogList(await logRes.json());
      setKategoriList(await katRes.json());
      setIntentList(await intentRes.json());
      setPertanyaanList(await pertanyaanRes.json());
    } catch {
      setPesan('Gagal mengambil data dari server chatbot.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    muatUlang();
  }, []);
  const grouped = useMemo(
    () =>
      kategoriList.map((kat) => ({
        kategori: kat,
        intents: intentList
          .filter((i) => i.category_id === kat.id)
          .map((intent) => ({
            ...intent,
            pertanyaan: pertanyaanList.filter((q) => q.intent_id === intent.id),
          })),
      })),
    [kategoriList, intentList, pertanyaanList]
  );
  const namaIntentDari = (id: number | null) => intentList.find((i) => i.id === id)?.name ?? '(none)';
  const simpanKategori = async () => {
    if (!formKategori.name.trim()) return setPesan('Nama kategori tidak boleh kosong.');
    if (editingKategoriId) {
      await fetch(`${BACKEND_URL}/admin/categories/${editingKategoriId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formKategori.name }),
      });
      catat('perbarui', `Memperbarui kategori: ${formKategori.name}`);
    } else {
      await fetch(`${BACKEND_URL}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formKategori.name }),
      });
      catat('tambah', `Menambah kategori: ${formKategori.name}`);
    }
    setFormKategori(kategoriKosong);
    setEditingKategoriId(null);
    setShowFormKategori(false);
    await muatUlang();
  };
  const editKategori = (k: Kategori) => {
    setFormKategori({ name: k.name });
    setEditingKategoriId(k.id);
    setShowFormKategori(true);
  };
  const hapusKategori = async (k: Kategori) => {
    if (Number(k.question_count) > 0) return setPesan('Hapus intent di dalam kategori ini dulu.');
    if (!confirm('Hapus kategori ini?')) return;
    await fetch(`${BACKEND_URL}/admin/categories/${k.id}`, { method: 'DELETE' });
    catat('hapus', `Menghapus kategori: ${k.name}`);
    await muatUlang();
  };
  const simpanIntent = async () => {
    if (!formIntent.name.trim()) return setPesan('Nama intent tidak boleh kosong.');
    if (!formIntent.category_id) return setPesan('Pilih kategori dulu.');
    if (editingIntentId) {
      await fetch(`${BACKEND_URL}/admin/intents/${editingIntentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formIntent),
      });
      catat('perbarui', `Memperbarui intent: ${formIntent.name}`);
    } else {
      await fetch(`${BACKEND_URL}/admin/intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formIntent),
      });
      catat('tambah', `Menambah intent: ${formIntent.name}`);
    }
    setFormIntent(intentKosong);
    setEditingIntentId(null);
    setShowFormIntent(false);
    await muatUlang();
  };
  const editIntent = (i: Intent) => {
    setFormIntent({
      category_id: String(i.category_id),
      name: i.name,
      response: i.response,
      emotion: i.emotion,
    });
    setEditingIntentId(i.id);
    setShowFormIntent(true);
  };
  const hapusIntent = async (i: Intent) => {
    if (Number(i.question_count) > 0) return setPesan('Hapus pertanyaan di dalam intent ini dulu.');
    if (!confirm('Hapus intent ini?')) return;
    await fetch(`${BACKEND_URL}/admin/intents/${i.id}`, { method: 'DELETE' });
    catat('hapus', `Menghapus intent: ${i.name}`);
    await muatUlang();
  };
  const simpanPertanyaan = async () => {
    if (!formPertanyaan.question.trim()) return setPesan('Pertanyaan tidak boleh kosong.');
    if (!formPertanyaan.intent_id) return setPesan('Pilih intent dulu.');
    if (editingPertanyaanId) {
      await fetch(`${BACKEND_URL}/admin/questions/${editingPertanyaanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPertanyaan),
      });
      catat('perbarui', 'Memperbarui pertanyaan training');
    } else {
      await fetch(`${BACKEND_URL}/admin/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPertanyaan),
      });
      catat('tambah', 'Menambah pertanyaan training');
    }
    setFormPertanyaan(pertanyaanKosong);
    setEditingPertanyaanId(null);
    setShowFormPertanyaan(false);
    await muatUlang();
  };
  const editPertanyaan = (q: PertanyaanTraining) => {
    setFormPertanyaan({ intent_id: String(q.intent_id), question: q.question });
    setEditingPertanyaanId(q.id);
    setShowFormPertanyaan(true);
  };
  const hapusPertanyaan = async (q: PertanyaanTraining) => {
    if (!confirm('Hapus pertanyaan ini?')) return;
    await fetch(`${BACKEND_URL}/admin/questions/${q.id}`, { method: 'DELETE' });
    catat('hapus', 'Menghapus pertanyaan training');
    await muatUlang();
  };
  const tandaiLog = async (id: number, status: 0 | 1) => {
    await fetch(`${BACKEND_URL}/admin/logs/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_correct: status }),
    });
    await muatUlang();
  };
  const gantiIntentLog = async (logId: number, intentId: string) => {
    await fetch(`${BACKEND_URL}/admin/logs/update-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log_id: logId, intent_id: intentId === '' ? null : Number(intentId) }),
    });
    await muatUlang();
  };
  const tambahDariLog = async (logId: number) => {
    await fetch(`${BACKEND_URL}/admin/logs/add-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log_id: logId }),
    });
    catat('tambah', 'Menambah pertanyaan training dari chat log');
    await muatUlang();
  };
  const exportExcel = async () => {
    const res = await fetch(`${BACKEND_URL}/admin/export`);
    const data = await res.json();
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.categories ?? []), 'categories');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.intents ?? []), 'intents');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.questions ?? []), 'questions');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.chat_logs ?? []), 'chat_logs');
    XLSX.writeFile(wb, 'chatbot-export.xlsx');
  };
  const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const ambilSheet = (nama: string) => (wb.Sheets[nama] ? XLSX.utils.sheet_to_json(wb.Sheets[nama]) : []);
    const res = await fetch(`${BACKEND_URL}/admin/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categories: ambilSheet('categories'),
        intents: ambilSheet('intents'),
        questions: ambilSheet('questions'),
      }),
    });
    const hasil = await res.json();
    setPesan(
      `Import selesai — ${hasil.stats?.categories ?? 0} kategori, ${hasil.stats?.intents ?? 0} intent, ${hasil.stats?.questions ?? 0} pertanyaan.`
    );
    catat('tambah', 'Import dataset chatbot dari Excel');
    setImporting(false);
    e.target.value = '';
    await muatUlang();
  };
  const hapusSemuaData = async () => {
    setMenghapusSemua(true);
    try {
      for (const l of logList) {
        if (l.matched_intent_id !== null) {
          const res = await fetch(`${BACKEND_URL}/admin/logs/update-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ log_id: l.id, intent_id: null }),
          });
          if (!res.ok) throw new Error('Gagal melepas referensi chat log ke intent sebelum penghapusan.');
        }
      }
      for (const q of pertanyaanList) {
        const res = await fetch(`${BACKEND_URL}/admin/questions/${q.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Gagal menghapus pertanyaan "${q.question}".`);
      }
      for (const i of intentList) {
        const res = await fetch(`${BACKEND_URL}/admin/intents/${i.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Gagal menghapus intent "${i.name}".`);
      }
      for (const k of kategoriList) {
        const res = await fetch(`${BACKEND_URL}/admin/categories/${k.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Gagal menghapus kategori "${k.name}".`);
      }
      catat('hapus', 'Menghapus seluruh data training chatbot (kategori, intent, pertanyaan)');
      setPesan('Semua data training chatbot berhasil dihapus.');
      setShowHapusSemua(false);
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Sebagian data gagal dihapus. Silakan periksa kembali lalu coba lagi.');
    } finally {
      setMenghapusSemua(false);
      await muatUlang();
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen Chatbot</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>
          Kelola kategori, intent, training data, dan chat log dari backend chatbot (Railway). Ini terpisah dari
          Manajemen FAQ yang tampil di halaman publik.
        </p>
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
        {(['dashboard', 'training', 'logs', 'data'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 font-body text-sm font-medium capitalize border-b-2 -mb-0.5 transition-all duration-200 hover:scale-105 ${
              tab === t
                ? 'border-secondary-deep text-secondary-deep dark:border-secondary-sky dark:text-secondary-sky'
                : 'border-transparent text-neutral-stone hover:text-neutral-charcoal dark:hover:text-neutral-cream'
            }`}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'training' ? 'Training' : t === 'logs' ? 'Chat Logs' : 'Data'}
          </button>
        ))}
      </div>
      {loading && <p className="font-body text-neutral-stone">Memuat data dari backend chatbot...</p>}
      {!loading && tab === 'dashboard' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Kategori', value: kategoriList.length },
            { label: 'Intent', value: intentList.length },
            { label: 'Pertanyaan Training', value: pertanyaanList.length },
            { label: 'Chat Log', value: logList.length },
          ].map((s) => (
            <div key={s.label} className={`${cardBase} p-4 text-center hover:scale-[1.03] hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <p className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>{s.value}</p>
              <p className={`${font.caption} mt-1 text-neutral-stone`}>{s.label}</p>
            </div>
          ))}
        </div>
      )}
      {!loading && tab === 'training' && (
        <div className="space-y-4">
          <button onClick={() => { setFormKategori(kategoriKosong); setEditingKategoriId(null); setShowFormKategori(true); }} className={primaryButton}>
            + Tambah Kategori
          </button>
          <div className="space-y-3">
            {grouped.map((g) => (
              <div key={g.kategori.id} className={cardBase}>
                <div
                  className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep"
                  onClick={() => setExpandedKategori((p) => ({ ...p, [g.kategori.id]: !p[g.kategori.id] }))}
                >
                  <span className="font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                    {expandedKategori[g.kategori.id] ? '▼' : '▶'} {g.kategori.name}
                    <span className="ml-2 font-body text-xs font-normal text-neutral-stone">{g.intents.length} intent</span>
                  </span>
                  <div className="flex gap-3 font-body text-sm" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => editKategori(g.kategori)} className={primaryLink}>
                      Edit
                    </button>
                    <button onClick={() => hapusKategori(g.kategori)} className={dangerLink}>
                      Hapus
                    </button>
                    <button
                      onClick={() => { setFormIntent({ ...intentKosong, category_id: String(g.kategori.id) }); setEditingIntentId(null); setShowFormIntent(true); }}
                      className={neutralLink}
                    >
                      + Intent
                    </button>
                  </div>
                </div>
                {expandedKategori[g.kategori.id] && (
                  <div className="border-t-2 border-neutral-stone/25 px-4 py-3">
                    {g.intents.length === 0 && <p className="font-body text-sm text-neutral-stone">Belum ada intent.</p>}
                    {g.intents.map((intent) => (
                      <div key={intent.id} className="mb-2 rounded-lg border-2 border-neutral-stone/25 bg-neutral-cream transition-colors duration-200 dark:border-neutral-stone/15 dark:bg-neutral-charcoal-deep">
                        <div
                          className="flex cursor-pointer items-center justify-between px-3 py-2 transition-colors duration-200 hover:bg-white dark:hover:bg-neutral-charcoal"
                          onClick={() => setExpandedIntent((p) => ({ ...p, [intent.id]: !p[intent.id] }))}
                        >
                          <span className="font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                            {expandedIntent[intent.id] ? '▼' : '▶'} {intent.name}
                            <span className="ml-2 rounded-full border-2 border-neutral-stone/30 bg-neutral-sand px-2 py-0.5 text-xs text-neutral-charcoal dark:border-neutral-stone/20 dark:bg-neutral-charcoal dark:text-neutral-sand">
                              {intent.emotion}
                            </span>
                            <span className="ml-2 font-body text-xs text-neutral-stone">{intent.pertanyaan.length} pertanyaan</span>
                          </span>
                          <div className="flex gap-3 font-body text-xs" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => editIntent(intent)} className={primaryLink}>
                              Edit
                            </button>
                            <button onClick={() => hapusIntent(intent)} className={dangerLink}>
                              Hapus
                            </button>
                            <button
                              onClick={() => { setFormPertanyaan({ ...pertanyaanKosong, intent_id: String(intent.id) }); setEditingPertanyaanId(null); setShowFormPertanyaan(true); }}
                              className={neutralLink}
                            >
                              + Pertanyaan
                            </button>
                          </div>
                        </div>
                        {expandedIntent[intent.id] && (
                          <div className="space-y-2 px-3 pb-3">
                            <p className="rounded border-2 border-neutral-stone/15 bg-white px-3 py-2 font-body text-xs text-neutral-stone dark:border-neutral-stone/10 dark:bg-neutral-charcoal">
                              <span className="font-medium text-neutral-charcoal dark:text-neutral-cream">Response:</span> {intent.response || '(kosong)'}
                            </p>
                            {intent.pertanyaan.map((q) => (
                              <div key={q.id} className="flex items-center justify-between rounded border-2 border-neutral-stone/15 bg-white px-3 py-2 font-body text-sm transition-colors duration-200 hover:bg-neutral-cream dark:border-neutral-stone/10 dark:bg-neutral-charcoal dark:hover:bg-neutral-charcoal-deep">
                                <span className="text-neutral-charcoal dark:text-neutral-cream">{q.question}</span>
                                <div className="flex gap-3 text-xs">
                                  <button onClick={() => editPertanyaan(q)} className={primaryLink}>
                                    Edit
                                  </button>
                                  <button onClick={() => hapusPertanyaan(q)} className={dangerLink}>
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {!loading && tab === 'logs' && (
        <div className={`overflow-x-auto ${cardBase}`}>
          <table className="w-full text-left font-body text-sm">
            <thead className="border-b-2 border-neutral-stone/30 bg-neutral-sand/40 text-neutral-stone dark:border-neutral-stone/20 dark:bg-neutral-charcoal-deep">
              <tr>
                <th className="px-4 py-3">Pesan User</th>
                <th className="px-4 py-3">Respon Bot</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {logList.map((l) => (
                <tr key={l.id} className="border-t-2 border-neutral-stone/20 transition-colors duration-200 hover:bg-neutral-cream dark:hover:bg-neutral-charcoal-deep">
                  <td className="max-w-48 truncate px-4 py-3 text-neutral-charcoal dark:text-neutral-cream" title={l.user_message}>
                    {l.user_message}
                  </td>
                  <td className="max-w-48 truncate px-4 py-3 text-neutral-stone" title={l.bot_response}>
                    {l.bot_response}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.matched_intent_id ?? ''}
                      onChange={(e) => gantiIntentLog(l.id, e.target.value)}
                      className="rounded border-2 border-neutral-stone/40 bg-white px-2 py-1 text-xs text-neutral-charcoal transition-colors focus:border-secondary-deep dark:border-neutral-stone/25 dark:bg-neutral-charcoal-deep dark:text-neutral-cream"
                    >
                      <option value="">{namaIntentDari(l.matched_intent_id)}</option>
                      {intentList.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-neutral-stone">
                    {l.confidence_score != null ? l.confidence_score.toFixed(2) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {l.is_correct === 1 ? (
                      <span className="rounded-full border-2 border-success/30 bg-success/15 px-2 py-0.5 text-xs text-success dark:border-success/25 dark:bg-success/20 dark:text-success-light">
                        Benar
                      </span>
                    ) : l.is_correct === 0 ? (
                      <span className="rounded-full border-2 border-accent-red/30 bg-accent-red/10 px-2 py-0.5 text-xs text-accent-red dark:border-accent-red/25 dark:bg-accent-red/20 dark:text-accent-red-light">
                        Salah
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-stone">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 text-xs">
                      <button onClick={() => tandaiLog(l.id, 1)} className={successLink}>
                        Benar
                      </button>
                      <button onClick={() => tandaiLog(l.id, 0)} className={dangerLink}>
                        Salah
                      </button>
                      <button
                        onClick={() => tambahDariLog(l.id)}
                        disabled={!l.matched_intent_id}
                        className={`${neutralLink} disabled:opacity-40 disabled:hover:drop-shadow-none`}
                      >
                        + Dataset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && tab === 'data' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Export Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Download semua kategori, intent, pertanyaan, dan chat log dalam format Excel.
              </p>
              <button onClick={exportExcel} className={`${primaryButton} mt-4`}>
                Download Excel
              </button>
            </div>
            <div className={`${cardBase} p-6 hover:border-secondary-deep/50 hover:shadow-md dark:hover:border-secondary-sky/40`}>
              <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Import Data</h2>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Upload file Excel (.xlsx) dengan sheet{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">categories</code>,{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">intents</code>,{' '}
                <code className="rounded border-2 border-neutral-stone/25 bg-neutral-sand px-1 dark:bg-neutral-charcoal-deep">questions</code>.
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
              Menghapus seluruh kategori, intent, dan pertanyaan training secara permanen. Chat log tidak terpengaruh.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <button onClick={() => setShowHapusSemua(true)} className={`${dangerButton} mt-4`}>
              Hapus Semua Data
            </button>
          </div>
        </div>
      )}
      {showFormKategori && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70" onClick={() => setShowFormKategori(false)}>
          <div className={`w-full max-w-md space-y-4 rounded-2xl bg-white p-6 border-2 border-neutral-stone/30 dark:bg-neutral-charcoal dark:border-neutral-stone/20`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingKategoriId ? 'Edit Kategori' : 'Tambah Kategori'}
            </h3>
            <input
              value={formKategori.name}
              onChange={(e) => setFormKategori({ name: e.target.value })}
              placeholder="Nama kategori"
              className={inputBase}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormKategori(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanKategori} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showFormIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70" onClick={() => setShowFormIntent(false)}>
          <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal" onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingIntentId ? 'Edit Intent' : 'Tambah Intent'}
            </h3>
            <select
              value={formIntent.category_id}
              onChange={(e) => setFormIntent({ ...formIntent, category_id: e.target.value })}
              className={inputBase}
            >
              <option value="">Pilih kategori</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
            <input
              value={formIntent.name}
              onChange={(e) => setFormIntent({ ...formIntent, name: e.target.value })}
              placeholder="Nama intent (contoh: jadwal_mentoring)"
              className={inputBase}
            />
            <textarea
              value={formIntent.response}
              onChange={(e) => setFormIntent({ ...formIntent, response: e.target.value })}
              placeholder="Response bot"
              className={inputBase}
            />
            <select
              value={formIntent.emotion}
              onChange={(e) => setFormIntent({ ...formIntent, emotion: e.target.value as Emotion })}
              className={inputBase}
            >
              {EMOTIONS.map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormIntent(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanIntent} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showFormPertanyaan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70" onClick={() => setShowFormPertanyaan(false)}>
          <div className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal" onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingPertanyaanId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
            </h3>
            <select
              value={formPertanyaan.intent_id}
              onChange={(e) => setFormPertanyaan({ ...formPertanyaan, intent_id: e.target.value })}
              className={inputBase}
            >
              <option value="">Pilih intent</option>
              {intentList.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
            <textarea
              value={formPertanyaan.question}
              onChange={(e) => setFormPertanyaan({ ...formPertanyaan, question: e.target.value })}
              placeholder="Contoh: Kapan jadwal mentoring?"
              className={inputBase}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormPertanyaan(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanPertanyaan} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showHapusSemua && (
        <DangerConfirmModal
          title="Hapus Semua Data Training Chatbot"
          description={`Anda akan menghapus ${kategoriList.length} kategori, ${intentList.length} intent, dan ${pertanyaanList.length} pertanyaan training secara permanen.`}
          loading={menghapusSemua}
          onCancel={() => setShowHapusSemua(false)}
          onConfirm={hapusSemuaData}
        />
      )}
    </div>
  );
}