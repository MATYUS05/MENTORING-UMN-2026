// src/app/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import Home from "../../featured/home/pages/Home";
import About from "../../featured/about/pages/About";
import Teams from "../../featured/teams/pages/Teams";
import Division from "../../featured/division/pages/Division";
import Faq from "../../featured/faq/pages/Faq";
import Gallery from "../../featured/gallery/pages/Gallery";
import Login from "../../featured/auth/pages/Login";
import Admin from "../../featured/admin/pages/Admin";
import AdminTeam from "../../featured/admin/pages/AdminTeam";
import AdminDivisi from "../../featured/admin/pages/AdminDivisi";
import AdminChatbot from "../../featured/admin/pages/AdminChatbot";
import AdminFaq from "../../featured/admin/pages/AdminFaq";
import AdminGaleri from "../../featured/admin/pages/AdminGaleri";
import SuperAdmin from "../../featured/super-admin/pages/superAdmin";
import SuperAdminAkun from "../../featured/super-admin/pages/SuperAdminAkun";
import SuperAdminLogs from "../../featured/super-admin/pages/SuperAdminLogs";
import DesignSystems from '../../featured/dev/DesignSystems';
import NotFound from "../../featured/errors/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login-mentoring",
    element: <Login />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Admin /> },
      { path: "team", element: <AdminTeam /> },
      { path: "divisi", element: <AdminDivisi /> },
      { path: "chatbot", element: <AdminChatbot /> },
      { path: "faq", element: <AdminFaq /> },
      { path: "galeri", element: <AdminGaleri /> },
    ],
  },

  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      { path: "", element: <SuperAdmin /> },
      { path: "akun", element: <SuperAdminAkun /> },
      { path: "logs", element: <SuperAdminLogs /> },
    ],
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/division",
        element: <Division />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/design-systems",
        element: <DesignSystems />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);