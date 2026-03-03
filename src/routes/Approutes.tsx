// import { Route, BrowserRouter, Routes } from "react-router-dom";
//
// import Dashboard from "@/pages/Dashbord/Dashboard";
// import CreateProduct from "@/pages/inventory/CreateProduct";
// import OutletLayout from "@/layout/outlet";
// import ProductDataTablepage from "@/pages/inventory/Product";
// import ProductDetails from "@/components/inventory/ProductDetail";
// import CategoryPage from "@/pages/inventory/Category";
// import SubCategorypage from "@/pages/inventory/SubCategory";
// import BrandPage from "@/pages/inventory/Brand";
// import UnitsPage from "@/pages/inventory/Units";
// import VariantPage from "@/pages/inventory/Variant";
// import WarrantiesPage from "@/pages/inventory/Warranties";
// import StockMangepage from "@/pages/stock/StockMange";
// import Sales from "@/pages/Sales/Sales";
// import AddSales from "@/pages/Sales/AddSales";
// import AddSalesReturn from "@/pages/Sales/AddSalesReturn";
// import SalesReturn from "@/pages/Sales/SalesReturn";
// import Invoives from "@/pages/Sales/Invoives";
// import { Purchase } from "@/pages/Purchase/purchase";
// import AddPurchase from "@/pages/Purchase/AddPurchase";
// import { Customer } from "@/pages/People/Customer";
// import { Suppliers } from "@/pages/People/Supplier";
// import EditSales from "@/components/Sales/EditSale";
// import Invoice from "@/components/Sales/Invoice";
// import WareHouse from "@/pages/People/WareHouse";
// import SignIn from "@/components/Login/login";
// import PrivateRoute from "./PrivateRoutes";
// import ProtectedLayout from "./ProtectedLayout";
// import RoleRedirect from "./IndexRedirect";
// import { PurchaseOrder } from "@/pages/Purchase/purchaseOrder";
// import AddPurchaseOrder from "@/pages/Purchase/AddPurchaseOrder";
// function Approutes() {
//   return (
//     <BrowserRouter>
//       <main>
//         <Routes>
//           <Route path="/" element={<RoleRedirect />} />
//           <Route path="/login" element={<SignIn />} />
//           <Route element={<ProtectedLayout roles={["SUPER_ADMIN"]} />}>
//             <Route element={<OutletLayout />}>
//               <Route path="/super/dashboard" element={<Dashboard />} />
//               <Route path="/super/create-product" element={<CreateProduct />} />
//               <Route
//                 path="/super/products"
//                 element={<ProductDataTablepage />}
//               />
//               <Route
//                 path="/super/product-detail/:product_id"
//                 element={<ProductDetails />}
//               />
//               <Route path="/super/category" element={<CategoryPage />} />
//               <Route path="/super/sub-category" element={<SubCategorypage />} />
//               <Route path="/super/brand" element={<BrandPage />} />
//               <Route path="/super/units" element={<UnitsPage />} />
//               <Route path="/super/variant" element={<VariantPage />} />
//               <Route path="/super/warranties" element={<WarrantiesPage />} />
//
//               {/* Stock Manage Sales. */}
//               <Route path="/super/manage-stock" element={<StockMangepage />} />
//               <Route path="/super/sales" element={<Sales />} />
//               <Route path="/super/sales-return" element={<SalesReturn />} />
//               <Route path="/super/add-sales" element={<AddSales />} />
//               <Route
//                 path="/super/add-sales-return"
//                 element={<AddSalesReturn />}
//               />
//               <Route path="/super/invoices" element={<Invoives />} />
//               <Route
//                 path="/super/sales/update/:sale_id"
//                 element={<EditSales />}
//               />
//               <Route
//                 path="/super/sales/invoice/:sale_id"
//                 element={<Invoice />}
//               />
//               {/* Purchase , order , return*/}
//               <Route path="/super/purchase" element={<Purchase />} />
//               <Route path="/super/add-purchase" element={<AddPurchase />} />
//
//               {/* Customer  ,supplier ,Employees*/}
//               <Route path="/super/customer" element={<Customer />} />
//               <Route path="/super/supplier" element={<Suppliers />} />
//
//               {/* Only super admin things */}
//               {/* <Route path="/super/shops" element={<ShopsPage />} />
//               <Route path="/super/shop-admins" element={<ShopAdminsPage />} /> */}
//             </Route>
//           </Route>
//
//           {/* ================= SHOP ADMIN ================= */}
//
//           <Route element={<ProtectedLayout roles={["SHOP_ADMIN"]} />}>
//             <Route element={<OutletLayout />}>
//               <Route path="/shop/dashboard" element={<Dashboard />} />
//               <Route path="/shop/create-product" element={<CreateProduct />} />
//               <Route path="/shop/products" element={<ProductDataTablepage />} />
//               <Route
//                 path="/shop/product-detail/:product_id"
//                 element={<ProductDetails />}
//               />
//               <Route path="/shop/category" element={<CategoryPage />} />
//               <Route path="/shop/sub-category" element={<SubCategorypage />} />
//               <Route path="/shop/brand" element={<BrandPage />} />
//               <Route path="/shop/units" element={<UnitsPage />} />
//               <Route path="/shop/variant" element={<VariantPage />} />
//               <Route path="/shop/warranties" element={<WarrantiesPage />} />
//
//               {/* Stock Manage Sales. */}
//               <Route path="/shop/manage-stock" element={<StockMangepage />} />
//               <Route path="/shop/sales" element={<Sales />} />
//               <Route path="/shop/sales-return" element={<SalesReturn />} />
//               <Route path="/shop/warehouse" element={<WareHouse />} />
//
//               <Route path="/shop/add-sales" element={<AddSales />} />
//               <Route
//                 path="/shop/add-sales-return"
//                 element={<AddSalesReturn />}
//               />
//               <Route path="/shop/invoices" element={<Invoives />} />
//               <Route
//                 path="/shop/sales/update/:sale_id"
//                 element={<EditSales />}
//               />
//               <Route
//                 path="/shop/sales/invoice/:sale_id"
//                 element={<Invoice />}
//               />
//               {/* Purchase , order , return*/}
//               <Route path="/shop/purchase" element={<Purchase />} />
//               <Route path="/shop/add-purchase" element={<AddPurchase />} />
//               <Route path="/shop/purchase_order" element={<PurchaseOrder />} />
//               <Route
//                 path="/shop/add_purchase_order"
//                 element={<AddPurchaseOrder />}
//               />
//
//               {/* Customer  ,supplier ,Employees*/}
//               <Route path="/shop/customer" element={<Customer />} />
//               <Route path="/shop/supplier" element={<Suppliers />} />
//             </Route>
//           </Route>
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }
//
// export default Approutes;


import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedLayout from "./ProtectedLayout";
import OutletLayout from "@/layout/outlet";
import RoleRedirect from "./IndexRedirect";
import SignIn from "@/components/Login/login";
import Loader from "@/components/commen/loader.tsx";


// 🔥 Lazy Imports
const Dashboard = lazy(() => import("@/pages/Dashbord/Dashboard"));
const CreateProduct = lazy(() => import("@/pages/inventory/CreateProduct"));
const ProductDataTablepage = lazy(() =>
    import("@/pages/inventory/Product")
);
const ProductDetails = lazy(() =>
    import("@/components/inventory/ProductDetail")
);
const CategoryPage = lazy(() => import("@/pages/inventory/Category"));
const SubCategorypage = lazy(() =>
    import("@/pages/inventory/SubCategory")
);
const BrandPage = lazy(() => import("@/pages/inventory/Brand"));
const UnitsPage = lazy(() => import("@/pages/inventory/Units"));
const VariantPage = lazy(() => import("@/pages/inventory/Variant"));
const WarrantiesPage = lazy(() =>
    import("@/pages/inventory/Warranties")
);
const StockMangepage = lazy(() =>
    import("@/pages/stock/StockMange")
);

const Sales = lazy(() => import("@/pages/Sales/Sales"));
const AddSales = lazy(() => import("@/pages/Sales/AddSales"));
const AddSalesReturn = lazy(() =>
    import("@/pages/Sales/AddSalesReturn")
);
const SalesReturn = lazy(() =>
    import("@/pages/Sales/SalesReturn")
);
const Invoives = lazy(() => import("@/pages/Sales/Invoives"));
const EditSales = lazy(() =>
    import("@/components/Sales/EditSale")
);
const Invoice = lazy(() =>
    import("@/components/Sales/Invoice")
);

const Purchase = lazy(() => import("@/pages/Purchase/purchase"));
const AddPurchase = lazy(() =>
    import("@/pages/Purchase/AddPurchase")
);
const PurchaseOrder = lazy(() =>
    import("@/pages/Purchase/purchaseOrder.tsx")
);
const AddPurchaseOrder = lazy(() =>
    import("@/pages/Purchase/AddPurchaseOrder")
);

const EditPurchaseOrder = lazy(() =>
    import("@/components/Purchase/PurchaseOrderEdit.tsx")
);

const Customer = lazy(() => import("@/pages/People/Customer.tsx"));
const Suppliers = lazy(() => import("@/pages/People/Supplier"));
const WareHouse = lazy(() => import("@/pages/People/WareHouse"));

function Approutes() {
  return (
      <BrowserRouter>
        <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
             <Loader/>
              </div>
            }
        >
          <main>
            <Routes>
              <Route path="/" element={<RoleRedirect />} />
              <Route path="/login" element={<SignIn />} />

              {/* SUPER ADMIN */}
              <Route element={<ProtectedLayout roles={["SUPER_ADMIN"]} />}>
                <Route element={<OutletLayout />}>
                  <Route path="/super/dashboard" element={<Dashboard />} />
                  <Route path="/super/create-product" element={<CreateProduct />} />
                  <Route path="/super/products" element={<ProductDataTablepage />} />
                  <Route path="/super/product-detail/:product_id" element={<ProductDetails />} />
                  <Route path="/super/category" element={<CategoryPage />} />
                  <Route path="/super/sub-category" element={<SubCategorypage />} />
                  <Route path="/super/brand" element={<BrandPage />} />
                  <Route path="/super/units" element={<UnitsPage />} />
                  <Route path="/super/variant" element={<VariantPage />} />
                  <Route path="/super/warranties" element={<WarrantiesPage />} />
                  <Route path="/super/manage-stock" element={<StockMangepage />} />
                  <Route path="/super/sales" element={<Sales />} />
                  <Route path="/super/sales-return" element={<SalesReturn />} />
                  <Route path="/super/add-sales" element={<AddSales />} />
                  <Route path="/super/add-sales-return" element={<AddSalesReturn />} />
                  <Route path="/super/invoices" element={<Invoives />} />
                  <Route path="/super/sales/update/:sale_id" element={<EditSales />} />
                  <Route path="/super/sales/invoice/:sale_id" element={<Invoice />} />
                  <Route path="/super/purchase" element={<Purchase />} />
                  <Route path="/super/add-purchase" element={<AddPurchase />} />
                  <Route path="/super/customer" element={<Customer />} />
                  <Route path="/super/supplier" element={<Suppliers />} />
                </Route>
              </Route>

              {/* SHOP ADMIN */}
              <Route element={<ProtectedLayout roles={["SHOP_ADMIN"]} />}>
                <Route element={<OutletLayout />}>
                  <Route path="/shop/dashboard" element={<Dashboard />} />
                  <Route path="/shop/create-product" element={<CreateProduct />} />
                  <Route path="/shop/products" element={<ProductDataTablepage />} />
                  <Route path="/shop/product-detail/:product_id" element={<ProductDetails />} />
                  <Route path="/shop/category" element={<CategoryPage />} />
                  <Route path="/shop/sub-category" element={<SubCategorypage />} />
                  <Route path="/shop/brand" element={<BrandPage />} />
                  <Route path="/shop/units" element={<UnitsPage />} />
                  <Route path="/shop/variant" element={<VariantPage />} />
                  <Route path="/shop/warranties" element={<WarrantiesPage />} />
                  <Route path="/shop/manage-stock" element={<StockMangepage />} />
                  <Route path="/shop/sales" element={<Sales />} />
                  <Route path="/shop/sales-return" element={<SalesReturn />} />
                  <Route path="/shop/warehouse" element={<WareHouse />} />
                  <Route path="/shop/add-sales" element={<AddSales />} />
                  <Route path="/shop/add-sales-return" element={<AddSalesReturn />} />
                  <Route path="/shop/invoices" element={<Invoives />} />
                  <Route path="/shop/sales/update/:sale_id" element={<EditSales />} />
                  <Route path="/shop/sales/invoice/:sale_id" element={<Invoice />} />
                  <Route path="/shop/purchase" element={<Purchase />} />
                  <Route path="/shop/add-purchase" element={<AddPurchase />} />
                  <Route path="/shop/purchase_order" element={<PurchaseOrder />} />
                  <Route path="/shop/add_purchase_order" element={<AddPurchaseOrder />} />
                  <Route path="/shop/purchase_order/update/:purchase_order_id" element={<EditPurchaseOrder />} />
                  <Route path="/shop/customer" element={<Customer />} />
                  <Route path="/shop/supplier" element={<Suppliers />} />
                </Route>
              </Route>
            </Routes>
          </main>
        </Suspense>
      </BrowserRouter>
  );
}

export default Approutes;
