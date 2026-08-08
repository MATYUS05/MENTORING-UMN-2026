// src/shared/components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

const KELAS_BAWAAN =
  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

interface ThemeToggleProps {
  /** Ganti kelas tombol. Dibiarkan kosong = tampilan bawaan (dipakai di halaman Design Systems). */
  className?: string;
  /** Tampilkan ikon bulan/matahari di kiri label. */
  withIcon?: boolean;
  /** Sembunyikan teks label, misalnya saat sidebar dalam kondisi collapsed. */
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  withIcon = false,
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const Ikon = theme === 'light' ? Moon : Sun;
  const label = theme === 'light' ? 'Dark Mode' : 'Light Mode';

  return (
    <button
      onClick={toggleTheme}
      aria-label={showLabel ? 'Ganti tema' : label}
      className={className ?? KELAS_BAWAAN}
    >
      {withIcon && <Ikon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />}
      {showLabel && label}
    </button>
  );
}
