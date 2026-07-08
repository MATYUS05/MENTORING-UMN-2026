// src/featured/home/hooks/useHorizontalScroll.ts
import { useEffect, useRef, useState } from "react";

export function useHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScrollLeft, setMaxScrollLeft] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateMax = () => {
      setMaxScrollLeft(el.scrollWidth - el.clientWidth);
    };

    const handleWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      e.preventDefault();
      el.scrollLeft += delta;
    };

    const handleScroll = () => {
      setScrollLeft(el.scrollLeft);
    };

    updateMax();
    const resizeObserver = new ResizeObserver(updateMax);
    resizeObserver.observe(el);

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMax);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMax);
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, scrollLeft, maxScrollLeft };
}