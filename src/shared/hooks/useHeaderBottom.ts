// src/shared/hooks/useHeaderBottom.ts
import { useEffect, useState } from "react";

/** Tracks the fixed <header>'s rendered bottom edge (in px from viewport top). */
export function useHeaderBottom(fallback: number) {
  const [bottom, setBottom] = useState(fallback);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => setBottom(header.getBoundingClientRect().bottom);
    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(header);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return bottom;
}
