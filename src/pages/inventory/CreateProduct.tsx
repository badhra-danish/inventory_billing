import { Button } from "@/components/ui/button";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  ArrowLeft,
  ChevronDown,
  CircleAlert,
  Plus,
  Package,
  X,
  Calendar,
  List,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
function CreateProduct() {
  const navigate = useNavigate();
  const [productType, setProductType] = React.useState<
    "single" | "variable" | ""
  >("");
  const [isOpen, setIsOpen] = React.useState(true);

  const handleProductTypeChange = (value: "single" | "variable") => {
    console.log("Selected product type:", value);
    setProductType(value);
  };

  interface ImageItem {
    id: string;
    url: string;
    file?: File;
  }

  const [images, setImages] = React.useState<ImageItem[]>([]);

  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };
  return (
    <>
      <div>
        {/* hearder of the page */}
        <div className="flex items-center justify-between ">
          <div>
            <p className="text-xl font-semibold">Create Product</p>
            <p>Create Product</p>
          </div>
          <div>
            <Button
              className="bg-gray border-2 border-blue-400 text-blue-400 hover:text-white"
              onClick={() => navigate("/products")}
            >
              <ArrowLeft />
              Back To Product
            </Button>
          </div>
        </div>

        {/* Product information */}

        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CircleAlert className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Product Information
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Detail section */}
          {isOpen && (
            <>
              <div className="w-full max-w-7xl mx-auto  bg-white border-t pt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Store */}
                  {/* <div className="space-y-2 grid items-center">
                    <Label htmlFor="store">
                      Store <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="store" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">Store 1</SelectItem>
                        <SelectItem value="store2">Store 2</SelectItem>
                        <SelectItem value="store3">Store 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Warehouse */}
                  {/* <div className="space-y-2 grid">
                    <Label htmlFor="warehouse">
                      Warehouse <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="warehouse" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse1">Warehouse 1</SelectItem>
                        <SelectItem value="warehouse2">Warehouse 2</SelectItem>
                        <SelectItem value="warehouse3">Warehouse 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Product Name */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="productName">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="productName" placeholder="Enter product name" />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input id="slug" placeholder="Enter slug" />
                  </div>

                  {/* SKU */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        placeholder="Enter SKU"
                        className="flex-1"
                      />
                      <Button type="button" className=" text-white px-4">
                        Generate
                      </Button>
                    </div>
                  </div>

                  {/* Selling Type */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="sellingType">
                      Selling Type <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="sellingType" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 grid">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-orange-600"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    </div>
                    <Select>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub Category */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="subCategory">
                      Sub Category <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="subCategory" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subcategory1">
                          Sub Category 1
                        </SelectItem>
                        <SelectItem value="subcategory2">
                          Sub Category 2
                        </SelectItem>
                        <SelectItem value="subcategory3">
                          Sub Category 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="brand">
                      Brand <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="brand" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand1">Brand 1</SelectItem>
                        <SelectItem value="brand2">Brand 2</SelectItem>
                        <SelectItem value="brand3">Brand 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="unit">
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Barcode Symbology */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="barcodeSymbology">
                      Size <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="barcodeSymbology" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="code128">Code 128</SelectItem>
                        <SelectItem value="ean13">EAN-13</SelectItem>
                        <SelectItem value="upc">UPC</SelectItem>
                        <SelectItem value="code39">Code 39</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Barcode Symbology (Right side) */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="barcodeSymbologyRight">
                      Barcode Symbology
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="barcodeSymbologyRight"
                        className="w-full"
                      >
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="code128">Code 128</SelectItem>
                        <SelectItem value="ean13">EAN-13</SelectItem>
                        <SelectItem value="upc">UPC</SelectItem>
                        <SelectItem value="code39">Code 39</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item Barcode */}
                  <div className="space-y-2 md:col-span-2 grid">
                    <Label htmlFor="itemBarcode">
                      Item Barcode <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="itemBarcode"
                        placeholder="Enter barcode"
                        className="flex-1"
                      />
                      <Button className="text-white px-4">Generate</Button>
                    </div>
                  </div>

                  <div className="w-full md:col-span-2 grid gap-2">
                    <Label htmlFor="itemBarcode">
                      Descriptions<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 ">
                      <Editor
                        apiKey="zlfgbxzuirlwvikyarfduoq8l9qb5wxv3hbkkd3t5n358neq"
                        init={{
                          plugins:
                            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                        }}
                        initialValue="Welcome to TinyMCE!"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* pricing and stock */}

        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing & Stocks
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Form Content */}
          {isOpen && (
            <div className="space-y-6 border-t pt-6">
              {/* Product Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Product Type <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  className="flex gap-6"
                  onValueChange={handleProductTypeChange}
                  value={productType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label
                      htmlFor="single"
                      className="font-normal cursor-pointer"
                    >
                      Single Product
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="variable" id="variable" />
                    <Label
                      htmlFor="variable"
                      className="font-normal cursor-pointer"
                    >
                      Variable Product
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Row 1: Quantity, Price, Tax Type */}

              {productType == "single" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="quantity"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        className="w-full"
                        placeholder=""
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="price"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Price <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        className="w-full"
                        placeholder=""
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="taxType"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Tax Type <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger id="taxType" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inclusive">Inclusive</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Tax, Discount Type, Discount Value */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="tax"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Tax <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger id="tax" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gst5">GST 5%</SelectItem>
                          <SelectItem value="gst12">GST 12%</SelectItem>
                          <SelectItem value="gst18">GST 18%</SelectItem>
                          <SelectItem value="gst28">GST 28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="discountType"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Discount Type <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger id="discountType" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="none">No Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="discountValue"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Discount Value <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        className="w-full"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Row 3: Quantity Alert */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="quantityAlert"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Quantity Alert <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantityAlert"
                        type="number"
                        className="w-full"
                        placeholder=""
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>dcsdcsd </>
              )}
            </div>
          )}
        </div>

        {/* iMAGES  */}
        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {isExpanded && (
            <div className="p-6 pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-4">
                {/* Add Images Button */}
                <label className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer group">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-2">
                      <Plus />
                    </div>
                    <span className="text-sm font-medium">Add Images</span>
                  </div>
                </label>

                {/* Image Preview Cards */}
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 group-hover:scale-110"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {images.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-4">
                  No images uploaded yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Coustom and Feailds */}

        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <List className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Custom Feild
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {isExpanded && (
            <div className="p-6 pt-2 border-t border-gray-100">
              {/* Tabs */}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Warranty Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Select>
                      <SelectTrigger id="warrantyType" className="w-full">
                        <SelectValue placeholder="Select Warranty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1-year</SelectItem>
                        <SelectItem value="2-year">1-year 1-year</SelectItem>
                        <SelectItem value="3-year">1-year 1-year</SelectItem>
                      </SelectContent>
                    </Select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Manufacturer Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter manufacturer"
                  />
                </div>

                {/* Manufactured Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufactured Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      placeholder="DD-MM-YYYY"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Expiry Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry On <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      placeholder="DD-MM-YYYY"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-5">
          <div className="flex gap-3">
            <Button className="bg-gray border-2 border-blue-500 text-blue-400 hover:text-white">
              Cancel
            </Button>
            <Button>Add Product</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;
