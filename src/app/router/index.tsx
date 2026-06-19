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
import SuperAdmin from "../../featured/super-admin/pages/superAdmin";
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
      {
        path: "",
        element: <Admin />,
      },
    ],
  },

  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      {
        path: "",
        element: <SuperAdmin />,
      },
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
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
