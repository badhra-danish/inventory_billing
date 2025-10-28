import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Router, Route, BrowserRouter, Routes } from "react-router-dom";
import AppSidebar from "@/layout/Sidebar";
import Navbar from "@/layout/Navbar";
import CreateProduct from "@/pages/inventory/CreateProduct";
import OutletLayout from "@/layout/outlet";
import ProductDataTablepage from "@/pages/inventory/Product";
import ProductDetails from "@/components/inventory/ProductDetail";
import CategoryPage from "@/pages/inventory/Category";
import SubCategorypage from "@/pages/inventory/SubCategory";
import BrandPage from "@/pages/inventory/Brand";
import UnitsPage from "@/pages/inventory/Units";

function Approutes() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<OutletLayout />}>
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/products" element={<ProductDataTablepage />} />
            <Route
              path="/product-detail/:product_id"
              element={<ProductDetails />}
            />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/sub-category" element={<SubCategorypage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/units" element={<UnitsPage />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Approutes;
