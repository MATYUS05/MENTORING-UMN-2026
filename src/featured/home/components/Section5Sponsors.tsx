// src/featured/home/components/Section5Sponsors.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import PartnerImageModal from "./PartnerImageModal";

const sponsorModules = import.meta.glob("../../../assets/sponsor/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const sponsors = Object.entries(sponsorModules)
  .map(([path, mod]) => ({
    name: path.split("/").pop()?.replace(".webp", "") ?? "Sponsor",
    src: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Section5Sponsors() {
  const [activeSponsor, setActiveSponsor] = useState<{
    name: string;
    src: string;
  } | null>(null);

  return (
    <section className="scrollbar-hide hidden h-full w-screen shrink-0 flex-col items-center justify-center gap-8 overflow-y-auto px-6 pt-0 pb-10 sm:flex sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-charcoal-glow`}>
        OUR SPONSOR
      </h2>
      <div className="flex w-full max-w-205 flex-wrap justify-center gap-2 sm:gap-3">
        {sponsors.map((sponsor) => (
          <button
            key={sponsor.name}
            onClick={() => setActiveSponsor(sponsor)}
            className="h-20 w-auto shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={sponsor.src}
              alt={sponsor.name}
              className="h-full w-auto rounded-[30px] object-contain"
            />
          </button>
        ))}
      </div>
      <div className="text-center">
        <h3 className={`${font.h3} text-charcoal-glow`}>
          CONTACT US AT
        </h3>
        <p className={`${font.body} mt-2 max-w-md text-charcoal-glow-soft`}>
          Universitas Multimedia Nusantara Jl. Scientia Boulevard, Gading
          Serpong, Tangerang, Banten 15811 Indonesia
        </p>
        <p className={`${font.body} mt-1 text-charcoal-glow-soft`}>
          +62-21.5422.0808 +62-21.5422.0800
        </p>
      </div>
      <PartnerImageModal
        partner={activeSponsor}
        onClose={() => setActiveSponsor(null)}
      />
    </section>
  );
}
