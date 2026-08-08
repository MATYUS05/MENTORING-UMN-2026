// src/featured/home/pages/Home.tsx
import { useEffect } from "react";
import "./home.css";
import { useHorizontalScroll } from "../hooks/useHorizontalScroll";
import ParallaxOcean from "../components/ParallaxOcean";
import Section1TitleMobile from "../components/Section1TitleMobile";
import Section1TaglineMobile from "../components/Section1TaglineMobile";
import Section1Hero from "../components/Section1Hero";
import Section2About from "../components/Section2About";
import Section3Timeline from "../components/Section3Timeline";
import Section4Values from "../components/Section4Values";
import Section5PartnersGrid from "../components/Section5PartnersGrid";
import Section5Contact from "../components/Section5Contact";
import Section5Partners from "../components/Section5Partners";
import Section6Cta from "../components/Section6Cta";

export default function Home() {
  const { containerRef, scrollLeft, maxScrollLeft } = useHorizontalScroll();

  // Home mengisi tepat area di bawah navbar, jadi halaman tidak perlu scroll vertikal
  useEffect(() => {
    document.body.classList.add("home-lock-scroll");
    return () => document.body.classList.remove("home-lock-scroll");
  }, []);

  return (
    <div className="home-shell relative w-screen overflow-hidden bg-secondary-sky">
      <ParallaxOcean scrollLeft={scrollLeft} maxScrollLeft={maxScrollLeft} />
      <div
        ref={containerRef}
        className="scrollbar-hide relative z-10 flex h-full w-full overflow-x-auto overflow-y-hidden"
      >
        <Section1TitleMobile />
        <Section1TaglineMobile />
        <Section1Hero />
        <Section2About />
        <Section3Timeline />
        <Section4Values />
        <Section5PartnersGrid />
        <Section5Contact />
        <Section5Partners />
        <Section6Cta />
      </div>
    </div>
  );
}