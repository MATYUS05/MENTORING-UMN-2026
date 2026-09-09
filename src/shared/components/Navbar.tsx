// src/shared/components/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../style/Navbar.css";
import mentoringLogo from "../../assets/navbar/Logo Mentoring 2026 (White Outline Ver.).png";
import navMobile from "../../assets/navbar/mobile.webp";
import navTab from "../../assets/navbar/tab.webp";
import navDesktop from "../../assets/navbar/desktop.webp";
import buttonBg from "../../assets/navbar/button.webp";
import { font } from "../typography/font";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Teams", path: "/teams" },
  { label: "Division", path: "/division" },
  { label: "Gallery", path: "/gallery" },
  { label: "FAQ", path: "/faq" },
];

const DROPDOWN_TRANSITION_MS = 300;
const ITEM_ANIMATION_MS = 220;

function getRandomDelays(count: number) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const delays = new Array(count);
  order.forEach((itemIndex, orderIndex) => {
    delays[itemIndex] = orderIndex * ITEM_ANIMATION_MS;
  });
  return delays;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(false);
  const [itemDelays, setItemDelays] = useState<number[]>(() =>
    getRandomDelays(navItems.length)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setItemDelays(getRandomDelays(navItems.length));
      const showTimer = setTimeout(() => setItemsVisible(true), DROPDOWN_TRANSITION_MS);
      return () => clearTimeout(showTimer);
    } else {
      setItemsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="fixed top-2.5 left-0 z-50 flex w-full justify-center">
      <div ref={containerRef} className="relative w-[103%] max-w-[1072px] sm:w-[73.6%]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={navDesktop} />
          <source media="(min-width: 640px)" srcSet={navTab} />
          <img
            src={navMobile}
            alt=""
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </picture>

        <div className="absolute inset-0 flex translate-y-5 sm:translate-y-4.5 lg:translate-y-4.75 items-center justify-between px-[7%] sm:px-[12%] lg:px-[9%] lg:pr-[13%]">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 translate-x-11 sm:translate-x-0 sm:gap-3"
          >
            <img
              src={mentoringLogo}
              alt="Mentoring UMN"
              className="h-12.75 w-12.75 -translate-x-0.5 translate-y-0.5 object-contain sm:h-10 sm:w-10 sm:translate-x-0 sm:-translate-y-0.5 lg:h-12 lg:w-12 lg:translate-y-0"
            />
            <h1 className={`${font.navbar} hidden text-slate-900 sm:block`}>MENTORING UMN</h1>
          </Link>

          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.path} className="relative">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group text-medium relative font-medium transition ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-500 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          aria-hidden
                          className={`pointer-events-none absolute inset-0 -z-10 scale-[1.875] bg-no-repeat bg-[length:100%_100%] transition-opacity duration-150 ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          style={{ backgroundImage: `url(${buttonBg})` }}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            className="-translate-x-11 sm:translate-x-0 p-3 sm:p-1.5 text-slate-900 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 filter-[drop-shadow(0_0_4px_rgba(255,255,255,1))_drop-shadow(0_0_10px_rgba(255,255,255,0.9))_drop-shadow(0_0_18px_rgba(255,255,255,0.7))] sm:h-6 sm:w-6"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`
            absolute
            top-full
            left-0
            -mt-2.5
            w-full
            transition-all
            ease-[cubic-bezier(0.22,1,0.36,1)]
            lg:hidden
            ${
              isOpen
                ? "opacity-100 translate-y-0 duration-300"
                : "pointer-events-none opacity-0 -translate-y-6 duration-300"
            }
          `}
        >
          <nav className="mobile-dropdown flex aspect-19/10 items-center justify-center overflow-hidden">
            <div className="mx-auto flex aspect-133/80 w-[70%] items-center justify-center sm:aspect-10/9 sm:w-[80%]">
              <ul className="grid w-full grid-cols-2 place-items-center gap-2 sm:gap-3">
                {navItems.map((item, index) => (
                  <li
                    key={item.path}
                    className={`w-full transition-all ease-out ${
                      itemsVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "pointer-events-none opacity-0 translate-y-3 scale-95"
                    }`}
                    style={{
                      transitionDuration: `${ITEM_ANIMATION_MS}ms`,
                      transitionDelay: itemsVisible ? `${itemDelays[index]}ms` : "0ms",
                    }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        group
                        relative
                        block
                        px-4
                        py-3
                        text-center
                        text-lg
                        font-medium
                        transition-all
                        duration-200
                        ${isActive ? "text-white" : "text-[#2B2B2B]"}
                        `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            aria-hidden
                            className={`pointer-events-none absolute inset-0 sm:inset-x-[15%] lg:inset-x-0 -z-10 rounded-xl bg-no-repeat bg-[length:100%_100%] transition-opacity duration-200 ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                            style={{ backgroundImage: `url(${buttonBg})` }}
                          />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}