import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import AdminSidebar from '../../shared/components/AdminSidebar';

export default function AdminLayout() {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-teal-400">
        Loading...
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return <Navigate to="/login-mentoring" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}