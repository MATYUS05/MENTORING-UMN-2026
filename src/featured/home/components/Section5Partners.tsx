// src/featured/home/components/Section5Partners.tsx
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

export default function Section5Partners() {
  const [activePartner, setActivePartner] = useState<{
    name: string;
    src: string;
  } | null>(null);

  return (
    <section className="hidden h-screen w-screen shrink-0 flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-10 sm:flex sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-neutral-charcoal-deep`}>
        OUR MEDIA PARTNER
      </h2>
      <div className="flex w-full max-w-205 flex-wrap justify-center gap-2 sm:gap-3">
        {partners.map((partner) => (
          <button
            key={partner.name}
            onClick={() => setActivePartner(partner)}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-surface/80 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={partner.src}
              alt={partner.name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="text-center">
        <h3 className={`${font.h3} text-neutral-charcoal-deep`}>
          CONTACT US AT
        </h3>
        <p className={`${font.body} mt-2 max-w-md text-neutral-charcoal`}>
          Universitas Multimedia Nusantara Jl. Scientia Boulevard, Gading
          Serpong, Tangerang, Banten 15811 Indonesia
        </p>
        <p className={`${font.body} mt-1 text-neutral-charcoal`}>
          +62-21.5422.0808 +62-21.5422.0800
        </p>
      </div>
      <PartnerImageModal
        partner={activePartner}
        onClose={() => setActivePartner(null)}
      />
    </section>
  );
}