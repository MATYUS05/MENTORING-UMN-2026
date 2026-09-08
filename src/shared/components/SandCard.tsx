// src/shared/components/SandCard.tsx
import type { CSSProperties, ElementType, MouseEventHandler, ReactNode } from "react";

interface SandCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Outer corner radius, e.g. "0.75rem" | "1rem" | "1.5rem". */
  radius?: string;
  borderWidth?: string;
  as?: ElementType;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}

/**
 * Shared "sand" card surface: gradient border (primary-dark to near-black),
 * gold outer glow, sand-textured fill with a top/right highlight and a
 * left/bottom inner shadow. See src/shared/style/SandCard.css.
 */
export default function SandCard({
  children,
  className = "",
  innerClassName = "",
  radius = "1rem",
  borderWidth = "2px",
  as: Component = "div",
  onClick,
  style,
}: SandCardProps) {
  return (
    <Component
      className={`sand-card ${className}`}
      onClick={onClick}
      style={
        {
          "--sand-card-radius": radius,
          "--sand-card-border": borderWidth,
          ...style,
        } as CSSProperties
      }
    >
      <div className={`sand-card__inner ${innerClassName}`}>
        <div className="sand-card__content">{children}</div>
      </div>
    </Component>
  );
}
