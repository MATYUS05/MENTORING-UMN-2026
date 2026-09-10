// src/lib/googleDrive.ts
// Mengubah link share Google Drive menjadi URL gambar yang bisa langsung ditampilkan di <img>.
const DRIVE_ID_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/, // https://drive.google.com/file/d/FILE_ID/view
  /[?&]id=([a-zA-Z0-9_-]+)/, // https://drive.google.com/open?id=FILE_ID atau ?id=FILE_ID
  /\/d\/([a-zA-Z0-9_-]+)/, // https://lh3.googleusercontent.com/d/FILE_ID
];

export const isGoogleDriveUrl = (url: string): boolean =>
  /drive\.google\.com|googleusercontent\.com/.test(url);

export const extractGoogleDriveFileId = (url: string): string | null => {
  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

/**
 * Link non-Drive (mis. Cloudinary) dikembalikan apa adanya.
 * Memakai domain lh3.googleusercontent.com langsung (bukan drive.google.com/thumbnail)
 * karena redirect lewat drive.google.com/thumbnail sering diblokir oleh ad-blocker/ekstensi privasi.
 */
export const toDisplayImageUrl = (url: string): string => {
  const trimmed = url?.trim() ?? '';
  if (!trimmed || !isGoogleDriveUrl(trimmed)) return trimmed;
  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return trimmed;
  return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
};

/**
 * Beberapa format URL untuk mengambil gambar yang sama dari Google Drive, diurutkan
 * dari yang paling andal. Dipakai sebagai fallback berantai: kalau format pertama
 * gagal dimuat di browser (jaringan/firewall tertentu), coba format berikutnya
 * sebelum jatuh ke placeholder.
 */
export const getImageUrlCandidates = (url: string): string[] => {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return [];
  if (!isGoogleDriveUrl(trimmed)) return [trimmed];
  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return [trimmed];
  return [
    `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ];
};
