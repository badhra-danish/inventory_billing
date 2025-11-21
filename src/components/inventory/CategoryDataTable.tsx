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
import { Label } from "@radix-ui/react-label";
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
  Flashlight,
  MoreHorizontal,
  Trash,
  TrendingUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "../ui/switch";
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
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "@/api/ApiClient";
import Loader from "../commen/loader";
import toast from "react-hot-toast";
//  const data: Category[] = [
//     {
//       name: "wood",
//       slug: "wood",
//       status: "active",
//     },
//     {
//       name: "Plywood",
//       slug: "plywood",
//       status: "active",
//     },
//     {
//       name: "Laminates",
//       slug: "laminates",
//       status: "active",
//     },
//     {
//       name: "Hardware",
//       slug: "hardware",
//       status: "active",
//     },
//     {
//       name: "Glass",
//       slug: "glass",
//       status: "inactive",
//     },
//     {
//       name: "Paints",
//       slug: "paints",
//       status: "active",
//     },
//     {
//       name: "Doors",
//       slug: "doors",
//       status: "inactive",
//     },
//     {
//       name: "Flooring",
//       slug: "flooring",
//       status: "active",
//     },
//     {
//       name: "Handles & Locks",
//       slug: "handles-locks",
//       status: "active",
//     },
//     {
//       name: "Cement Sheets",
//       slug: "cement-sheets",
//       status: "inactive",
//     },
//     {
//       name: "Doors",
//       slug: "doors",
//       status: "inactive",
//     },
//     {
//       name: "Doors",
//       slug: "doors",
//       status: "inactive",
//     },
//     {
//       name: "Flooring",
//       slug: "flooring",
//       status: "active",
//     },
//     {
//       name: "Handles & Locks",
//       slug: "handles-locks",
//       status: "active",
//     },
//     {
//       name: "Flooring",
//       slug: "flooring",
//       status: "active",
//     },
//     {
//       name: "Handles & Locks",
//       slug: "handles-locks",
//       status: "active",
//     },
//   ];
export type Category = {
  categoryID: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
};
type CategoryDataTableProps = {
  refresh: boolean;
};
export default function CategoryDataTable({ refresh }: CategoryDataTableProps) {
  //const navigate = useNavigate();
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
  const [categoryData, setCategoryData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedCategoryUpdate, setSelectedCategoryUpdate] =
    React.useState<Category | null>(null);

  console.log(selectedCategoryUpdate);

  const getallCategory = async () => {
    try {
      setIsLoading(true);
      const res = await getAllCategory();
      if (res?.statusCode === 200) {
        setCategoryData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  React.useEffect(() => {
    getallCategory();
  }, [refresh]);

  const handleupdate = async () => {
    try {
      const payload = {
        name: selectedCategoryUpdate?.name,
        slug: selectedCategoryUpdate?.slug,
        status: selectedCategoryUpdate?.status,
      };
      if (!selectedCategoryUpdate?.categoryID) {
        toast.error("No category selected!");
        return;
      }

      const res = await updateCategory(
        selectedCategoryUpdate?.categoryID,
        payload
      );
      if (res.statusCode === 200) {
        toast.success(res.message);
        setOpenEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      if (!selectedCategoryUpdate?.categoryID) {
        toast.error("No category selected!");
        return;
      }
      const res = await deleteCategory(selectedCategoryUpdate.categoryID);
      if (res?.status == 204) {
        toast.success("Category Deleted..");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const data: Category[] = categoryData;
  const columns: ColumnDef<Category>[] = [
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
            Category
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "slug",
      header: () => <div className="text-left">Category Slug</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("slug")}</div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Created At</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("createdAt")}
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
          status === "ACTIVE"
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
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategoryUpdate(category);
                setOpenEdit(true);
              }}
            >
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
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
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
                    const categoryColumn = table.getColumn("name");
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
              {["All", "active", "inactive"].map((status) => (
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
            {isLoading ? (
              <>
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Loader />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <>
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
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Single Edit Dialog (controlled) */}
      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedCategoryUpdate(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2">
            <div className="grid gap-4">
              <Label htmlFor="category-1">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-1"
                type="text"
                name="categoryname"
                value={selectedCategoryUpdate?.name}
                onChange={(e) =>
                  setSelectedCategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return { ...prev, name: e.target.value };
                  })
                }
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="slug-1">
                Slug Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug-1"
                type="text"
                name="slugName"
                value={selectedCategoryUpdate?.slug}
                onChange={(e) =>
                  setSelectedCategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return { ...prev, slug: e.target.value };
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between border-b-2 pb-7">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                id="status"
                checked={selectedCategoryUpdate?.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  setSelectedCategoryUpdate((prev) => ({
                    ...prev!,
                    status: checked ? "ACTIVE" : "INACTIVE",
                  }))
                }
                className=" data-[state=checked]:bg-green-500 transition-colors"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleupdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
