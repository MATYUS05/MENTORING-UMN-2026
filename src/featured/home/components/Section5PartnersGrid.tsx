// src/featured/home/components/Section5PartnersGrid.tsx
import { useState } from "react";
import { font } from "../../../shared/typography/font";
import PartnerImageModal from "./PartnerImageModal";

const partnerModules = import.meta.glob("../../../assets/medpar/*.webp", {
  eager: true,
}) as Record<string, { default: string }>;

const partners = Object.entries(partnerModules)
  .map(([path, mod]) => ({
    name: path.split("/").pop()?.replace(".webp", "") ?? "Partner",
    src: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Section5PartnersGrid() {
  const [activePartner, setActivePartner] = useState<{
    name: string;
    src: string;
  } | null>(null);

  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-10 sm:hidden">
      <h2 className={`${font.h1} text-neutral-charcoal-deep`}>
        OUR MEDIA PARTNER
      </h2>
      <div className="flex w-full max-w-100 flex-wrap justify-center gap-2">
        {partners.map((partner) => (
          <button
            key={partner.name}
            onClick={() => setActivePartner(partner)}
            className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-surface/80 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={partner.src}
              alt={partner.name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <PartnerImageModal
        partner={activePartner}
        onClose={() => setActivePartner(null)}
      />
    </section>
  );
}