import * as React from "react";
import Img from "../../assets/images/xls.png";
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
  Layers,
  Trash,
} from "lucide-react";
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
import trashImg from "../../assets/images/trash.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
const data: StockProduct[] = [
  {
    image: Img,
    productName: "Dell XPS 13 9310",
    code: "P1200",
    unit: "piece",
    quantity: "20",
    sellingPrice: "60,000",
    purchasePrice: "50,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "MacBook Air M2",
    code: "P1201",
    unit: "piece",
    quantity: "15",
    sellingPrice: "95,000",
    purchasePrice: "80,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "HP Spectre x360",
    code: "P1202",
    unit: "piece",
    quantity: "10",
    sellingPrice: "88,000",
    purchasePrice: "72,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "Lenovo ThinkPad X1 Carbon",
    code: "P1203",
    unit: "piece",
    quantity: "25",
    sellingPrice: "1,10,000",
    purchasePrice: "90,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "ASUS ROG Zephyrus G14",
    code: "P1204",
    unit: "piece",
    quantity: "5",
    sellingPrice: "1,25,000",
    purchasePrice: "1,00,000",
    status: "out of stock",
  },
  {
    image: Img,
    productName: "MacBook Air M2",
    code: "P1201",
    unit: "piece",
    quantity: "15",
    sellingPrice: "95,000",
    purchasePrice: "80,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "HP Spectre x360",
    code: "P1202",
    unit: "piece",
    quantity: "10",
    sellingPrice: "88,000",
    purchasePrice: "72,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "Lenovo ThinkPad X1 Carbon",
    code: "P1203",
    unit: "piece",
    quantity: "25",
    sellingPrice: "1,10,000",
    purchasePrice: "90,000",
    status: "stock In",
  },
  {
    image: Img,
    productName: "ASUS ROG Zephyrus G14",
    code: "P1204",
    unit: "piece",
    quantity: "5",
    sellingPrice: "1,25,000",
    purchasePrice: "1,00,000",
    status: "out of stock",
  },
];

export type StockProduct = {
  image: String;
  productName: String;
  code: String;
  unit: String;
  quantity: String;
  sellingPrice: String;
  purchasePrice: String;
  status: "stock In" | "out of stock";
};

export default function StockMangeDatatable() {
  // const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // DialogBox State Variable
  const [openStockIn, setOpenStockIn] = React.useState(false);
  const [openStockOut, setOpenStockOut] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);

  const columns: ColumnDef<StockProduct>[] = [
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
    // {
    //   accessorKey: "image",
    //   header: () => <div className="text-left">Image</div>,
    //   cell: ({ row }) => {
    //     const imageUrl = row.getValue("image") as string;
    //     return (
    //       <div className="flex justify-left">
    //         <img
    //           src={imageUrl}
    //           alt="category"
    //           className="w-6 h-6 rounded-md object-cover border"
    //         />
    //       </div>
    //     );
    //   },
    // },
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
        // const imageUrl = row.getValue("image") as string;
        const imageUrl = row.original as any;
        return (
          <div className="capitalize font-bold flex gap-3">
            <img
              src={imageUrl.image}
              alt="category"
              className="w-6 h-6 rounded-md object-cover border"
            />
            {row.getValue("productName")}
          </div>
        );
      },
    },

    {
      accessorKey: "code",
      header: () => <div className="text-left">Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("code")}</div>
        );
      },
    },
    {
      accessorKey: "unit",
      header: () => <div className="text-left">Unit</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("unit")}</div>
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
      accessorKey: "sellingPrice",
      header: () => <div className="text-left"> Selling Price</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("sellingPrice")}
          </div>
        );
      },
    },
    {
      accessorKey: "purchasePrice",
      header: () => <div className="text-left"> Purchase Price</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("purchasePrice")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const status: string = row.getValue("status");

        const colorClass =
          status === "stock In"
            ? "bg-green-400 text-white"
            : "bg-red-400 text-white";

        return (
          <div className="text-left">
            <span
              className={`capitalize px-1.5 py-1 rounded-sm text-xs font-normal ${colorClass}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: () => {
        // const product = row.original;
        return (
          <div className="flex gap-1">
            {/* Dialog History veiw */}
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-200"
              onClick={() => setOpenHistory(true)}
            >
              <Eye />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-green-100 text-green-600"
              onClick={() => setOpenStockIn(true)}
            >
              <Layers />
              Stock In
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-red-100 text-red-500 text-xs"
              onClick={() => setOpenStockOut(true)}
            >
              <Layers />
              Stock Out
            </Button>
          </div>
        );
      },
    },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: () => {
        // const product = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenUpdate(true)}
            >
              <Edit />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDelete(true)}
            >
              <Trash />
            </Button>
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
                        status === "All" ? "" : status
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

      {/* All Dialog Box of the Table */}
      <Dialog open={openHistory} onOpenChange={setOpenHistory}>
        <DialogContent className="">
          <DialogHeader className=" border-b-2  pb-4">
            <DialogTitle className="">Product History</DialogTitle>
          </DialogHeader>
          Something here
          {/* <DialogFooter className="mt-1 flex justify-center space-x-1">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Add Quantity</Button>
                </DialogFooter> */}
        </DialogContent>
      </Dialog>
      {/* Dialog for StockIn */}
      <Dialog open={openStockIn} onOpenChange={setOpenStockIn}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Add Quantity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label
                    htmlFor="single"
                    className="font-normal cursor-pointer"
                  >
                    Single Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label
                    htmlFor="variable"
                    className="font-normal cursor-pointer"
                  >
                    Variable Product
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4">
              <Label>
                {" "}
                Product <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => console.log("Selected:", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="finishing">Finishing</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>

            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input type="text" name="sub-category" />
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Notes <span className="text-red-500">*</span>
              </Label>
              <Textarea rows={5} />
            </div>
          </div>

          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button>Add Quantity</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for Out of Stock */}
      <Dialog open={openStockOut} onOpenChange={setOpenStockOut}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Remove Quantity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label
                    htmlFor="single"
                    className="font-normal cursor-pointer"
                  >
                    Single Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label
                    htmlFor="variable"
                    className="font-normal cursor-pointer"
                  >
                    Variable Product
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4">
              <Label>
                {" "}
                Product <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => console.log("Selected:", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="finishing">Finishing</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>

            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input type="text" name="sub-category" />
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Notes <span className="text-red-500">*</span>
              </Label>
              <Textarea rows={5} />
            </div>
          </div>
          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button>Remove Quantity</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogbox of the delete Update  */}
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label
                    htmlFor="single"
                    className="font-normal cursor-pointer"
                  >
                    Single Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label
                    htmlFor="variable"
                    className="font-normal cursor-pointer"
                  >
                    Variable Product
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4">
              <Label>
                {" "}
                Product <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => console.log("Selected:", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="finishing">Finishing</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>

            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Selling Price <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Purchase Price <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input type="text" name="sub-category" />
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => console.log("Selected:", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">InStock</SelectItem>
                  <SelectItem value="hardware">StockOut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button>Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
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
}
