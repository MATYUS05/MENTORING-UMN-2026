// src/featured/home/components/Section5Contact.tsx
import { font } from "../../../shared/typography/font";

export default function Section5Contact() {
  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-4 px-6 text-center sm:hidden">
      <h3 className={`${font.h2} text-neutral-charcoal-deep`}>
        CONTACT US AT
      </h3>
      <p className={`${font.body} max-w-md text-neutral-charcoal`}>
        Universitas Multimedia Nusantara Jl. Scientia Boulevard, Gading
        Serpong, Tangerang, Banten 15811 Indonesia
      </p>
      <p className={`${font.body} text-neutral-charcoal`}>
        +62-21.5422.0808 +62-21.5422.0800
      </p>
    </section>
  );
}