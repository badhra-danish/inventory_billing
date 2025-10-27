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
import Category from "@/components/inventory/CategoryDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
function CategoryDataTablepage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Category </p>
          <p>Manage Your categories</p>
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
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-2">
                <div className="grid gap-4">
                  <Label htmlFor="category-1"> Category</Label>
                  <Input id="category-1" type="text" name="category" />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="category-1"> Slug Category</Label>
                  <Input id="category-1" type="text" name="category" />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="category-1"> Status</Label>
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
      <Category />
    </>
  );
}

export default CategoryDataTablepage;
