import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import ERPNavbar from "./Navbar";

export default function OutletLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    // Added dark:bg-slate-950 to the root container for the sidebar area background
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar (left) */}
      <AppSidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      {/* Main area (right) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar (top) */}
        <ERPNavbar toggleSidebar={toggleSidebar} />

        {/* Page content (scrollable outlet) */}
        {/* Changed bg-gray-100 to bg-gray-50 for consistency 
            Added dark:bg-slate-900 for the main content dark mode 
        */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-slate-900 custom-scrollbar transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
