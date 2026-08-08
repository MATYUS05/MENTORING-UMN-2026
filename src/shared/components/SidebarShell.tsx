// src/shared/components/SidebarShell.tsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../app/providers/AuthProvider';
import { APP_VERSION } from '../constants/app';
import { useSidebarCollapse } from '../hooks/useSidebarCollapse';
import { useTheme } from '../theme/ThemeContext';
import ThemeToggle from './ThemeToggle';

export interface SidebarNavItem {
  label: string;
  path: string;
  end: boolean;
  icon: LucideIcon;
}

export interface SidebarSection {
  heading: string;
  items: SidebarNavItem[];
}

/** Warna menu aktif. Keduanya memakai palet yang sudah dipakai masing-masing sidebar. */
type SidebarAccent = 'secondary' | 'primary';

const KELAS_AKTIF: Record<SidebarAccent, string> = {
  secondary: 'bg-secondary-deep/15 text-secondary-deep dark:bg-secondary-sky/20 dark:text-secondary-sky',
  primary: 'bg-primary-dark/15 text-primary-dark dark:bg-primary-light/20 dark:text-primary-light',
};

const ITEM_DASAR =
  'group relative flex w-full items-center gap-3 rounded-lg py-2.5 font-body text-sm transition-colors duration-200';
const ITEM_NONAKTIF =
  'font-medium text-neutral-stone hover:bg-neutral-stone/10 hover:text-neutral-charcoal dark:hover:bg-white/5 dark:hover:text-neutral-cream';
const IKON = 'h-4.5 w-4.5 shrink-0';

/** Perataan isi item: ikon di tengah saat collapsed, ikon + label saat expanded. */
const perataanItem = (collapsed: boolean) => (collapsed ? 'justify-center px-0' : 'px-3');

const LABEL_ROLE: Record<string, string> = {
  admin: 'Administrator',
  superadmin: 'Super Admin',
};

const LABEL_DIVISI: Record<string, string> = {
  executive: 'Executive Division',
  website: 'Website Division',
  documentation: 'Documentation Division',
  visual: 'Visual Division',
  insurer: 'Insurer Division',
};

/**
 * Tooltip yang hanya dipakai saat sidebar collapsed. Muncul lewat `group-hover`
 * milik item pembungkusnya, jadi tanpa state maupun library tambahan.
 */
function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 translate-x-1 rounded-lg border-2 border-neutral-stone/25 bg-white px-3 py-1.5 font-body text-xs font-medium whitespace-nowrap text-neutral-charcoal opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:border-neutral-stone/20 dark:bg-neutral-charcoal dark:text-neutral-cream"
    >
      {label}
    </span>
  );
}

function Pemisah() {
  return <div className="my-4 h-px bg-neutral-stone/20 dark:bg-neutral-stone/15" />;
}

function JudulSection({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-2 font-body text-[11px] font-semibold tracking-wider text-neutral-stone/70 uppercase">
      {children}
    </p>
  );
}

/** Identitas user yang sedang login — seluruhnya dari AuthProvider, tidak ada yang di-hardcode. */
function Profil() {
  const { userData } = useAuth();
  if (!userData) return null;

  const divisi = userData.divisi
    ? (LABEL_DIVISI[userData.divisi] ??
      `${userData.divisi.charAt(0).toUpperCase()}${userData.divisi.slice(1)} Division`)
    : null;

  return (
    <div className="px-3">
      <p className="font-body text-sm font-semibold text-neutral-charcoal dark:text-neutral-cream">
        {userData.username}
      </p>
      <p className="mt-0.5 font-body text-xs text-neutral-stone">
        {LABEL_ROLE[userData.role] ?? userData.role}
      </p>
      {divisi && <p className="font-body text-xs text-neutral-stone/70">{divisi}</p>}
    </div>
  );
}

function ItemNav({
  item,
  accent,
  collapsed = false,
  onNavigate,
}: {
  item: SidebarNavItem;
  accent: SidebarAccent;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Ikon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${ITEM_DASAR} ${perataanItem(collapsed)} ${
          isActive ? `${KELAS_AKTIF[accent]} font-semibold shadow-sm` : ITEM_NONAKTIF
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-full bg-current" />
          )}
          <Ikon className={IKON} strokeWidth={1.75} />
          {collapsed ? <Tooltip label={item.label} /> : item.label}
        </>
      )}
    </NavLink>
  );
}

function DaftarSection({
  sections,
  accent,
  collapsed = false,
  onNavigate,
}: {
  sections: SidebarSection[];
  accent: SidebarAccent;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {sections.map((section, index) => (
        <div key={section.heading}>
          {index > 0 && <Pemisah />}
          {!collapsed && <JudulSection>{section.heading}</JudulSection>}
          <nav className="flex flex-col gap-1">
            {section.items.map((item) => (
              <ItemNav
                key={item.path}
                item={item}
                accent={accent}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>
      ))}
    </>
  );
}

function Pengaturan({ onLogout, collapsed = false }: { onLogout: () => void; collapsed?: boolean }) {
  const { theme } = useTheme();
  const labelTema = theme === 'light' ? 'Dark Mode' : 'Light Mode';

  return (
    <div>
      {!collapsed && <JudulSection>Settings</JudulSection>}
      <div className="flex flex-col gap-1">
        <div className="group relative">
          <ThemeToggle
            withIcon
            showLabel={!collapsed}
            className={`${ITEM_DASAR} ${perataanItem(collapsed)} ${ITEM_NONAKTIF}`}
          />
          {collapsed && <Tooltip label={labelTema} />}
        </div>
        <button
          onClick={onLogout}
          aria-label="Log Out"
          className={`${ITEM_DASAR} ${perataanItem(collapsed)} font-medium text-accent-red hover:bg-accent-red/10 dark:text-accent-red-light dark:hover:bg-accent-red/15`}
        >
          <LogOut className={IKON} strokeWidth={1.75} />
          {collapsed ? <Tooltip label="Log Out" /> : 'Log Out'}
        </button>
      </div>
      {!collapsed && (
        <p className="px-3 pt-4 font-body text-[11px] text-neutral-stone/60">Version {APP_VERSION}</p>
      )}
    </div>
  );
}

interface SidebarShellProps {
  title: string;
  sections: SidebarSection[];
  accent: SidebarAccent;
}

/**
 * Kerangka sidebar dashboard (mobile + desktop) yang dipakai bersama oleh
 * AdminSidebar dan SuperAdminSidebar. Isi menu, judul, dan warna aktif
 * ditentukan lewat props supaya masing-masing dashboard tetap punya
 * rute dan identitas warnanya sendiri.
 *
 * Mode collapsed hanya berlaku pada sidebar desktop; pada mobile navigasi
 * tetap berupa dropdown yang selalu tampil penuh.
 */
export default function SidebarShell({ title, sections, accent }: SidebarShellProps) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggleCollapse } = useSidebarCollapse();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login-mentoring');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <>
      {/* Header + dropdown untuk mobile & tablet */}
      <div className="shrink-0 border-b-2 border-neutral-stone/25 bg-white md:hidden dark:border-neutral-stone/15 dark:bg-neutral-charcoal">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="font-heading text-base font-bold text-neutral-charcoal dark:text-neutral-cream">
              {title}
            </h2>
            <p className="font-body text-xs text-neutral-stone">{userData?.username}</p>
          </div>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-neutral-stone/30 text-neutral-charcoal transition-colors duration-200 hover:bg-neutral-cream dark:border-neutral-stone/20 dark:text-neutral-cream dark:hover:bg-neutral-charcoal-deep"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </div>
        {mobileOpen && (
          <div className="max-h-[calc(100vh-70px)] overflow-y-auto border-t-2 border-neutral-stone/20 px-4 pt-4 pb-4 dark:border-neutral-stone/15">
            <Profil />
            <Pemisah />
            <DaftarSection
              sections={sections}
              accent={accent}
              onNavigate={() => setMobileOpen(false)}
            />
            <Pemisah />
            <Pengaturan onLogout={handleLogout} />
          </div>
        )}
      </div>

      {/* Sidebar untuk desktop */}
      <aside
        className={`hidden h-full shrink-0 flex-col border-r-2 border-neutral-stone/25 bg-white px-4 py-6 transition-[width] duration-200 md:flex dark:border-neutral-stone/15 dark:bg-neutral-charcoal ${
          collapsed ? 'w-20 overflow-visible' : 'w-64 overflow-y-auto'
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-3'}`}>
          {!collapsed && (
            <h2 className="font-heading text-lg font-bold text-neutral-charcoal dark:text-neutral-cream">
              {title}
            </h2>
          )}
          <div className="group relative">
            <button
              onClick={toggleCollapse}
              aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
              aria-expanded={!collapsed}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-stone transition-colors duration-200 hover:bg-neutral-stone/10 hover:text-neutral-charcoal dark:hover:bg-white/5 dark:hover:text-neutral-cream"
            >
              {collapsed ? (
                <PanelLeftOpen className={IKON} strokeWidth={1.75} />
              ) : (
                <PanelLeftClose className={IKON} strokeWidth={1.75} />
              )}
            </button>
            {collapsed && <Tooltip label="Buka sidebar" />}
          </div>
        </div>
        {!collapsed && (
          <div className="mt-3">
            <Profil />
          </div>
        )}
        <Pemisah />
        <DaftarSection sections={sections} accent={accent} collapsed={collapsed} />
        <div className="mt-auto">
          <Pemisah />
          <Pengaturan onLogout={handleLogout} collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
