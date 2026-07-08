// src/featured/admin/pages/AdminFaq.tsx
import { useEffect, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { useAuth } from '../../../app/providers/AuthProvider';
import { chatbotService } from '../../../lib/chatbotService';
import { logService } from '../../../lib/logService';
import type { FaqItem } from '../../../shared/types/database';

const faqKosong = { pertanyaan: '', jawaban: '', kategori: '' };

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';
const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-3 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';
const primaryButton =
  'rounded-lg bg-secondary-deep px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';
const primaryLink =
  'text-secondary-deep transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(40,100,174,0.5)] dark:text-secondary-sky dark:hover:drop-shadow-[0_0_6px_rgba(78,171,238,0.5)]';
const dangerLink =
  'text-accent-red transition-all duration-200 hover:underline hover:drop-shadow-[0_0_6px_rgba(176,44,32,0.6)] dark:text-accent-red-light dark:hover:drop-shadow-[0_0_6px_rgba(226,88,74,0.6)]';
const neutralLink = 'text-neutral-stone transition-all duration-200 hover:underline hover:text-neutral-charcoal dark:hover:text-neutral-cream';

export default function AdminFaq() {
  const { userData } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [formFaq, setFormFaq] = useState(faqKosong);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [showFormFaq, setShowFormFaq] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await chatbotService.ambilKonfigurasi();
      setGreeting(config.greeting);
      setIsActive(config.isActive);
      setFaqs(config.faqs);
      setLoading(false);
    })();
  }, []);

  const simpanKonfigurasi = async () => {
    await chatbotService.perbaruiKonfigurasi({ greeting, isActive, faqs }, userData?.uid ?? '');
    if (userData) {
      logService.catat(userData.uid, userData.username, 'perbarui', 'faq', 'Memperbarui konfigurasi FAQ');
    }
    setSaved(true);
  };

  const simpanFaq = () => {
    if (editingFaqId) {
      setFaqs((prev) => prev.map((f) => (f.id === editingFaqId ? { ...formFaq, id: editingFaqId } : f)));
    } else {
      setFaqs((prev) => [...prev, { ...formFaq, id: crypto.randomUUID() }]);
    }
    setFormFaq(faqKosong);
    setEditingFaqId(null);
    setShowFormFaq(false);
  };
  const editFaq = (f: FaqItem) => {
    setFormFaq({ pertanyaan: f.pertanyaan, jawaban: f.jawaban, kategori: f.kategori ?? '' });
    setEditingFaqId(f.id);
    setShowFormFaq(true);
  };
  const hapusFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  if (loading) return <p className="font-body text-neutral-stone">Memuat konfigurasi chatbot...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Manajemen FAQ</h1>
        <p className={`${font.body} mt-2 text-neutral-stone`}>
          FAQ di sini tampil di halaman publik /faq. Ini terpisah dari otak chatbot (training data/intent), yang
          dikelola di halaman Manajemen Chatbot.
        </p>
      </div>

      <div className={`${cardBase} space-y-4 p-6`}>
        <div>
          <label className={`${font.bodySmall} mb-2 block font-medium text-neutral-charcoal dark:text-neutral-cream`}>
            Pesan Sambutan
          </label>
          <input value={greeting} onChange={(e) => setGreeting(e.target.value)} className={inputBase} />
        </div>
        <label className="flex items-center gap-2 font-body text-sm text-neutral-stone">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          FAQ aktif ditampilkan di halaman publik
        </label>
        <button onClick={simpanKonfigurasi} className={primaryButton.replace('px-4 py-2', 'px-5 py-3')}>
          Simpan Konfigurasi
        </button>
        {saved && <p className="font-body text-sm text-success dark:text-success-light">Tersimpan.</p>}
      </div>

      <div className="flex items-center justify-between">
        <h2 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>Daftar FAQ</h2>
        <button
          onClick={() => {
            setFormFaq(faqKosong);
            setEditingFaqId(null);
            setShowFormFaq(true);
          }}
          className={primaryButton}
        >
          + Tambah FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className={`${cardBase} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">{f.pertanyaan}</p>
                <p className={`${font.bodySmall} mt-1 text-neutral-stone`}>{f.jawaban}</p>
              </div>
              <div className="flex shrink-0 gap-3 font-body text-sm">
                <button onClick={() => editFaq(f)} className={primaryLink}>
                  Edit
                </button>
                <button onClick={() => hapusFaq(f.id)} className={dangerLink}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className={`${font.caption}`}>Belum ada FAQ. Tambahkan di atas.</p>}
      </div>

      <p className={font.caption}>
        Ingat klik "Simpan Konfigurasi" di atas setelah menambah/edit/hapus FAQ, karena perubahan FAQ baru
        tersimpan ke Firestore saat tombol itu ditekan.
      </p>

      {showFormFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-charcoal-deep/50 p-4 dark:bg-black/70"
          onClick={() => setShowFormFaq(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border-2 border-neutral-stone/30 bg-white p-6 dark:border-neutral-stone/20 dark:bg-neutral-charcoal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>
              {editingFaqId ? 'Edit FAQ' : 'Tambah FAQ'}
            </h3>
            <input
              value={formFaq.pertanyaan}
              onChange={(e) => setFormFaq({ ...formFaq, pertanyaan: e.target.value })}
              placeholder="Pertanyaan"
              className={inputBase.replace('py-3', 'py-2')}
            />
            <textarea
              value={formFaq.jawaban}
              onChange={(e) => setFormFaq({ ...formFaq, jawaban: e.target.value })}
              placeholder="Jawaban"
              className={inputBase.replace('py-3', 'py-2')}
            />
            <input
              value={formFaq.kategori}
              onChange={(e) => setFormFaq({ ...formFaq, kategori: e.target.value })}
              placeholder="Kategori (opsional)"
              className={inputBase.replace('py-3', 'py-2')}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFormFaq(false)} className={`${neutralLink} px-4 py-2`}>
                Batal
              </button>
              <button onClick={simpanFaq} className={primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}