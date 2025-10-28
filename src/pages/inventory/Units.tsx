import React from "react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import UnitsDataTable from "@/components/inventory/UnitDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
function UnitsPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Units </p>
          <p>Manage Your Units</p>
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
          <Dialog>
            <DialogTrigger>
              {" "}
              <Button>
                <CirclePlus />
                Add Units
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Units </DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-2">
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Unit Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="category-1" type="text" name="category" />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="category-1">
                    {" "}
                    Short Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="category-1" type="text" name="category" />
                </div>
                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label htmlFor="category-1">
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    id="status"
                    className=" data-[state=checked]:bg-green-500 transition-colors"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button>Add Unit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <UnitsDataTable />
    </>
  );
}

export default UnitsPage;
