// src/shared/components/AdminSidebar.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import ThemeToggle from "./ThemeToggle";

const navItemsBase = [
  { label: "Dashboard", path: "/admin", end: true },
  { label: "Team", path: "/admin/team", end: false },
  { label: "Divisi", path: "/admin/divisi", end: false },
  { label: "Chatbot", path: "/admin/chatbot", end: false },
  { label: "FAQ", path: "/admin/faq", end: false },
  { label: "Galeri", path: "/admin/galeri", end: false },
];
const navItemsSuperAdminExtra = [
  { label: "Akun", path: "/superadmin/akun", end: false },
  { label: "Logs", path: "/superadmin/logs", end: false },
];

export default function AdminSidebar() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login-mentoring");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const navItems = userData?.role === "superadmin" ? [...navItemsBase, ...navItemsSuperAdminExtra] : navItemsBase;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 font-body text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-secondary-deep/10 text-secondary-deep dark:bg-secondary-sky/15 dark:text-secondary-sky"
        : "text-neutral-stone hover:bg-neutral-cream hover:text-neutral-charcoal dark:hover:bg-neutral-charcoal-deep dark:hover:text-neutral-cream"
    }`;

  return (
    <>
      {/* Header + dropdown untuk mobile & tablet */}
      <div className="border-b-2 border-neutral-stone/25 bg-white dark:border-neutral-stone/15 dark:bg-neutral-charcoal md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="font-heading text-base font-bold text-neutral-charcoal dark:text-neutral-cream">Admin Panel</h2>
            <p className="font-body text-xs text-neutral-stone">{userData?.divisi}</p>
          </div>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-neutral-stone/30 text-neutral-charcoal transition-colors duration-200 hover:bg-neutral-cream dark:border-neutral-stone/20 dark:text-neutral-cream dark:hover:bg-neutral-charcoal-deep"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t-2 border-neutral-stone/20 px-4 pb-4 dark:border-neutral-stone/15">
            <nav className="flex flex-col gap-1 pt-3">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.end} onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-1 border-t-2 border-neutral-stone/20 pt-3 dark:border-neutral-stone/15">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-2 font-body text-sm font-medium text-accent-red transition-all duration-200 hover:bg-accent-red/10 dark:text-accent-red-light dark:hover:bg-accent-red/15"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar untuk desktop */}
      <aside className="hidden w-64 flex-col border-r-2 border-neutral-stone/25 bg-white p-6 dark:border-neutral-stone/15 dark:bg-neutral-charcoal md:flex">
        <div>
          <h2 className="font-heading text-lg font-bold text-neutral-charcoal dark:text-neutral-cream">Admin Panel</h2>
          <p className="mt-1 font-body text-sm text-neutral-stone">{userData?.divisi}</p>
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2 font-body text-sm font-medium text-accent-red transition-all duration-200 hover:bg-accent-red/10 dark:text-accent-red-light dark:hover:bg-accent-red/15"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}