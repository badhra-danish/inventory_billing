import * as React from "react";
// Component
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
import { Label } from "@radix-ui/react-label";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Edit, Trash } from "lucide-react";
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

// Models Of the Api Clinet
import {
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "@/api/Category-subCategory/ApiClient";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
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

//Interface
export type Category = {
  category_id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
};
type CategoryDataTableProps = {
  refresh: boolean;
};

export default function CategoryDataTable({ refresh }: CategoryDataTableProps) {
  const { categories } = useCategory();
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
  const [categoryData, setCategoryData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedCategoryUpdate, setSelectedCategoryUpdate] =
    React.useState<Category | null>(null);
  const [selectedCetogoryDelete, setSelectCetogoryDelete] =
    React.useState<Category | null>();

  const [page, setPage] = React.useState(1);
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
    hasnextPage: false,
    hasPrevPage: false,
  });
  const categoryOptions = [{ name: "All", category_id: 0 }, ...categories];

  const getallCategory = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const res = await getAllCategory(page, 10);
      if (res?.status === "OK") {
        setCategoryData(res.data);
        setPageMetaData(res.pageMetaData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  React.useEffect(() => {
    getallCategory();
  }, [refresh, page]);

  const handleupdate = async () => {
    try {
      const payload = {
        name: selectedCategoryUpdate?.name,
        slug: selectedCategoryUpdate?.slug,
        status: selectedCategoryUpdate?.status,
      };
      if (!selectedCategoryUpdate?.category_id) {
        toast.error("No category selected!");
        return;
      }

      const res = await updateCategory(
        selectedCategoryUpdate?.category_id,
        payload,
      );
      if (res.status === "OK") {
        toast.success(res.message);
        setOpenEdit(false);
        getallCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      if (!selectedCetogoryDelete?.category_id) {
        toast.error("No category selected!");
        return;
      }
      const res = await deleteCategory(selectedCetogoryDelete.category_id);
      if (res?.status === 200) {
        toast.success("Category Deleted..");
        setOpenDelete(false);
        getallCategory();
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
            className="text-white"
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
      header: () => <div className="text-left text-white">Category Slug</div>,
      cell: ({ row }) => {
        return <div className=" text-left ">{row.getValue("slug")}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left text-white">Created At</div>,

      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="capitalize text-left ">{date.toDateString()}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left text-white">Status</div>,
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectCetogoryDelete(category);
                setOpenDelete(true);
              }}
            >
              <Trash />
            </Button>
            {/* <Button variant="outline" size="sm">
              <Trash />
            </Button> */}
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
    <div className="w-full bg-white dark:bg-slate-900 rounded-md shadow-md p-4 transition-colors">
      {/* 🔍 Top Toolbar */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search....."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-gray-500"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-slate-200">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-slate-700" />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize dark:text-slate-300 dark:focus:bg-slate-700"
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
              className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors"
            >
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300"
              >
                Category: {selectedCategory}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-slate-200">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-slate-700" />

              {categoryOptions?.map((cat) => (
                <DropdownMenuItem
                  key={cat.category_id}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    const categoryColumn = table.getColumn("name");
                    if (categoryColumn) {
                      categoryColumn.setFilterValue(
                        cat.name === "All" ? "" : cat.name,
                      );
                    }
                  }}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors"
            >
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300"
              >
                Status: {selectedStatus}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              {["All", "active", "inactive"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
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

      {/* 📊 Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 dark:border-slate-800 transition-colors">
        <Table>
          <TableHeader className="bg-blue-500 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="dark:border-slate-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-gray-800 dark:text-slate-200 tracking-wide px-4 py-3"
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

          <TableBody className="dark:bg-slate-900 transition-colors">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="dark:border-slate-800"
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors dark:border-slate-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300"
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
                      className="h-24 text-center text-gray-500 dark:text-slate-400 capitalize dark:border-slate-800"
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

      {/* Single Edit Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedCategoryUpdate(null);
        }}
      >
        <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2 dark:border-slate-800">
            <div className="grid gap-4">
              <Label htmlFor="category-1" className="dark:text-slate-300">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-1"
                type="text"
                name="categoryname"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
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
              <Label htmlFor="slug-1" className="dark:text-slate-300">
                Slug Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug-1"
                type="text"
                name="slugName"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={selectedCategoryUpdate?.slug}
                onChange={(e) =>
                  setSelectedCategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return { ...prev, slug: e.target.value };
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between border-b-2 dark:border-slate-800 pb-7">
              <Label htmlFor="status" className="dark:text-slate-300">
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
                className="data-[state=checked]:bg-green-500 transition-colors"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleupdate}
              className="dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-14 h-14 border-2 dark:border-slate-800 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <img src={trashImg} className="w-10 rounded-full" />
            </div>
            <DialogTitle className="text-lg font-semibold dark:text-slate-100">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-slate-400">
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-1 flex justify-center space-x-1">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 📄 Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600 dark:text-slate-400">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex gap-2 items-center">
          <div>
            Page {pageMeteData.currentPage} of {pageMeteData.totalPage}
          </div>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMeteData.hasPrevPage === false}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPage, p + 1))
            }
            disabled={pageMeteData.hasnextPage === false}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
