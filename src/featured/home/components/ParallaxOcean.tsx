// src/featured/home/components/ParallaxOcean.tsx
import { useEffect, useState } from "react";
import bg from "../../../assets/home/bg.png";
import laut from "../../../assets/home/laut.png";
import kapal from "../../../assets/home/kapal.png";
import pulau from "../../../assets/home/pulau.png";

interface ParallaxOceanProps {
  scrollLeft: number;
  maxScrollLeft: number;
}

const SPEED_BG = 0.05;
const SPEED_LAUT_BACK = 0.18;
const SPEED_LAUT_FRONT = 0.4;
const PULAU_MIN_SCALE = 0.15;

export default function ParallaxOcean({
  scrollLeft,
  maxScrollLeft,
}: ParallaxOceanProps) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pulauScreenX = viewportWidth / 2 + (maxScrollLeft - scrollLeft);
  const distanceFromCenter = Math.abs(maxScrollLeft - scrollLeft);
  const maxDistance = viewportWidth * 0.9;
  const proximity = Math.max(0, 1 - distanceFromCenter / maxDistance);
  const pulauScale = PULAU_MIN_SCALE + proximity * (1 - PULAU_MIN_SCALE);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-repeat-x"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "auto 100%",
          backgroundPositionX: -scrollLeft * SPEED_BG,
          backgroundPositionY: "bottom",
        }}
      />
      <img
        src={pulau}
        alt="Pulau"
        className="absolute bottom-[8vh] w-75 sm:w-112.5 md:w-150"
        style={{
          left: pulauScreenX,
          transform: `translateX(-50%) scale(${pulauScale})`,
          transformOrigin: "bottom center",
        }}
      />
      <div
        className="absolute left-0 h-[18vh] w-full animate-[wave-bob-back_3.6s_ease-in-out_infinite] bg-repeat-x"
        style={{
          backgroundImage: `url(${laut})`,
          backgroundSize: "auto 100%",
          backgroundPositionX: -scrollLeft * SPEED_LAUT_BACK,
          bottom: "-20px",
        }}
      />
      <img
        src={kapal}
        alt="Kapal"
        className="absolute bottom-[5vh] left-1/2 w-32.5 -translate-x-1/2 animate-[bob_4s_ease-in-out_infinite] sm:w-40 md:w-45"
      />
      <div
        className="absolute bottom-0 left-0 h-[14vh] w-full animate-[wave-bob-front_2.6s_ease-in-out_infinite] bg-repeat-x"
        style={{
          backgroundImage: `url(${laut})`,
          backgroundSize: "auto 100%",
          backgroundPositionX: -scrollLeft * SPEED_LAUT_FRONT,
        }}
      />
    </div>
  );
}