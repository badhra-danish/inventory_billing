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
const data: InvoiceDetails[] = [
  {
    invoiceNo: "INV006",
    customer: "Mark Joslyn",
    dueDate: "24 Dec 2024",
    amount: "500",
    paid: "0.00",
    amountDue: "500",
    status: "unpaid",
  },
  {
    invoiceNo: "INV007",
    customer: "John Carter",
    dueDate: "28 Dec 2024",
    amount: "750",
    paid: "250.00",
    amountDue: "500",
    status: "overdue",
  },
  {
    invoiceNo: "INV008",
    customer: "Emily Watson",
    dueDate: "30 Dec 2024",
    amount: "1200",
    paid: "1200.00",
    amountDue: "0.00",
    status: "paid",
  },
  {
    invoiceNo: "INV009",
    customer: "Ava Smith",
    dueDate: "02 Jan 2025",
    amount: "950",
    paid: "0.00",
    amountDue: "950",
    status: "unpaid",
  },
  {
    invoiceNo: "INV010",
    customer: "Michael Brown",
    dueDate: "05 Jan 2025",
    amount: "650",
    paid: "100.00",
    amountDue: "550",
    status: "overdue",
  },
  {
    invoiceNo: "INV008",
    customer: "Emily Watson",
    dueDate: "30 Dec 2024",
    amount: "1200",
    paid: "1200.00",
    amountDue: "0.00",
    status: "paid",
  },
  {
    invoiceNo: "INV009",
    customer: "Ava Smith",
    dueDate: "02 Jan 2025",
    amount: "950",
    paid: "0.00",
    amountDue: "950",
    status: "unpaid",
  },
  {
    invoiceNo: "INV008",
    customer: "Emily Watson",
    dueDate: "30 Dec 2024",
    amount: "1200",
    paid: "1200.00",
    amountDue: "0.00",
    status: "paid",
  },
  {
    invoiceNo: "INV009",
    customer: "Ava Smith",
    dueDate: "02 Jan 2025",
    amount: "950",
    paid: "0.00",
    amountDue: "950",
    status: "unpaid",
  },
];

export type InvoiceDetails = {
  invoiceNo: string;
  customer: string;
  dueDate: string;
  amount: string;
  paid: string;
  amountDue: string;
  status: "unpaid" | "paid" | "overdue";
};

export default function InvoiceDataTable() {
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
  const columns: ColumnDef<InvoiceDetails>[] = [
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
      accessorKey: "invoiceNo",
      header: () => <div className="text-left">Inovoice No</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("invoiceNo")}
          </div>
        );
      },
    },

    {
      accessorKey: "customer",
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
        const sales = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* Customer Image */}

            {/* Customer Name */}
            <span className="capitalize font-bold">
              {row.getValue("customer")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: () => <div className="text-left">Due Date</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("dueDate")}</div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-left">Amount</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">{row.getValue("amount")}</div>
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
      accessorKey: "amountDue",
      header: () => <div className="text-left">Amount Due</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">
            {row.getValue("amountDue")}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => <div className="text-left"> Status</div>,
      cell: ({ row }) => {
        const status = String(row.getValue("status")).toLowerCase();

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
