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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import WarrantiesDataTable from "@/components/inventory/WarrantieDataTable";
import { CirclePlus, RefreshCcw } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createWarranty } from "@/api/Warranty/Warranty";
import toast from "react-hot-toast";
interface Warranty {
  warranty: string;
  duration: string;
  period: string;
  descriptions: string;
  status: "ACTIVE" | "INACTIVE";
}
function WarrantiesPage() {
  const [openWarranty, setOpenWarranty] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [formData, setFormData] = React.useState<Warranty>({
    warranty: "",
    duration: "",
    period: "",
    descriptions: "",
    status: "INACTIVE",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(formData);
  const handleCreatewarranty = () => {
    try {
      const payload = {
        warrantyName: formData.warranty,
        description: formData.descriptions,
        period: formData.period,
        duration: Number(formData.duration),
        status: formData.status,
      };
      const createPromise = createWarranty(payload);
      toast.promise(createPromise, {
        loading: "Creating Warranty",
        success: (res) => {
          setOpenWarranty(false);
          setRefresh(true);
          setFormData({
            warranty: "",
            duration: "",
            period: "",
            descriptions: "",
            status: "INACTIVE",
          });
          return res.message;
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  console.log(formData);

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
          <Dialog open={openWarranty} onOpenChange={setOpenWarranty}>
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
                  <Input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center justify-between gap-5">
                  <div className="grid gap-4 w-full">
                    <Label htmlFor="category-1">
                      {" "}
                      Duration<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="grid gap-4 w-full">
                    <Label htmlFor="category-1">
                      {" "}
                      Period<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          period: value,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTH">Month</SelectItem>
                        <SelectItem value="YEAR">Year</SelectItem>
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
                    name="descriptions"
                    placeholder="Enter Warranty description..."
                    className="min-h-[80px] resize-y"
                    onChange={handleChange}
                    value={formData.descriptions}
                  />
                </div>
                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label htmlFor="category-1">
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    checked={formData.status == "ACTIVE"}
                    id="status"
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        status: checked ? "ACTIVE" : "INACTIVE",
                      }));
                    }}
                    className=" data-[state=checked]:bg-green-500 transition-colors"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreatewarranty}>Add Warranty</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <WarrantiesDataTable refresh={refresh} />
    </>
  );
}

export default WarrantiesPage;
