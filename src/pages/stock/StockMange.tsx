import React, { useState } from "react";
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
import { CirclePlus, Plus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StockMangeDatatable from "@/components/stock/StockDataTable";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
function StockMangepage() {
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Sub Category </p>
          <p>Manage Your Sub-Categories</p>
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
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
              <DialogHeader>
                <DialogTitle>Add Stock</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Product Type <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label
                        htmlFor="single"
                        className="font-normal cursor-pointer"
                      >
                        Single Product
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="variable" id="variable" />
                      <Label
                        htmlFor="variable"
                        className="font-normal cursor-pointer"
                      >
                        Variable Product
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Product <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => console.log("Selected:", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="finishing">Finishing</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Product details codec,quantiy */}
                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Code <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" name="sub-category" readOnly disabled />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" name="sub-category" readOnly disabled />
                  </div>
                </div>

                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Selling Price <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" name="sub-category" readOnly disabled />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Purchase Price <span className="text-red-500">*</span>
                    </Label>
                    <Input type="text" name="sub-category" readOnly disabled />
                  </div>
                </div>
                {/* *** */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input type="text" name="sub-category" />
                </div>
                {/* *** */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => console.log("Selected:", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wood">InStock</SelectItem>
                      <SelectItem value="hardware">StockOut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t-1 pt-5">
                <DialogFooter>
                  <DialogClose>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button>Add Stock</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <StockMangeDatatable />
    </>
  );
}

export default StockMangepage;
