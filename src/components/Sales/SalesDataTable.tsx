import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

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
  MenubarTrigger,
} from "@/components/ui/menubar";
// import { useNavigate } from "react-router-dom";
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
//import trashImg from "../../assets/images/trash.jpg";
import custImg from "../../assets/images/customer.jpg";
import { Badge } from "../ui/badge";
const data: SalesDetail[] = [
  {
    imgUrl: custImg,
    customer: "JHones",
    refrence: "SL0021",
    date: "12-MAR-2024",
    status: "Completed",
    grandTotal: "12,000",
    paid: "2000",
    due: "10,000",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Mohan Kumar",
    refrence: "SL0022",
    date: "15-MAR-2024",
    status: "Pending",
    grandTotal: "8,500",
    paid: "5,000",
    due: "3,500",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Aisha Patel",
    refrence: "SL0023",
    date: "20-MAR-2024",
    status: "Completed",
    grandTotal: "15,000",
    paid: "15,000",
    due: "0",
    paymentStatus: "Paid",
  },
  {
    imgUrl: custImg,
    customer: "Rahul Sharma",
    refrence: "SL0024",
    date: "25-MAR-2024",
    status: "Cancelled",
    grandTotal: "6,200",
    paid: "0",
    due: "6,200",
    paymentStatus: "Unpaid",
  },
  {
    imgUrl: custImg,
    customer: "Sneha Verma",
    refrence: "SL0025",
    date: "28-MAR-2024",
    status: "Completed",
    grandTotal: "22,000",
    paid: "20,000",
    due: "2,000",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "David Wilson",
    refrence: "SL0026",
    date: "02-APR-2024",
    status: "Pending",
    grandTotal: "9,200",
    paid: "4,000",
    due: "5,200",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Anil Mehta",
    refrence: "SL0027",
    date: "05-APR-2024",
    status: "Completed",
    grandTotal: "18,500",
    paid: "18,500",
    due: "0",
    paymentStatus: "Paid",
  },
  {
    imgUrl: custImg,
    customer: "Emma Watson",
    refrence: "SL0028",
    date: "07-APR-2024",
    status: "Completed",
    grandTotal: "27,000",
    paid: "10,000",
    due: "17,000",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Ramesh Chauhan",
    refrence: "SL0029",
    date: "10-APR-2024",
    status: "Completed",
    grandTotal: "14,800",
    paid: "10,000",
    due: "4,800",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Priya Nair",
    refrence: "SL0030",
    date: "12-APR-2024",
    status: "Pending",
    grandTotal: "7,400",
    paid: "3,000",
    due: "4,400",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Chris Martin",
    refrence: "SL0031",
    date: "14-APR-2024",
    status: "Completed",
    grandTotal: "32,000",
    paid: "32,000",
    due: "0",
    paymentStatus: "Paid",
  },
  {
    imgUrl: custImg,
    customer: "Vinay Gupta",
    refrence: "SL0032",
    date: "16-APR-2024",
    status: "Completed",
    grandTotal: "11,500",
    paid: "2,000",
    due: "9,500",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Sarah Thompson",
    refrence: "SL0033",
    date: "18-APR-2024",
    status: "Cancelled",
    grandTotal: "5,900",
    paid: "0",
    due: "5,900",
    paymentStatus: "Unpaid",
  },
  {
    imgUrl: custImg,
    customer: "Kunal Singh",
    refrence: "SL0034",
    date: "20-APR-2024",
    status: "Pending",
    grandTotal: "19,200",
    paid: "12,000",
    due: "7,200",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Olivia Brown",
    refrence: "SL0035",
    date: "22-APR-2024",
    status: "Completed",
    grandTotal: "24,000",
    paid: "24,000",
    due: "0",
    paymentStatus: "Paid",
  },
  {
    imgUrl: custImg,
    customer: "Rohit Verma",
    refrence: "SL0036",
    date: "25-APR-2024",
    status: "Completed",
    grandTotal: "17,800",
    paid: "5,000",
    due: "12,800",
    paymentStatus: "OverDue",
  },
  {
    imgUrl: custImg,
    customer: "Daniel Harris",
    refrence: "SL0037",
    date: "26-APR-2024",
    status: "Pending",
    grandTotal: "9,900",
    paid: "0",
    due: "9,900",
    paymentStatus: "Unpaid",
  },
  {
    imgUrl: custImg,
    customer: "Siddharth Patel",
    refrence: "SL0038",
    date: "28-APR-2024",
    status: "Completed",
    grandTotal: "29,500",
    paid: "20,000",
    due: "9,500",
    paymentStatus: "OverDue",
  },
];

export type SalesDetail = {
  imgUrl: string;
  customer: string;
  refrence: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
  grandTotal: string;
  paid: string;
  due: string;
  paymentStatus: "Paid" | "Unpaid" | "OverDue";
};

export default function SalesDataTable() {
  // const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns: ColumnDef<SalesDetail>[] = [
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
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const sales = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* Customer Image */}
            <img
              src={sales.imgUrl}
              alt={sales.customer}
              className="w-10 h-10 rounded-full object-cover border"
            />

            {/* Customer Name */}
            <span className="capitalize font-bold">
              {row.getValue("customer")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "refrence",
      header: () => <div className="text-left">Refrence</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("refrence")}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-left">Date</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">{row.getValue("date")}</div>
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

        if (status === "completed") {
          color = "bg-green-400";
        } else if (status === "pending") {
          color = "bg-blue-400";
        } else if (status === "cancelled") {
          color = "bg-red-400 ";
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
      accessorKey: "grandTotal",
      header: () => <div className="text-left">Total</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            ₹{row.getValue("grandTotal")}
          </div>
        );
      },
    },
    {
      accessorKey: "paid",
      header: () => <div className="text-left">Paid</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">₹{row.getValue("paid")}</div>
        );
      },
    },
    {
      accessorKey: "due",
      header: () => <div className="text-left">Due</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">₹{row.getValue("due")}</div>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: () => <div className="text-left">Payment Status</div>,
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
      cell: () => {
        //const product = row.original;
        return (
          <div>
            <Menubar className="border-0 bg-transparent shadow-none">
              <MenubarMenu>
                <MenubarTrigger>
                  <EllipsisVertical className="w-5 h-5 hover:text-blue-600" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    {" "}
                    <Eye />
                    Sales Details
                  </MenubarItem>
                  <MenubarItem>
                    <Edit />
                    Edit Sales
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <CirclePlus />
                    Create Payment
                  </MenubarItem>
                  <MenubarItem>
                    <BadgeIndianRupee />
                    Show Payment
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Trash />
                    Delete Sales
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
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
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Brand: {selectedBrand} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter By Brand
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                "All",
                "GreenPly",
                "Century",
                "Taparia",
                "Alstone",
                "Pidilite",
              ].map((brand) => (
                <DropdownMenuItem
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const brandColumn = table.getColumn("brand");
                    if (brandColumn) {
                      brandColumn.setFilterValue(brand === "All" ? "" : brand);
                    }
                  }}
                >
                  {brand}
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
