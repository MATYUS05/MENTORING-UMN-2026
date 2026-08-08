// src/shared/components/InputWithCounter.tsx
import type { InputHTMLAttributes } from 'react';

type InputWithCounterProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'maxLength'> & {
  value: string;
  maxLength: number;
  /** Kelas untuk pembungkus, dipakai kalau induknya mengatur jarak antar field. */
  wrapperClassName?: string;
};

/**
 * Input teks dengan penghitung karakter (contoh: 5/30) di bawah kanan input.
 * Angka kiri mengikuti panjang `value`, jadi otomatis update saat pengguna mengetik.
 * Sisanya diteruskan apa adanya ke <input>, sehingga styling form yang sudah ada
 * tetap dipakai lewat prop `className`.
 */
export default function InputWithCounter({
  value,
  maxLength,
  wrapperClassName,
  ...inputProps
}: InputWithCounterProps) {
  const penuh = value.length >= maxLength;

  return (
    <div className={wrapperClassName}>
      <input {...inputProps} value={value} maxLength={maxLength} />
      <p
        className={`mt-1 text-right font-body text-xs ${
          penuh ? 'text-accent-red dark:text-accent-red-light' : 'text-neutral-stone'
        }`}
      >
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
