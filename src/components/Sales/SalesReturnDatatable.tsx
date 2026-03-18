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
  CirclePlus,
  Edit,
  EllipsisVertical,
  Eye,
  Trash,
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
//import trashImg from "../../assets/images/trash.jpg";
import custImg from "../../assets/images/customer.jpg";
import { Badge } from "../ui/badge";
import { getAllSalesReturnInfo } from "@/api/SalesReturn/SaleReturnClient";
import { Cell } from "recharts";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import SalesReturnDetials from "./SalesReturnDetials";
import { useNavigate } from "react-router-dom";

export interface SaleReturnResponse {
  data: SaleReturn[];
}

export interface SaleReturn {
  sale_return_id: string;
  srn_no: string;
  sale_return_date: string;
  status: "PENDING" | "RECEIVED";
  payment_status: "PAID" | "UNPAID" | "PARTIAL";
  total_amount: number;

  summary: Summary;

  sale: Sale;

  customer: Customer;

  return_items: ReturnItem[];
}

// ----------------------------
// Summary
// ----------------------------
export interface Summary {
  total_items_count: number;
  fully_returned_count: number;
  total_return_qty: number;
  total_tax_amount: number;
  total_discount: number;
  net_return_amount: number;
}

// ----------------------------
// Sale Info
// ----------------------------
export interface Sale {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  payment_status: "PAID" | "UNPAID" | "PARTIAL";
  order_tax: number;
  shipping: number;
  discount: number;
}

// ----------------------------
// Customer Info
// ----------------------------
export interface Customer {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

// ----------------------------
// Return Items
// ----------------------------
export interface ReturnItem {
  sale_return_item_id: string;
  sale_item_id: string;
  product_variant_id: string;
  warehouse_id: string;

  product_id: string;
  product_name: string;
  sku_code: string;
  variant_label: string;

  unit_price: number;
  original_sold_qty: number;
  return_quantity: number;
  remaining_qty: number;
  is_fully_returned: boolean;

  discount: number;
  tax: number;
  tax_amount: number;

  sub_total: number;
}

export default function SalesReturnDataTable() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("All");
  const [page, setPage] = React.useState(1);
  const [pageMetaData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    hasnextPage: false,
    hasPrevPage: false,
  });
  const [openSaleReturnDetails, setOpenSaleReturnDetails] =
    React.useState(false);
  const [saleReturnData, setSalesReturnData] = React.useState<SaleReturn[]>([]);
  const [selectedSaleReturn, setSelectedSaleReturn] =
    React.useState<SaleReturn | null>();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const getAllsaleReturnInfo = async () => {
    try {
      const res = await getAllSalesReturnInfo(page, 10);
      if (res.status === "OK") {
        setSalesReturnData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllsaleReturnInfo();
  }, []);
  console.log(saleReturnData);

  const data: SaleReturn[] = saleReturnData;
  const columns: ColumnDef<SaleReturn>[] = [
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
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sales = row.original;

        return (
          <div className="flex items-center gap-3">
            {/* Avatar Placeholder if needed */}

            <span className="capitalize font-semibold text-gray-900 truncate max-w-[150px]">
              {sales.customer?.full_name}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "srn_no",
      header: () => <div className="text-left"> SRN NO</div>,
      cell: ({ row }) => {
        // const sales = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* Customer Image */}

            {/* Customer Name */}
            <span className="capitalize font-bold">
              {row.getValue("srn_no")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "invoice_no",
      header: () => <div className="text-left">Invoice NO</div>,
      cell: ({ row }) => {
        const sales = row.original;
        return (
          <div className="capitalize text-left ">{sales.sale.invoice_no}</div>
        );
      },
    },
    {
      accessorKey: "sale_return_date",
      header: () => <div className="text-left">Return Date</div>,
      cell: ({ row }) => {
        const date = row.original.sale_return_date;
        return (
          <div className=" text-left capitalize">
            {new Date(date).toLocaleDateString()}
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

        if (status === "RECEIVED") {
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
      accessorKey: "total_amount",
      header: () => <div className="text-left">Total</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            ₹{row.getValue("total_amount")}
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
        const salesReturn = row.original;
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
                      setSelectedSaleReturn(salesReturn);
                      setOpenSaleReturnDetails(true);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    Sales Details
                  </MenubarItem>
                  <MenubarItem
                    className="gap-2 text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/shop/salereturn/update/${salesReturn.sale_return_id}`,
                      )
                    }
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                    Edit Sales Return
                  </MenubarItem>
                  <MenubarSeparator />

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
      <SalesReturnDetials
        open={openSaleReturnDetails}
        onClose={() => setOpenSaleReturnDetails(false)}
        saleReturn={selectedSaleReturn}
      />
    </div>
  );
}
