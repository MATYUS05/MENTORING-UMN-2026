import { useEffect, useMemo, useState } from 'react';
import { font } from '../../../shared/typography/font';
import { fotoService } from '../../../lib/fotoService';
import type { Foto, Minggu, Sesi } from '../../../shared/types/database';

import galeriBg from '../../../assets/galeri/galeri bg.png';

import gemAll from '../../../assets/galeri/gem_all.png';
import gemPagi from '../../../assets/galeri/gem_pagi.png';
import gemSiang from '../../../assets/galeri/gem_siang.png';
import gemPengganti from '../../../assets/galeri/gem_pengganti.png';

type FilterSesi = 'semua' | Sesi;
type FilterMinggu = 'semua' | Minggu;

export default function Gallery() {
  const [fotoList, setFotoList] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterSesi, setFilterSesi] =
    useState<FilterSesi>('semua');

  const [filterMinggu, setFilterMinggu] =
    useState<FilterMinggu>('semua');

  useEffect(() => {
    (async () => {
      const data = await fotoService.ambilSemua();

      setFotoList(data);
      setLoading(false);
    })();
  }, []);

  const filteredFoto = useMemo(() => {
    return fotoList.filter((f) => {
      const cocokSesi =
        filterSesi === 'semua' ||
        f.sesi === filterSesi;

      const cocokMinggu =
        filterMinggu === 'semua' ||
        f.minggu === filterMinggu;

      return cocokSesi && cocokMinggu;
    });
  }, [fotoList, filterSesi, filterMinggu]);

  return (
    <div className="relative overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `url(${galeriBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* DECORATION */}
      <img
        src={gemAll}
        alt=""
        className="
          pointer-events-none
          absolute
          left-12
          top-36
          hidden
          w-14
          rotate-12
          opacity-80
          md:block
          animate-[floatGem_5s_ease-in-out_infinite]
        "
      />

      <img
        src={gemPagi}
        alt=""
        className="
          pointer-events-none
          absolute
          right-20
          top-52
          hidden
          w-12
          -rotate-12
          opacity-80
          lg:block
          animate-[floatGem_4s_ease-in-out_infinite]
        "
      />

      <img
        src={gemPengganti}
        alt=""
        className="
          pointer-events-none
          absolute
          bottom-44
          left-16
          hidden
          w-12
          rotate-12
          opacity-80
          lg:block
          animate-[floatGem_6s_ease-in-out_infinite]
        "
      />

      <img
        src={gemSiang}
        alt=""
        className="
          pointer-events-none
          absolute
          bottom-28
          right-20
          hidden
          w-14
          -rotate-12
          opacity-80
          lg:block
          animate-[floatGem_5s_ease-in-out_infinite]
        "
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className={`${font.h1} text-slate-900`}>
            Galeri
          </h1>

          <p
            className={`${font.body} mx-auto mt-3 max-w-2xl text-slate-600`}
          >
            Dokumentasi kegiatan mentoring,
            perjalanan seru bersama mentor dan mentee.
          </p>
        </div>

        {/* FILTER */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-4
            rounded-3xl
            border
            border-white/50
            bg-white/60
            p-5
            shadow-lg
            backdrop-blur-md
            sm:flex-row
          "
        >
          <select
            value={filterSesi}
            onChange={(e) =>
              setFilterSesi(
                e.target.value as FilterSesi
              )
            }
            className="
              flex-1
              rounded-xl
              border
              border-slate-300
              bg-white/90
              px-4
              py-3
              outline-none
              focus:border-emerald-500
            "
          >
            <option value="semua">
              Semua Sesi
            </option>

            <option value="pagi">
              🌤️ Pagi
            </option>

            <option value="siang">
              ☀️ Siang
            </option>

            <option value="pengganti">
              💎 Pengganti
            </option>
          </select>

          <select
            value={filterMinggu}
            onChange={(e) =>
              setFilterMinggu(
                e.target.value as FilterMinggu
              )
            }
            className="
              flex-1
              rounded-xl
              border
              border-slate-300
              bg-white/90
              px-4
              py-3
              outline-none
              focus:border-emerald-500
            "
          >
            <option value="semua">
              Semua Minggu
            </option>

            <option value="minggu-1">
              Minggu 1
            </option>

            <option value="minggu-2">
              Minggu 2
            </option>

            <option value="minggu-3">
              Minggu 3
            </option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-center text-slate-500">
            Memuat foto...
          </p>
        )}

        {!loading &&
          filteredFoto.length === 0 && (
            <div
              className="
                mt-12
                rounded-3xl
                bg-white/70
                py-12
                text-center
                shadow-md
                backdrop-blur-md
              "
            >
              <img
                src={gemAll}
                className="mx-auto mb-4 w-12 opacity-70"
              />

              <p className="text-slate-600">
                Belum ada foto untuk filter ini.
              </p>
            </div>
          )}

        {/* GRID */}
        <div
          className="
            mt-10
            grid
            grid-cols-2
            gap-5
            sm:grid-cols-3
            lg:grid-cols-4
          "
        >
          {filteredFoto.map((f) => (
            <figure
              key={f.id}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-white/50
                bg-white/70
                shadow-md
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              <div className="overflow-hidden">
                <img
                  src={f.fotoUrl}
                  alt={
                    f.judul ??
                    'Dokumentasi mentoring'
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      '/placeholder.webp';
                  }}
                  className="
                    h-44
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />
              </div>

              <figcaption className="p-4">
                {f.judul && (
                  <p className="font-medium text-slate-800">
                    {f.judul}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  {f.sesi} · {f.minggu}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}