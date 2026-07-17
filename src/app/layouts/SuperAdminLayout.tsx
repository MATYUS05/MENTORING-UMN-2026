// src/app/layouts/SuperAdminLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ThemeProvider } from '../../shared/theme/ThemeContext';
import SuperAdminSidebar from '../../shared/components/SuperAdminSidebar';

export default function SuperAdminLayout() {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-charcoal-deep text-secondary-sky">
        Loading...
      </div>
    );
  }

  if (!userData || userData.role !== 'superadmin') {
    return <Navigate to="/login-mentoring" replace />;
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-cream dark:bg-neutral-charcoal-deep md:flex-row">
        <SuperAdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}