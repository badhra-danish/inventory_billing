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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import WarrantiesDataTable from "@/components/inventory/WarrantieDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
function WarrantiesPage() {
  const [values, setValues] = React.useState<string[]>([]);
  const [currentValue, setCurrentValue] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // When user types a comma, create a new chip
    if (val.endsWith(",")) {
      const newValue = val.slice(0, -1).trim();
      if (newValue && !values.includes(newValue)) {
        setValues([...values, newValue]);
      }
      setCurrentValue(""); // clear input after comma
    } else {
      setCurrentValue(val);
    }
  };

  const handleRemoveValue = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    setValues(updated);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Warranty </p>
          <p>Manage Your Warranty</p>
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
                Add Warranty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Warranty </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 pt-5 mt-3 border-t-2">
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Warranty <span className="text-red-500">*</span>
                  </Label>
                  <Input id="category-1" type="text" name="category" />
                </div>
                <div className="flex items-center justify-between gap-5">
                  <div className="grid gap-4 w-full">
                    <Label htmlFor="category-1">
                      {" "}
                      Duration<span className="text-red-500">*</span>
                    </Label>
                    <Input id="category-1" type="text" name="category" />
                  </div>{" "}
                  <div className="grid gap-4 w-full">
                    <Label htmlFor="category-1">
                      {" "}
                      Period<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => console.log("Selected:", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wood">Month</SelectItem>
                        <SelectItem value="hardware">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>{" "}
                </div>
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Descriptions <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter Warranty description..."
                    className="min-h-[80px] resize-y"
                  />
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
                <Button>Add Warranty</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <WarrantiesDataTable />
    </>
  );
}

export default WarrantiesPage;
