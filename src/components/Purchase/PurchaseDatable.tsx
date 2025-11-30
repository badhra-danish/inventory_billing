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
  EllipsisVertical,
  ReceiptIndianRupee,
  ReceiptIndianRupeeIcon,
  BadgeIndianRupee,
  CirclePlus,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import custImg from "../../assets/images/customer.jpg";
import { Badge } from "../ui/badge";
const data: PurchaseDetails[] = [
  {
    supplierName: "Travel Mart",
    date: "10 Sep 2024",
    total: "1700",
    paid: "1700",
    due: "0.00",
    paymentStatus: "paid",
    status: "pending",
  },
  {
    supplierName: "Global Supplies",
    date: "15 Sep 2024",
    total: "3200",
    paid: "1000",
    due: "2200",
    paymentStatus: "overdue",
    status: "ordered",
  },
  {
    supplierName: "Smart Traders",
    date: "19 Sep 2024",
    total: "2800",
    paid: "0.00",
    due: "2800",
    paymentStatus: "unpaid",
    status: "pending",
  },
  {
    supplierName: "Metro Wholesale",
    date: "25 Sep 2024",
    total: "5600",
    paid: "5600",
    due: "0.00",
    paymentStatus: "paid",
    status: "received",
  },
  {
    supplierName: "Value Connect",
    date: "30 Sep 2024",
    total: "4100",
    paid: "1500",
    due: "2600",
    paymentStatus: "overdue",
    status: "pending",
  },
  {
    supplierName: "Prime Industries",
    date: "04 Oct 2024",
    total: "2400",
    paid: "0.00",
    due: "2400",
    paymentStatus: "unpaid",
    status: "pending",
  },
];

export type PurchaseDetails = {
  supplierName: string;
  date: string;
  total: string;
  paid: string;
  due: string;
  status: "pending" | "ordered" | "received";
  paymentStatus: "unpaid" | "paid" | "overdue";
};

export default function PurchaseDataTable() {
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
  const columns: ColumnDef<PurchaseDetails>[] = [
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
      accessorKey: "supplierName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        //const sales = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* Customer Image */}

            {/* Customer Name */}
            <span className="capitalize font-bold">
              {row.getValue("supplierName")}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "date",
      header: () => <div className="text-left">Supplier Name</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("date")}</div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const status = String(row.getValue("status")).toLowerCase();

        let color = "bg-gray-500";
        let label = status;

        if (status === "received") {
          color = "bg-green-400";
        } else if (status === "pending") {
          color = "bg-blue-400";
        } else if (status === "ordered") {
          color = "bg-yellow-400 ";
        }
        return (
          <div className="lowercase text-left">
            <Badge
              className={`${color} px-3 py-1 rounded-md capitalize text-[10px]`}
            >
              {label}
            </Badge>
          </div>
        );
      },
    },

    {
      accessorKey: "total",
      header: () => <div className="text-left">Total</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">{row.getValue("total")}</div>
        );
      },
    },

    {
      accessorKey: "paid",
      header: () => <div className="text-left">Paid</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">{row.getValue("paid")}</div>
        );
      },
    },

    {
      accessorKey: "due",
      header: () => <div className="text-left"> Due</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">{row.getValue("due")}</div>
        );
      },
    },

    {
      accessorKey: "paymentStatus",
      header: () => <div className="text-left"> Status</div>,
      cell: ({ row }) => {
        const status = String(row.getValue("paymentStatus")).toLowerCase();

        let color = "bg-gray-500";
        let label = status;

        if (status === "paid") {
          color = "bg-green-100 text-green-400 ";
        } else if (status === "overdue") {
          color = "bg-yellow-50 text-yellow-400";
        } else if (status === "unpaid") {
          color = "bg-red-50 text-red-400";
        }
        return (
          <div className="lowercase text-left">
            <Badge
              className={`${color} px-3 py-1 rounded-md capitalize font-semibold flex items-center`}
            >
              {label}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
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
      {/*  Top Toolbar */}
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

          {/* <DropdownMenu>
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
          </DropdownMenu> */}

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
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter By Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {["All", "paid", "unpaid", "overdue"].map((status) => (
                <DropdownMenuItem
                  key={status}
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
