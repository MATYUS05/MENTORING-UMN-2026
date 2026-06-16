import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Teams", path: "/teams" },
  { label: "Division", path: "/division" },
  { label: "Gallery", path: "/gallery" },
  { label: "FAQ", path: "/faq" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-wide text-slate-900"
        >
          MENTORING UMN
        </Link>

        <nav>
          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}