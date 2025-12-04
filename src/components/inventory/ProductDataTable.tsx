import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useNavigate } from "react-router-dom";
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
import trashImg from "../../assets/images/trash.jpg";
import { getAllProductPage } from "@/api/CreateProduct/ProductClinet";
// const data: Product[] = [
//   {
//     id: "P001",
//     name: "Plywood Sheet 12mm",
//     category: "Wood & Boards",
//     brand: "GreenPly",
//     unit: "pc",
//     qty: 300,
//     price: 1200,
//     status: "In Stock",
//   },
//   {
//     id: "P002",
//     name: "Laminated Sheet 18mm",
//     category: "Wood & Boards",
//     brand: "Century",
//     unit: "pc",
//     qty: 300,
//     price: 1800,

//     status: "Low Stock",
//   },
//   {
//     id: "P003",
//     name: "Hinges 3-inch",
//     category: "Hardware",
//     brand: "Godrej",
//     unit: "pc",
//     qty: 300,
//     price: 50,

//     status: "Out of Stock",
//   },
//   {
//     id: "P004",
//     name: "Wood Glue 1L",
//     category: "Adhesives",
//     brand: "Fevicol",
//     unit: "pc",
//     qty: 300,
//     price: 250,

//     status: "In Stock",
//   },
//   {
//     id: "P005",
//     name: "Drawer Slide Set",
//     category: "Hardware",
//     brand: "Hettich",
//     unit: "pc",
//     qty: 300,
//     price: 300,

//     status: "In Stock",
//   },
//   {
//     id: "P006",
//     name: "Veneer Sheet 4x8ft",
//     category: "Finishing",
//     brand: "Kitply",
//     unit: "pc",
//     qty: 300,
//     price: 950,

//     status: "Low Stock",
//   },
//   {
//     id: "P007",
//     name: "Screw Pack (100pcs)",
//     category: "Fasteners",
//     brand: "Taparia",
//     unit: "pc",
//     qty: 300,
//     price: 120,

//     status: "Out of Stock",
//   },
//   {
//     id: "P008",
//     name: "Edge Band Roll",
//     category: "Finishing",
//     brand: "Rehau",
//     unit: "pc",
//     qty: 300,
//     price: 200,

//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
// ];

export type Product = {
  productID: string;
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  qty: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "failed";
};

export default function Products() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [productData, setProductData] = React.useState([]);
  const [selectedProduct, setSelecctedProduct] = React.useState({});
  const getAllProduct = async () => {
    try {
      const res = await getAllProductPage(page, 10);
      if (res.statusCode === 200) {
        setProductData(res.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getAllProduct();
  }, [page]);

  console.log(selectedProduct);
  const data: Product[] = productData;
  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "categoryName",
      header: () => <div className="text-left">Category</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("categoryName")}
          </div>
        );
      },
    },
    {
      accessorKey: "brandName",
      header: () => <div className="text-left">Brand</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">
            {row.getValue("brandName")}
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Created At</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">{row.getValue("createdAt")}</div>
        );
      },
    },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(`/product-detail/${product.productID}`);
                setSelecctedProduct(product);
              }}
            >
              <Eye />
            </Button>
            <Button variant="outline" size="sm">
              <Edit />
            </Button>
            {/* <Button variant="outline" size="sm">
              <Trash />
            </Button> */}
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="sm">
                  <Trash />
                </Button>
              </DialogTrigger>

              <DialogContent className="flex flex-col items-center text-center">
                <DialogHeader className="flex flex-col items-center ">
                  <div className="w-14 h-14 border-2 rounded-full flex items-center justify-center">
                    <img src={trashImg} className="w-20  rounded-full" />
                  </div>

                  <DialogTitle className="text-lg font-semibold">
                    Delete Product
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Are you sure you want to delete this product?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-1 flex justify-center space-x-1">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
