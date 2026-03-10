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
import { ArrowUpDown, ChevronDown, Edit, Trash } from "lucide-react";
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
  deleteSubCategory,
  getAllSubCategory,
  updateSubCategory,
} from "@/api/Category-subCategory/ApiClient";
import Loader from "../commen/loader";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import toast from "react-hot-toast";

export type SubCategory = {
  subCategory_id: string;
  subCategoryName: string;
  categoryName: string;
  category_id: string;
  categoryCode: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};
type SubCategoryDataTableProps = {
  refresh: boolean;
};
export default function SubCategoryDatatable({
  refresh,
}: SubCategoryDataTableProps) {
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [subCategoryData, setsubCategoryData] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectesSubcategoryUpdate, setSelectesSubcategoryUpdate] =
    React.useState<SubCategory | null>({
      subCategory_id: "",
      subCategoryName: "",
      categoryCode: "",
      description: "",
      categoryName: "",
      category_id: "",
      status: "ACTIVE",
    });
  const [page, setPage] = React.useState(1);
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPage: 1,
    currentPage: 1,
    totalItems: 7,
    pageSize: 10,
    hasnextPage: false,
    hasPrevPage: false,
  });

  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const { refreshCategories, categories } = useCategory();
  const categoryOptions = [{ name: "All", category_id: 0 }, ...categories];

  const getallSubCategory = async () => {
    try {
      setIsLoading(true);
      const res = await getAllSubCategory(page, 10);
      if (res?.status === "OK") {
        setsubCategoryData(res.data);
        setPageMetaData(res.pageMetaData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  React.useEffect(() => {
    getallSubCategory();
    refreshCategories();
  }, [refresh, page]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSelectesSubcategoryUpdate((prev) => {
      if (!prev) return prev; // or return null
      return { ...prev, [name]: value };
    });
  };

  const handleUpdateCategory = async () => {
    try {
      const payload = {
        category_id: selectesSubcategoryUpdate?.category_id,
        subCategoryName: selectesSubcategoryUpdate?.subCategoryName,
        categoryCode: selectesSubcategoryUpdate?.categoryCode,
        description: selectesSubcategoryUpdate?.description,
        status: selectesSubcategoryUpdate?.status,
      };
      const res = await updateSubCategory(
        selectesSubcategoryUpdate?.subCategory_id ?? "",
        payload,
      );
      if (res.status === "OK") {
        toast.success(res.message);
        setOpenEdit(false);
        getallSubCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   console.log(file);
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const uploadPromise = updateSubCategoryImage(
  //       selectedImage.subCategoryId,
  //       formData
  //     );
  //     toast.promise(uploadPromise, {
  //       loading: "Updating image...",
  //       success: (res) => {
  //         setOpenImageDialog(false);
  //         getallSubCategory();
  //         return "Image Updated!";
  //       },
  //       error: "Failed to update image",
  //     });
  //     const res = await uploadPromise;

  //     e.target.value = "";
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleDeleteCategory = async () => {
    try {
      const deletePromise = deleteSubCategory(deleteId);

      toast.promise(deletePromise, {
        loading: "Deleting SubCategory...",
        success: () => {
          setOpenDelete(false);
          getallSubCategory();
          return "Deleted Successfully!";
        },
        error: "Failed to Delete ",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const data: SubCategory[] = subCategoryData;

  const columns: ColumnDef<SubCategory>[] = [
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
    //   accessorKey: "imageUrl",
    //   header: () => <div className="text-left">Image</div>,
    //   cell: ({ row }) => {
    //     const imageUrl = row.getValue("imageUrl") as string;
    //     const subCategoryId = row.original;
    //     return (
    //       <div
    //         className="flex justify-left"
    //         onClick={() => {
    //           setOpenImageDialog((prev) => !prev);

    //           setSelectedImage({
    //             imageurl: imageUrl,
    //             subCategoryId: subCategoryId.subCategoryID,
    //           });
    //         }}
    //       >
    //         <img
    //           src={imageUrl}
    //           alt="category"
    //           className="w-8 h-8 rounded-md object-cover border"
    //         />
    //       </div>
    //     );
    //   },
    // },

    {
      accessorKey: "subCategoryName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sub Category
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">
          {row.getValue("subCategoryName")}
        </div>
      ),
    },

    {
      accessorKey: "categoryName",
      header: () => <div className="text-left text-white">Category</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("categoryName")}
          </div>
        );
      },
    },
    {
      accessorKey: "categoryCode",
      header: () => <div className="text-left text-white">Category Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("categoryCode")}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left text-white"> Description</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("description")}
          </div>
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
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const subCategory = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectesSubcategoryUpdate(subCategory);
                setOpenEdit(true);
              }}
            >
              <Edit />
            </Button>
            {/* <Button variant="outline" size="sm">
              <Trash />
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenDelete(true);
                setDeleteId(subCategory.subCategory_id);
              }}
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
    <div className="w-full bg-white dark:bg-slate-900 rounded-md shadow-md p-4 custom-scrollbar transition-colors">
      {/* 🔍 Top Toolbar */}
      <div className="flex items-center justify-between py-4 ">
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
                    const categoryColumn = table.getColumn("categoryName");
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

      {/* Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 dark:border-slate-800 custom-scrollbar transition-colors">
        <Table>
          <TableHeader className="bg-blue-500 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.depth}
                className="dark:border-slate-700"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.index}
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
                      key={row.index}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors capitalize border-gray-200 dark:border-slate-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.column.id}
                          className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 capitalize"
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

      {/* Pagination + Footer Info */}
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

      {/* Update Sub Category Dialog Box */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">
              Update Sub Category
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2 dark:border-slate-800">
            <div className="grid gap-4">
              <Label className="dark:text-slate-300">
                {" "}
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectesSubcategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      category_id: value,
                    };
                  })
                }
                name="category_id"
                value={selectesSubcategoryUpdate?.category_id}
              >
                <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                  {categories?.map((cat) => (
                    <SelectItem key={cat?.category_id} value={cat?.category_id}>
                      {cat?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              <Label className="dark:text-slate-300">
                {" "}
                Sub Category <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="subCategoryName"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={selectesSubcategoryUpdate?.subCategoryName}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4">
              <Label className="dark:text-slate-300">
                {" "}
                Category Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="categoryCode"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={selectesSubcategoryUpdate?.categoryCode}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4">
              <Label className="dark:text-slate-300">
                {" "}
                Descriptions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description..."
                className="min-h-[80px] resize-y dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                value={selectesSubcategoryUpdate?.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between border-b-2 dark:border-slate-800 pb-7">
              <Label className="dark:text-slate-300">
                {" "}
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                id="status"
                checked={selectesSubcategoryUpdate?.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  setSelectesSubcategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      status: checked ? "ACTIVE" : "INACTIVE",
                    };
                  })
                }
                className=" data-[state=checked]:bg-green-500 transition-colors"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"outline"}
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUpdateCategory}
              className="dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog Box */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800 transition-colors">
          <DialogHeader className="flex flex-col items-center ">
            <div className="w-14 h-14 border-2 dark:border-slate-700 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <img src={trashImg} className="w-10  rounded-full" />
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
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
