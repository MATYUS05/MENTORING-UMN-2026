// src/shared/hooks/useSidebarCollapse.ts
import { useEffect, useState } from 'react';

const KUNCI_PENYIMPANAN = 'admin-sidebar-collapsed';

/**
 * State buka/tutup sidebar dashboard.
 *
 * Nilainya disimpan di localStorage supaya pilihan pengguna bertahan saat
 * berpindah halaman maupun reload — pola yang sama dengan ThemeContext
 * yang menyimpan 'admin-theme'.
 */
export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(KUNCI_PENYIMPANAN) === 'true'
  );

  useEffect(() => {
    localStorage.setItem(KUNCI_PENYIMPANAN, String(collapsed));
  }, [collapsed]);

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return { collapsed, toggleCollapse };
}
