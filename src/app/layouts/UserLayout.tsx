import { Outlet, useLocation } from "react-router-dom";
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';

export default function UserLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar position={isHome ? "fixed" : "sticky"} />
      <main className="grow">
        <Outlet />
      </main>

      <Footer showContent={!isHome} />
    </div>
  );
}