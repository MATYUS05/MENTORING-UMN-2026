import { font } from "../../../shared/typography/font";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function Admin() {
  const { userData } = useAuth();

  const stats = [
    {
      name: "Total Peserta",
      count: "120",
    },
    {
      name: "Total Panitia",
      count: "45",
    },
    {
      name: "Foto Galeri",
      count: "89",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`${font.h1} text-slate-900`}>
          Dashboard
        </h1>

        <p className={`${font.body} mt-2 text-slate-500`}>
          Selamat datang,{" "}
          <span className="font-semibold text-slate-900">
            {userData?.username}
          </span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm text-slate-500">
              {stat.name}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {stat.count}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}