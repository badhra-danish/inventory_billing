import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
  EllipsisVertical,
  ReceiptIndianRupee,
  ReceiptIndianRupeeIcon,
  BadgeIndianRupee,
  CirclePlus,
  Type,
  Calendar,
  FastForward,
  KanbanSquareDashed,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
// import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import trashImg from "../../assets/images/trash.jpg";
import custImg from "../../assets/images/customer.jpg";
import { Badge } from "../ui/badge";
import { getAllSalesInfo } from "@/api/Sales/SalesClient";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { CreatePaymentDialog } from "./CreatePayment";
import { SalesDetailsDialog } from "./SalesDetail";
import { ShowPaymentDetail } from "./ShowPayment";
import EditSales from "./EditSale";
import { useNavigate } from "react-router-dom";
//
export type CustomerDetail = {
  customer_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: Location;
  status: "ACTIVE" | "INACTIVE";
};
export type Location = {
  city: string;
  state: string;
  postalCode: string;
};

export type SalesItemDetail = {
  sales_item_id: string;
  product_variant_id: string;
  warehouse_id: string;

  quantity: number;
  discount: number;
  tax: number;
  tax_amount: number;
  total: number;

  variant: {
    skuCode: string | null;
    variant_label: string | null;
    price: number | null;
    productName: string | null;
  };
};

export type SalesDetail = {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
  sub_total: number;
  order_tax: number;
  shipping: number;
  discount: number;
  status: "INPROGRESS" | "COMPLETED" | "CANCELLED";

  grand_total: number;
  paid_amount: number;
  due_amount: number;

  payment_status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "OVERDUE";

  customer: CustomerDetail | null;

  sales_items: SalesItemDetail[];
};

export default function SalesDataTable() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  /// --sales Details State --//

  const [page, setPage] = React.useState(1);
  const [salesData, setSalesData] = React.useState<SalesDetail[]>([]);
  const [pageMetaData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    hasnextPage: false,
    hasPrevPage: false,
  });
  const getAllSales = async () => {
    try {
      const res = await getAllSalesInfo(page, 10);
      if (res.status === "OK") {
        setSalesData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [openCreatePayment, setOpenCreatePayment] = React.useState(false);
  const [openShowPayment, setOpenShowPayment] = React.useState(false);
  const [openSalesDetail, SetOpenSalesDetail] = React.useState(false);
  const [openEditSale, SetOpenEditSale] = React.useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesDetail | null>(null);
  useEffect(() => {
    if (!openCreatePayment && !openShowPayment) {
      getAllSales();
    }
  }, [page, openCreatePayment, openShowPayment]);

  const data: SalesDetail[] = salesData;
  // const columns: ColumnDef<SalesDetail>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },

  //   {
  //     accessorKey: "customer",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Product Name
  //           <ArrowUpDown />
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       const sales = row.original;
  //       return (
  //         <div className="flex items-center gap-3">
  //           {/* Customer Image */}

  //           {/* Customer Name */}
  //           <span className="capitalize font-bold">
  //             {sales.firstName}-{sales.lastName}
  //           </span>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "invoice_no",
  //     header: () => <div className="text-left">Refrence</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="capitalize text-left ">
  //           {row.getValue("invoice_no")}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "sale_date",
  //     header: () => <div className="text-left">Date</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className=" text-left capitalize">
  //           {row.getValue("sale_date")}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "status",
  //     header: () => <div className="text-left">Status</div>,
  //     cell: ({ row }) => {
  //       const status = String(row.getValue("status")).toUpperCase();

  //       let color = "bg-gray-500";
  //       let label = status;

  //       if (status === "COMPLETED") {
  //         color = "bg-green-400";
  //       } else if (status === "INPROGRESS") {
  //         color = "bg-blue-400";
  //       } else if (status === "CANCELLED") {
  //         color = "bg-red-400 ";
  //       }
  //       return (
  //         <div className="flex justify-start">
  //           <Badge
  //             className={`
  //     ${color}
  //     flex items-center gap-1.5
  //     px-2.5 py-1.5
  //     rounded-lg
  //     font-bold
  //     text-[10px]
  //     uppercase
  //     tracking-wider
  //     border
  //     transition-all
  //     hover:opacity-80
  //   `}
  //           >
  //             {/* Clean Status Dot */}
  //             <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-current shadow-[0_0_4px_rgba(0,0,0,0.1)]" />

  //             <span className="truncate">{label}</span>
  //           </Badge>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "grand_total",
  //     header: () => <div className="text-left">Total</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="lowercase text-left">
  //           ₹{row.getValue("grand_total")}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "paid_amount",
  //     header: () => <div className="text-left">Paid</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="lowercase text-left">
  //           ₹{row.getValue("paid_amount")}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "due_amount",
  //     header: () => <div className="text-left">Due</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="lowercase text-left">
  //           ₹{row.getValue("due_amount")}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "payment_status",
  //     header: () => <div className="text-left">Payment Status</div>,
  //     cell: ({ row }) => {
  //       const status = String(row.getValue("payment_status")).toLowerCase();

  //       let color = "bg-gray-500";
  //       let label = status;

  //       if (status === "paid") {
  //         color = "bg-green-100 text-green-400 ";
  //       } else if (status === "partially_paid") {
  //         color = "bg-yellow-50 text-yellow-400";
  //       } else if (status === "unpaid") {
  //         color = "bg-red-50 text-red-400";
  //       }
  //       return (
  //         <div className="flex justify-start items-center">
  //           <Badge
  //             className={`
  //     ${color}
  //     px-2.5 py-2
  //     rounded-xs
  //     capitalize
  //     font-bold
  //     text-[12px]
  //     tracking-wide
  //     flex items-center
  //     gap-2
  //     border-none
  //     shadow-sm
  //     transition-all
  //     hover:brightness-95
  //   `}
  //           >
  //             {/* Status Dot with Pulse Effect */}
  //             <span className="relative flex h-2 w-2">
  //               {/* Optional: Add 'animate-ping' here if the status is "Active" or "Online" */}
  //               <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
  //               <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
  //             </span>

  //             <span className="leading-none select-none">{label}</span>
  //           </Badge>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     id: "actions",
  //     // header: () => <div className="text-left">Action</div>,
  //     cell: () => {
  //       //const product = row.original;
  //       return (
  //         <div>
  //           <Menubar className="border-0 bg-transparent shadow-none">
  //             <MenubarMenu>
  //               <MenubarTrigger>
  //                 <EllipsisVertical className="w-5 h-5 hover:text-blue-600" />
  //               </MenubarTrigger>
  //               <MenubarContent>
  //                 <MenubarItem>
  //                   {" "}
  //                   <Eye />
  //                   Sales Details
  //                 </MenubarItem>
  //                 <MenubarItem>
  //                   <Edit />
  //                   Edit Sales
  //                 </MenubarItem>
  //                 <MenubarSeparator />
  //                 <MenubarItem>
  //                   <CirclePlus />
  //                   Create Payment
  //                 </MenubarItem>
  //                 <MenubarItem>
  //                   <BadgeIndianRupee />
  //                   Show Payment
  //                 </MenubarItem>
  //                 <MenubarSeparator />
  //                 <MenubarItem>
  //                   <Trash />
  //                   Delete Sales
  //                 </MenubarItem>
  //               </MenubarContent>
  //             </MenubarMenu>
  //           </Menubar>
  //         </div>
  //       );
  //     },
  //   },
  // ];
  const columns: ColumnDef<SalesDetail>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-8 data-[state=open]:bg-accent hover:bg-gray-100"
          >
            <span>Product Name</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sales = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* Avatar Placeholder if needed */}
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
              {sales.customer?.firstName?.[0]}
              {sales.customer?.lastName?.[0]}
            </div>

            <span className="capitalize font-semibold text-gray-900 truncate max-w-[150px]">
              {sales.customer?.firstName} {sales.customer?.lastName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "invoice_no",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Reference</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium text-gray-700 font-mono text-xs">
            {row.getValue("invoice_no")}
          </div>
        );
      },
    },
    {
      accessorKey: "sale_date",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Date</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-left text-gray-500 text-sm">
            {row.getValue("sale_date")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Status</div>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status")).toUpperCase();

        // Professional semantic colors
        let color = "bg-gray-100 text-gray-700 border-gray-200";

        if (status === "COMPLETED") {
          color = "bg-green-400 text-white border-green-200";
        } else if (status === "INPROGRESS") {
          color = "bg-blue-500 text-white border-blue-200";
        } else if (status === "CANCELLED") {
          color = "bg-red-200 text-white border-red-200";
        }

        const label = status.replace("_", " ");

        return (
          <div className="flex justify-start">
            <Badge
              className={`
              ${color} 
              flex items-center gap-1.5 
              pl-3 pr-3.5 py-1.5   
              rounded-lg 
              font-bold 
              text-[10px] 
              uppercase 
              tracking-wider
              border
              shadow-sm
              transition-all
              hover:opacity-90
            `}
            >
              {/* Dot Indicator */}
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
              </span>

              <span className="truncate">{label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "grand_total",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Total</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium tabular-nums text-gray-900">
            ₹{row.getValue("grand_total")}
          </div>
        );
      },
    },
    {
      accessorKey: "paid_amount",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Paid</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium tabular-nums text-green-600">
            ₹{row.getValue("paid_amount")}
          </div>
        );
      },
    },
    {
      accessorKey: "due_amount",
      header: () => (
        <div className="text-left font-semibold text-gray-600">Due</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium tabular-nums text-red-500">
            ₹{row.getValue("due_amount")}
          </div>
        );
      },
    },
    {
      accessorKey: "payment_status",
      header: () => (
        <div className="text-left font-semibold text-gray-600">
          Payment Status
        </div>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("payment_status")).toLowerCase();

        let color = "bg-gray-100 text-gray-600 border-gray-200";

        if (status === "paid") {
          color = "bg-emerald-200 text-emerald-700 border-emerald-200";
        } else if (status === "partially_paid") {
          color = "bg-amber-50 text-amber-700 border-amber-200";
        } else if (status === "unpaid") {
          color = "bg-rose-100 text-rose-700 border-rose-200";
        }

        const label = status.replace("_", " ");

        return (
          <div className="flex justify-start items-center">
            <Badge
              className={`
              ${color} 
              pl-3 pr-3.5 py-2 
              rounded-lg 
              capitalize 
              font-semibold 
              text-[11px] 
              tracking-wide
              flex items-center 
              gap-1.5
              border
              shadow-sm
            `}
            >
              {/* Static Dot for payment status */}
              <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
              <span className="leading-none">{label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sales = row.original;
        return (
          <div className="flex justify-end">
            <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="focus:bg-gray-100 data-[state=open]:bg-gray-100 p-1.5 rounded-md cursor-pointer transition-colors">
                  <EllipsisVertical className="w-4 h-4 text-gray-500" />
                </MenubarTrigger>
                <MenubarContent align="end" className="min-w-[180px]">
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedSale(sales);
                      SetOpenSalesDetail(true);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    Sales Details
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/shop/sales/update/${sales.sale_id}`)
                    }
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    Edit Sales
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedSale(sales);
                      setOpenCreatePayment(true);
                    }}
                    disabled={Number(sales.due_amount) <= 0}
                  >
                    <CirclePlus className="w-4 h-4 text-blue-500" />
                    Create Payment
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedSale(sales);
                      setOpenShowPayment(true);
                    }}
                  >
                    <BadgeIndianRupee className="w-4 h-4 text-green-500" />
                    Show Payment
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <Trash className="w-4 h-4" />
                    Delete Sales
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter, // add this
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full bg-white rounded-md shadow-md p-4">
      {/* 🔍 Top Toolbar */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search....."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-gray-300 focus-visible:ring-gray-500"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Category: {selectedCategory}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                "All",
                "Wood & Boards",
                "Hardware",
                "Finishing",
                "Plastic Boards",
                "Adhesives",
              ].map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const categoryColumn = table.getColumn("category");
                    if (categoryColumn) {
                      categoryColumn.setFilterValue(cat === "All" ? "" : cat);
                    }
                  }}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Brand: {selectedBrand} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter By Brand
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                "All",
                "GreenPly",
                "Century",
                "Taparia",
                "Alstone",
                "Pidilite",
              ].map((brand) => (
                <DropdownMenuItem
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const brandColumn = table.getColumn("brand");
                    if (brandColumn) {
                      brandColumn.setFilterValue(brand === "All" ? "" : brand);
                    }
                  }}
                >
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🧾 Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-gray-800  tracking-wide px-4 py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors capitalize"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700 capitalize"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500 capitalize"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <CreatePaymentDialog
        open={openCreatePayment}
        onClose={() => setOpenCreatePayment(false)}
        sales={selectedSale}
        payment={null}
      />
      <SalesDetailsDialog
        open={openSalesDetail}
        onClose={() => SetOpenSalesDetail(false)}
        sales={selectedSale}
      />
      <ShowPaymentDetail
        open={openShowPayment}
        onClose={() => setOpenShowPayment(false)}
        sales={selectedSale}
      />
    </div>
  );
}
