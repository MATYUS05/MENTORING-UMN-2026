import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import SuperAdminSidebar from '../../shared/components/SuperAdminSidebar';

export default function SuperAdminLayout() {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-purple-400">
        Loading...
      </div>
    );
  }

  if (!userData || userData.role !== 'superadmin') {
    return <Navigate to="/login-mentoring" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <SuperAdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}