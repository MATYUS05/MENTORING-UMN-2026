import React from 'react'
import { colors } from '../../../shared/theme/colors'
import { font } from '../../../shared/typography/font'
import {
  Section,
  SectionTitle,
  ImagePlaceholder,
  PillarCard,
  LogoMeaningRow,
  ActivityCarousel,
  ProfileCard,
  type Activity,
} from '../components/AboutComponent'

// IF real assets imma put it here
// import aboutBg from '../assets/about_bg.png'

const pillars = [
  {
    title: 'Seek',
    description:
      'Tahap yang membimbing mahasiswa mengenali potensi, minat, dan tujuan hidup melalui refleksi diri. Mereka diajak mengeksplorasi peluang di sekitar serta memahami arah impian yang ingin dicapai melalui mentoring.',
  },
  {
    title: 'Strive',
    description:
      'Tahap ini menekankan usaha, ketekunan, dan semangat tinggi. Mahasiswa diajak untuk mengasah kemampuan, menghadapi tantangan, memperbaiki diri, dan terus berkembang demi mencapai tujuan serta memberi dampak bagi lingkungan sekitar.',
  },
  {
    title: 'Surpass',
    description:
      'Mendorong mahasiswa melampaui ekspektasi dengan menciptakan dampak nyata. Setelah melalui proses refleksi dan perjuangan, mereka diharapkan memberi kontribusi positif yang luas dan menginspirasi lingkungan sekitar secara berkelanjutan.',
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
  return (
    <div style={{ backgroundColor: colors.neutral.cream }}>
      {/* Hero */}
      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className={font.h1} style={{ color: colors.neutral.charcoal }}>
              Transforming Vision To Action, Turning Potential To Impact
            </h1>
            <p className={`${font.body} mt-4`} style={{ color: colors.neutral.stone }}>
              Dunia perkuliahan penuh potensi dan peluang. Melalui tema &ldquo;Transforming Vision to
              Action, Turning Potential to Impact&rdquo;, mahasiswa diajak mengembangkan diri,
              mewujudkan visi, dan menciptakan dampak nyata bagi lingkungan melalui nilai 5C.
            </p>
          </div>
          <ImagePlaceholder
            // src={aboutBg}
            alt="About hero"
            className="aspect-video w-full flex-1 md:max-w-md"
          />
        </div>
      </Section>

      {/* Tagline / Pillars */}
      <Section className="pt-0">
        <SectionTitle>Tagline</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} title={pillar.title} description={pillar.description} />
          ))}
        </div>
      </Section>

      {/* Logo */}
      <Section style={{ backgroundColor: colors.neutral.surface }}>
        <SectionTitle>Our Logo</SectionTitle>
        <div className="flex flex-col gap-10 sm:gap-12">
          {logoMeanings.map((item, i) => (
            <LogoMeaningRow
              key={item.title}
              title={item.title}
              description={item.description}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </Section>

      {/* Our Activity */}
      <Section>
        <SectionTitle>Our Activity</SectionTitle>
        <ActivityCarousel activities={activities} />
      </Section>

      {/* Meet Zachery */}
      <Section style={{ backgroundColor: colors.neutral.surface }}>
        <SectionTitle>Meet Zachery</SectionTitle>
        <ProfileCard
          title="Meet Zachery"
          description="Zachery (Burung Hantu): Zachery (Latin) merupakan bentuk perwujudan dari logo Mentoring UMN 2021 yang menggambarkan sifat kejujuran, kecerdasan, dan keyakinan yang tinggi. Zachery akan menemani Mentee mengarungi perjalanan panjang yang tak terlupakan."
        />
      </Section>
    </div>
  )
}