import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
  Menu,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarMenuAction,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items.
const InventoryItems = [
  {
    title: "Product",
    url: "/products",
    icon: Box,
  },
  {
    title: "Create Product",
    url: "create-product",
    icon: PackagePlus,
  },
  {
    title: "Expired Product",
    url: "/expired",
    icon: OctagonAlert,
  },
  {
    title: "Low Stock",
    url: "/lowscock",
    icon: TrendingDown,
  },
  {
    title: "Category",
    url: "/category",
    icon: Shapes,
  },
  {
    title: "Sub Category",
    url: "/sub-category",
    icon: ChartBarStacked,
  },
  {
    title: "Brands",
    url: "/brand",
    icon: Cone,
  },
  {
    title: "Units",
    url: "/units",
    icon: Boxes,
  },
  {
    title: "Varient Attribute",
    url: "/variant",
    icon: ClipboardList,
  },
  {
    title: "Warranties",
    url: "/warranties",
    icon: ShieldCheck,
  },
];

const StockItems = [
  {
    title: "Stock",
    url: "/manage-stock",
    icon: Layers,
  },
  {
    title: "Manage Stock",
    url: "create-product",
    icon: SquareActivity,
  },
];

const SalesItems = [
  {
    title: "Sales",
    url: "sales",
    icon: BadgeIndianRupee,
  },
  {
    title: "Invoice",
    url: "invoices",
    icon: ReceiptIndianRupee,
  },
  {
    title: "Sales Return",
    url: "sales-return",
    icon: Undo2,
  },
];
const PurchaseItem = [
  {
    title: "Purchase",
    url: "purchase",
    icon: Handbag,
  },
  {
    title: "Purchase Order",
    url: "invoices",
    icon: ShoppingBag,
  },
  {
    title: "Purchase Return",
    url: "sales-return",
    icon: Undo2,
  },
];
const PeoplesItem = [
  {
    title: "Customer",
    url: "purchase",
    icon: Users,
  },
  {
    title: "Supplier",
    url: "invoices",
    icon: UserLock,
  },
  {
    title: "Employees",
    url: "sales-return",
    icon: User,
  },
];
const ReportsItem = [
  {
    title: "Sales Report",
    url: "purchase",
    icon: AlignEndHorizontal,
  },
  {
    title: "Purchase Report",
    url: "invoices",
    icon: FileChartPie,
  },
  {
    title: "Inventory Report",
    url: "sales-return",
    icon: Cone,
  },
  {
    title: "Invoice Report",
    url: "sales-return",
    icon: ReceiptIndianRupee,
  },
  {
    title: "Product Report",
    url: "sales-return",
    icon: PackageSearch,
  },
];
export default function AppSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div>STAR HARDWARE</div>

            {/* <div onClick={() => setOpen((o) => !o)}>
              <Menu />
            </div> */}
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-base">
                    <LayoutDashboard />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              INVENTORY
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {InventoryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}

                {/* 
            
            
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <LayoutDashboard />
                      Dashboard
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <SidebarMenuAction>
                    <ChevronDown />
                  </SidebarMenuAction>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>child 1</SidebarMenuSubItem>
                      <SidebarMenuSubItem>child 2</SidebarMenuSubItem>
                      <SidebarMenuSubItem>child 3</SidebarMenuSubItem>
                      <SidebarMenuSubItem>child 4</SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible> */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              STOCK
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {StockItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              SALES
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SalesItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              PURCHASE
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PurchaseItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              PEOPLE
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PeoplesItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-500 font-bold">
              REPORTS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ReportsItem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-md h-9 text-base ${
                            isActive
                              ? "bg-primary font-medium text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
