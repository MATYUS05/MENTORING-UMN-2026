// src/featured/home/components/IslandButton.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import laut from "../../../assets/home/Ombak.webp";
import pulau from "../../../assets/home/pulau.webp";

interface IslandButtonProps {
  scrollLeft: number;
  maxScrollLeft: number;
}

const SPEED_LAUT_FRONT = 0.4;
const PULAU_MIN_SCALE = 0.15;
const EXPLORE_ROUTES = ["/about", "/teams", "/division", "/faq", "/gallery"];

export default function IslandButton({
  scrollLeft,
  maxScrollLeft,
}: IslandButtonProps) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleExplore = () => {
    const target =
      EXPLORE_ROUTES[Math.floor(Math.random() * EXPLORE_ROUTES.length)];
    navigate(target);
  };

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
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <button
        type="button"
        onClick={handleExplore}
        aria-label="Ketuk pulau untuk menjelajah lebih lanjut"
        className="pointer-events-auto absolute bottom-[calc(8vh-30px)] cursor-pointer border-0 bg-transparent p-0 md:bottom-[calc(8vh-35px)]"
        style={{
          left: pulauScreenX,
          transform: `translateX(-50%) scale(${pulauScale})`,
          transformOrigin: "bottom center",
        }}
      >
        <img src={pulau} alt="Pulau" className="w-90 sm:w-135 md:w-90" />
      </button>
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
