import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../theme/colors'

/**
 * Triple-ring border used on the About "Our Logo" images: a 1px Primary Dark
 * outer edge, two 4px opposite-diagonal gradient rings, a gold outer glow,
 * and a heavier top-right / lighter bottom-left inner shadow over the content.
 */
export default function FramedBorder({
  children,
  radius = '0.75rem',
  className = '',
}: {
  children: ReactNode
  radius?: string
  className?: string
}) {
  const r2 = `calc(${radius} - 1px)`
  const r3 = `calc(${radius} - 5px)`
  const r4 = `calc(${radius} - 9px)`

  return (
    <div
      className={`p-px ${className}`}
      style={{
        borderRadius: radius,
        backgroundColor: colors.primary.dark,
        boxShadow: `0 0 16px 2px ${colors.accent.gold}99`,
      }}
    >
      <div
        className="h-full w-full p-1"
        style={
          {
            borderRadius: r2,
            background: `linear-gradient(to bottom left, ${colors.accent.gold}, ${colors.primary.dark})`,
          } as CSSProperties
        }
      >
        <div
          className="h-full w-full p-1"
          style={
            {
              borderRadius: r3,
              background: `linear-gradient(to bottom left, ${colors.primary.dark}, ${colors.accent.gold})`,
            } as CSSProperties
          }
        >
          <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: r4 }}>
            {children}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: r4,
                boxShadow:
                  'inset -10px 10px 16px 0 rgba(0,0,0,0.55), inset 10px -10px 16px 0 rgba(0,0,0,0.275)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
