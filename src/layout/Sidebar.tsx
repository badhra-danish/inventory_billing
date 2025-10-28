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
    url: "#",
    icon: OctagonAlert,
  },
  {
    title: "Low Stock",
    url: "#",
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
    url: "#",
    icon: ClipboardList,
  },
  {
    title: "Warranties",
    url: "#",
    icon: ShieldCheck,
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
            <div>ERP</div>

            <div onClick={() => setOpen((o) => !o)}>
              <Menu />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
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
            <SidebarGroupLabel>Inventory</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {InventoryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-base">
                      <NavLink key={item.title} to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
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
              <SidebarSeparator />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Stock</SidebarGroupLabel>
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
