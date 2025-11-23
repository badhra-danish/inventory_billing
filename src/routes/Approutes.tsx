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
import VariantPage from "@/pages/inventory/Variant";
import WarrantiesPage from "@/pages/inventory/Warranties";
import StockMangepage from "@/pages/stock/StockMange";
import Sales from "@/pages/Sales/Sales";
import Invoives from "@/pages/Sales/Invoives";
import SalesReturn from "@/pages/Sales/SalesReturn";
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
            <Route path="/variant" element={<VariantPage />} />
            <Route path="/warranties" element={<WarrantiesPage />} />

            {/* Stock Manage */}
            <Route path="/manage-stock" element={<StockMangepage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales-return" element={<SalesReturn />} />
            <Route path="/invoices" element={<Invoives />} />
            {/* Sales Invoices*/}
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Approutes;
