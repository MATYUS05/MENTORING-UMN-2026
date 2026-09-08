// src/featured/home/components/Section1TitleMobile.tsx
import { font } from "../../../shared/typography/font";
import maskot from "../../../assets/home/maskot.webp";

export default function Section1TitleMobile() {
  return (
    <section className="flex h-full w-screen shrink-0 flex-col items-center justify-center gap-6 px-6 text-center sm:hidden">
      <h1 className={`${font.h1} text-charcoal-glow`}>
        CHARACTER BUILDING MENTORING 2026
      </h1>
      <img
        src={maskot}
        alt="maskot"
        className="h-55 max-h-[40dvh] w-55 animate-[float_4s_ease-in-out_infinite] object-contain"
      />
    </section>
  );
}