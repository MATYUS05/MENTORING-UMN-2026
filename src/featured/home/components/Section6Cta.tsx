// src/featured/home/components/Section6Cta.tsx
import { useNavigate } from "react-router-dom";
import { font } from "../../../shared/typography/font";

const PUBLIC_ROUTES = ["/about", "/teams", "/division", "/faq", "/gallery"];

export default function Section6Cta() {
  const navigate = useNavigate();

  const handleContinue = () => {
    const target =
      PUBLIC_ROUTES[Math.floor(Math.random() * PUBLIC_ROUTES.length)];
    navigate(target);
  };

  return (
    <section className="flex h-screen w-screen shrink-0 flex-col items-center justify-center gap-6 px-6 sm:px-12 md:px-20">
      <button
        onClick={handleContinue}
        className={`${font.h1} rounded-full bg-accent-red px-12 py-6 text-neutral-surface transition hover:scale-105 hover:bg-accent-red-light`}
      >
        LANJUT ?
      </button>
    </section>
  );
}