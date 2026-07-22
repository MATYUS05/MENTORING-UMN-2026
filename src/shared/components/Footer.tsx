import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footerBg border-t border-slate-200 bg-cover bg-center bg-no-repeat">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Mentoring UMN 2026
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Empowering future leaders through collaboration and growth.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Mentoring UMN. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}