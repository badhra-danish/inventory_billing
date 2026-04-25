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
import { ArrowUpDown, ChevronDown } from "lucide-react";
//import { useNavigate } from "react-router-dom";
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
import { getAllLowStockPage } from "@/api/Stock/Stockclinet";
import toast from "react-hot-toast";

interface StockVariant {
  stock_id: string;
  productName: string;
  skuCode: string;
  price: number;
  variant_label: string;
  quantity: string;
  status: "INSTOCK" | "STOCKOUT";
}

export default function LowStockDataTable() {
  // const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
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

  const [lowStockVariantData, setLowStockVariantData] = React.useState<
    StockVariant[]
  >([]);

  const getAlllowStockData = async () => {
    try {
      const res = await getAllLowStockPage(page, 10);
      if (res.status == "OK") {
        setLowStockVariantData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAlllowStockData();
  }, []);
  const data: StockVariant[] = lowStockVariantData;
  const columns: ColumnDef<StockVariant>[] = [
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
      accessorKey: "productName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize font-bold flex gap-3">
            {row.getValue("productName")}
          </div>
        );
      },
    },

    {
      accessorKey: "variant_label",
      header: () => <div className="text-left">Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("variant_label")}
          </div>
        );
      },
    },
    {
      accessorKey: "skuCode",
      header: () => <div className="text-left">SkuCode</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("skuCode")}</div>
        );
      },
    },
    {
      accessorKey: "warehouseName",
      header: () => <div className="text-left">Warehouse</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("warehouseName")}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-left"> Quantity</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("quantity")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-left"> Price</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">₹{row.getValue("price")}</div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: () => {
        const status: string = "LOWSTOCK";

        const colorClass =
          status === "LOWSTOCK"
            ? "bg-yellow-200 text-yellow-600 "
            : "bg-red-400 text-white";

        return (
          <div className="text-left">
            <span
              className={`capitalize px-1.5 py-1 rounded-sm text-xs font-bold ${colorClass} bg-amber-200`}
            >
              LOWSTOCK
            </span>
          </div>
        );
      },
    },

    // {
    //   id: "actions",
    //   // header: () => <div className="text-left">Action</div>,
    //   cell: ({ row }) => {
    //     const product = row.original;
    //     return <div className="flex gap-1">{/* Dialog History veiw */}</div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   // header: () => <div className="text-left">Action</div>,
    //   cell: ({ row }) => {
    //     const product = row.original;
    //     return <div className="flex gap-1"></div>;
    //   },
    // },
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
    <div className="w-full bg-white rounded-md shadow-md p-4 custom-scrollbar">
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
                "Wood",
                "Plywood",
                "Laminates",
                "Veneers",
                "Hardware",
                "Handles & Locks",
                "Hinges & Channels",
                "Screws & Fasteners",
                "Glass",
                "Paints & Coatings",
                "Finishing",
                "Adhesives",
                "Plastic Boards",
                "MDF Boards",
                "Particle Boards",
                "Acrylic Sheets",
                "Cement Sheets",
                "Doors",
                "Flooring",
                "Ceiling Panels",
                "Edge Banding",
                "Tools & Accessories",
                "Electrical Fittings",
                "Kitchen Fittings",
                "Bathroom Fittings",
                "Construction Material",
                "Safety Equipment",
                "Decorative Panels",
                "Sealers & Polishes",
                "Others",
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
                Status: {selectedStatus}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              {["All", "stock In", "out of stock"].map((status) => (
                <DropdownMenuItem
                  //key={status}
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

      {/*  Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 custom-scrollbar">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.depth}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.index}
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
                  key={row.index}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors capitalize"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.column.id}
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
    </div>
  );
}
