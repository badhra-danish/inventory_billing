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
import BrandDataTable from "@/components/inventory/BrandDatatable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createBrand } from "@/api/brand/BrandApiClient";
import toast from "react-hot-toast";
function BrandPage() {
  type BrandStatus = "ACTIVE" | "INACTIVE";
  const [openAddBrand, setOpenAddBrand] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [brandFormData, setBrandFormData] = React.useState<{
    brandName: string;
    status: BrandStatus;
  }>({
    brandName: "",
    status: "INACTIVE",
  });
  const handleCreateBrand = async () => {
    try {
      const payload = {
        brandName: brandFormData.brandName,
        status: brandFormData.status,
      };
      const brandPromise = createBrand(payload);
      toast.promise(brandPromise, {
        loading: "Creating Brand",
        success: (res) => {
          setOpenAddBrand(false);
          setRefresh(true);
          setBrandFormData({
            brandName: "",
            status: "INACTIVE",
          });
          return res.message;
        },
        error: (err) => {
          console.error("Error During Create:", err);
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBrandFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(brandFormData);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Brands </p>
          <p>Manage Your Brands</p>
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
          <Dialog open={openAddBrand} onOpenChange={setOpenAddBrand}>
            <DialogTrigger>
              {" "}
              <Button>
                <CirclePlus />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Brand</DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-2">
                <div className="grid gap-4">
                  <Label htmlFor="category-1">
                    {" "}
                    Brand Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand-1"
                    type="text"
                    name="brandName"
                    value={brandFormData.brandName}
                    onChange={handleChange}
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
                    checked={brandFormData.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      setBrandFormData((prev) => ({
                        ...prev,
                        status: checked ? "ACTIVE" : "INACTIVE",
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateBrand}>Add Brand</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <BrandDataTable refresh={refresh} />
    </>
  );
}

export default BrandPage;
