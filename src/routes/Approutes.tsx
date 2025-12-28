import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Router, Route, BrowserRouter, Routes } from "react-router-dom";
import AppSidebar from "@/layout/Sidebar";
import Navbar from "@/layout/Navbar";
import Dashboard from "@/pages/Dashbord/Dashboard";
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
import AddSales from "@/pages/Sales/AddSales";
import AddSalesReturn from "@/pages/Sales/AddSalesReturn";
import SalesReturn from "@/pages/Sales/SalesReturn";
import Invoives from "@/pages/Sales/Invoives";
import { Purchase } from "@/pages/Purchase/purchase";
import AddPurchase from "@/pages/Purchase/AddPurchase";
import { Customer } from "@/pages/People/Customer";
import { Suppliers } from "@/pages/People/Supplier";

function Approutes() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<OutletLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
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

            {/* Stock Manage Sales. */}
            <Route path="/manage-stock" element={<StockMangepage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales-return" element={<SalesReturn />} />
            <Route path="/add-sales" element={<AddSales />} />
            <Route path="/add-sales-return" element={<AddSalesReturn />} />
            <Route path="/invoices" element={<Invoives />} />

            {/* Purchase , order , return*/}
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/add-purchase" element={<AddPurchase />} />

            {/* Customer  ,supplier ,Employees*/}
            <Route path="/customer" element={<Customer />} />
            <Route path="/supplier" element={<Suppliers />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default Approutes;
