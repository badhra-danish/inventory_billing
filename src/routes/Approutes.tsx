import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Router, Route, BrowserRouter, Routes } from "react-router-dom";
import AppSidebar from "@/layout/Sidebar";
import Navbar from "@/layout/Navbar";
import CreateProduct from "@/pages/inventory/CreateProduct";
import OutletLayout from "@/layout/outlet";

function Approutes() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<OutletLayout />}>
            <Route path="/create-product" element={<CreateProduct />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Approutes;
