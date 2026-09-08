// src/featured/home/data/valuesData.ts
const placeholder = "/placeholder.webp";
import carring5C from "../../../assets/home/caring.webp";
import credible5C from "../../../assets/home/credible.webp";
import competitive5C from "../../../assets/home/competitive.webp";
import competent5C from "../../../assets/home/competent.webp";
import customerDelight5C from "../../../assets/home/Customer_Delight.webp";

export interface ValueItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

export const valuesData: ValueItem[] = [
  {
    id: 1,
    title: "Caring",
    image: carring5C,
    description:
      "Sikap peduli terhadap mahasiswa, para dosen dan staf, lingkungan sekitar kampus, dan masyarakat",
  },
  {
    id: 2,
    title: "Credible",
    image: credible5C,
    description:
      "Dapat dipercaya dan diandalkan melalui integritas dalam melaksanakan tugas, aktif berorganisasi maupun dalam kegiatan kampus UMN secara umum, serta menjaga nama baik UMN",
  },
  {
    id: 3,
    title: "Competitive",
    image: competitive5C,
    description:
      "Berkompetisi secara sehat/sportif, memberikan ide-ide baru, dan mengembangkan diri dan lingkungan.",
  },
  {
    id: 4,
    title: "Competent",
    image: competent5C,
    description:
      "Aktif dalam perkuliahan, mengikuti organisasi untuk mengasah softskill, dan mencari referensi untuk menambah pengetahuan",
  },
  {
    id: 5,
    title: "Customer Delight",
    image: customerDelight5C,
    description:
      "Sikap berorientasi dan antisipatif terhadap kebutuhan orang tua dengan belajar, berprestasi, dan sopan selama berada di kampus",
  },
];