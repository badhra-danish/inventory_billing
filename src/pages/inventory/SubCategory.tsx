import React, { useEffect, useState } from "react";
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
// react-window list removed; using direct mapping for SelectItem
import { Switch } from "@/components/ui/switch";
import SubCategoryDatatable from "@/components/inventory/SubCategoryDatatable";
import { CirclePlus, Plus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
import {
  createCategory,
  createSubCategory,
} from "@/api/Category-subCategory/ApiClient";
import toast from "react-hot-toast";
import { SelectViewport } from "@radix-ui/react-select";
export interface SubCategory {
  name: string;
  code: string;
  description: string;
  categoryID: string;
  status: boolean;
}
function SubCategorypage() {
  const [file, setFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { categoryPageMetaData, refreshCategories, categories, loading } =
    useCategory();
  const [subCateFormData, setSubCategoryFormData] = React.useState<SubCategory>(
    {
      name: "",
      code: "",
      description: "",
      categoryID: "",
      status: false,
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payLoad = {
        name: subCateFormData.name,
        code: subCateFormData.code,
        description: subCateFormData.description,
        categoryID: subCateFormData.categoryID,
        status: subCateFormData.status ? "ACTIVE" : "INACTIVE",
      };

      const formData = new FormData();
      if (!file) return;
      formData.append("file", file);
      formData.append("subCategory", JSON.stringify(payLoad));

      const promise = createSubCategory(formData);

      toast.promise(promise, {
        loading: "Creating Subcategory...",
        success: (res) => {
          setOpen(false);
          setRefresh((prev) => !prev);
          return "Subcategory Created Successfully!";
        },
        error: (err) => {
          console.error("Error During Create:", err);
          return "Failed to create subcategory.";
        },
      });
    } catch (error) {
      console.error("Error During the create Category", error);
    }
  };
  console.log(page);

  //const navigate = useNavigate();
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              {" "}
              <Button onClick={() => setOpen(true)}>
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
                    {file ? file.name : <p>JPEG, PNG up to 2 MB</p>}
                  </div>
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setSubCategoryFormData((prev) => ({
                        ...prev,
                        categoryID: value,
                      }))
                    }
                    name="categoryID"
                    value={subCateFormData.categoryID}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectViewport className="max-h-40 overflow-y-auto">
                        {categories?.length ? (
                          categories.map((cat) => (
                            <SelectItem
                              key={cat.categoryID}
                              value={cat.categoryID}
                            >
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No categories found
                          </div>
                        )}
                        {/* {categories?.map((cat) => (
                          <SelectItem value={cat?.categoryID}>
                            {cat?.name}
                          </SelectItem>
                        ))} */}
                      </SelectViewport>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Sub Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={subCateFormData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Category Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="code"
                    value={subCateFormData.code}
                    onChange={handleChange}
                  />
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
                    value={subCateFormData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label>
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    id="status"
                    checked={subCateFormData.status}
                    onCheckedChange={(checked) =>
                      setSubCategoryFormData((prev) => ({
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
                <Button onClick={handleSubmit}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <SubCategoryDatatable refresh={refresh} />
    </>
  );
}

export default SubCategorypage;
