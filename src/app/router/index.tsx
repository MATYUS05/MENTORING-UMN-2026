import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import Home from "../../featured/home/pages/Home";
import About from "../../featured/about/pages/About";
import Teams from "../../featured/teams/pages/Teams";
import Division from "../../featured/division/pages/Division";
import Faq from "../../featured/faq/pages/Faq";
import Gallery from "../../featured/gallery/pages/Gallery";

export const router = createBrowserRouter([
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
]);
