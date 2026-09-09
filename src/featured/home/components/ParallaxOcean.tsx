// src/featured/home/components/ParallaxOcean.tsx
import bg from "../../../assets/home/latar_belakang.webp";
import laut from "../../../assets/home/Ombak.webp";
import kapal from "../../../assets/home/kapal_kayu.webp";

interface ParallaxOceanProps {
  scrollLeft: number;
}

const SPEED_BG = 0.05;
const SPEED_LAUT_BACK = 0.18;

export default function ParallaxOcean({ scrollLeft }: ParallaxOceanProps) {
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
        className="absolute bottom-[calc(5vh-10px)] left-[35%] w-42.25 -translate-x-1/2 animate-[bob_4s_ease-in-out_infinite] sm:w-52 md:bottom-[calc(5vh-25px)] md:w-58.5"
      />
    </div>
  );
}