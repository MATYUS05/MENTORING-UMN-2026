import React, { useState, type ReactNode } from 'react'
import { colors } from '../../../shared/theme/colors'
import { font } from '../../../shared/typography/font'
import { useHeaderBottom } from '../../../shared/hooks/useHeaderBottom'

const PLACEHOLDER_IMG = 'https://placehold.co/600x400/EFE3CF/8C7B68?text=Image'

/*  Layout primitives */

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

export function Section({
  children,
  className = '',
  id,
  style,
}: {
  children: ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`} style={style}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col items-center gap-2 text-center sm:mb-14">
      <h2 className={font.h2} style={{ color: colors.neutral.charcoal }}>
        {children}
      </h2>
      <span className="h-px w-14" style={{ backgroundColor: colors.neutral.stone }} />
    </div>
  )
}

/*  Image placeholder*/

export function ImagePlaceholder({
  src,
  alt = '',
  className = '',
  rounded = 'rounded-2xl',
}: {
  src?: string
  alt?: string
  className?: string
  rounded?: string
}) {
  return (
    <img
      src={src ?? PLACEHOLDER_IMG}
      alt={alt}
      className={`object-cover ${rounded} ${className}`}
    />
  )
}

export function CirclePlaceholder({
  src,
  alt = '',
  className = '',
}: {
  src?: string
  alt?: string
  className?: string
}) {
  return <ImagePlaceholder src={src} alt={alt} rounded="rounded-full" className={className} />
}

/*  for Seek / Strive / Surpass  */

export function PillarCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-2xl border p-6 shadow-sm transition"
      style={{ backgroundColor: colors.neutral.surface, borderColor: colors.neutral.sand }}
    >
      <h3 className={font.h3} style={{ color: colors.neutral.charcoal }}>
        {title}
      </h3>
      <p className={font.body} style={{ color: colors.neutral.stone }}>
        {description}
      </p>
    </div>
  )
}

/*  for Motion Lines / Shooting Star / Airplane*/

export function LogoMeaningRow({
  title,
  description,
  image,
  reverse = false,
}: {
  title: string
  description: string
  image?: string
  reverse?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-6 sm:gap-8 lg:flex-row ${
        reverse ? 'lg:flex-row-reverse' : ''
      }`}
    >
      <CirclePlaceholder src={image} alt={title} className="h-40 w-40 shrink-0 sm:h-48 sm:w-48" />
      <div
        className="flex-1 rounded-2xl border p-6 text-center shadow-sm lg:text-left"
        style={{ backgroundColor: colors.neutral.surface, borderColor: colors.neutral.sand }}
      >
        <h3 className={`${font.h3} mb-2`} style={{ color: colors.neutral.charcoal }}>
          {title}
        </h3>
        <p className={font.body} style={{ color: colors.neutral.stone }}>
          {description}
        </p>
      </div>
    </div>
  )
}

/*  Activity card + carousel                                           */

export interface Activity {
  title: string
  description: string
  image?: string
}

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm"
      style={{ backgroundColor: colors.neutral.surface, borderColor: colors.neutral.sand }}
    >
      <ImagePlaceholder
        src={activity.image}
        alt={activity.title}
        rounded="rounded-none"
        className="aspect-video w-full"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className={font.h3} style={{ color: colors.neutral.charcoal }}>
          {activity.title}
        </h3>
        <p className={font.body} style={{ color: colors.neutral.stone }}>
          {activity.description}
        </p>
      </div>
    </div>
  )
}

export function ActivityCarousel({ activities }: { activities: Activity[] }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i === 0 ? activities.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === activities.length - 1 ? 0 : i + 1))

  return (
    <div>
      {/* Mobile: stacked list */}
      <div className="grid grid-cols-1 gap-6 sm:hidden">
        {activities.map((activity) => (
          <ActivityCard key={activity.title} activity={activity} />
        ))}
      </div>

      {/* Tablet / Desktop: one-at-a-time carousel, perfectly centered */}
      <div className="hidden sm:block">
        <div className="mx-auto grid max-w-2xl grid-cols-[2.5rem_1fr_2.5rem] items-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous activity"
            className="flex h-10 w-10 items-center justify-center rounded-full border transition"
            style={{ borderColor: colors.neutral.sand, color: colors.neutral.stone, backgroundColor: colors.neutral.surface }}
          >
            &#8249;
          </button>

          <ActivityCard activity={activities[index]} />

          <button
            type="button"
            onClick={next}
            aria-label="Next activity"
            className="flex h-10 w-10 items-center justify-center rounded-full border transition"
            style={{ borderColor: colors.neutral.sand, color: colors.neutral.stone, backgroundColor: colors.neutral.surface }}
          >
            &#8250;
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {activities.map((activity, i) => (
            <button
              key={activity.title}
              type="button"
              aria-label={`Go to ${activity.title}`}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? '1.5rem' : '0.5rem',
                backgroundColor: i === index ? colors.secondary.deep : colors.neutral.sand,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


export function SceneBackground({ src, alt = '' }: { src?: string; alt?: string }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      aria-hidden={!alt}
    >
      <img src={src ?? PLACEHOLDER_IMG} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `${colors.neutral.charcoalDeep}B3` }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm rounded-2xl border p-6 shadow-lg"
        style={{ backgroundColor: colors.neutral.surface, borderColor: colors.neutral.sand }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-xl leading-none"
          style={{ color: colors.neutral.stone }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

/*  Kenal Zachery — reveal button that pops the description in a modal */
/*  Desktop: fixed pill button, top-left, below the navbar        */
/*  Mobile/Tablet (<lg): plain centered button inside its own section   */

const FLOATING_BUTTON_GAP = 16 // px

const FLOATING_BUTTON_FALLBACK_TOP = 96 // px

export function ZacheryReveal({
  description,
  variant,
}: {
  description: string
  variant: 'floating' | 'inline'
}) {
  const [open, setOpen] = useState(false)
  const headerBottom = useHeaderBottom(FLOATING_BUTTON_FALLBACK_TOP - FLOATING_BUTTON_GAP)

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.sand,
    color: colors.neutral.charcoal,
  }

  return (
    <>
      {variant === 'floating' ? (
        <div
          className="fixed left-6 z-40 hidden lg:block"
          style={{ top: headerBottom + FLOATING_BUTTON_GAP }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`${font.bodySmall} rounded-full border px-4 py-2 shadow-sm transition hover:shadow-md`}
            style={buttonStyle}
          >
            Kenal Zachery
          </button>
        </div>
      ) : (
        <div className="flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border px-5 py-2.5 shadow-sm transition"
            style={buttonStyle}
          >
            Kenal Zachery
          </button>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className={`${font.h3} mb-2 pr-6`} style={{ color: colors.neutral.charcoal }}>
          Kenal Zachery
        </h3>
        <p className={font.body} style={{ color: colors.neutral.stone }}>
          {description}
        </p>
      </Modal>
    </>
  )
}