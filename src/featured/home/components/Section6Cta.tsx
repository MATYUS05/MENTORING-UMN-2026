// src/featured/home/components/Section6Cta.tsx
import { font } from "../../../shared/typography/font";

export default function Section6Cta() {
  return (
    <section className="flex h-full w-screen shrink-0 flex-col items-center justify-end gap-6 px-6 pb-[calc(8vh+22.5rem)] sm:px-12 sm:pb-[calc(8vh+33.75rem)] md:px-20 md:pb-[calc(8vh+22.5rem)]">
      <p
        className={`${font.h3} mx-auto max-w-md animate-[pulau-text-float_4s_ease-in-out_infinite,pulau-text-blink_2.4s_ease-in-out_infinite] text-center text-neutral-charcoal-deep`}
      >
        Ketuk pulau untuk menjelajah lebih lanjut
      </p>
    </section>
  );
}