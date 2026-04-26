"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllShopAdmin, updateShopUser } from "@/api/superAdmin/superAdmin";
import { Edit, ShieldCheck, Store, Trash } from "lucide-react";
import toast from "react-hot-toast";

// ✅ TYPE
export type User = {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  shop: {
    shop_id: string;
    shop_name: string;
    address: string;
    phone: string;
  };
};

export default function UserDataTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isOpenEditModel, setIsOpenEditModel] = React.useState(false);
  const [selctedUser, setSelectedUser] = React.useState<User | null>(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllShopAdmin();

      if (res?.status === "OK") {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => {
      if (!prev) return prev;

      switch (name) {
        case "shopName":
          return {
            ...prev,
            shop: {
              ...prev.shop,
              shop_name: value,
            },
          };
        case "phone":
          return {
            ...prev,
            shop: {
              ...prev.shop,
              phone: value,
            },
          };
        case "address":
          return {
            ...prev,
            shop: {
              ...prev.shop,
              address: value,
            },
          };
        case "adminName":
          return {
            ...prev,
            name: value,
          };
        case "adminEmail":
          return {
            ...prev,
            email: value,
          };
        case "adminPassword":
          return {
            ...prev,
            password: value,
          };
        default:
          return prev;
      }
    });
  };

  const handleSubmit = async () => {
    try {
      // Prepare payload
      const payload = {
        shopName: selctedUser?.shop.shop_name,
        address: selctedUser?.shop.address,
        phone: selctedUser?.shop.phone,
        adminName: selctedUser?.name,
        adminEmail: selctedUser?.email,
        adminPassword: selctedUser?.password,
      };
      // validation
      if (
        !payload.shopName ||
        !payload.address ||
        !payload.phone ||
        !payload.adminName ||
        !payload.adminEmail
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      const id = selctedUser?.shop.shop_id;
      if (!id) return;
      await toast.promise(updateShopUser(id, payload), {
        loading: "Updating Shop Admin User...",
        success: (res: any) => {
          setIsOpenEditModel(false);
          setSelectedUser(null);

          return res?.message || "Shop Updated successfully";
        },
        error: (err: any) => {
          return err?.response?.data?.message || "Something went wrong";
        },
      });
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  // ✅ FILTER DATA
  const filteredData = React.useMemo(() => {
    return data.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // ✅ COLUMNS
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User Name",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-gray-600">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "shop.shop_name",
      header: "Shop Name",
      cell: ({ row }) => <div>{row.original.shop?.shop_name}</div>,
    },
    {
      accessorKey: "shop.address",
      header: "Address",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.shop?.address}
        </div>
      ),
    },
    {
      accessorKey: "shop.phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.original.shop?.phone}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setIsOpenEditModel(true);
                setSelectedUser(user);
              }}
            >
              <Edit />
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                console.log("Delete", user.user_id);
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
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* 🔍 SEARCH */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={getAllUsers}>Refresh</Button>
      </div>

      {/* 📊 TABLE */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>Loading...</TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={columns.length}>No data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpenEditModel} onOpenChange={setIsOpenEditModel}>
        <DialogContent className="sm:max-w-[700px] max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 custom-scrollbar border-none rounded-2xl shadow-2xl">
          {/* Header Section */}
          <DialogHeader className=" p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-[#1e293b]">
              Update User ..
            </DialogTitle>
            <DialogDescription>
              Update Your User Detail and Manage{" "}
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="px-5 py-4">
              {/* Main Card Container */}
              <div className="w-full ">
                {/* Page Header */}

                {/* Form */}
                <div className="">
                  {/* --- Section 1: Shop Details --- */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Store className="text-primary w-5 h-5" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Shop Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Shop Name */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Shop Name
                        </label>
                        <input
                          type="text"
                          name="shopName"
                          value={selctedUser?.shop.shop_name}
                          onChange={handleChange}
                          placeholder="e.g. Badhra Son"
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={selctedUser?.shop.phone}
                          onChange={handleChange}
                          placeholder="e.g. 9876543210"
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      {/* Address */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Complete Address
                        </label>
                        <textarea
                          name="address"
                          value={selctedUser?.shop.address}
                          onChange={handleChange}
                          placeholder="Enter full shop address..."
                          rows={3}
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-200" />

                  {/* --- Section 2: Admin Account --- */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-primary w-5 h-5" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Admin Account
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Admin Name */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Admin Full Name
                        </label>
                        <input
                          type="text"
                          name="adminName"
                          value={selctedUser?.name}
                          onChange={handleChange}
                          placeholder="e.g. John Doe"
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      {/* Admin Email */}
                      <div className="col-span-1">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          name="adminEmail"
                          value={selctedUser?.email}
                          onChange={handleChange}
                          placeholder="admin@example.com"
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      {/* Admin Password */}
                      <div className="col-span-1">
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                          Temporary Password
                        </label>
                        <input
                          type="password"
                          name="adminPassword"
                          value={selctedUser?.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Actions Footer --- */}
                  <div className="border-t-1 pt-5">
                    <DialogFooter>
                      <DialogClose>
                        <Button variant={"outline"}>Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
