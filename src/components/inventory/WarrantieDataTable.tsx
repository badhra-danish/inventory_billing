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
  deleteWarranty,
  getAllWarrantyPage,
  updateWarranty,
} from "@/api/Warranty/Warranty";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
// const data: Warranty[] = [
//   {
//     warranty: "Water Damage Warranty",
//     description: "Coverage for water-related issues",
//     duration: "6 Months",
//     status: "active",
//   },
//   {
//     warranty: "Screen Replacement Warranty",
//     description: "Free screen replacement within warranty period",
//     duration: "12 Months",
//     status: "active",
//   },
//   {
//     warranty: "Battery Warranty",
//     description: "Covers battery performance issues and replacements",
//     duration: "9 Months",
//     status: "inactive",
//   },
//   {
//     warranty: "Manufacturing Defect Warranty",
//     description: "Covers defects due to manufacturing faults",
//     duration: "1 Year",
//     status: "active",
//   },
//   {
//     warranty: "Screen Replacement Warranty",
//     description: "Free screen replacement within warranty period",
//     duration: "12 Months",
//     status: "active",
//   },
//   {
//     warranty: "Battery Warranty",
//     description: "Covers battery performance issues and replacements",
//     duration: "9 Months",
//     status: "inactive",
//   },
//   {
//     warranty: "Manufacturing Defect Warranty",
//     description: "Covers defects due to manufacturing faults",
//     duration: "1 Year",
//     status: "active",
//   },
//   {
//     warranty: "Accidental Damage Warranty",
//     description: "Protection against accidental physical damage",
//     duration: "6 Months",
//     status: "inactive",
//   },
//   {
//     warranty: "Accidental Damage Warranty",
//     description: "Protection against accidental physical damage",
//     duration: "6 Months",
//     status: "inactive",
//   },
// ];

export type Warranty = {
  warranty_id: string;
  warrantyName: string;
  description: string;
  duration: string;
  period: string;
  status: "ACTIVE" | "INACTIVE";
};
type refreshType = {
  refresh: boolean;
};
export default function WarrantiesDataTable({ refresh }: refreshType) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  // const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPage: 2,
    currentPage: 1,
    totalItems: 13,
    pageSize: 10,
    hasnextPage: true,
    hasPrevPage: false,
  });
  const [warrantyData, setWarrantyData] = React.useState<Warranty[]>([]);
  const [openUpdateWarranty, setOpenUpdateWarranty] = React.useState(false);
  const [selectedWarranty, setSelectedWarranty] =
    React.useState<Warranty | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectedWarranty((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const getAllWarranty = async () => {
    try {
      const res = await getAllWarrantyPage(page, 10);
      if (res.status == "OK") {
        setWarrantyData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllWarranty();
  }, [refresh, page]);
  console.log(selectedWarranty);

  const handleUpdate = () => {
    try {
      const payload = {
        warrantyName: selectedWarranty?.warrantyName,
        description: selectedWarranty?.description,
        period: selectedWarranty?.period,
        duration: Number(selectedWarranty?.duration),
        status: selectedWarranty?.status,
      };
      const id = selectedWarranty?.warranty_id;
      if (!id) return;
      const updatePromise = updateWarranty(id, payload);
      toast.promise(updatePromise, {
        loading: "Updating Warranty",
        success: (res) => {
          setOpenUpdateWarranty(false);
          getAllWarranty();
          return res.message;
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const handleDelete = () => {
    try {
      const id = selectedWarranty?.warranty_id;
      if (!id) return;
      const deletePromise = deleteWarranty(id);
      toast.promise(deletePromise, {
        loading: "Deleting Warranty",
        success: () => {
          setOpenDelete(false);
          getAllWarranty();
          return "Warranty Deleted";
        },
        error: (err) => {
          return err.res.data.message;
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };
  const data: Warranty[] = warrantyData;
  const columns: ColumnDef<Warranty>[] = [
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
      accessorKey: "warrantyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Warranty
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">
          {row.getValue("warrantyName")}
        </div>
      ),
    },

    {
      accessorKey: "description",
      header: () => <div className="text-left">Descriptions</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("description")}
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: () => <div className="text-left">Duration</div>,
      cell: ({ row }) => {
        const duration = row.original.duration;
        const period = row.original.period;

        return (
          <div className="capitalize text-left">
            {duration} {period?.toLowerCase()}
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
        // const product = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedWarranty(row.original);
                setOpenUpdateWarranty(true);
              }}
            >
              <Edit />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenDelete(true);
                setSelectedWarranty(row.original);
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMeteData.hasPrevPage == false}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPage, p + 1))
            }
            disabled={pageMeteData.hasnextPage == false}
          >
            Next
          </Button>
        </div>
      </div>

      {/* updateDialog Box */}
      <Dialog open={openUpdateWarranty} onOpenChange={setOpenUpdateWarranty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Warranty</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 pt-5 mt-3 border-t-2">
            {/* Warranty Name */}
            <div className="grid gap-2">
              <Label>
                Warranty <span className="text-red-500">*</span>
              </Label>
              <Input
                name="warrantyName"
                value={selectedWarranty?.warrantyName}
                onChange={handleUpdateChange}
              />
            </div>

            {/* Duration + Period */}
            <div className="flex gap-4">
              <div className="grid gap-2 w-full">
                <Label>
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="duration"
                  value={selectedWarranty?.duration}
                  onChange={handleUpdateChange}
                />
              </div>

              <div className="grid gap-2 w-full">
                <Label>
                  Period <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedWarranty?.period}
                  onValueChange={(value) =>
                    setSelectedWarranty((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        warrantyPeriod: value,
                      };
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTH">Month</SelectItem>
                    <SelectItem value="YEAR">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="description"
                value={selectedWarranty?.description}
                onChange={handleUpdateChange}
              />
            </div>

            {/* Status */}
            <div className="flex justify-between items-center border-b-2 pb-5">
              <Label>
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                checked={selectedWarranty?.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  setSelectedWarranty((prev) => {
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Update Warranty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* for the Delete */}
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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
