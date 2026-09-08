// src/featured/home/components/Section5SponsorsGrid.tsx
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

export default function Section5SponsorsGrid() {
  const [activeSponsor, setActiveSponsor] = useState<{
    name: string;
    src: string;
  } | null>(null);

  return (
    <section className="scrollbar-hide flex h-full w-screen shrink-0 flex-col items-center justify-center gap-6 overflow-y-auto px-6 pt-0 pb-10 sm:hidden">
      <h2 className={`${font.h1} text-charcoal-glow`}>
        OUR SPONSOR
      </h2>
      <div className="flex w-full max-w-100 flex-wrap justify-center gap-2">
        {sponsors.map((sponsor) => (
          <button
            key={sponsor.name}
            onClick={() => setActiveSponsor(sponsor)}
            className="h-16 w-auto shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={sponsor.src}
              alt={sponsor.name}
              className="h-full w-auto rounded-[30px] object-contain"
            />
          </button>
        ))}
      </div>
      <PartnerImageModal
        partner={activeSponsor}
        onClose={() => setActiveSponsor(null)}
      />
    </section>
  );
}
