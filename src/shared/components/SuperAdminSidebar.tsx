// src/shared/components/SuperAdminSidebar.tsx
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
import SidebarShell, { type SidebarSection } from './SidebarShell';

const sections: SidebarSection[] = [
  {
    heading: 'Main',
    items: [
      { label: 'Dashboard', path: '/superadmin', end: true, icon: LayoutDashboard },
      { label: 'Team', path: '/admin/team', end: false, icon: Users },
      { label: 'Divisi', path: '/admin/divisi', end: false, icon: Boxes },
    ],
  },
  {
    heading: 'Content',
    items: [
      { label: 'Chatbot', path: '/admin/chatbot', end: false, icon: Bot },
      { label: 'FAQ', path: '/admin/faq', end: false, icon: MessageCircleQuestion },
      { label: 'Galeri', path: '/admin/galeri', end: false, icon: Images },
    ],
  },
  {
    heading: 'Super Admin',
    items: [
      { label: 'Akun', path: '/superadmin/akun', end: false, icon: UserCog },
      { label: 'Logs', path: '/superadmin/logs', end: false, icon: ScrollText },
    ],
  },
];

export default function SuperAdminSidebar() {
  return <SidebarShell title="Super Admin" sections={sections} accent="primary" />;
}
