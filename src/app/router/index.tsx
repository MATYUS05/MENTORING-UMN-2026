// src/app/router/index.tsx

import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

/**
 * Setiap halaman dimuat lewat lazy() supaya tidak semuanya masuk ke satu bundle.
 * Sebelumnya seluruh halaman di-import statis, sehingga pengunjung halaman publik
 * ikut mengunduh kode dashboard admin beserta library Excel (xlsx) yang berat.
 */
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const SuperAdminLayout = lazy(() => import("../layouts/SuperAdminLayout"));

const Home = lazy(() => import("../../featured/home/pages/Home"));
const About = lazy(() => import("../../featured/about/pages/About"));
const Teams = lazy(() => import("../../featured/teams/pages/Teams"));
const Division = lazy(() => import("../../featured/division/pages/Division"));
const Faq = lazy(() => import("../../featured/faq/pages/Faq"));
const Gallery = lazy(() => import("../../featured/gallery/pages/Gallery"));
const Login = lazy(() => import("../../featured/auth/pages/Login"));
const Admin = lazy(() => import("../../featured/admin/pages/Admin"));
const AdminTeam = lazy(() => import("../../featured/admin/pages/AdminTeam"));
const AdminDivisi = lazy(() => import("../../featured/admin/pages/AdminDivisi"));
const AdminChatbot = lazy(() => import("../../featured/admin/pages/AdminChatbot"));
const AdminFaq = lazy(() => import("../../featured/admin/pages/AdminFaq"));
const AdminGaleri = lazy(() => import("../../featured/admin/pages/AdminGaleri"));
const SuperAdmin = lazy(() => import("../../featured/super-admin/pages/superAdmin"));
const SuperAdminAkun = lazy(() => import("../../featured/super-admin/pages/SuperAdminAkun"));
const SuperAdminLogs = lazy(() => import("../../featured/super-admin/pages/SuperAdminLogs"));
const DesignSystems = lazy(() => import('../../featured/dev/DesignSystems'));
const NotFound = lazy(() => import("../../featured/errors/pages/NotFound"));

/** Ditampilkan sesaat selama chunk halaman diunduh. */
function MemuatHalaman() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <p className="font-body text-sm text-neutral-stone">Memuat...</p>
    </div>
  );
}

const suspense = (element: ReactNode) => (
  <Suspense fallback={<MemuatHalaman />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login-mentoring",
    element: suspense(<Login />),
  },

  {
    path: "/admin",
    element: suspense(<AdminLayout />),
    children: [
      { path: "", element: suspense(<Admin />) },
      { path: "team", element: suspense(<AdminTeam />) },
      { path: "divisi", element: suspense(<AdminDivisi />) },
      { path: "chatbot", element: suspense(<AdminChatbot />) },
      { path: "faq", element: suspense(<AdminFaq />) },
      { path: "galeri", element: suspense(<AdminGaleri />) },
    ],
  },

  {
    path: "/superadmin",
    element: suspense(<SuperAdminLayout />),
    children: [
      { path: "", element: suspense(<SuperAdmin />) },
      { path: "akun", element: suspense(<SuperAdminAkun />) },
      { path: "logs", element: suspense(<SuperAdminLogs />) },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: suspense(<Home />),
      },
      {
        path: "/about",
        element: suspense(<About />),
      },
      {
        path: "/teams",
        element: suspense(<Teams />),
      },
      {
        path: "/division",
        element: suspense(<Division />),
      },
      {
        path: "/faq",
        element: suspense(<Faq />),
      },
      {
        path: "/gallery",
        element: suspense(<Gallery />),
      },
      {
        path: "/design-systems",
        element: suspense(<DesignSystems />),
      },
    ],
  },
  {
    path: "*",
    element: suspense(<NotFound />),
  },
]);
