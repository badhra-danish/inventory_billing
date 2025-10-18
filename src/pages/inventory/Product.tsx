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

const data: Product[] = [
  {
    id: "P001",
    name: "Plywood Sheet 12mm",
    category: "Wood & Boards",
    brand: "GreenPly",
    unit: "pc",
    qty: 300,
    price: 1200,
    status: "In Stock",
  },
  {
    id: "P002",
    name: "Laminated Sheet 18mm",
    category: "Wood & Boards",
    brand: "Century",
    unit: "pc",
    qty: 300,
    price: 1800,

    status: "Low Stock",
  },
  {
    id: "P003",
    name: "Hinges 3-inch",
    category: "Hardware",
    brand: "Godrej",
    unit: "pc",
    qty: 300,
    price: 50,

    status: "Out of Stock",
  },
  {
    id: "P004",
    name: "Wood Glue 1L",
    category: "Adhesives",
    brand: "Fevicol",
    unit: "pc",
    qty: 300,
    price: 250,

    status: "In Stock",
  },
  {
    id: "P005",
    name: "Drawer Slide Set",
    category: "Hardware",
    brand: "Hettich",
    unit: "pc",
    qty: 300,
    price: 300,

    status: "In Stock",
  },
  {
    id: "P006",
    name: "Veneer Sheet 4x8ft",
    category: "Finishing",
    brand: "Kitply",
    unit: "pc",
    qty: 300,
    price: 950,

    status: "Low Stock",
  },
  {
    id: "P007",
    name: "Screw Pack (100pcs)",
    category: "Fasteners",
    brand: "Taparia",
    unit: "pc",
    qty: 300,
    price: 120,

    status: "Out of Stock",
  },
  {
    id: "P008",
    name: "Edge Band Roll",
    category: "Finishing",
    brand: "Rehau",
    unit: "pc",
    qty: 300,
    price: 200,

    status: "In Stock",
  },
  {
    id: "P009",
    name: "PVC Sheet 6mm",
    category: "Plastic Boards",
    brand: "Alstone",
    unit: "pc",
    qty: 300,
    price: 1100,

    status: "Low Stock",
  },
  {
    id: "P010",
    name: "Fevicol SR 505 (5L)",
    category: "Adhesives",
    brand: "Pidilite",
    unit: "pc",
    qty: 300,
    price: 750,
    status: "In Stock",
  },
  {
    id: "P009",
    name: "PVC Sheet 6mm",
    category: "Plastic Boards",
    brand: "Alstone",
    unit: "pc",
    qty: 300,
    price: 1100,

    status: "Low Stock",
  },
  {
    id: "P010",
    name: "Fevicol SR 505 (5L)",
    category: "Adhesives",
    brand: "Pidilite",
    unit: "pc",
    qty: 300,
    price: 750,
    status: "In Stock",
  },
  {
    id: "P009",
    name: "PVC Sheet 6mm",
    category: "Plastic Boards",
    brand: "Alstone",
    unit: "pc",
    qty: 300,
    price: 1100,

    status: "Low Stock",
  },
  {
    id: "P010",
    name: "Fevicol SR 505 (5L)",
    category: "Adhesives",
    brand: "Pidilite",
    unit: "pc",
    qty: 300,
    price: 750,
    status: "In Stock",
  },
  {
    id: "P009",
    name: "PVC Sheet 6mm",
    category: "Plastic Boards",
    brand: "Alstone",
    unit: "pc",
    qty: 300,
    price: 1100,

    status: "Low Stock",
  },
  {
    id: "P010",
    name: "Fevicol SR 505 (5L)",
    category: "Adhesives",
    brand: "Pidilite",
    unit: "pc",
    qty: 300,
    price: 750,
    status: "In Stock",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  qty: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "failed";
};

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "id",
    header: () => <div className="text-left">SKU</div>,
    cell: ({ row }) => {
      return <div className="capitalize text-left ">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize font-bold">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-left ">{row.getValue("category")}</div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: () => <div className="text-left">Brand</div>,
    cell: ({ row }) => {
      return (
        <div className=" text-left capitalize">{row.getValue("brand")}</div>
      );
    },
  },
  {
    accessorKey: "qty",
    header: () => <div className="text-left">Quantity</div>,
    cell: ({ row }) => {
      return <div className="lowercase text-left">{row.getValue("qty")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-left">Price</div>,
    cell: ({ row }) => {
      return <div className="lowercase text-left">{row.getValue("price")}</div>;
    },
  },
  {
    accessorKey: "unit",
    header: () => <div className="text-right">Unit</div>,
    cell: ({ row }) => {
      return <div className="lowercase text-left">{row.getValue("unit")}</div>;
    },
  },
  {
    id: "actions",
    // header: () => <div className="text-left">Action</div>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          <Button variant="outline" size="sm">
            <Eye />
          </Button>
          <Button variant="outline" size="sm">
            <Edit />
          </Button>
          <Button variant="outline" size="sm">
            <Trash />
          </Button>
        </div>
      );
    },
  },
];

export default function Products() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                          header.getContext()
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
                        cell.getContext()
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
    </div>
  );
}
