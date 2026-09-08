// src/featured/home/components/Section4Values.tsx
import { useEffect, useId, useState } from "react";
import { font } from "../../../shared/typography/font";
import Kertas_lama from "../../../assets/home/Kertas_lama.webp";
import { valuesData } from "../data/valuesData";

const AUTO_INTERVAL = 4000;

function CarouselArrow({
  direction,
  onClick,
  className = "",
}: {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}) {
  const gradientId = useId();
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Sebelumnya" : "Berikutnya"}
      className={`group flex shrink-0 items-center justify-center transition-transform hover:scale-110 ${
        isLeft ? "animate-arrow-bob-left" : "animate-arrow-bob-right"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full"
        style={{
          filter: "drop-shadow(0 0 6px rgba(231, 196, 140, 0.9))",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3DDAE" />
            <stop offset="100%" stopColor="#B47C5B" />
          </linearGradient>
        </defs>
        <polygon
          points={isLeft ? "17,3 17,21 4,12" : "7,3 7,21 20,12"}
          fill={`url(#${gradientId})`}
          stroke="#4A2E1A"
          strokeWidth={2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </button>
  );
}

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
    <section className="flex h-full w-screen shrink-0 flex-col items-center justify-center gap-2 px-6 sm:gap-4 sm:px-12 md:px-20">
      <h2 className={`${font.h1} text-charcoal-glow`}>NILAI 5C</h2>

      <div className="flex w-full items-center justify-center gap-2 sm:hidden">
        <CarouselArrow direction="left" onClick={goPrev} className="h-10 w-10" />
        <div
          className="relative w-full max-w-80 shrink"
          style={{ aspectRatio: "75 / 140" }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${Kertas_lama})`,
              width: "186.67%",
              height: "53.57%",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
            <img
              src={active.image}
              alt={active.title}
              className="aspect-square w-[75%] rounded-lg object-cover"
            />
            <h3 className="font-heading text-xl font-semibold tracking-tight text-charcoal-glow">
              {active.title}
            </h3>
            <p className="font-body text-base font-normal leading-snug text-charcoal-glow-soft">
              {active.description}
            </p>
          </div>
        </div>
        <CarouselArrow direction="right" onClick={goNext} className="h-10 w-10" />
      </div>

      <div className="relative hidden aspect-1140/600 w-full max-w-171 items-center justify-center bg-contain bg-center bg-no-repeat sm:flex">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Kertas_lama})` }}
        />
        <CarouselArrow
          direction="left"
          onClick={goPrev}
          className="absolute -left-7 top-1/2 z-10 h-16 w-16 -translate-y-1/2 md:-left-8 md:h-20 md:w-20"
        />
        <CarouselArrow
          direction="right"
          onClick={goNext}
          className="absolute -right-7 top-1/2 z-10 h-16 w-16 -translate-y-1/2 md:-right-8 md:h-20 md:w-20"
        />
        <div className="relative flex h-full w-full items-center gap-4 px-10 sm:gap-6 sm:px-16">
          <div className="flex w-3/5 shrink-0 items-center justify-center">
            <img
              src={active.image}
              alt={active.title}
              className="aspect-square w-[75.6%] rounded-lg object-cover"
            />
          </div>
          <div className="flex w-2/5 min-w-0 flex-col items-start gap-3 text-left sm:gap-4">
            <h3 className={`${font.h2} text-charcoal-glow`}>
              {active.title}
            </h3>
            <p className={`${font.bodySmall} text-charcoal-glow-soft`}>
              {active.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
