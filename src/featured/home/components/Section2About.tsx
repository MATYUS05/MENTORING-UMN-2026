// src/featured/home/components/Section2About.tsx
import { font } from "../../../shared/typography/font";

export default function Section2About() {
  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-4 px-6 text-center sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-neutral-charcoal-deep`}>
        APA ITU MENTORING
      </h2>
      <p className={`${font.body} max-w-2xl text-neutral-charcoal`}>
        Mentoring UMN merupakan program tahunan yang wajib diikuti oleh
        seluruh Mentee. Kegiatan ini bertujuan untuk memperkenalkan dan
        menanamkan nilai-nilai utama 5C UMN secara lebih mendalam dan
        bermakna.
      </p>
    </section>
  );
}