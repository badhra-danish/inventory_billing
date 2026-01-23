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

// import { Switch } from "@/components/ui/switch";
import { Check, CirclePlus, Package, X } from "lucide-react";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StockMangeDatatable from "@/components/stock/StockDataTable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect } from "react";
import { getAllVariantBySearch } from "@/api/CreateProduct/ProductClinet";
import Loader from "@/components/commen/loader";
import { createStock } from "@/api/Stock/Stockclinet";
import toast from "react-hot-toast";
type Product = {
  product_variant_id: string;
  skuCode: string;
  price: number;
  tax_type: string;
  tax_value: number;
  discount_type: string;
  discount_value: number;
  variant_label: string;
  product_id: string;
  productName: string;
};
function StockMangepage() {
  const [query, setQuery] = React.useState("");
  const [variant, setVariant] = React.useState<Product[]>([]);
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openAddStock, setAddOpenStock] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState({
    product_variant_id: "",
    skuCode: "",
    price: 0,
    tax_type: "",
    tax_value: 0,
    discount_type: "",
    discount_value: 0,
    variant_label: "",
    product_id: "",
    productName: "",
  });
  const [quantityStatus, setQuantityStatus] = React.useState({
    quantity: "",
    status: "INSTOCK",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setQuantityStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(variant);

  React.useEffect(() => {
    if (!query.trim()) {
      setVariant([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getAllVariantBySearch(query);
        if (res.status === "OK") {
          setVariant(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);
  const handleClickVariant = (variant: Product) => {
    try {
      setSelectedVariant((prev) => ({
        ...prev,
        product_variant_id: variant.product_variant_id,
        skuCode: variant.skuCode,
        price: variant.price,
        tax_type: variant.tax_type,
        tax_value: variant.tax_value,
        discount_type: variant.discount_type,
        discount_value: variant.discount_value,
        variant_label: variant.variant_label,
        product_id: variant.product_id,
        productName: variant.productName,
      }));
      setQuery("");
      setVariant([]);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(quantityStatus);
  const handleCreateStock = () => {
    const payload = {
      product_variant_id: selectedVariant?.product_variant_id,
      quantity: Number(quantityStatus?.quantity),
      status: quantityStatus?.status,
    };

    const stockPromise = createStock(payload);

    toast.promise(stockPromise, {
      loading: "Creating stock...",
      success: (res) => {
        setAddOpenStock(false);
        setRefresh(true);
        return res?.message;
      },
      error: (err) => {
        if (err?.response?.status === 400) {
          return err.response.data.message;
        }
        return "Something Went Wrong";
      },
    });
  };

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
          <Dialog open={openAddStock} onOpenChange={setAddOpenStock}>
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
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Product <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Search by Code or Label"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  {query && (
                    <div className="border rounded-lg bg-white shadow-sm max-h-64 overflow-y-auto custom-scrollbar">
                      {loading ? (
                        <div className="p-8 text-center text-gray-500">
                          {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div> */}
                          <Loader />
                          <p className="mt-2">Searching...</p>
                        </div>
                      ) : variant.length > 0 ? (
                        <ul className="divide-y">
                          {variant.map((item) => (
                            <li
                              key={item.product_variant_id}
                              onClick={() => handleClickVariant(item)}
                              className={`p-4 cursor-pointer transition-all hover:bg-blue-50 ${
                                selectedVariant?.product_variant_id ===
                                item.product_variant_id
                                  ? "bg-blue-100 border-l-4 border-blue-600"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-800">
                                      {item.productName}
                                    </p>
                                    {selectedVariant?.product_variant_id ===
                                      item.product_variant_id && (
                                      <Check className="h-4 w-4 text-blue-600" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {item.variant_label}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium">SKU:</span>{" "}
                                    {item.skuCode}
                                  </p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-base font-bold text-green-600">
                                    ₹{item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Package className="h-12 w-12 mx-auto  mb-2 text-blue-400" />
                          <p>No products found</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* <Select
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
                  </Select> */}
                </div>
                {/* {selectedVariant && (
                  <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Selected Product
                      </h4>
                      <button
                        // onClick={() => setSelectedVariant(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">
                          Product Name
                        </Label>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {selectedVariant.productName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Variant</Label>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {selectedVariant.variant_label}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">
                          SKU Code
                        </Label>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {selectedVariant.skuCode}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Price</Label>
                        <p className="text-sm font-bold text-green-600 mt-1">
                          ₹{selectedVariant.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}
                {/* Product details codec,quantiy */}
                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="sub-category"
                      readOnly
                      disabled
                      value={selectedVariant.skuCode}
                    />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="sub-category"
                      readOnly
                      disabled
                      value={selectedVariant.price}
                    />
                  </div>
                </div>

                <div className="flex gap-2 ">
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="sub-category"
                      readOnly
                      disabled
                      value={selectedVariant.productName}
                    />
                  </div>
                  <div className="w-full grid gap-3">
                    <Label>
                      {" "}
                      Variant Label <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="sub-category"
                      readOnly
                      disabled
                      value={selectedVariant.variant_label}
                    />
                  </div>
                </div>
                {/* *** */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="quantity"
                    value={quantityStatus.quantity}
                    onChange={handleChange}
                  />
                </div>
                {/* *** */}
                <div className="grid gap-4">
                  <Label>
                    {" "}
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setQuantityStatus((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSTOCK">InStock</SelectItem>
                      <SelectItem value="STOCKOUT">StockOut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t-1 pt-5">
                <DialogFooter>
                  <DialogClose>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateStock}>Add Stock</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <StockMangeDatatable refresh={refresh} />
    </>
  );
}

export default StockMangepage;
