// src/shared/components/AdminSidebar.tsx
import {
  Bot,
  Boxes,
  Images,
  LayoutDashboard,
  MessageCircleQuestion,
  ScrollText,
  UserCog,
  Users,
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import SidebarShell, { type SidebarSection } from './SidebarShell';

/**
 * Menu Team/Divisi/Chatbot/FAQ/Galeri dipakai bersama di /admin/*, sehingga
 * superadmin yang membuka salah satunya ikut memakai sidebar ini. Tombol
 * Dashboard karena itu harus menyesuaikan role — kalau tidak, superadmin
 * akan diarahkan ke dashboard Admin (5 card) dan kehilangan jalan kembali
 * ke dashboard Super Admin (8 card).
 */
const buatSectionMain = (dashboardPath: string): SidebarSection => ({
  heading: 'Main',
  items: [
    { label: 'Dashboard', path: dashboardPath, end: true, icon: LayoutDashboard },
    { label: 'Team', path: '/admin/team', end: false, icon: Users },
    { label: 'Divisi', path: '/admin/divisi', end: false, icon: Boxes },
  ],
});

const SECTION_CONTENT: SidebarSection = {
  heading: 'Content',
  items: [
    { label: 'Chatbot', path: '/admin/chatbot', end: false, icon: Bot },
    { label: 'FAQ', path: '/admin/faq', end: false, icon: MessageCircleQuestion },
    { label: 'Galeri', path: '/admin/galeri', end: false, icon: Images },
  ],
};

const SECTION_SUPER_ADMIN: SidebarSection = {
  heading: 'Super Admin',
  items: [
    { label: 'Akun', path: '/superadmin/akun', end: false, icon: UserCog },
    { label: 'Logs', path: '/superadmin/logs', end: false, icon: ScrollText },
  ],
};

export default function AdminSidebar() {
  const { userData } = useAuth();
  const isSuperAdmin = userData?.role === 'superadmin';

  const sections = isSuperAdmin
    ? [buatSectionMain('/superadmin'), SECTION_CONTENT, SECTION_SUPER_ADMIN]
    : [buatSectionMain('/admin'), SECTION_CONTENT];

  return <SidebarShell title="Admin Panel" sections={sections} accent="secondary" />;
}
