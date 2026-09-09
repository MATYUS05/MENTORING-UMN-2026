// src/shared/components/Footer.tsx
import { useEffect, useRef, useState } from "react";
import "../style/Footer.css";
import mentoringLogo from "../../assets/navbar/Logo Mentoring 2026 (White Outline Ver.).png";
import footerMobile from "../../assets/footer/mobile.webp";
import footerTab from "../../assets/footer/tab.webp";
import footerDesktop from "../../assets/footer/desktop.webp";
import { FaInstagram } from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";
import { Phone } from "lucide-react";
import { font } from "../typography/font";
import PartnerImageModal from "../../featured/home/components/PartnerImageModal";

interface FooterProps {
  showContent?: boolean;
}

interface Logo {
  name: string;
  src: string;
}

const mediaPartnerModules = import.meta.glob("../../assets/medpar/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const mediaPartners: Logo[] = Object.entries(mediaPartnerModules)
  .map(([path, mod]) => ({
    name: path.split("/").pop()?.replace(".webp", "") ?? "Partner",
    src: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const sponsorModules = import.meta.glob("../../assets/sponsor/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const sponsors: Logo[] = Object.entries(sponsorModules)
  .map(([path, mod]) => ({
    name: path.split("/").pop()?.replace(".webp", "") ?? "Sponsor",
    src: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

type FooterItem =
  | { kind: "brand" }
  | { kind: "social" }
  | { kind: "contact" }
  | { kind: "address" }
  | { kind: "medpar" }
  | { kind: "sponsor" }
  | { kind: "label"; text: string }
  | { kind: "logo"; logo: Logo };

const baseItems: FooterItem[] = [
  { kind: "brand" },
  { kind: "social" },
  { kind: "contact" },
  { kind: "address" },
  { kind: "medpar" },
  { kind: "sponsor" },
];

const trackItems = [...baseItems, ...baseItems];

const cardTitle = `${font.h3} text-slate-900`;

const AUTO_SPEED_PX_PER_SEC = 45;
const RESUME_DELAY_MS = 700;

export default function Footer({ showContent = true }: FooterProps) {
  const [activeLogo, setActiveLogo] = useState<Logo | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let rafId: number;
    let lastTime: number | null = null;

    const normalize = (value: number, half: number) => {
      if (half <= 0) return value;
      let v = value % half;
      if (v > 0) v -= half;
      return v;
    };

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const track = trackRef.current;
      const half = track ? track.scrollWidth / 2 : 0;

      if (!isDraggingRef.current && !isPausedRef.current) {
        offsetRef.current -= AUTO_SPEED_PX_PER_SEC * dt;
      }
      offsetRef.current = normalize(offsetRef.current, half);

      if (track) {
        track.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    isPausedRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 3) draggedRef.current = true;
    offsetRef.current = dragStartOffsetRef.current + dx;
  };

  const schedulePointerUp = () => {
    isDraggingRef.current = false;
    resumeTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, RESUME_DELAY_MS);
  };

  const handleLogoClick = (logo: Logo) => {
    if (draggedRef.current) return;
    setActiveLogo(logo);
  };

  const renderLogoGrid = (logos: Logo[]) => {
    const row1 = logos.filter((_, i) => i % 2 === 0);
    const row2 = logos.filter((_, i) => i % 2 === 1);
    const renderLogo = (logo: Logo, i: number) => (
      <button
        key={`${logo.name}-${i}`}
        type="button"
        onClick={() => handleLogoClick(logo)}
        className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
        tabIndex={-1}
      >
        <img
          src={logo.src}
          alt={logo.name}
          draggable={false}
          className="h-14 w-auto rounded-xl object-contain select-none sm:h-16"
        />
      </button>
    );
    return (
      <div className="footer-medpar-grid">
        <div className="footer-medpar-row">{row1.map(renderLogo)}</div>
        <div className="footer-medpar-row">{row2.map(renderLogo)}</div>
      </div>
    );
  };

  const renderItem = (item: FooterItem, key: string) => {
    switch (item.kind) {
      case "brand":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-2 px-8 text-center">
            <img
              src={mentoringLogo}
              alt="Mentoring UMN 2026"
              draggable={false}
              className="h-16 w-16 object-contain select-none sm:h-20 sm:w-20"
            />
            <p className={`${font.caption} max-w-52 text-center leading-snug text-slate-900`}>
              Navigating Beyond Familiar Shores <br /> to Anchor Potential into Purposeful Impact
            </p>
          </div>
        );
      case "social":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-3 px-8 text-center">
            <h2 className={cardTitle}>Our Social Media</h2>
            <div className="flex items-center gap-5">
              <FaInstagram className="text-2xl text-[#1E1E1E] sm:text-3xl" />
              <SiLine className="text-2xl text-[#1E1E1E] sm:text-3xl" />
              <SiGmail className="text-2xl text-[#1E1E1E] sm:text-3xl" />
            </div>
          </div>
        );
      case "contact":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-3 px-8 text-center">
            <h2 className={cardTitle}>Contact</h2>
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <Phone size={16} strokeWidth={1.5} />
                <span className={`${font.body} text-[#1E1E1E]`}>+62-21.5422.0808</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} strokeWidth={1.5} />
                <span className={`${font.body} text-[#1E1E1E]`}>+62-21.5422.0800</span>
              </div>
            </div>
          </div>
        );
      case "address":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-3 px-8 text-center">
            <h2 className={cardTitle}>Address</h2>
            <address className={`${font.body} not-italic max-w-56 leading-snug text-[#1E1E1E]`}>
              Universitas Multimedia Nusantara, Jl. Scientia Boulevard, Gading
              Serpong, Tangerang, Banten 15811
            </address>
          </div>
        );
      case "medpar":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-3 px-8">
            <h2 className={cardTitle}>Media Partner</h2>
            {renderLogoGrid(mediaPartners)}
          </div>
        );
      case "sponsor":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center gap-3 px-8">
            <h2 className={cardTitle}>Sponsor</h2>
            {renderLogoGrid(sponsors)}
          </div>
        );
      case "label":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center px-8 text-center">
            <h2 className={cardTitle}>{item.text}</h2>
          </div>
        );
      case "logo":
        return (
          <div key={key} className="footer-item flex flex-col items-center justify-center px-4">
            <button
              type="button"
              onClick={() => handleLogoClick(item.logo)}
              className="flex items-center justify-center transition-transform duration-200 hover:scale-105"
              tabIndex={-1}
            >
              <img
                src={item.logo.src}
                alt={item.logo.name}
                draggable={false}
                className="h-16 w-auto rounded-2xl object-contain select-none sm:h-20"
              />
            </button>
          </div>
        );
    }
  };

  return (
    <footer className="footerBg w-full">
      <picture>
        <source media="(min-width: 1024px)" srcSet={footerDesktop} />
        <source media="(min-width: 640px)" srcSet={footerTab} />
        <img
          src={footerMobile}
          alt=""
          aria-hidden="true"
          className="footerBg-image"
        />
      </picture>
      {showContent && (
        <div className="footerBg-content mx-auto flex h-full w-full max-w-360 items-end justify-center px-4 pb-4 sm:px-8 sm:pb-6 lg:px-10 lg:pb-8">
          <div
            className="footer-marquee-all max-h-75 w-full cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={schedulePointerUp}
            onPointerCancel={schedulePointerUp}
            onPointerLeave={() => {
              if (isDraggingRef.current) schedulePointerUp();
            }}
            style={{ touchAction: "pan-y" }}
          >
            <div ref={trackRef} className="footer-marquee-all-track">
              {trackItems.map((item, index) => renderItem(item, `${index}`))}
            </div>
          </div>
        </div>
      )}
      <PartnerImageModal partner={activeLogo} onClose={() => setActiveLogo(null)} />
    </footer>
  );
}
