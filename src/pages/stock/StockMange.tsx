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
                Add Sub Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
              <DialogHeader>
                <DialogTitle>Add Sub Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-2">
                <div className="flex items-center gap-5">
                  <div>
                    {imageUrl ? (
                      <>
                        <div className="w-32 h-32 border-2 overflow-hidden flex items-center justify-center bg-gray-50 rounded-lg object-contain">
                          <img
                            src={imageUrl}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {" "}
                        <div className="w-30 h-30 border-2 rounded-lg flex items-center justify-center flex-col text-gray-500">
                          <CirclePlus />
                          <p className="text-gray-500  text-sm">Add Image</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center flex-col">
                    <label htmlFor="image-upload">
                      <Button asChild>
                        <span>Upload Image</span>
                      </Button>
                    </label>

                    {/* Hidden input field */}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {fileName ? fileName : <p>JPEG, PNG up to 2 MB</p>}
                  </div>
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Category <span className="text-red-500">*</span>
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

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Sub Category <span className="text-red-500">*</span>
                  </Label>
                  <Input type="text" name="sub-category" />
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Category Code <span className="text-red-500">*</span>
                  </Label>
                  <Input type="text" name="category-code" />
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Descriptions <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter category description..."
                    className="min-h-[80px] resize-y"
                  />
                </div>

                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label>
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
                <Button>Add Category</Button>
              </DialogFooter>
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
