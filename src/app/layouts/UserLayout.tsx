import { Outlet, useLocation } from "react-router-dom";
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';
import { useHeaderBottom } from '../../shared/hooks/useHeaderBottom';

export default function UserLayout() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const headerBottom = useHeaderBottom(140);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="grow" style={isHome ? undefined : { paddingTop: headerBottom }}>
        <Outlet />
      </main>

      {!isHome && <Footer />}
    </div>
  );
}