import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import ERPNavbar from "./Navbar";

export default function OutletLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 ">
      {/* Sidebar (left) */}
      <AppSidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      {/* Main area (right) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar (top) */}
        <ERPNavbar toggleSidebar={toggleSidebar} />

        {/* Page content (scrollable outlet) */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
