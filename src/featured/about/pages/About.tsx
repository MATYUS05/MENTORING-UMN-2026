import { useEffect, useRef, type CSSProperties } from 'react'
import { font } from '../../../shared/typography/font'
import { colors } from '../../../shared/theme/colors'
import SandCard from '../../../shared/components/SandCard'
import { useHeaderBottom } from '../../../shared/hooks/useHeaderBottom'
import {
  Section,
  SectionTitle,
  PillarCard,
  LogoMeaningRow,
  ActivityCarousel,
  SceneBackground,
  ZacheryReveal,
  type Activity,
} from '../components/AboutComponent'

// Section ids in scroll order. Some only exist on tablet/mobile (lg:hidden).
const DESKTOP_SECTION_IDS = [
  'about-hero',
  'about-tagline',
  'about-logo-1',
  'about-logo-2',
  'about-logo-3',
  'about-activity',
]
const MOBILE_SECTION_IDS = [
  'about-hero',
  'about-tagline',
  'about-logo-1',
  'about-logo-2',
  'about-logo-3',
  'about-activity',
  'about-zachery',
]

const LG_BREAKPOINT = '(min-width: 1024px)'
const SNAP_GAP = 5 // px gap below the navbar
const SNAP_FALLBACK_MS = 1200 // ms — safety net if the browser never fires 'scrollend'
const WHEEL_THRESHOLD = 2 // px — very small movement is enough to trigger a jump
const SWIPE_THRESHOLD = 30 // px — for touch

import About_BG from '../../../assets/about/About_BG.webp'

const zacheryDescription =
  'Zachery (Burung Hantu): Zachery (Latin) merupakan bentuk perwujudan dari logo Mentoring UMN 2021 yang menggambarkan sifat kejujuran, kecerdasan, dan keyakinan yang tinggi. Zachery akan menemani Mentee mengarungi perjalanan panjang yang tak terlupakan.'

const pillars = [
  {
    title: 'Brave the Step',
    description:
      '"Brave the Step" merefleksikan tindakan berani meninggalkan zona nyaman dan kepastian untuk memulai perjalanan akademik dan pengembangan diri yang baru.',
  },
  {
    title: 'Build the Impact',
    description:
      '"Build the Impact" menegaskan komitmen untuk tidak sekadar berproses, namun secara aktif mengarahkan potensi untuk menciptakan kontribusi yang nyata dan penuh makna bagi diri sendiri dan lingkungan.',
  },
]

const logoMeanings = [
  {
    title: 'Motion Lines',
    description:
      'Melambangkan perpindahan dan kemajuan. Simbol ini merepresentasikan ajakan untuk berubah dan bergerak maju, sejalan dengan semangat "Transforming" dan "Turning" dalam tema Mentoring 2025.',
  },
  {
    title: 'Shooting Star',
    description:
      'Melambangkan harapan, tujuan, maupun cita-cita yang dimiliki tunas bangsa Indonesia, yaitu para mahasiswa-mahasiswa yang baru saja menginjak dunia perkuliahan penuh dengan tantangan, kenang-kenangan mendatang, serta kejutan lainnya.',
  },
  {
    title: 'Airplane',
    description:
      'Melambangkan perjalanan transformatif mahasiswa baru menuju perubahan. Simbol ini merepresentasikan proses seru dan menantang dari siswa menjadi mahasiswa, sejalan dengan semangat tema Mentoring 2025 yang inspiratif.',
  },
]

const activities: Activity[] = [
  {
    title: 'Tantangan Kolaborasi',
    description:
      'Aktivitas ini mengajarkan bahwa tantangan bisa dihadapi lebih mudah dengan kerja sama. Di sinilah para mentee belajar untuk menciptakan kekompakan dan komunikasi sebagai kunci menuju keberhasilan bersama.',
  },
  {
    title: 'Asah Strategi, Satukan Energi',
    description:
      'Sebuah aktivitas yang mendasari koordinasi dan komunikasi efektif. Para mentee belajar dengan keterbatasan gerak, menjadikan tawa dan strategi sebagai kunci keberhasilan. Aktivitas ini mengajarkan bahwa perjalanan jadi lebih ringan saat dilakukan bersama.',
  },
  {
    title: 'Tertawa dan Terkoneksi',
    description:
      'Para mentee diajak ke dalam dunia permainan interaktif yang mendorong fokus, respon cepat, dan tentunya keseruan tanpa batas. Dengan suasana santai namun tetap menantang, setiap momen jadi peluang untuk membangun koneksi dan tawa bersama.',
  },
  {
    title: 'Buka Halaman dan Temukan Petunjuk',
    description:
      'Melalui media visual dan catatan, para mentee diajak menelusuri teka-teki, mencari petunjuk, dan berdiskusi untuk memecahkan misi yang tersembunyi. Semua dimulai dari membuka halaman pertama.',
  },
]

export default function About() {
  const headerBottom = useHeaderBottom(96)
  const offset = headerBottom + SNAP_GAP

  // Very sensitive, JS-driven scroll-snap: one wheel notch or swipe = exactly one
  // section, and every section stops right below the navbar with a small gap.
  // Order: hero -> tagline -> (tagline 2 on tablet/mobile) -> logo 1 -> logo 2 ->
  // logo 3 -> our activity -> kenal zachery (tablet/mobile).
  const currentIndexRef = useRef(0)
  const pastLastRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    const getIds = () =>
      window.matchMedia(LG_BREAKPOINT).matches ? DESKTOP_SECTION_IDS : MOBILE_SECTION_IDS

    const clearFallbackTimer = () => {
      if (fallbackTimerRef.current !== null) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
    }

    const onScrollEnd = () => {
      isAnimatingRef.current = false
      clearFallbackTimer()
    }
    window.addEventListener('scrollend', onScrollEnd)

    const goTo = (index: number) => {
      const ids = getIds()
      const clamped = Math.max(0, Math.min(index, ids.length - 1))
      const el = document.getElementById(ids[clamped])
      if (!el) return
      currentIndexRef.current = clamped
      isAnimatingRef.current = true
      clearFallbackTimer()
      // Safety net: not every browser fires 'scrollend' reliably, so force-clear
      // the lock after a while so scroll input never gets stuck ignored forever.
      fallbackTimerRef.current = setTimeout(onScrollEnd, SNAP_FALLBACK_MS)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const lastSectionTop = () => {
      const ids = getIds()
      const el = document.getElementById(ids[ids.length - 1])
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
    }

    const onWheel = (e: WheelEvent) => {
      // A section change is still animating — block this input outright, before
      // any other check, so not even a tiny trackpad delta can bleed through as
      // native scroll and disturb the transition or be recorded for later.
      if (isAnimatingRef.current) {
        e.preventDefault()
        return
      }

      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return

      // Past the last section (in the footer area): let native scroll run,
      // but resume snapping once the user scrolls back up into the section.
      if (pastLastRef.current) {
        if (e.deltaY < 0 && window.scrollY <= lastSectionTop() - offset) {
          pastLastRef.current = false
        } else {
          return
        }
      }

      const ids = getIds()
      const isLast = currentIndexRef.current === ids.length - 1

      if (isLast && e.deltaY > 0) {
        pastLastRef.current = true
        return
      }

      e.preventDefault()
      goTo(currentIndexRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (pastLastRef.current || touchStartYRef.current === null) return
      if (isAnimatingRef.current) {
        e.preventDefault()
        return
      }

      const deltaY = touchStartYRef.current - e.touches[0].clientY
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return

      const ids = getIds()
      const isLast = currentIndexRef.current === ids.length - 1

      if (isLast && deltaY > 0) {
        pastLastRef.current = true
        touchStartYRef.current = null
        return
      }

      e.preventDefault()
      goTo(currentIndexRef.current + (deltaY > 0 ? 1 : -1))
      touchStartYRef.current = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      clearFallbackTimer()
    }
  }, [offset])

  // Hero is tall enough that centering it looks right below the navbar already.
  // Shorter sections need to be top-aligned instead, or centering leaves them
  // floating in the middle of the screen instead of sitting under the navbar.
  const heroSection = 'flex items-center pb-14 sm:pb-20'
  const snapSection = 'flex items-start'
  const snapStyle: CSSProperties = {
    minHeight: `calc(100vh - ${offset}px)`,
    scrollMarginTop: offset,
    // Section normally adds its own py-14/py-20 — that's what was pushing
    // content far from the navbar, not the small gap above. Zero it out here
    // and let flex-centering handle spacing within the trimmed height instead.
    paddingTop: 0,
    paddingBottom: 0,
  }
  // Hero keeps its bottom padding (pb-14 sm:pb-20 above) so the gap before the
  // Tagline section matches the natural gap between the other sections.
  const heroStyle: CSSProperties = { ...snapStyle, paddingBottom: undefined }

  return (
    <div className="relative">
      {/* Single fixed background — same on mobile, tablet, and desktop */}
      <SceneBackground src={About_BG} alt="Zachery" />

      {/* Desktop-only: floating "Kenal Zachery" button, top-left, over the scene */}
      <ZacheryReveal variant="floating" description={zacheryDescription} />

      {/* Hero — sits over the scene background */}
      <Section id="about-hero" className={heroSection} style={heroStyle}>
        <SandCard innerClassName="p-6 text-center sm:p-8 lg:text-left">
          <h1 className={font.h1} style={{ color: colors.neutral.charcoal }}>
            Navigating Beyond Familiar Shores to Anchor Potential into Purposeful Impact
          </h1>
          <p className={`${font.body} mt-4`} style={{ color: colors.neutral.stone }}>
            &ldquo;Navigating Beyond Familiar Shores&rdquo; merepresentasikan keberanian mahasiswa
            untuk melangkah keluar dari zona nyaman menghadapi ketidakpastian, kegagalan, dan
            keraguan sebagai bagian dari proses bertumbuh.
          </p>
          <p className={`${font.body} mt-4`} style={{ color: colors.neutral.stone }}>
            &ldquo;to Anchor Potential into Purposeful Impact&rdquo; menekankan bahwa setiap
            individu memiliki potensi, namun potensi hanya akan bermakna ketika diarahkan dengan
            kesadaran, nilai, dan tujuan yang jelas.
          </p>
        </SandCard>
      </Section>

      {/* Tagline / Pillars — Brave the Step + Build the Impact */}
      <Section id="about-tagline" className={snapSection} style={snapStyle}>
        <div className="w-full">
          <SectionTitle>Tagline</SectionTitle>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.title} title={pillar.title} description={pillar.description} />
            ))}
          </div>
        </div>
      </Section>

      {/* Our Logo — one meaning per snap section */}
      {logoMeanings.map((item, i) => (
        <Section key={item.title} id={`about-logo-${i + 1}`} className={snapSection} style={snapStyle}>
          <div className="w-full">
            {i === 0 && <SectionTitle>Our Logo</SectionTitle>}
            <LogoMeaningRow title={item.title} description={item.description} reverse={i % 2 === 1} />
          </div>
        </Section>
      ))}

      {/* Our Activity */}
      <Section id="about-activity" className={snapSection} style={snapStyle}>
        <div className="w-full">
          <SectionTitle>Our Activity</SectionTitle>
          <ActivityCarousel activities={activities} />
        </div>
      </Section>

      {/* Mobile/Tablet only — desktop uses the floating button instead */}
      <Section id="about-zachery" className={`${snapSection} lg:hidden`} style={snapStyle}>
        <ZacheryReveal variant="inline" description={zacheryDescription} />
      </Section>
    </div>
  )
}