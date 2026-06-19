import { font } from "../../../shared/typography/font";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center font-">
      <h1 className={`${font.h1} `}>Sistem Informasi Organisasi</h1>
      <h2 className={`${font.h2} mt-6 `}>Membangun Generasi Solid</h2>
      <p className={`${font.h2}`}>Custom Font</p>
      <p className={`${font.body} mt-4 max-w-2xl `}>
        Ini adalah contoh teks paragraf. Karena kita sudah mengatur ukuran dan
        spasi (leading-relaxed) di file font, semua paragraf di seluruh website
        akan terlihat konsisten dan rapi plek ketiplek.
      </p>
      <span className={`${font.caption} mt-8 block`}>
        *Pendaftaran panitia akan segera dibuka
      </span>
    </div>
  );
}
