// src/featured/home/components/Section1TaglineMobile.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import InfoModal, { type InfoContent } from "./InfoModal";

const TEMA_INFO: InfoContent = {
  title: "Brave the Step, Build the Impact",
  paragraphs: [
    '"Brave the Step" merefleksikan tindakan berani meninggalkan zona nyaman dan kepastian untuk memulai perjalanan akademik dan pengembangan diri yang baru.',
    '"Build the Impact" menegaskan komitmen untuk tidak sekadar berproses, namun secara aktif mengarahkan potensi untuk menciptakan kontribusi yang nyata dan penuh makna bagi diri sendiri dan lingkungan.',
  ],
};

const TAGLINE_INFO: InfoContent = {
  title:
    "Navigating Beyond Familiar Shores to Anchor Potential into Purposeful Impact",
  paragraphs: [
    '"Navigating Beyond Familiar Shores" merepresentasikan keberanian mahasiswa untuk melangkah keluar dari zona nyaman menghadapi ketidakpastian, kegagalan, dan keraguan sebagai bagian dari proses bertumbuh.',
    '"to Anchor Potential into Purposeful Impact" menekankan bahwa setiap individu memiliki potensi, namun potensi hanya akan bermakna ketika diarahkan dengan kesadaran, nilai, dan tujuan yang jelas.',
  ],
};

export default function Section1TaglineMobile() {
  const [activeInfo, setActiveInfo] = useState<InfoContent | null>(null);

  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-6 px-6 text-center sm:hidden">
      <button
        onClick={() => setActiveInfo(TEMA_INFO)}
        className={`${font.h3} text-neutral-charcoal-deep transition-transform duration-200 hover:scale-105`}
      >
        Brave the Step, Build the Impact
      </button>
      <button
        onClick={() => setActiveInfo(TAGLINE_INFO)}
        className={`${font.h3} max-w-md italic text-neutral-charcoal transition-transform duration-200 hover:scale-105`}
      >
        "Navigating Beyond Familiar Shores to Anchor Potential into Purposeful
        Impact"
      </button>
      <InfoModal content={activeInfo} onClose={() => setActiveInfo(null)} />
    </section>
  );
}