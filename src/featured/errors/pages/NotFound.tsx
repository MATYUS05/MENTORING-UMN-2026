import { Link } from "react-router-dom";
import { font } from "../../../shared/typography/font";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-widest text-emerald-600">
          ERROR 404
        </p>

        <h1 className={`${font.h1} mt-4 text-slate-900`}>
          Page Not Found
        </h1>

        <p className={`${font.body} mt-3 text-slate-500`}>
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}