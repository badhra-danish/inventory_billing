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
  CirclePlus,
  Edit,
  Eye,
  Import,
  MoreHorizontal,
  Rows,
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
import {
  deleteSubCategory,
  getAllSubCategory,
  updateSubCategory,
  updateSubCategoryImage,
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
import { Switch } from "../ui/switch"; // const data: SubCategory[] = [
import toast from "react-hot-toast";
//   {
//     image: Img,
//     subCategory: "PlyWood",
//     category: "Wood",
//     categoryCode: "CT005",
//     description: "Wood Description",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Laminates",
//     category: "Wood",
//     categoryCode: "CT002",
//     description:
//       "Decorative laminates for modern interior finishes and furniture.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Door Fittings",
//     category: "Hardware",
//     categoryCode: "CT003",
//     description:
//       "Durable  hsdasjd shavdsvd sajvdjs javdasj jasvdand rust-resistant fittings for all types of doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Screws & Nails",
//     category: "Hardware",
//     categoryCode: "CT004",
//     description: "Premium-grade screws, nails, and fasteners for construction.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Paints & Polish",
//     category: "Finishing",
//     categoryCode: "CT005",
//     description:
//       "Range of wood paints, varnish, and polish for smooth finishing.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Handles & Knobs",
//     category: "Hardware",
//     categoryCode: "CT006",
//     description: "Designer handles and knobs for cabinets and doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "MDF Boards",
//     category: "Wood",
//     categoryCode: "CT007",
//     description: "Medium-density fiberboards ideal for furniture and panels.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Adhesives",
//     category: "Hardware",
//     categoryCode: "CT008",
//     description:
//       "Strong bonding adhesives for woodworking and construction use.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Laminates",
//     category: "Wood",
//     categoryCode: "CT002",
//     description:
//       "Decorative laminates for modern interior finishes and furniture.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Door Fittings",
//     category: "Hardware",
//     categoryCode: "CT003",
//     description: "Durable and rust-resistant fittings for all types of doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Screws & Nails",
//     category: "Hardware",
//     categoryCode: "CT004",
//     description: "Premium-grade screws, nails, and fasteners for construction.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Paints & Polish",
//     category: "Finishing",
//     categoryCode: "CT005",
//     description:
//       "Range of wood paints, varnish, and polish for smooth finishing.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Handles & Knobs",
//     category: "Hardware",
//     categoryCode: "CT006",
//     description: "Designer handles and knobs for cabinets and doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "MDF Boards",
//     category: "Wood",
//     categoryCode: "CT007",
//     description: "Medium-density fiberboards ideal for furniture and panels.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Adhesives",
//     category: "Hardware",
//     categoryCode: "CT008",
//     description:
//       "Strong bonding adhesives for woodworking and construction use.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Laminates",
//     category: "Wood",
//     categoryCode: "CT002",
//     description:
//       "Decorative laminates for modern interior finishes and furniture.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Door Fittings",
//     category: "Hardware",
//     categoryCode: "CT003",
//     description: "Durable and rust-resistant fittings for all types of doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Screws & Nails",
//     category: "Hardware",
//     categoryCode: "CT004",
//     description: "Premium-grade screws, nails, and fasteners for construction.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Paints & Polish",
//     category: "Finishing",
//     categoryCode: "CT005",
//     description:
//       "Range of wood paints, varnish, and polish for smooth finishing.",
//     status: "inactive",
//   },
//   {
//     image: Img,
//     subCategory: "Handles & Knobs",
//     category: "Hardware",
//     categoryCode: "CT006",
//     description: "Designer handles and knobs for cabinets and doors.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "MDF Boards",
//     category: "Wood",
//     categoryCode: "CT007",
//     description: "Medium-density fiberboards ideal for furniture and panels.",
//     status: "active",
//   },
//   {
//     image: Img,
//     subCategory: "Adhesives",
//     category: "Hardware",
//     categoryCode: "CT008",
//     description:
//       "Strong bonding adhesives for woodworking and construction use.",
//     status: "inactive",
//   },
// ];

export type SubCategory = {
  subCategoryID: string;
  imageUrl: string;
  name: string;
  categoryName: string;
  categoryID: string;
  code: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};
type SubCategoryDataTableProps = {
  refresh: boolean;
};
export default function SubCategoryDatatable({
  refresh,
}: SubCategoryDataTableProps) {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [subCategoryData, setsubCategoryData] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectesSubcategoryUpdate, setSelectesSubcategoryUpdate] =
    React.useState<SubCategory | null>({
      subCategoryID: "",
      imageUrl: "",
      name: "",
      code: "",
      description: "",
      categoryName: "",
      categoryID: "",
      status: "ACTIVE",
    });
  const [page, setPage] = React.useState(1);
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPages: 0,
  });
  const [openImageDialog, setOpenImageDialog] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState({
    imageurl: "",
    subCategoryId: "",
  });
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const { refreshCategories, categories } = useCategory();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const categoryOptions = [{ name: "All", categoryID: 0 }, ...categories];

  const getallSubCategory = async () => {
    try {
      setIsLoading(true);
      const res = await getAllSubCategory(page, 10);
      if (res?.statusCode === 200) {
        setsubCategoryData(res.data);
        setPageMetaData(res.pageMetaData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  //console.log(selectesSubcategoryUpdate);
  React.useEffect(() => {
    getallSubCategory();
    refreshCategories(1, 10);
  }, [refresh, page]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectesSubcategoryUpdate((prev) => {
      if (!prev) return prev; // or return null
      return { ...prev, [name]: value };
    });
  };
  console.log(selectesSubcategoryUpdate);

  const handleUpdateCategory = async () => {
    try {
      const payload = {
        categoryID: selectesSubcategoryUpdate?.categoryID,
        name: selectesSubcategoryUpdate?.name,
        code: selectesSubcategoryUpdate?.code,
        description: selectesSubcategoryUpdate?.description,
        status: selectesSubcategoryUpdate?.status,
      };
      const res = await updateSubCategory(
        selectesSubcategoryUpdate?.subCategoryID ?? "",
        payload
      );
      if (res.statusCode === 200) {
        toast.success(res.message);
        setOpenEdit(false);
        getallSubCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadPromise = updateSubCategoryImage(
        selectedImage.subCategoryId,
        formData
      );
      toast.promise(uploadPromise, {
        loading: "Updating image...",
        success: (res) => {
          setOpenImageDialog(false);
          getallSubCategory();
          return "Image Updated!";
        },
        error: "Failed to update image",
      });
      const res = await uploadPromise;

      e.target.value = "";
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteCategory = async () => {
    try {
      const deletePromise = deleteSubCategory(deleteId);

      toast.promise(deletePromise, {
        loading: "Deleting SubCategory...",
        success: (res) => {
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
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-left">Image</div>,
      cell: ({ row }) => {
        const imageUrl = row.getValue("imageUrl") as string;
        const subCategoryId = row.original;
        return (
          <div
            className="flex justify-left"
            onClick={() => {
              setOpenImageDialog((prev) => !prev);

              setSelectedImage({
                imageurl: imageUrl,
                subCategoryId: subCategoryId.subCategoryID,
              });
            }}
          >
            <img
              src={imageUrl}
              alt="category"
              className="w-8 h-8 rounded-md object-cover border"
            />
          </div>
        );
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
            Sub Category
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
      accessorKey: "code",
      header: () => <div className="text-left">Category Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("code")}</div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left"> Description</div>,
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
                setDeleteId(subCategory.subCategoryID);
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

              {categoryOptions?.map((cat) => (
                <DropdownMenuItem
                  key={cat.categoryID}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    const categoryColumn = table.getColumn("categoryName");
                    if (categoryColumn) {
                      categoryColumn.setFilterValue(
                        cat.name === "All" ? "" : cat.name
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
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/*  Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.previousPage()}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPages, p + 1))
            }
            // onClick={() => table.nextPage()}
            disabled={pageMeteData.totalPages <= page}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Update Delete Dialog Box */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Update Sub Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2">
            <div className="grid gap-4">
              <Label>
                {" "}
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectesSubcategoryUpdate((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      categoryID: value,
                    };
                  })
                }
                name="categoryID"
                value={selectesSubcategoryUpdate?.categoryID}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem value={cat?.categoryID}>
                      {" "}
                      {cat?.name}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              <Label>
                {" "}
                Sub Category <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                value={selectesSubcategoryUpdate?.name}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4">
              <Label>
                {" "}
                Category Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="code"
                value={selectesSubcategoryUpdate?.code}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4">
              <Label>
                {" "}
                Descriptions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description..."
                className="min-h-[80px] resize-y"
                value={selectesSubcategoryUpdate?.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between border-b-2 pb-7">
              <Label>
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
            <DialogClose>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          {selectedImage && (
            <div className="w-full flex justify-center mb-4">
              <img
                src={selectedImage.imageurl}
                alt="Preview"
                className="max-h-[70vh] rounded-lg object-contain border"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose>
              <div className="flex gap-3">
                <Button variant={"outline"}>Cancel</Button>
              </div>
            </DialogClose>
            <Button onClick={() => fileInputRef.current?.click()} type="button">
              Change Image
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger></DialogTrigger>

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
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
