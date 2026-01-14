import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import CategoryDataTable from "@/components/inventory/CategoryDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/api/Category-subCategory/ApiClient";
import toast from "react-hot-toast";
function CategoryPage() {
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [categoryFormData, setcategoryFormData] = React.useState({
    categoryname: "",
    slugName: "",
    status: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setcategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async () => {
    try {
      const payload = {
        name: categoryFormData.slugName,
        slug: categoryFormData.slugName,
        status: categoryFormData.status ? "ACTIVE" : "INACTIVE",
      };

      const promise = createCategory(payload);

      await toast.promise(promise, {
        loading: "Creating category...",
        success: () => {
          setOpen(false);
          setRefresh((prev) => !prev);
          setcategoryFormData({
            categoryname: "",
            slugName: "",
            status: false,
          });
          return "Category Created!";
        },
        error: (err) => {
          console.error("Error During Create:", err);
          return err.response.data.message;
        },
      });
    } catch (error: any) {
      console.error(error);
      if (error.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              {" "}
              <Button onClick={() => setOpen(true)}>
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
                  <Label htmlFor="category-1">
                    {" "}
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category-1"
                    type="text"
                    name="categoryname"
                    onChange={handleChange}
                    value={categoryFormData.categoryname}
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="category-1">
                    {" "}
                    Slug Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category-1"
                    type="text"
                    name="slugName"
                    onChange={handleChange}
                    value={categoryFormData.slugName}
                  />
                </div>
                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label htmlFor="category-1">
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    id="status"
                    checked={categoryFormData.status}
                    onCheckedChange={(checked) =>
                      setcategoryFormData((prev) => ({
                        ...prev,
                        status: checked,
                      }))
                    }
                    className=" data-[state=checked]:bg-green-500 transition-colors"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button onClick={handlesubmit}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <CategoryDataTable refresh={refresh} />
    </>
  );
}

export default CategoryPage;
