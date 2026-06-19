import { font } from "../../../shared/typography/font";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function SuperAdmin() {
  const { userData } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`${font.h1} text-slate-900`}>
          Super Admin Dashboard
        </h1>

        <p className={`${font.body} mt-2 text-slate-500`}>
          Selamat datang,{" "}
          <span className="font-semibold text-slate-900">
            {userData?.username}
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">
              Username
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {userData?.username}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {userData?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}