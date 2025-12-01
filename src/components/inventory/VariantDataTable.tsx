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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
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
  deleteAttribute,
  getAllVaariantAttribute,
  updateAttribute,
} from "@/api/VariantAttribute/Attributeclinet";
import toast from "react-hot-toast";
// const data: Variants[] = [
//   // {
//   //   variant: "material",
//   //   values: [
//   //     {
//   //       value: "red",
//   //     },
//   //     {
//   //       value: "blue",
//   //     },
//   //     {
//   //       value: "green",
//   //     },
//   //   ],
//   //   createdDate: "24 Dec 2024",
//   //   status: "active",
//   // },
//   // {
//   //   variant: "color",
//   //   values: [
//   //     {
//   //       value: "red",
//   //     },
//   //     {
//   //       value: "blue",
//   //     },
//   //     {
//   //       value: "green",
//   //     },
//   //   ],
//   //   createdDate: "24 Dec 2024",
//   //   status: "active",
//   // },
// ];

export type Variants = {
  attributeID: string;
  name: string;
  values: { value: string }[];
  createdDate: string;
  status: "active" | "inactive";
};
type refreshTable = {
  refresh: boolean;
};
type OldValue = {
  attributeValueID?: string; // optional because new added values have no ID
  value: string;
};
export default function VariantDataTable({ refresh }: refreshTable) {
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
  const [page, setPage] = React.useState(1);
  const [pageMetaData, setPageMetaData] = React.useState({
    totalPages: 0,
    totalElements: 0,
    elementCountInCurrentPage: 0,
    currentPageNumber: 0,
  });

  const [rowSelection, setRowSelection] = React.useState({});

  const [openupdateVarAttribute, setOpenUpdateVarAttribute] =
    React.useState(false);
  const [variantData, setVariantData] = React.useState([]);
  const [oldValues, setOldValues] = React.useState<OldValue[]>([]);
  const [newValues, setNewValues] = React.useState<string[]>([]);
  const [deletedValues, setDeletedValues] = React.useState<string[]>([]);
  const [variantName, setVariantName] = React.useState("");
  const [currentValue, setCurrentValue] = React.useState("");

  const [openDeleteDilaog, setOpenDeleteDilaog] = React.useState(false);
  const [AttributeId, setAttributeId] = React.useState("");
  const getAllVariantAttributeData = async () => {
    try {
      const res = await getAllVaariantAttribute(page, 10);
      if (res.statusCode === 200) {
        setVariantData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllVariantAttributeData();
  }, [page, refresh]);

  //  for Upadte
  const handleUpdateOldValue = (index: number, newText: string) => {
    setOldValues((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: newText };
      return updated;
    });
  };
  const handleRemoveValue = (item: OldValue | string) => {
    if (typeof item === "object") {
      // Old DB value → remove & mark delete
      setDeletedValues((prev) => [...prev, String(item.attributeValueID)]);
      setOldValues((prev) =>
        prev.filter((v) => v.attributeValueID !== item.attributeValueID)
      );
    } else {
      // New value → just remove from newValues
      setNewValues((prev) => prev.filter((v) => v !== item));
    }
  };

  const handleAddNewValue = (v: string) => {
    if (!v.trim()) return;
    setNewValues((prev) => [...prev, v]);
    setCurrentValue(""); // clear input
  };
  const handleUpdateAttribute = () => {
    const payload = {
      name: variantName,
      attributeValues: [
        ...oldValues.map((v) => ({
          attributeValueID: v.attributeValueID,
          value: v.value,
        })), // UPDATED
        ...newValues.map((v) => ({ value: v })), // ADDED
        ...deletedValues.map((id) => ({ attributeValueID: id })), // DELETED
      ],
    };

    // const updatePromise = updateAttribute(AttributeId )
    console.log(payload);
    // axios.put("/update", payload)
  };

  const handleDeleteAttribute = () => {
    try {
      const deletePromise = deleteAttribute(AttributeId);
      toast.promise(deletePromise, {
        loading: "Deleting Attribute",
        success: (res) => {
          setOpenDeleteDilaog(false);
          getAllVariantAttributeData();
          return "Attribute Deleted..";
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const data: Variants[] = variantData;
  const columns: ColumnDef<Variants>[] = [
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
            Variant
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "values",
      header: () => <div className="text-left">Values</div>,
      cell: ({ row }) => {
        const values = row.getValue("values") as { value: string }[];
        return (
          <div className="capitalize text-left">
            {values.map((v) => v.value).join(", ")}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "createdDate",
    //   header: () => <div className="text-left">Created Date</div>,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="capitalize text-left ">
    //         {row.getValue("createdDate")}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "status",
    //   header: () => <div className="text-left">Status</div>,
    //   cell: ({ row }) => {
    //     const status: string = row.getValue("status");

    //     const colorClass =
    //       status === "active"
    //         ? "bg-green-400 text-white"
    //         : "bg-red-400 text-white";

    //     return (
    //       <div className="text-left">
    //         <span
    //           className={`capitalize px-1.5 py-1 rounded-sm text-xs font-normal ${colorClass}`}
    //         >
    //           {status}
    //         </span>
    //       </div>
    //     );
    //   },
    // },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const varriantAttribute = row.original;
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenUpdateVarAttribute(true);
                setVariantName(varriantAttribute.name);
                setOldValues(varriantAttribute.values);
                setNewValues([]);
                setDeletedValues([]);
                setAttributeId(varriantAttribute.attributeID);
              }}
            >
              <Edit />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenDeleteDilaog(true);
                setAttributeId(varriantAttribute.attributeID);
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

      {/* update Dialog */}
      <Dialog
        open={openupdateVarAttribute}
        onOpenChange={setOpenUpdateVarAttribute}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Attribute</DialogTitle>
            <DialogDescription>Update, add or remove values</DialogDescription>
          </DialogHeader>

          {/* Variant Name */}
          <Input
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            placeholder="Attribute Name"
            className="mt-2"
          />

          {/* Editable Values */}
          <div className="flex flex-wrap gap-2 mt-4 border rounded p-3">
            {oldValues.map((item, index) => (
              <Badge
                key={item.attributeValueID}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <input
                  value={item.value}
                  onChange={(e) => handleUpdateOldValue(index, e.target.value)}
                  className="bg-transparent outline-none text-sm w-8"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue(item)}
                  className="hover:text-red-600"
                >
                  <X className="w-2 h-2" />
                </button>
              </Badge>
            ))}

            {newValues.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(item)}
                  className="hover:text-red-600"
                >
                  <X className="w-2 h-2" />
                </button>
              </Badge>
            ))}

            <input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleAddNewValue(currentValue)
              }
              placeholder="Add new value"
              className="outline-none bg-transparent flex-grow"
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateAttribute}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog Box */}
      <Dialog open={openDeleteDilaog} onOpenChange={setOpenDeleteDilaog}>
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
            <Button variant="destructive" onClick={handleDeleteAttribute}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
