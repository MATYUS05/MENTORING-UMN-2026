// src/shared/components/Footer.tsx
import "../style/Footer.css";
import mentoringLogo from "../../assets/navbar/Logo Mentoring 2026 (White Outline Ver.).png";
import footerMobile from "../../assets/footer/mobile.webp";
import footerTab from "../../assets/footer/tab.webp";
import footerDesktop from "../../assets/footer/desktop.webp";
import { FaInstagram } from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";
import { Phone } from "lucide-react";
import { font } from "../typography/font";

interface FooterProps {
  showContent?: boolean;
}

export default function Footer({ showContent = true }: FooterProps) {
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
        <div
          className="
          footerBg-content
          mx-auto
          flex
          h-full
          w-full
          max-w-[1440px]
          grid-cols-1
          flex-col
          items-center
          justify-center
          gap-8
          px-6
          sm:px-8
          md:grid
          md:grid-cols-[1.2fr_1fr_1.8fr]
          md:gap-8
          lg:grid-cols-[1.2fr_1fr_1.8fr]
          lg:gap-10
          lg:px-10
      "
          style={{ "--footer-gap": "40px" } as React.CSSProperties}
        >
          <div className="footer-brand flex flex-col items-center justify-center">
            <img
              src={mentoringLogo}
              alt="Mentoring UMN 2026"
              className="mb-5 h-28 w-28 object-contain"
            />
            <h2 className={`${font.caption} text-center text-slate-900`}>
              Transforming Vision To Action, <br /> Turning Potential To Impact
            </h2>
            <div className="mt-6 flex items-center gap-6">
              <h2 className={`${font.h3} text-slate-900`}>Our Social Media</h2>
              <FaInstagram className="text-[28px] text-[#1E1E1E]" />
              <SiLine className="text-[28px] text-[#1E1E1E]" />
              <SiGmail className="text-[28px] text-[#1E1E1E]" />
            </div>
          </div>

          <div className="footer-contact flex flex-col">
            <h2 className={font.h3}>Contact and Address</h2>
            <address className={`${font.body} not-italic mt-2 text-[#1E1E1E]`}>
              Universitas Multimedia Nusantara
              <br />
              Jl. Scientia Boulevard,
              <br />
              Gading Serpong,
              <br />
              Tangerang,
              <br />
              Banten 15811 Indonesia
            </address>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <Phone size={17.5} strokeWidth={1.5} />
                <span className={font.body}>+62-21.5422.0808</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={17.5} strokeWidth={1.5} />
                <span className={font.body}>+62-21.5422.0800</span>
              </div>
            </div>
          </div>

          <div className="">Media Partner Section</div>
        </div>
      )}
    </footer>
  );
}