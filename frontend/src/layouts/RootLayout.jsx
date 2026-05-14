import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RootLayout() {
  const { pathname } = useLocation();
  // Admin pages have their own full-page sidebar layout — hide global nav
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default RootLayout;