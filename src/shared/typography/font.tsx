// src/shared/typography/font.tsx
export const font = {
  h1: "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight",
  h2: "font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight leading-snug",
  h3: "font-heading text-xl sm:text-2xl font-semibold tracking-tight",
  body: "font-body text-sm sm:text-base font-normal leading-relaxed",
  bodySmall: "font-body text-xs sm:text-sm font-normal leading-relaxed",
  caption: "font-body text-xs sm:text-sm font-light text-slate-400",
} as const;