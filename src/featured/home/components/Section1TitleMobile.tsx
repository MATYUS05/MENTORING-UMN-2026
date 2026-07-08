// src/featured/home/components/Section1TitleMobile.tsx
import { font } from "../../../shared/typography/font";
import minerva from "../../../assets/home/minerva.png";

export default function Section1TitleMobile() {
  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-6 px-6 text-center sm:hidden">
      <h1 className={`${font.h1} text-neutral-charcoal-deep`}>
        CHARACTER BUILDING MENTORING 2026
      </h1>
      <img
        src={minerva}
        alt="Minerva"
        className="h-55 w-55 animate-[float_4s_ease-in-out_infinite]"
      />
    </section>
  );
}