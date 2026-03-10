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
import { useNavigate, useNavigation } from "react-router-dom";
import { getAllPurchase } from "@/api/PurchaseOrder/PurchaseClient";
import { PurchaseDetailsDialog } from "./PurchaseDetail";
import { CreatePurchasePaymentDialog } from "./CreatePaymentPurchase";
import { ShowPaymentDetail } from "./ShowPaymentPurchase";

export interface Purchase {
  purchase_id: string;
  reference_no: string;
  purchase_date: string;
  status: "PENDING" | "ORDERED" | "RECEIVED" | "PARTIAL";
  grand_total: string;
  order_tax: string;
  shipping: string;
  discount: string;
  paid_amount: string;
  due_amount: string;
  payment_status: "UNPAID" | "PAID" | "PARTIALLY_PAID";
  warehouse_id: string;

  supplier: Supplier;
  purchase_items: PurchaseItem[];
}

export interface Supplier {
  supplierID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: Location;
  shop_id: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PurchaseItem {
  product_variant_id: string;
  quantity: number;
  discount: number;
  tax: number;
  tax_amount: string;
  total: string;
  variant: Variant;
}

export interface Variant {
  skuCode: string;
  variant_label: string;
  price: number;
  productName: string;
}

export default function PurchaseDataTable() {
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

  const [purchaseData, setPurchaseData] = React.useState<Purchase[]>([]);

  const [selectedPurchase, setSelectedPurchase] =
    React.useState<Purchase | null>(null);

  const [openPurchaseDetail, setOpenPurchaseDetail] = React.useState(false);
  const [openCreatePurchasePayment, setOpenCreatePurchasePayment] =
    React.useState(false);
  const [openShowPurchasePayment, setOpenShowPurchasePayment] =
    React.useState(false);
  const getAllPurchasaeInfo = async () => {
    try {
      const res = await getAllPurchase(page, 10);
      if (res.status == "OK") {
        setPurchaseData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!openCreatePurchasePayment && !openShowPurchasePayment) {
      getAllPurchasaeInfo();
    }
  }, [page, openCreatePurchasePayment, openShowPurchasePayment]);
  React.useEffect(() => {
    getAllPurchasaeInfo();
  }, []);

  const data: Purchase[] = purchaseData;
  const columns: ColumnDef<Purchase>[] = [
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
      accessorKey: "reference_no",
      header: () => <div className="text-left text-white">Refrence No</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left text-blue-600">
            {row.getValue("reference_no")}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "warehouseName",
    //   header: () => <div className="text-left text-white">Warehouse</div>,
    //   accessorFn: (row) => `${row.warehouse.warehouseName}`,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex items-center gap-3">
    //         <span className="capitalize ">{row.getValue("warehouseName")}</span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "purchase_date",
      header: () => <div className="text-left text-white">Purchase Date</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("purchase_date")}
          </div>
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
      accessorKey: "paid_amount",
      header: () => (
        <div className="text-left font-semibold text-white">Paid</div>
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
        <div className="text-left font-semibold text-white">Due</div>
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
        <div className="text-left font-semibold text-white">Payment Status</div>
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
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const purchase = row.original;
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
                      setSelectedPurchase(purchase);
                      setOpenPurchaseDetail(true);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    Purchase Details
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/shop/purchase/update/${purchase.purchase_id}`)
                    }
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    Edit Purchase
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setOpenCreatePurchasePayment(true);
                    }}
                    disabled={Number(purchase.due_amount) <= 0}
                  >
                    <CirclePlus className="w-4 h-4 text-blue-500" />
                    Create Payment
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setOpenShowPurchasePayment(true);
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
      <PurchaseDetailsDialog
        open={openPurchaseDetail}
        onClose={() => setOpenPurchaseDetail(false)}
        purchase={selectedPurchase}
      />
      <CreatePurchasePaymentDialog
        open={openCreatePurchasePayment}
        onClose={() => setOpenCreatePurchasePayment(false)}
        purchase={selectedPurchase}
        payment={null}
      />
      <ShowPaymentDetail
        onClose={() => setOpenShowPurchasePayment(false)}
        open={openShowPurchasePayment}
        purchase={selectedPurchase}
      />
    </div>
  );
}
