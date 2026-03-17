import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
     
      <div className="mobile-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h2>CMS</h2>
      </div>

      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <Sidebar />
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
