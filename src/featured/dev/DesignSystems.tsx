// src/featured/dev/DesignSystems.tsx
import { useState } from 'react';
import { font } from '../../shared/typography/font';
import { ThemeProvider } from '../../shared/theme/ThemeContext';
import ThemeToggle from '../../shared/components/ThemeToggle';

type EffectType = 'none' | 'glow' | 'border';
type SizeMode = 'manual' | 'token';
type Device = 'mobile' | 'tab' | 'desktop';
type FontFamily = 'heading' | 'body';

interface ColorOption {
  label: string;
  hex: string;
  className: string;
}

interface ColorGroup {
  title: string;
  description: string;
  colors: ColorOption[];
}

const colorGroups: ColorGroup[] = [
  {
    title: 'Primary',
    description:
      'Warna hangat, dipakai untuk aksen dekoratif, highlight, badge, atau elemen non-fungsional yang butuh sentuhan "warm". Jangan dipakai untuk tombol aksi utama karena kontrasnya kurang tegas di atas putih.',
    colors: [
      { label: 'Primary Light', hex: '#E7C48C', className: 'bg-primary-light / text-primary-light' },
      { label: 'Primary Dark', hex: '#B47C5B', className: 'bg-primary-dark / text-primary-dark' },
    ],
  },
  {
    title: 'Secondary',
    description:
      'Warna biru, jadi warna aksi utama di seluruh sistem — dipakai buat tombol, link, tab aktif, border fokus input. Ini warna yang paling sering muncul di elemen interaktif.',
    colors: [
      { label: 'Secondary Deep', hex: '#2864AE', className: 'bg-secondary-deep / text-secondary-deep' },
      { label: 'Secondary Sky', hex: '#4EABEE', className: 'bg-secondary-sky / text-secondary-sky' },
      { label: 'Secondary Mint', hex: '#A2D6D7', className: 'bg-secondary-mint / text-secondary-mint' },
    ],
  },
  {
    title: 'Accent',
    description:
      'Dipakai khusus buat hal yang butuh perhatian ekstra: merah untuk aksi berbahaya/hapus/error, gold untuk peringatan/highlight penting. Konsistensi makna warna ini penting — jangan pakai accent-red buat hal selain "bahaya/hapus".',
    colors: [
      { label: 'Accent Red', hex: '#B02C20', className: 'bg-accent-red / text-accent-red' },
      { label: 'Accent Red Light', hex: '#E2584A', className: 'text-accent-red-light (dark mode variant)' },
      { label: 'Accent Gold', hex: '#F8D486', className: 'bg-accent-gold / text-accent-gold' },
    ],
  },
  {
    title: 'Neutral',
    description:
      'Fondasi seluruh layout — background halaman, teks utama, border, dan background dark mode. Cream/Sand buat background terang, Stone buat teks sekunder/border, Charcoal buat teks gelap dan background dark mode.',
    colors: [
      { label: 'Neutral Cream', hex: '#FBF6EC', className: 'bg-neutral-cream (background halaman light)' },
      { label: 'Neutral Sand', hex: '#EFE3CF', className: 'bg-neutral-sand (background sekunder)' },
      { label: 'Neutral Stone', hex: '#8C7B68', className: 'text-neutral-stone (teks sekunder, border)' },
      { label: 'Neutral Charcoal', hex: '#2A241F', className: 'bg-neutral-charcoal (background card dark mode)' },
      { label: 'Neutral Charcoal Deep', hex: '#1C1815', className: 'bg-neutral-charcoal-deep (background halaman dark)' },
      { label: 'Off-White Surface', hex: '#F5F8FA', className: 'bg-neutral-surface (pengganti putih polos)' },
    ],
  },
  {
    title: 'Semantic',
    description:
      'Warna dengan makna tetap — dipakai KHUSUS untuk status. Success = berhasil, Warning = perlu perhatian, Danger = error/bahaya, Info = informasi netral. Jangan pernah dipakai buat dekorasi biasa.',
    colors: [
      { label: 'Success', hex: '#4E8F6A', className: 'text-success / bg-success' },
      { label: 'Success Light', hex: '#7CBB93', className: 'text-success-light (dark mode variant)' },
      { label: 'Warning', hex: '#F8D486', className: 'text-warning / bg-warning' },
      { label: 'Danger', hex: '#B02C20', className: 'text-danger / bg-danger' },
      { label: 'Info', hex: '#4EABEE', className: 'text-info / bg-info' },
    ],
  },
];

const flatColorOptions: ColorOption[] = colorGroups.flatMap((g) => g.colors);

const typographyShowcase = [
  { key: 'h1', label: 'Heading 1', className: font.h1, sample: 'Selamat Datang di Mentoring UMN 2026', usage: 'Judul utama halaman. Idealnya cuma satu per halaman.' },
  { key: 'h2', label: 'Heading 2', className: font.h2, sample: 'Manajemen Divisi & Panitia', usage: 'Judul sub-bagian di dalam halaman.' },
  { key: 'h3', label: 'Heading 3', className: font.h3, sample: 'Detail Kelompok', usage: 'Judul kartu, modal, atau blok konten kecil.' },
  { key: 'body', label: 'Body', className: font.body, sample: 'Ini adalah teks paragraf standar yang dipakai untuk konten utama, deskripsi, dan penjelasan di seluruh halaman.', usage: 'Teks paragraf/konten utama.' },
  { key: 'bodySmall', label: 'Body Small', className: font.bodySmall, sample: 'Teks pendukung dengan ukuran lebih kecil, cocok untuk keterangan tambahan.', usage: 'Deskripsi sekunder, label form, teks pendukung.' },
  { key: 'caption', label: 'Caption', className: font.caption, sample: 'Diperbarui 5 menit yang lalu', usage: 'Metadata, timestamp, keterangan kecil, disclaimer.' },
] as const;

const tokenFontSizes: Record<string, Record<Device, number>> = {
  h1: { mobile: 30, tab: 48, desktop: 60 },
  h2: { mobile: 24, tab: 36, desktop: 36 },
  h3: { mobile: 20, tab: 24, desktop: 24 },
  body: { mobile: 14, tab: 16, desktop: 16 },
  bodySmall: { mobile: 12, tab: 14, desktop: 14 },
  caption: { mobile: 12, tab: 14, desktop: 14 },
};

const tokenOptions = Object.keys(tokenFontSizes);

const cardBase =
  'rounded-xl border-2 border-neutral-stone/40 bg-neutral-surface shadow-sm transition-all duration-200 overflow-hidden dark:border-neutral-stone/25 dark:bg-neutral-charcoal dark:shadow-none';

const inputBase =
  'w-full rounded-lg border-2 border-neutral-stone/40 bg-neutral-surface px-4 py-2 font-body text-sm text-neutral-charcoal outline-none transition-colors focus:border-secondary-deep dark:border-neutral-stone/30 dark:bg-neutral-charcoal-deep dark:text-neutral-cream dark:focus:border-secondary-sky';

const primaryButton =
  'rounded-lg bg-secondary-deep px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_rgba(40,100,174,0.45)] dark:bg-secondary-sky dark:text-neutral-charcoal-deep dark:hover:shadow-[0_0_16px_rgba(78,171,238,0.5)]';

const secondaryButton =
  'rounded-lg border-2 border-neutral-stone/40 px-5 py-3 text-sm font-medium text-neutral-charcoal transition-all duration-200 hover:scale-105 hover:border-secondary-deep/60 dark:border-neutral-stone/25 dark:text-neutral-cream dark:hover:border-secondary-sky/50';

const navAnchors = [
  { id: 'typografi', label: 'Typografi' },
  { id: 'warna', label: 'Warna' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'panduan', label: 'Panduan' },
];

interface GeneratedResult {
  text: string;
  size: number;
  textColor: string;
  cardColor: string;
  effect: EffectType;
  effectColor: string;
  intensity: number;
  fontFamily: FontFamily;
}

function DesignSystemContent() {
  const [text, setText] = useState('Contoh Teks Sandbox');
  const [size, setSize] = useState(24);
  const [sizeMode, setSizeMode] = useState<SizeMode>('manual');
  const [selectedToken, setSelectedToken] = useState('h1');
  const [device, setDevice] = useState<Device>('desktop');
  const [textColor, setTextColor] = useState(flatColorOptions[2].hex);
  const [cardColor, setCardColor] = useState(flatColorOptions[8].hex);
  const [effect, setEffect] = useState<EffectType>('none');
  const [effectColor, setEffectColor] = useState(flatColorOptions[2].hex);
  const [intensity, setIntensity] = useState(5);
  const [fontFamily, setFontFamily] = useState<FontFamily>('body');
  const [result, setResult] = useState<GeneratedResult | null>(null);

  const handleGenerate = () => {
    const finalSize = sizeMode === 'token' ? tokenFontSizes[selectedToken][device] : size;
    setResult({ text, size: finalSize, textColor, cardColor, effect, effectColor, intensity, fontFamily });
  };

  const handleDeviceChange = (d: Device) => {
    setDevice(d);
    const finalSize = sizeMode === 'token' ? tokenFontSizes[selectedToken][d] : size;
    setResult({ text, size: finalSize, textColor, cardColor, effect, effectColor, intensity, fontFamily });
  };

  const previewStyle = (r: GeneratedResult): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize: `${r.size}px`,
      color: r.textColor,
      fontFamily: r.fontFamily === 'heading' ? '"Obra Letra", serif' : '"Futura", sans-serif',
    };
    if (r.effect === 'glow') {
      base.textShadow = `0 0 ${r.intensity * 3}px ${r.effectColor}, 0 0 ${r.intensity * 6}px ${r.effectColor}`;
    }
    if (r.effect === 'border') {
      base.WebkitTextStroke = `${(r.intensity * 0.35).toFixed(1)}px ${r.effectColor}`;
    }
    return base;
  };

  return (
    <div className="min-h-screen bg-neutral-cream px-6 py-10 dark:bg-neutral-charcoal-deep relative">
      {/* Theme toggle fixed di kanan atas */}
      <div className="fixed top-20 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-5xl space-y-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={`${font.h1} text-neutral-charcoal dark:text-neutral-cream`}>Design System</h1>
            <p className={`${font.body} mt-2 max-w-2xl text-neutral-stone`}>
              Referensi resmi typografi, warna, dan aturan interaksi Mentoring UMN 2026. Semua halaman admin wajib
              mengikuti standar di halaman ini.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 border-b-2 border-neutral-stone/30 pb-4 dark:border-neutral-stone/20">
          {navAnchors.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="rounded-lg border-2 border-neutral-stone/30 px-4 py-2 font-body text-sm font-medium text-neutral-charcoal transition-all duration-200 hover:scale-105 hover:border-secondary-deep/60 dark:border-neutral-stone/20 dark:text-neutral-cream dark:hover:border-secondary-sky/50"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <section id="typografi" className="space-y-6 scroll-mt-6">
          <div>
            <h2 className={`${font.h2} text-neutral-charcoal dark:text-neutral-cream`}>Typografi</h2>
            <p className={`${font.body} mt-2 text-neutral-stone`}>
              Ada 2 keluarga font: <strong>Obra Letra</strong> (heading, class <code>font-heading</code>) dan{' '}
              <strong>Futura</strong> (body, class <code>font-body</code>). Semua ukuran dan style sudah dibungkus di{' '}
              <code>src/shared/typography/font.tsx</code> — jangan pernah pakai <code>text-4xl</code> mentah, selalu
              pakai token di bawah ini.
            </p>
          </div>
          <div className="space-y-4">
            {typographyShowcase.map((t) => (
              <div key={t.key} className={`${cardBase} p-6`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border-2 border-secondary-deep/40 bg-secondary-deep/10 px-3 py-1 font-body text-xs font-medium text-secondary-deep dark:border-secondary-sky/40 dark:bg-secondary-sky/10 dark:text-secondary-sky">
                    font.{t.key}
                  </span>
                  <span className="font-body text-xs text-neutral-stone">{t.usage}</span>
                </div>
                <p className={`${t.className} text-neutral-charcoal dark:text-neutral-cream`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="warna" className="space-y-6 scroll-mt-6">
          <div>
            <h2 className={`${font.h2} text-neutral-charcoal dark:text-neutral-cream`}>Palet Warna</h2>
            <p className={`${font.body} mt-2 text-neutral-stone`}>
              Semua warna didefinisikan di <code>src/shared/theme/colors.ts</code> dan dihubungkan ke Tailwind lewat{' '}
              <code>@theme</code> di <code>index.css</code>. Selalu pakai token warna ini, jangan pakai warna Tailwind
              generic (<code>bg-blue-500</code>, <code>text-gray-600</code>, dst).
            </p>
          </div>
          <div className="space-y-8">
            {colorGroups.map((group) => (
              <div key={group.title}>
                <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>{group.title}</h3>
                <p className={`${font.bodySmall} mt-1 mb-4 text-neutral-stone`}>{group.description}</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {group.colors.map((c) => (
                    <div key={c.label} className={`${cardBase} overflow-hidden`}>
                      <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                      <div className="p-3">
                        <p className="font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">{c.label}</p>
                        <p className="font-body text-xs text-neutral-stone">{c.hex}</p>
                        <p className="mt-1 font-body text-xs italic text-neutral-stone">{c.className}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="sandbox" className="space-y-6 scroll-mt-6">
          <div>
            <h2 className={`${font.h2} text-neutral-charcoal dark:text-neutral-cream`}>Sandbox</h2>
            <p className={`${font.body} mt-2 text-neutral-stone`}>
              Coba kombinasi teks, ukuran, warna, dan efek sebelum dipakai beneran di kode.
            </p>
          </div>
          <div className={`${cardBase} grid gap-6 p-6 md:grid-cols-2`}>
            {/* Panel kiri – input */}
            <div className="space-y-4">
              {/* Teks (full width) */}
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                  Teks
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  className={inputBase}
                  placeholder="Tulis apa aja di sini..."
                />
              </div>

              {/* Grid dua kolom untuk input lainnya */}
              <div className="grid grid-cols-2 gap-4">
                {/* Kolom kiri */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Mode Ukuran
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSizeMode('manual')}
                        className={`rounded-lg border-2 px-3 py-1 text-xs font-medium transition ${
                          sizeMode === 'manual'
                            ? 'border-secondary-deep bg-secondary-deep/10 text-secondary-deep dark:border-secondary-sky dark:bg-secondary-sky/10 dark:text-secondary-sky'
                            : 'border-neutral-stone/30 text-neutral-stone'
                        }`}
                      >
                        Manual (px)
                      </button>
                      <button
                        onClick={() => setSizeMode('token')}
                        className={`rounded-lg border-2 px-3 py-1 text-xs font-medium transition ${
                          sizeMode === 'token'
                            ? 'border-secondary-deep bg-secondary-deep/10 text-secondary-deep dark:border-secondary-sky dark:bg-secondary-sky/10 dark:text-secondary-sky'
                            : 'border-neutral-stone/30 text-neutral-stone'
                        }`}
                      >
                        Token Font
                      </button>
                    </div>
                  </div>

                  {sizeMode === 'manual' ? (
                    <div>
                      <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                        Ukuran Teks — {size}px
                      </label>
                      <input
                        type="range"
                        min={12}
                        max={96}
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full accent-secondary-deep"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                        Token Font
                      </label>
                      <select
                        value={selectedToken}
                        onChange={(e) => setSelectedToken(e.target.value)}
                        className={inputBase}
                      >
                        {tokenOptions.map((key) => (
                          <option key={key} value={key}>
                            {key} ({tokenFontSizes[key][device]}px on {device})
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 font-body text-xs text-neutral-stone">
                        Ukuran saat ini: {tokenFontSizes[selectedToken][device]}px (simulasi {device})
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Warna Teks
                    </label>
                    <select value={textColor} onChange={(e) => setTextColor(e.target.value)} className={inputBase}>
                      {flatColorOptions.map((c) => (
                        <option key={c.label} value={c.hex}>
                          {c.label} ({c.hex})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Warna Kartu
                    </label>
                    <select value={cardColor} onChange={(e) => setCardColor(e.target.value)} className={inputBase}>
                      {flatColorOptions.map((c) => (
                        <option key={c.label} value={c.hex}>
                          {c.label} ({c.hex})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Kolom kanan */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Jenis Font
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                      className={inputBase}
                    >
                      <option value="heading">Heading (Obra Letra)</option>
                      <option value="body">Body (Futura)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Efek Teks
                    </label>
                    <select value={effect} onChange={(e) => setEffect(e.target.value as EffectType)} className={inputBase}>
                      <option value="none">None</option>
                      <option value="glow">Glow</option>
                      <option value="border">Border (outline)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Warna Efek
                    </label>
                    <select
                      value={effectColor}
                      onChange={(e) => setEffectColor(e.target.value)}
                      disabled={effect === 'none'}
                      className={`${inputBase} disabled:opacity-40`}
                    >
                      {flatColorOptions.map((c) => (
                        <option key={c.label} value={c.hex}>
                          {c.label} ({c.hex})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">
                      Kekuatan Efek — {intensity}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={intensity}
                      disabled={effect === 'none'}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full accent-secondary-deep disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              <button onClick={handleGenerate} className={`${primaryButton} w-full`}>
                Generate
              </button>
            </div>

            {/* Panel kanan – output */}
            <div className="flex flex-col min-h-0 flex-1">
              <p className="mb-2 font-body text-sm font-medium text-neutral-charcoal dark:text-neutral-cream">Hasil</p>

              <div className="mb-3 flex gap-2">
                {(['mobile', 'tab', 'desktop'] as Device[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDeviceChange(d)}
                    className={`rounded-full border-2 px-3 py-1 text-xs font-medium capitalize transition ${
                      device === d
                        ? 'border-secondary-deep bg-secondary-deep/10 text-secondary-deep dark:border-secondary-sky dark:bg-secondary-sky/10 dark:text-secondary-sky'
                        : 'border-neutral-stone/30 text-neutral-stone'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div
                className="flex-1 min-h-0 rounded-xl border-2 border-neutral-stone/30 p-6 text-center transition-colors duration-200 dark:border-neutral-stone/20 overflow-auto max-h-120 md:max-h-none"
                style={{ backgroundColor: result?.cardColor ?? '#FFFFFF' }}
              >
                {result ? (
                  <p className="wrap-break-word whitespace-pre-wrap" style={previewStyle(result)}>
                    {result.text || '(teks kosong)'}
                  </p>
                ) : (
                  <p className="font-body text-sm text-neutral-stone">
                    Klik "Generate" untuk melihat hasilnya di sini.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="panduan" className="space-y-6 scroll-mt-6">
          <div>
            <h2 className={`${font.h2} text-neutral-charcoal dark:text-neutral-cream`}>Panduan Penggunaan</h2>
            <p className={`${font.body} mt-2 text-neutral-stone`}>
              Buat pengembang baru yang belum familiar sama sistem ini — baca ini sebelum bikin halaman baru.
            </p>
          </div>
          <div className={`${cardBase} space-y-6 p-6`}>
            <div>
              <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>1. Typografi — jangan pakai ukuran mentah</h3>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Jangan tulis <code>className="text-2xl font-bold"</code> langsung di komponen. Selalu import{' '}
                <code>font</code> dari <code>src/shared/typography/font.tsx</code> dan pakai salah satu token:{' '}
                <code>font.h1</code>, <code>font.h2</code>, <code>font.h3</code>, <code>font.body</code>,{' '}
                <code>font.bodySmall</code>, atau <code>font.caption</code>. Kalau butuh ukuran baru yang belum ada,
                tambahkan token baru di <code>font.tsx</code>, jangan bikin ukuran custom di halaman masing-masing.
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                <strong>H1</strong> cuma boleh muncul sekali per halaman (judul utama). <strong>H2</strong> untuk
                sub-bagian. <strong>H3</strong> untuk judul kartu/modal. <strong>Body</strong> untuk isi paragraf
                normal. <strong>Caption</strong> untuk teks kecil kayak timestamp atau keterangan.
              </p>
            </div>
            <div>
              <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>2. Warna — setiap warna punya makna, jangan asal comot</h3>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                <strong>Secondary</strong> (biru) itu warna aksi utama — dipakai buat tombol, link, border fokus
                input. Kalau bikin tombol baru, defaultnya pakai <code>bg-secondary-deep</code>.
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                <strong>Accent Red</strong> HANYA untuk hapus/error/bahaya. <strong>Accent Gold</strong> untuk
                peringatan. Jangan pakai merah untuk tombol biasa, nanti user mengira itu tombol berbahaya padahal
                bukan.
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                <strong>Semantic</strong> (success/warning/danger/info) HANYA dipakai untuk status — badge "Benar",
                notifikasi error, dsb. Jangan dipakai untuk dekorasi biasa.
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                <strong>Neutral</strong> itu fondasi semua layout: <code>neutral-cream</code> untuk background
                halaman (light), <code>neutral-charcoal-deep</code> untuk background halaman (dark),{' '}
                <code>neutral-surface</code> untuk background kartu (light), <code>neutral-charcoal</code> untuk
                background kartu (dark), <code>neutral-stone</code> untuk teks sekunder dan border.
              </p>
            </div>
            <div>
              <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>3. Dark mode — wajib, bukan opsional</h3>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Setiap kali nulis warna, PASANGKAN dengan versi <code>dark:</code>-nya. Contoh benar:{' '}
                <code>text-neutral-charcoal dark:text-neutral-cream</code>. Kalau lupa pasang <code>dark:</code>,
                halaman bakal keliatan rusak/gak kebaca pas mode gelap dinyalain.
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Halaman/layout baru yang butuh dark mode harus dibungkus <code>&lt;ThemeProvider&gt;</code> dari{' '}
                <code>src/shared/theme/ThemeContext.tsx</code>. Tombol togglenya tinggal pakai komponen{' '}
                <code>ThemeToggle</code> yang udah ada di <code>src/shared/components/</code>.
              </p>
            </div>
            <div>
              <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>4. Border dan Hover — dua aturan wajib</h3>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Semua border pakai <code>border-2</code>, JANGAN <code>border</code> biasa (itu cuma 1px, ketipisan
                dan susah keliatan).
              </p>
              <p className={`${font.body} mt-2 text-neutral-stone`}>
                Semua elemen yang bisa diklik (tombol, kartu, link) WAJIB punya efek hover. Tombol solid pakai{' '}
                <code>hover:scale-105</code> + glow (<code>hover:shadow-[0_0_16px_rgba(...)]</code>). Link teks pakai{' '}
                <code>hover:underline</code> + <code>hover:drop-shadow-[...]</code> warna sesuai fungsinya (biru =
                netral, merah = hapus, hijau = konfirmasi). Kartu yang bisa diklik pakai{' '}
                <code>hover:scale-[1.02]</code> + border makin terang.
              </p>
            </div>
            <div>
              <h3 className={`${font.h3} text-neutral-charcoal dark:text-neutral-cream`}>5. Checklist sebelum ngirim halaman baru</h3>
              <ul className={`${font.body} mt-2 list-disc space-y-1 pl-5 text-neutral-stone`}>
                <li>Halaman dibungkus <code>ThemeProvider</code> kalau butuh dark mode</li>
                <li>Semua teks pakai token dari <code>font.tsx</code>, bukan ukuran mentah</li>
                <li>Semua warna pakai token dari palet ini, bukan warna Tailwind generic</li>
                <li>Setiap warna dipasangkan versi <code>dark:</code>-nya</li>
                <li>Border minimal <code>border-2</code></li>
                <li>Semua elemen klik-able punya efek hover</li>
                <li>Sudah dicek tampilannya di light mode DAN dark mode sebelum dianggap selesai</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <a href="#top" className={secondaryButton}>
            Kembali ke Atas
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  return (
    <ThemeProvider>
      <DesignSystemContent />
    </ThemeProvider>
  );
}