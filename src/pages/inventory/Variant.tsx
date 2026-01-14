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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import VariantDataTable from "@/components/inventory/VariantDataTable";
import { CirclePlus } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
// import { useNavigate } from "react-router-dom";
import { RefreshCcw, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createAttribute } from "@/api/VariantAttribute/Attributeclinet";
import toast from "react-hot-toast";
function VariantPage() {
  const [values, setValues] = React.useState<string[]>([]);
  const [variantName, setVariantName] = React.useState("");
  const [status, setStatus] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState("");
  const [refresh, setRefresh] = React.useState(false);
  const [openAddvariant, setOpenAddVariant] = React.useState(false);
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // avoid form submit
      const newValue = currentValue.trim();
      if (newValue && !values.includes(newValue)) {
        setValues((prev) => [...prev, newValue]);
      }
      setCurrentValue("");
    }
  };
  const handleCreateAttribute = () => {
    try {
      const payload = {
        attributeName: variantName,
        attributeValues: values.map((v) => ({ value: v })),
        status: status === true ? "ACTIVE" : "INACTIVE",
      };
      console.log(payload);

      const attributePromise = createAttribute(payload);
      toast.promise(attributePromise, {
        loading: "Creating Attribute",
        success: (res) => {
          setOpenAddVariant(false);
          setRefresh(true);
          setVariantName("");
          setValues([]);
          return res.message;
        },
        error: (err) => {
          return err.response.data.message;
        },
      });
      console.log(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setRefresh(false);
    }
  };

  // const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Variants </p>
          <p>Manage Your Variants</p>
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
          <Dialog open={openAddvariant} onOpenChange={setOpenAddVariant}>
            <DialogTrigger>
              {" "}
              <Button>
                <CirclePlus />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Variant </DialogTitle>
              </DialogHeader>
              <div className="grid gap-8 pt-5 mt-3 border-t-2">
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Varaint Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category-1"
                    type="text"
                    // name="attributeName"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="category-1">
                    {" "}
                    Values <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap items-center gap-2 border rounded-md p-2">
                    {/* Display chips */}
                    {values.map((val, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() => handleRemoveValue(index)}
                          className="hover:text-red-600"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </Badge>
                    ))}

                    {/* Input field for new values */}
                    <input
                      id="variant-values"
                      type="text"
                      value={currentValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Type value and press comma"
                      className="flex-grow outline-none bg-transparent text-sm p-1"
                    />
                  </div>{" "}
                  <p className="text-sm">Enter Value separated By Comma ,</p>
                </div>
                <div className="flex items-center justify-between border-b-2 pb-7">
                  <Label htmlFor="category-1">
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Switch
                    id="status"
                    className=" data-[state=checked]:bg-green-500 transition-colors"
                    checked={status}
                    onCheckedChange={(checked) => setStatus(checked)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateAttribute}>Add Unit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button onClick={() => navigate("/create-product")}>
            <CirclePlus />
            Add Product
          </Button> */}
        </div>
      </div>
      <VariantDataTable refresh={refresh} />
    </>
  );
}

export default VariantPage;
