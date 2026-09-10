import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { getImageUrlCandidates } from '../../lib/googleDrive';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> & {
  src: string;
  fallbackSrc?: string;
};

/**
 * <img> yang mencoba beberapa format URL (khusus link Google Drive) sebelum
 * jatuh ke fallbackSrc, karena keandalan tiap format Drive bisa berbeda
 * tergantung jaringan/firewall pengunjung.
 */
export default function SmartImage({ src, fallbackSrc = '/placeholder.webp', ...rest }: Props) {
  const candidates = getImageUrlCandidates(src);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [src]);

  const current = candidates[index] || fallbackSrc;

  return (
    <img
      {...rest}
      src={current}
      onError={() => {
        setIndex((i) => i + 1);
      }}
    />
  );
}
