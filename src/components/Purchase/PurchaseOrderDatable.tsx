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
  Trash,
  EllipsisVertical,
  RefreshCcw,
} from "lucide-react";

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

import { Badge } from "../ui/badge";
import { getAllPurchaseOrder } from "@/api/PurchaseOrder/PurchaseOrderClient";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { PurchaseOrderDetailsDialog } from "./PurchaseOrderDetail";
import { useNavigate } from "react-router-dom";

export interface Variant {
  product_variant_id: string;
  skuCode: string;
  price: number;
  variant_label: string;
  product: {
    productName: string;
  };
}

// ===============================
// Purchase Order Item
// ===============================
export interface PurchaseOrderItem {
  purchase_order_item_id: string;
  purchase_order_id: string;
  product_variant_id: string;
  quantity: number;
  received_quantity: number;
  unit_price: string; // coming as string from backend
  tax: string;
  tax_amount: string;
  discount: string;
  total_amount: string;
  shop_id: string;
  createdAt: string;
  updatedAt: string;
  variant: Variant;
}

// ===============================
// Supplier
// ===============================
export interface Supplier {
  supplierID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ===============================
// Warehouse
// ===============================
export interface Warehouse {
  warehouse_id: string;
  warehouseName: string;
}

export interface PurchaseOrder {
  purchase_order_id: string;
  po_number: string;
  supplier_id: string;
  warehouse_id: string;
  po_date: string;
  order_tax: string;
  discount_amt: string;
  shipping: string;
  sub_total: string;
  grand_total: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  shop_id: string;
  createdAt: string;
  updatedAt: string;
  supplier: Supplier;
  warehouse: Warehouse;
  items: PurchaseOrderItem[];
}

export default function PurchaseOrderDataTable() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  //const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);

  const [pageMetaData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    hasnextPage: false,
    hasPrevPage: false,
  });

  const [purchaseOrderData, setPurchaseOrderData] = React.useState<
    PurchaseOrder[]
  >([]);

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    React.useState<PurchaseOrder | null>(null);

  const [openPurchaseOrderDetail, setOpenPurchaseOrderDetail] =
    React.useState(false);

  const getAllPurchasaeOrders = async () => {
    try {
      const res = await getAllPurchaseOrder(page, 10);
      if (res.status == "OK") {
        setPurchaseOrderData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getAllPurchasaeOrders();
  }, []);

  const data: PurchaseOrder[] = purchaseOrderData;
  const columns: ColumnDef<PurchaseOrder>[] = [
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "po_number",
      header: () => <div className="text-left text-white">Order No</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left text-blue-600">
            {row.getValue("po_number")}
          </div>
        );
      },
    },
    {
      accessorKey: "supplierName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-white"
          >
            Supplier
            <ArrowUpDown />
          </Button>
        );
      },
      accessorFn: (row) => `${row.supplier.firstName} ${row.supplier.lastName}`,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <span className="capitalize font-bold">
              {row.getValue("supplierName")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "warehouseName",
      header: () => <div className="text-left text-white">Warehouse</div>,
      accessorFn: (row) => `${row.warehouse.warehouseName}`,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <span className="capitalize ">{row.getValue("warehouseName")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "po_date",
      header: () => <div className="text-left text-white">Order Date</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("po_date")}</div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => (
        <div className="text-left font-semibold text-white">Status</div>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status")).toUpperCase();

        // Professional semantic colors
        let color = "bg-gray-100 text-gray-700 border-gray-200";

        if (status === "APPROVED") {
          color = "bg-green-400 text-white border-green-200";
        } else if (status === "PENDING") {
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
      header: () => <div className="text-left text-white">Total Amt</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">
            {row.getValue("grand_total")}
          </div>
        );
      },
    },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const purchaseOrder = row.original;
        return (
          <div className="flex gap-2">
            <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="focus:bg-gray-100 data-[state=open]:bg-gray-100 p-1.5 rounded-md cursor-pointer transition-colors">
                  <EllipsisVertical className="w-4 h-4 text-gray-500" />
                </MenubarTrigger>
                <MenubarContent align="end" className="min-w-[180px]">
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedPurchaseOrder(purchaseOrder);
                      setOpenPurchaseOrderDetail(true);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    Purchase Details
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/shop/purchase_order/update/${purchaseOrder.purchase_order_id}`,
                      )
                    }
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    Edit Purchase Order
                  </MenubarItem>
                  <MenubarItem className="gap-2 text-gray-700 cursor-pointer">
                    <RefreshCcw className="w-4 h-4 text-gray-500" />
                    Convert to Purchase
                  </MenubarItem>
                  <MenubarSeparator />

                  <MenubarItem className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <Trash className="w-4 h-4" />
                    Delete Purchase
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
      {/*  Top Toolbar */}
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

          {/* <DropdownMenu>
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
          </DropdownMenu> */}

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Status: {selectedStatus}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter By Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {["All", "paid", "unpaid", "overdue"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    const statusColumn = table.getColumn("status");
                    if (statusColumn) {
                      statusColumn.setFilterValue(
                        status === "All" ? "" : status,
                      );
                    }
                  }}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🧾 Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-blue-500">
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
      <div className="flex items-center justify-between py-4 text-sm text-gray-600 dark:text-slate-400 transition-colors">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex items-center gap-3">
          <div className="font-bold font-">
            page {pageMetaData.currentPage} of {pageMetaData.totalPage}
          </div>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMetaData.hasPrevPage == false}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() =>
              setPage((p) => Math.min(pageMetaData.totalPage, p + 1))
            }
            disabled={pageMetaData.hasnextPage == false}
          >
            Next
          </Button>
        </div>
      </div>
      <PurchaseOrderDetailsDialog
        open={openPurchaseOrderDetail}
        onClose={() => setOpenPurchaseOrderDetail(false)}
        purchaseOrder={selectedPurchaseOrder}
      />
    </div>
  );
}
