import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function RootLayout() {
  return (
    <div>

      {/* Navbar shown on all pages */}
      <Header />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
        <Footer/>
    </div>
  );
}

export default RootLayout;