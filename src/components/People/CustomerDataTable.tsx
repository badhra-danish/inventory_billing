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
  Trash,
  Phone,
  Mail,
  UserRound,
} from "lucide-react";

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
import { Badge } from "../ui/badge";
import {
  deleteCustomer,
  getAllCustomertPage,
  updateCustomer,
} from "@/api/Coustomer/CustomerClient";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import toast from "react-hot-toast";
// const data: CustomerDetails[] = [
//   {
//     supplierName: "Travel Mart",
//     date: "10 Sep 2024",
//     total: "1700",
//     paid: "1700",
//     due: "0.00",
//     paymentStatus: "paid",
//     status: "pending",
//   },
//   {
//     supplierName: "Global Supplies",
//     date: "15 Sep 2024",
//     total: "3200",
//     paid: "1000",
//     due: "2200",
//     paymentStatus: "overdue",
//     status: "ordered",
//   },
//   {
//     supplierName: "Smart Traders",
//     date: "19 Sep 2024",
//     total: "2800",
//     paid: "0.00",
//     due: "2800",
//     paymentStatus: "unpaid",
//     status: "pending",
//   },
//   {
//     supplierName: "Metro Wholesale",
//     date: "25 Sep 2024",
//     total: "5600",
//     paid: "5600",
//     due: "0.00",
//     paymentStatus: "paid",
//     status: "received",
//   },
//   {
//     supplierName: "Value Connect",
//     date: "30 Sep 2024",
//     total: "4100",
//     paid: "1500",
//     due: "2600",
//     paymentStatus: "overdue",
//     status: "pending",
//   },
//   {
//     supplierName: "Prime Industries",
//     date: "04 Oct 2024",
//     total: "2400",
//     paid: "0.00",
//     due: "2400",
//     paymentStatus: "unpaid",
//     status: "pending",
//   },
// ];

export type CustomerDetails = {
  customerID: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  postalCode: string;
  state: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
};
interface refreshTable {
  refresh: boolean;
}
export default function CustomerDataTable({ refresh }: refreshTable) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [pageMetaData, setPageMetaData] = React.useState({
    totalPages: 0,
  });
  const [customerData, setCustomerData] = React.useState([]);
  const [selectedCustomer, setSelectecdCustomer] =
    React.useState<CustomerDetails>();
  const [openCustomerDetail, setOpenCustomerdetails] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const getAllCustomer = async () => {
    try {
      const res = await getAllCustomertPage(page, 10);
      if (res.statusCode === 200) {
        setCustomerData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    getAllCustomer();
  }, [refresh]);
  const handleUpdateProduct = () => {
    try {
      const payload = {
        firstName: selectedCustomer?.firstName,
        lastName: selectedCustomer?.lastName,
        email: selectedCustomer?.email,
        phone: selectedCustomer?.phone,
        address: selectedCustomer?.address,
        city: selectedCustomer?.city,
        state: selectedCustomer?.state,
        postalCode: selectedCustomer?.postalCode,
        status: selectedCustomer?.status,
      };
      if (!selectedCustomer?.customerID) return;
      const updatePromise = updateCustomer(
        payload,
        selectedCustomer?.customerID
      );
      toast.promise(updatePromise, {
        loading: "Upadating Customer",
        success: (res) => {
          setOpenUpdate(false);
          getAllCustomer();
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
      if (!selectedCustomer?.customerID) return;
      const deletePromise = deleteCustomer(selectedCustomer?.customerID);
      toast.promise(deletePromise, {
        loading: "Deleting Customer",
        success: () => {
          setOpenDelete(false);
          getAllCustomer();
          return "Delete Successfully";
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went Wrong");
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (!digits) {
        finalValue = "+91 ";
      } else {
        finalValue = digits.startsWith("91")
          ? `+91 ${digits.slice(2)}`
          : `+91 ${digits}`;
      }
    }

    setSelectecdCustomer((prev) => {
      if (!prev) return prev; // <- prevents error when prev is undefined

      return {
        ...prev,
        [name]: finalValue,
      };
    });
  };

  const data: CustomerDetails[] = customerData;
  const columns: ColumnDef<CustomerDetails>[] = [
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
      accessorKey: "firstName",
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
        const { firstName, lastName } = row.original;
        return (
          <div className="flex items-center gap-3">
            <span className="capitalize font-bold">
              {firstName} {lastName}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "email",
      header: () => <div className="text-left">Email</div>,
      cell: ({ row }) => {
        return (
          <div className=" lowercase text-left ">{row.getValue("email")}</div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-left">Phone</div>,
      cell: ({ row }) => {
        return (
          <div className=" lowercase text-left ">{row.getValue("phone")}</div>
        );
      },
    },
    {
      accessorKey: "city",
      header: () => <div className="text-left">City</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left capitalize">{row.getValue("city")}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const status = String(row.getValue("status"));

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
        const customer = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectecdCustomer(customer);
                setOpenCustomerdetails(true);
              }}
            >
              <Eye />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenUpdate(true);
                setSelectecdCustomer(customer);
              }}
            >
              <Edit />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenDelete(true);
                setSelectecdCustomer(customer);
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

              {["All", "Active", "InActive"].map((status) => (
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
            disabled={page == 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMetaData.totalPages, p + 1))
            }
            disabled={page >= pageMetaData?.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={openCustomerDetail} onOpenChange={setOpenCustomerdetails}>
        <DialogContent className="max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 ">
              <UserRound className="w-7 h-7 text-primary" />
              Customer Details
            </DialogTitle>
            <DialogDescription>
              Full profile and contact information of the customer.
            </DialogDescription>
          </DialogHeader>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 justify-between">
            <div>
              <h2 className="text-xl font-bold capitalize">
                {selectedCustomer?.firstName} {selectedCustomer?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCustomer?.email}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Badge
                className={`px-3 py-1 text-sm text-white ${
                  selectedCustomer?.status === "ACTIVE"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {selectedCustomer?.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Information</h3>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" /> {selectedCustomer?.phone}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" /> {selectedCustomer?.email}
            </div>
          </div>

          <Separator />

          {/* Address Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium block text-muted-foreground">
                  Address
                </span>
                <span className="capitalize">{selectedCustomer?.address}</span>
              </div>

              <div>
                <span className="font-medium block text-muted-foreground">
                  City
                </span>
                <span className="capitalize">{selectedCustomer?.city}</span>
              </div>

              <div>
                <span className="font-medium block text-muted-foreground">
                  State
                </span>
                <span className="capitalize">{selectedCustomer?.state}</span>
              </div>

              <div>
                <span className="font-medium block text-muted-foreground">
                  Postal Code
                </span>
                <span>{selectedCustomer?.postalCode}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status */}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* for update */}
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogTrigger asChild>
          {/* This trigger is optional; use Edit button in your table */}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Update Customer</DialogTitle>
          </DialogHeader>

          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            {/* First / Last */}
            <div className="flex gap-2">
              <div className="w-full grid gap-3">
                <Label>
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={selectedCustomer?.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  value={selectedCustomer?.lastName}
                />
              </div>
            </div>

            {/* Email / Phone */}
            <div className="flex gap-2">
              <div className="w-full grid gap-3">
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={selectedCustomer?.email}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  maxLength={14}
                  value={selectedCustomer?.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid gap-4">
              <Label>
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="address"
                value={selectedCustomer?.address}
                onChange={handleChange}
              />
            </div>

            {/* City / State */}
            <div className="flex gap-2">
              <div className="w-full grid gap-3">
                <Label>
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="city"
                  value={selectedCustomer?.city}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="state"
                  value={selectedCustomer?.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="grid gap-4">
              <Label>
                Postal Code <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="postalCode"
                value={selectedCustomer?.postalCode}
                onChange={handleChange}
              />
            </div>

            {/* Status (Switch) */}
            <div className="flex items-center justify-between">
              <Label htmlFor="category-1">
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                id="status"
                className="data-[state=checked]:bg-green-500 transition-colors"
                checked={selectedCustomer?.status === "ACTIVE"}
                onCheckedChange={(checked) =>
                  setSelectecdCustomer((prev) => {
                    if (!prev) return prev; // <-- handle undefined state safely

                    return {
                      ...prev,
                      status: checked ? "ACTIVE" : "INACTIVE",
                    };
                  })
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateProduct}>Save Change</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* for the delete  */}
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
