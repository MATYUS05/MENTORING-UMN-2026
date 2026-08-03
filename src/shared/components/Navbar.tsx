// src/shared/components/Navbar.tsx

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../style/Navbar.css";
import mentoringLogo from "../../assets/navbar/Logo Mentoring 2026 (White Outline Ver.).png";
import { font } from "../typography/font";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Teams", path: "/teams" },
  { label: "Division", path: "/division" },
  { label: "Gallery", path: "/gallery" },
  { label: "FAQ", path: "/faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-2.5 left-0 z-50 flex w-full justify-center relative sticky">
      <div className="navbar-container flex h-[120px] w-[92%] max-w-[1340px] items-center justify-between px-8 lg:px-12">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex w-[220px] shrink-0 items-center gap-3 md:w-[260px] lg:w-[320px]" >
            <img
                src={mentoringLogo}
                alt="Mentoring UMN"
                className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
            <div className="flex flex-col">
                <h1 className={`${font.navbar} text-slate-900`}>
                    MENTORING UMN
                </h1>
            </div>
        </Link>

        <nav>
          <ul className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-medium font-medium transition ${
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

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          className="text-slate-600 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-7 w-7"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {(
        <div
          className={`
            absolute
            top-[132px]
            left-1/2
            w-[92%]
            -translate-x-1/2
            transition-all
            duration-300
            lg:hidden

            ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-4"
            }
          `}
        >
          <nav
            className="
              mobile-dropdown
              overflow-hidden
            "
          >
            <ul className="flex flex-col px-5 py-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-lg
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "bg-[#143E63] text-white"
                          : "text-[#2B2B2B] hover:bg-white/40"
                      }
                      `
                    }
                  >
                      {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}