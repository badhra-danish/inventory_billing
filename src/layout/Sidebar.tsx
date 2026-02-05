import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  PackagePlus,
  OctagonAlert,
  TrendingDown,
  ChartBarStacked,
  Shapes,
  Cone,
  Boxes,
  ClipboardList,
  ShieldCheck,
  LayoutDashboard,
  Layers,
  SquareActivity,
  BadgeIndianRupee,
  ReceiptIndianRupee,
  Undo2,
  Handbag,
  ShoppingBag,
  Users,
  UserLock,
  User,
  AlignEndHorizontal,
  FileChartPie,
  PackageSearch,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";

// --- Menu Item Definitions ---
const DashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];
const InventoryItems = [
  { title: "Product", url: "/shop/products", icon: Box },
  { title: "Create Product", url: "/shop/create-product", icon: PackagePlus },
  { title: "Expired Product", url: "/shop/expired", icon: OctagonAlert },
  { title: "Low Stock", url: "/shop/lowscock", icon: TrendingDown },
  { title: "Category", url: "/shop/category", icon: Shapes },
  { title: "Sub Category", url: "/shop/sub-category", icon: ChartBarStacked },
  { title: "Brands", url: "/shop/brand", icon: Cone },
  { title: "Units", url: "/shop/units", icon: Boxes },
  { title: "Varient Attribute", url: "/shop/variant", icon: ClipboardList },
  { title: "Warranties", url: "/shop/warranties", icon: ShieldCheck },
];
const StockItems = [
  { title: "Stock", url: "/shop/manage-stock", icon: Layers },
  { title: "Manage Stock", url: "/shop/create-product", icon: SquareActivity },
];
const SalesItems = [
  { title: "Sales", url: "/shop/sales", icon: BadgeIndianRupee },
  { title: "Invoice", url: "/shop/invoices", icon: ReceiptIndianRupee },
  { title: "Sales Return", url: "/shop/sales-return", icon: Undo2 },
];
const PurchaseItem = [
  { title: "Purchase", url: "/shop/purchase", icon: Handbag },
  { title: "Purchase Order", url: "/shop/invoices", icon: ShoppingBag },
  { title: "Purchase Return", url: "/shop/sales-return", icon: Undo2 },
];
const PeoplesItem = [
  { title: "Customer", url: "/shop/customer", icon: Users },
  { title: "Supplier", url: "/shop/supplier", icon: UserLock },
  { title: "Employees", url: "/shop/sales-return", icon: User },
];
const ReportsItem = [
  { title: "Sales Report", url: "purchase", icon: AlignEndHorizontal },
  { title: "Purchase Report", url: "invoices", icon: FileChartPie },
  { title: "Inventory Report", url: "sales-return", icon: Cone },
  { title: "Invoice Report", url: "sales-return", icon: ReceiptIndianRupee },
  { title: "Product Report", url: "sales-return", icon: PackageSearch },
];
const AdminItems = [
  { title: "Dashboard", url: "purchase", icon: AlignEndHorizontal },
  { title: "Shops", url: "invoices", icon: FileChartPie },
  { title: "Analyst", url: "sales-return", icon: Cone },
  { title: "Users", url: "sales-return", icon: ReceiptIndianRupee },
];

const NavItem = ({ item }: { item: any }) => (
  <SidebarMenuItem key={item.title}>
    <NavLink to={item.url} className="w-full">
      {({ isActive }) => (
        <SidebarMenuButton
          className={`
            relative flex items-center gap-3 w-full px-3 py-5 rounded-md 
            transition-all duration-200 group overflow-hidden
            ${
              isActive
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
            }
          `}
        >
          {isActive && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
          )}

          <item.icon
            className={`
              w-[18px] h-[18px] transition-colors stroke-[2px]
              ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}
            `}
          />

          <span className="text-[14.5px] leading-none tracking-tight font-poppins">
            {item.title}
          </span>

          {isActive && (
            <div className="ml-auto opacity-90">
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            </div>
          )}
        </SidebarMenuButton>
      )}
    </NavLink>
  </SidebarMenuItem>
);

export default function AppSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 selection:bg-blue-100 dark:selection:bg-blue-900">
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-700 p-2 rounded-lg shadow-sm">
              <Boxes className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 dark:text-slate-100 tracking-tighter text-lg leading-none">
                SMART INV
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                Management System
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator className="mx-8 opacity-50 dark:opacity-20" />

        <SidebarContent className="px-2 py-2 custom-scrollbar transition-colors">
          {role === "SUPER_ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                System Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {AdminItems.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {role === "SHOP_ADMIN" && (
            <div className="space-y-6">
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">
                  Main
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {DashboardItems.map((item) => (
                      <NavItem key={item.title} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator className="m-0 opacity-50 dark:opacity-20" />

              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">
                  Inventory
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {InventoryItems.map((item) => (
                      <NavItem key={item.title} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator className="m-0 opacity-50 dark:opacity-20" />

              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">
                  Operations
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {[...StockItems, ...SalesItems, ...PurchaseItem].map(
                      (item) => (
                        <NavItem key={item.title} item={item} />
                      ),
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator className="m-0 opacity-50 dark:opacity-20" />

              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mt-1">
                  Directory
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {PeoplesItem.map((item) => (
                      <NavItem key={item.title} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator className="m-0 opacity-50 dark:opacity-20" />

              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mt-1">
                  Analytics
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {ReportsItem.map((item) => (
                      <NavItem key={item.title} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          )}
        </SidebarContent>

        <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <SidebarMenuButton
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
