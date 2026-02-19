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
import toast from "react-hot-toast";
import { createWarehouse } from "@/api/WareHouse/WareHouse";
import WarehouseDataTable from "@/components/People/WareHouseDatatable";
function BrandPage() {
  type BrandStatus = "ACTIVE" | "INACTIVE";
  const [openAddWarehouse, setOpenAddWarehouse] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [warehouseFormData, setWarehouseFormData] = React.useState<{
    warehouseName: string;
    code: string;
    address: string;
    status: BrandStatus;
  }>({
    warehouseName: "",
    code: "",
    address: "",
    status: "INACTIVE",
  });
  const handleCreateWarehouse = async () => {
    try {
      const payload = {
        warehouseName: warehouseFormData.warehouseName,
        code: warehouseFormData.code,
        address: warehouseFormData.address,
        status: warehouseFormData.status,
      };
      const brandPromise = createWarehouse(payload);
      toast.promise(brandPromise, {
        loading: "Creating Brand",
        success: (res) => {
          setOpenAddWarehouse(false);
          setRefresh(true);
          setWarehouseFormData({
            warehouseName: "",
            code: "",
            address: "",
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
    >,
  ) => {
    const { name, value } = e.target;
    setWarehouseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Warehouse </p>
          <p>Manage Your Warehouse</p>
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
          <Dialog open={openAddWarehouse} onOpenChange={setOpenAddWarehouse}>
            <DialogTrigger>
              {" "}
              <Button>
                <CirclePlus />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Warehouse</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 pt-5 mt-3 border-t-2">
                <div className="grid gap-2">
                  <Label htmlFor="category-1">
                    {" "}
                    Warehouse Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand-1"
                    type="text"
                    name="warehouseName"
                    value={warehouseFormData.warehouseName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-1">
                    {" "}
                    Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand-1"
                    type="text"
                    name="code"
                    value={warehouseFormData.code}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-1">
                    {" "}
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand-1"
                    type="text"
                    name="address"
                    value={warehouseFormData.address}
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
                    checked={warehouseFormData.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      setWarehouseFormData((prev) => ({
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
                <Button onClick={handleCreateWarehouse}>Add Warehouse</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <WarehouseDataTable refresh={refresh} />
    </>
  );
}

export default BrandPage;
