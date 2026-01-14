import React from "react";
import { Button } from "@/components/ui/button";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { CirclePlus, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import CustomerDataTable from "@/components/People/CustomerDataTable";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createCustomer } from "@/api/Coustomer/CustomerClient";
import toast from "react-hot-toast";

export const Customer = () => {
  interface Customer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    status: "ACTIVE" | "INACTIVE";
  }
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [customerFormData, setCustomerFormData] = React.useState<Customer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    status: "INACTIVE",
  });
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

    setCustomerFormData((prev: Customer) => ({
      ...prev,
      [name]: finalValue,
    }));
  };
  console.log(customerFormData);

  const handleCreateCustomer = async () => {
    try {
      const payload = {
        firstName: customerFormData.firstName,
        lastName: customerFormData.lastName,
        email: customerFormData.email,
        phone: customerFormData.phone,
        address: customerFormData.address,
        city: customerFormData.city,
        state: customerFormData.state,
        postalCode: customerFormData.postalCode,
        status: customerFormData.status,
      };
      const createPromise = createCustomer(payload);
      toast.promise(createPromise, {
        loading: "Creating Customer.",
        success: (res) => {
          setCustomerFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            status: "INACTIVE",
          });
          setOpen(false);
          setRefresh(true);
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
  // console.log(customerFormData);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Customer </p>
          <p>Manage Your Customer </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={pdfImg} className="w-5 h-6" />
          </Button>
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={xslImg} className="w-5 h-6" />
          </Button>
          <Button className="bg-white text-gray-600 border-1 border-gray p-2 hover:bg-gray-100">
            <RefreshCcw />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              {" "}
              <Button onClick={() => setOpen(true)}>
                <CirclePlus />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
                {/* Product details codec,quantiy */}
                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={customerFormData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      value={customerFormData.lastName}
                    />
                  </div>
                </div>

                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={customerFormData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Phone<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      maxLength={14}
                      value={customerFormData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* *** */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    name="address"
                    value={customerFormData.address}
                    onChange={handleChange}
                  />
                </div>
                {/*vfdfcdcd*/}
                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="city"
                      value={customerFormData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      State<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="state"
                      onChange={handleChange}
                      value={customerFormData.state}
                    />
                  </div>
                </div>
                {/* dffdf */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="postalCode"
                    onChange={handleChange}
                    value={customerFormData.postalCode}
                  />
                </div>
                {/* *** */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="category-1">
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    id="status"
                    className=" data-[state=checked]:bg-green-500 transition-colors"
                    checked={customerFormData.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      setCustomerFormData((prev) => ({
                        ...prev,
                        status: checked ? "ACTIVE" : "INACTIVE",
                      }))
                    }
                  />
                </div>
              </div>

              <div className="border-t-1 pt-5">
                <DialogFooter>
                  <DialogClose>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateCustomer}> Add Customer</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          {/* <Dialog>
            <DialogTrigger>
              <Button>
                <CirclePlus />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
      <CustomerDataTable refresh={refresh} />
    </>
  );
};
