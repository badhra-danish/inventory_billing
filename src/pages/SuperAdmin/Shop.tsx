import { createUserShop } from "@/api/superAdmin/superAdmin";
import UserDataTable from "@/components/superAdmin/ShopUserDataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus, RefreshCcw, ShieldCheck, Store } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Shop() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  // 2. Handle input changes dynamically
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handle form submission
  const handleSubmit = async () => {
    try {
      // Basic validation (optional but recommended)
      if (
        !formData.shopName ||
        !formData.adminEmail ||
        !formData.adminPassword
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      // Prepare payload
      const payload = { ...formData };

      // API call wrapped in toast
      await toast.promise(createUserShop(payload), {
        loading: "Creating Shop Admin User...",
        success: (res: any) => {
          // Reset form
          setOpen(false);
          setFormData({
            shopName: "",
            address: "",
            phone: "",
            adminName: "",
            adminEmail: "",
            adminPassword: "",
          });

          return res?.message || "Shop created successfully";
        },
        error: (err: any) => {
          return err?.response?.data?.message || "Something went wrong";
        },
      });
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <div>
      {" "}
      <>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold text-xl">User</p>
            <p>Manage Your User </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-white text-gray-600 border-1 border-gray p-2 hover:bg-gray-100">
              <RefreshCcw />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                {" "}
                <Button>
                  <CirclePlus />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                </DialogHeader>
                <div className="px-2 py-4">
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
                              value={formData.shopName}
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
                              value={formData.phone}
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
                              value={formData.address}
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
                              value={formData.adminName}
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
                              value={formData.adminEmail}
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
                              value={formData.adminPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              required
                              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* --- Actions Footer --- */}
                    </div>
                  </div>
                </div>
                <div className="border-t-1 pt-5">
                  <DialogFooter>
                    <DialogClose>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}> Create User</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <UserDataTable />
      </>
    </div>
  );
}
