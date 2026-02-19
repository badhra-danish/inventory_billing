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
  deleteBrand,
  getAllBrand,
  upadateBrand,
} from "@/api/brand/BrandApiClient";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import toast from "react-hot-toast";
import {
  deleteWarehouse,
  getAllWarehousePage,
  updateWarehouse,
} from "@/api/WareHouse/WareHouse";

export type Warehouse = {
  warehouse_id: string;
  warehouseName: string;
  code: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
};
type warehouseDatatable = {
  refresh: boolean;
};
export default function WarehouseDataTable({ refresh }: warehouseDatatable) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  //const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
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
  const [warehouseData, setWarehouseData] = React.useState([]);
  const [selectedWarehouse, setSelectedWarehouse] =
    React.useState<Warehouse | null>();
  const [openWarehouseUpdate, setOpenWarehouseUpdate] = React.useState(false);
  const [openWarehosueDelete, setOpenWarehouseDelete] = React.useState(false);
  const getallWarehousePage = async () => {
    try {
      const res = await getAllWarehousePage(page, 10);
      if (res.status === "OK") {
        setWarehouseData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getallWarehousePage();
  }, [page, refresh]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setSelectedWarehouse((prev) => {
      if (!prev) return prev; // Ensure `prev` is not null or undefined
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = () => {
    try {
      const payload = {
        warehouseName: selectedWarehouse?.warehouseName,
        code: selectedWarehouse?.code,
        address: selectedWarehouse?.address,
        status: selectedWarehouse?.status,
      };
      if (!selectedWarehouse?.warehouse_id) {
        console.error("warehouse_id  is undefined");
        return;
      }
      console.log(payload);

      const updatePomise = updateWarehouse(
        selectedWarehouse.warehouse_id,
        payload,
      );
      toast.promise(updatePomise, {
        loading: "Updating Warehouse..",
        success: (res) => {
          setOpenWarehouseUpdate(false);
          getallWarehousePage();
          return res.message;
        },
        error: (err) => {
          console.error("Error During Create:", err);
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = () => {
    try {
      if (selectedWarehouse?.warehouse_id) {
        const deletePromise = deleteWarehouse(selectedWarehouse.warehouse_id);
        toast.promise(deletePromise, {
          loading: "Deleting Brand",
          success: (res) => {
            setOpenWarehouseDelete(false);
            getallWarehousePage();
            return res.message;
          },
          error: (err) => {
            console.error(err);
            return "Warehouse Not Deleted";
          },
        });
      } else {
        console.error("WareHouse ID is undefined");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const data: Warehouse[] = warehouseData;

  const columns: ColumnDef<Warehouse>[] = [
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
      accessorKey: "warehouseName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Brand
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">
          {row.getValue("warehouseName")}
        </div>
      ),
    },

    {
      accessorKey: "code",
      header: () => <div className="text-left">Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left "> {row.getValue("code")}</div>
        );
      },
    },
    {
      accessorKey: "address",
      header: () => <div className="text-left">Address </div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {" "}
            {row.getValue("address")}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Created At</div>,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="capitalize text-left "> {date.toDateString()}</div>
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
        const warehouse = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedWarehouse(warehouse);
                setOpenWarehouseUpdate(true);
              }}
            >
              <Edit />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedWarehouse(warehouse);
                setOpenWarehouseDelete(true);
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMetaData.hasPrevPage === false}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMetaData?.totalPage, p + 1))
            }
            disabled={pageMetaData.hasnextPage === false}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Update dialog */}
      <Dialog open={openWarehouseUpdate} onOpenChange={setOpenWarehouseUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2">
            <div className="grid gap-4">
              <Label htmlFor="category-1">
                {" "}
                Warehouse Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand-1"
                type="text"
                name="warehouseName"
                value={selectedWarehouse?.warehouseName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="category-1">
                {" "}
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand-1"
                type="text"
                name="code"
                value={selectedWarehouse?.code}
                onChange={handleChange}
              />
            </div>{" "}
            <div className="grid gap-4">
              <Label htmlFor="category-1">
                {" "}
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand-1"
                type="text"
                name="address"
                value={selectedWarehouse?.address}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between border-b-2 pb-7">
              <Label htmlFor="category-1">
                {" "}
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                id="status"
                className=" data-[state=checked]:bg-green-500 transition-colors"
                checked={selectedWarehouse?.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  setSelectedWarehouse((prev) => {
                    if (!prev) return prev; // Ensure `prev` is not null or undefined
                    return {
                      ...prev,
                      status: checked ? "ACTIVE" : "INACTIVE",
                    };
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Save Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete dialog */}
      <Dialog open={openWarehosueDelete} onOpenChange={setOpenWarehouseDelete}>
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
