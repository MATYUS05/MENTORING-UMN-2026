// src/featured/home/components/Section2About.tsx
import { font } from "../../../shared/typography/font";

export default function Section2About() {
  return (
    <section className="flex
    h-screen
    w-screen
    shrink-0
    flex-col
    pt-28
    pb-6">

      <div  className = "flex flex-1 items-center justify-center">
        <h2 className={`${font.h1} text-neutral-charcoal-deep`}>
          APA ITU MENTORING
        </h2>
      </div>

      <div className = "flex flex-1 items-start justify-center">
        <p className={`${font.body} max-w-2xl text-neutral-charcoal`}>
          Mentoring UMN merupakan program tahunan yang wajib diikuti oleh
          seluruh Mentee. Kegiatan ini bertujuan untuk memperkenalkan dan
          menanamkan nilai-nilai utama 5C UMN secara lebih mendalam dan
          bermakna.
        </p>
      </div>
    </section>
  );
}