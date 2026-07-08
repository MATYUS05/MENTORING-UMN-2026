// src/featured/home/components/Section4Values.tsx
import { useEffect, useState } from "react";
import { font } from "../../../shared/typography/font";
import kertas from "../../../assets/home/kertas.png";
import { valuesData } from "../data/valuesData";

const AUTO_INTERVAL = 4000;

export default function Section4Values() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % valuesData.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const goPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + valuesData.length) % valuesData.length,
    );
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % valuesData.length);
  };

  const active = valuesData[activeIndex];

  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-6 px-6 sm:gap-8 sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-neutral-charcoal-deep`}>NILAI 5C</h2>

      <div className="flex w-full items-center justify-center gap-2 sm:hidden">
        <button
          onClick={goPrev}
          className="shrink-0 text-6xl font-bold text-primary-dark transition-transform hover:scale-110"
        >
          ‹
        </button>
        <div className="relative h-70 w-37.5 shrink-0">
          <div
            className="absolute left-1/2 top-1/2 h-37.5 w-70 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${kertas})` }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            <img
              src={active.image}
              alt={active.title}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <h3 className={`${font.h3} text-neutral-charcoal-deep`}>
              {active.title}
            </h3>
            <p className={`${font.bodySmall} text-neutral-charcoal`}>
              {active.description}
            </p>
          </div>
        </div>
        <button
          onClick={goNext}
          className="shrink-0 text-6xl font-bold text-primary-dark transition-transform hover:scale-110"
        >
          ›
        </button>
      </div>

      <div className="relative hidden aspect-1140/600 w-full max-w-171 items-center justify-center bg-contain bg-center bg-no-repeat sm:flex">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${kertas})` }}
        />
        <button
          onClick={goPrev}
          className="absolute -left-14 top-1/2 z-10 -translate-y-1/2 text-6xl font-bold text-primary-dark transition-transform hover:scale-110 md:-left-16 md:text-7xl"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute -right-14 top-1/2 z-10 -translate-y-1/2 text-6xl font-bold text-primary-dark transition-transform hover:scale-110 md:-right-16 md:text-7xl"
        >
          ›
        </button>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-10 text-center sm:gap-4 sm:px-16">
          <img
            src={active.image}
            alt={active.title}
            className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
          />
          <h3 className={`${font.h2} text-neutral-charcoal-deep`}>
            {active.title}
          </h3>
          <p
            className={`${font.bodySmall} max-w-sm text-center text-neutral-charcoal`}
          >
            {active.description}
          </p>
        </div>
      </div>
    </section>
  );
}