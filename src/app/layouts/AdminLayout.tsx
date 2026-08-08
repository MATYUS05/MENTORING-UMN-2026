// src/app/layouts/AdminLayout.tsx
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ThemeProvider } from '../../shared/theme/ThemeContext';
import AdminSidebar from '../../shared/components/AdminSidebar';

export default function AdminLayout() {
  const { userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-charcoal-deep text-secondary-sky">
        Loading...
      </div>
    );
  }

  if (!userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
    return <Navigate to="/login-mentoring" replace />;
  }

  // Dashboard /admin hanya menampilkan 5 statistik milik role admin. Superadmin
  // punya dashboard sendiri dengan 8 statistik, jadi ia selalu dialihkan ke sana.
  // Halaman /admin/* lainnya (team, divisi, chatbot, faq, galeri) tetap dipakai bersama.
  if (userData.role === 'superadmin' && location.pathname === '/admin') {
    return <Navigate to="/superadmin" replace />;
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-cream dark:bg-neutral-charcoal-deep md:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}