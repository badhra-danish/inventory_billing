import { Button } from "@/components/ui/button";
import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  CircleAlert,
  Plus,
  Package,
  X,
  List,
  PlusCircle,
  Trash,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

function CreateProduct() {
  const navigate = useNavigate();
  const [productType, setProductType] = React.useState<
    "single" | "variable" | ""
  >("single");
  const [isOpen, setIsOpen] = React.useState(true);
  const [productInformation, setProductInformation] = React.useState({
    productName: "",
    slugName: "",
    skuCode: "",
    sellingType: "",
    category: "",
    subCategory: "",
    brand: "",
    unit: "",
    description: "",
    warranty: "",
  });
  const [customFeild, setcustomFeild] = React.useState({
    warranty: "",
    manufacturer: "",
    manufacturedDate: "",
    expiryDate: "",
  });

  // accept string from RadioGroup and cast safely
  const handleProductTypeChange = (value: string) => {
    console.log("Selected product type:", value);
    if (value === "single" || value === "variable") {
      setProductType(value);
    }
  };

  //dasdasd
  const handleCustomFeildChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setcustomFeild((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //sczxcxz
  const handleProductInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProductInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //sadnsadjsn

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const Product = {
      ...productInformation,
      ...customFeild,
      images: images.map((img) => img.file), // only send files
      attributes: attributes,
      variants: variants,
    };

    console.log("Final Product:", Product);
  };
  interface ImageItem {
    id: string;
    url: string;
    file?: File;
  }

  const [images, setImages] = React.useState<ImageItem[]>([]);

  const [isExpanded, setIsExpanded] = React.useState(true);

  // Attributes and Variants state for variable products
  interface Attribute {
    id: string;
    name: string;
    options: string[];
  }

  interface Variant {
    id: string;
    attributes: Record<string, string>;
    price?: number | "";
    quantity?: number | "";
    sku?: string;
    taxType?: string;
    discountType?: string;
    discountValue?: number | "";
    quantityAlert?: number | "";
  }

  const [attributes, setAttributes] = React.useState<Attribute[]>([]);
  const [newAttrName, setNewAttrName] = React.useState("");
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [tempOptionInputs, setTempOptionInputs] = React.useState<
    Record<string, string>
  >({});

  const addAttribute = () => {
    if (!newAttrName.trim()) return;

    // split by comma
    const names = newAttrName
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    setAttributes((prev) => [
      ...prev,
      ...names.map((name) => ({
        id: Math.random().toString(36).slice(2, 9),
        name,
        options: [],
      })),
    ]);

    setNewAttrName("");
  };
  const removeAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  };

  const addOptionToAttribute = (attrId: string, option: string) => {
    if (!option.trim()) return;
    setAttributes((prev) =>
      prev.map((a) =>
        a.id === attrId ? { ...a, options: [...a.options, option.trim()] } : a
      )
    );
  };

  const removeOption = (attrId: string, optionIndex: number) => {
    setAttributes((prev) =>
      prev.map((a) =>
        a.id === attrId
          ? { ...a, options: a.options.filter((_, i) => i !== optionIndex) }
          : a
      )
    );
  };

  const generateVariants = () => {
    if (attributes.length === 0) return;
    const arrays = attributes.map((a) =>
      a.options.map((o) => ({ name: a.name, option: o }))
    );
    // cartesian product
    let combos: Array<Array<{ name: string; option: string }>> = [[]];
    for (const arr of arrays) {
      combos = combos.flatMap((prev) => arr.map((item) => [...prev, item]));
    }

    const newVariants: Variant[] = combos.map((combo) => ({
      id: Math.random().toString(36).slice(2, 9),
      attributes: combo.reduce(
        (acc, cur) => ({ ...acc, [cur.name]: cur.option }),
        {} as Record<string, string>
      ),
      price: "",
      quantity: "",
      sku: "",
      taxType: "",
      discountType: "",
      discountValue: "",
      quantityAlert: "",
    }));

    setVariants(newVariants);
  };

  const updateVariantField = (
    variantId: string,
    field: keyof Variant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };
  const deleteVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <>
      <div>
        {/* header of the page */}
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
            type="button"
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
                  {/* Product Name */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="productName">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      name="productName"
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="Enter slug"
                      name="slugName"
                      value={productInformation?.slugName}
                      onChange={handleProductInfoChange}
                    />
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
                        name="skuCode"
                        value={productInformation.skuCode}
                        onChange={handleProductInfoChange}
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
                    <Select
                      value={productInformation.sellingType}
                      onValueChange={(val) =>
                        setProductInformation((prev) => ({
                          ...prev,
                          sellingType: val,
                        }))
                      }
                    >
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
                    <Select
                      value={productInformation.category}
                      onValueChange={(val) =>
                        setProductInformation((prev) => ({
                          ...prev,
                          category: val,
                        }))
                      }
                    >
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
                    <Select
                      value={productInformation.subCategory}
                      onValueChange={(val) =>
                        setProductInformation((prev) => ({
                          ...prev,
                          subCategory: val,
                        }))
                      }
                    >
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
                    <Select
                      value={productInformation.brand}
                      onValueChange={(val) =>
                        setProductInformation((prev) => ({
                          ...prev,
                          brand: val,
                        }))
                      }
                    >
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
                    <Select
                      value={productInformation.unit}
                      onValueChange={(val) =>
                        setProductInformation((prev) => ({
                          ...prev,
                          unit: val,
                        }))
                      }
                    >
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

                  <div className="w-full md:col-span-2 grid gap-2">
                    <Label htmlFor="itemBarcode">
                      Descriptions<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 ">
                      <Textarea
                        placeholder="Enter Your Descriptions"
                        rows={6}
                        value={productInformation.description}
                        name="description"
                        onChange={handleProductInfoChange}
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
            type="button"
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
                  onValueChange={(v) => handleProductTypeChange(v)}
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

              {productType === "single" ? (
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
                <>
                  <div className="grid  gap-6">
                    {/* Attributes manager */}
                    <div className="p-4 border rounded space-y-4">
                      <Label className="text-sm font-medium">Attributes</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Color, Size"
                          value={newAttrName}
                          onChange={(e) => setNewAttrName(e.target.value)}
                        />
                        <Button onClick={addAttribute}>
                          <PlusCircle />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {attributes.length === 0 && (
                          <p className="text-sm text-gray-500">
                            No attributes added yet. Add an attribute name, then
                            add options.
                          </p>
                        )}

                        {attributes.map((attr) => (
                          <div key={attr.id} className="border p-3 rounded">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{attr.name}</div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => removeAttribute(attr.id)}
                                  className="bg-red-50  px-2 py-1 border-2 border-red-500"
                                  variant="outline"
                                >
                                  <Trash className="text-red-500" />
                                </Button>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex gap-2">
                                <Input
                                  placeholder={`Add option for ${attr.name} (e.g. Red)`}
                                  value={tempOptionInputs[attr.id] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setTempOptionInputs((prev) => ({
                                      ...prev,
                                      [attr.id]: value,
                                    }));
                                    // auto add when comma typed
                                    if (value.endsWith(",")) {
                                      const option = value
                                        .replace(",", "")
                                        .trim();
                                      if (option) {
                                        addOptionToAttribute(attr.id, option);
                                      }

                                      // clear input
                                      setTempOptionInputs((prev) => ({
                                        ...prev,
                                        [attr.id]: "",
                                      }));
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // ENTER also adds
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const value =
                                        tempOptionInputs[attr.id]?.trim();
                                      if (value) {
                                        addOptionToAttribute(attr.id, value);
                                        setTempOptionInputs((prev) => ({
                                          ...prev,
                                          [attr.id]: "",
                                        }));
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  onClick={() => {
                                    const opt = tempOptionInputs[attr.id] || "";
                                    addOptionToAttribute(attr.id, opt);
                                    setTempOptionInputs((prev) => ({
                                      ...prev,
                                      [attr.id]: "",
                                    }));
                                  }}
                                  variant="outline"
                                  className="border-blue-600"
                                >
                                  <PlusCircle className="text-blue-600 font-bold" />
                                </Button>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {attr.options.map((opt, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
                                  >
                                    <span className="text-sm">{opt}</span>
                                    <button
                                      onClick={() => removeOption(attr.id, idx)}
                                      className="text-red-500 text-xs"
                                      type="button"
                                    >
                                      x
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        {attributes.length > 0 && (
                          <div className="flex justify-end">
                            <Button onClick={generateVariants}>
                              Generate Variants
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Variants table */}
                    <div className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Variants</Label>
                        <div className="text-sm text-gray-500">
                          {variants.length} variants
                        </div>
                      </div>

                      {variants.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No variants generated. Add attributes and click
                          "Generate Variants".
                        </p>
                      ) : (
                        <div className="overflow-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                {attributes.map((a) => (
                                  <th key={a.id} className="pb-2">
                                    {a.name}
                                  </th>
                                ))}
                                <th className="pb-2">Price</th>
                                <th className="pb-2">Quantity</th>
                                <th className="pb-2">SKU</th>
                                <th className="pb-2">Tax Type</th>
                                <th className="pb-2">Discount</th>
                                <th className="pb-2">Qty Alert</th>
                                <th className="pb-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants.map((v) => (
                                <tr key={v.id} className="align-top border-t">
                                  {attributes.map((a) => (
                                    <td key={a.id} className="py-3">
                                      <div className="bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                                        {v.attributes[a.name]}
                                      </div>
                                    </td>
                                  ))}

                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      value={v.price as any}
                                      onChange={(e) =>
                                        updateVariantField(
                                          v.id,
                                          "price",
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                        )
                                      }
                                      className="w-24"
                                    />
                                  </td>

                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      value={v.quantity as any}
                                      onChange={(e) =>
                                        updateVariantField(
                                          v.id,
                                          "quantity",
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                        )
                                      }
                                      className="w-24"
                                    />
                                  </td>

                                  <td className="py-2">
                                    <Input
                                      value={v.sku}
                                      onChange={(e) =>
                                        updateVariantField(
                                          v.id,
                                          "sku",
                                          e.target.value
                                        )
                                      }
                                      className="w-32"
                                    />
                                  </td>

                                  <td className="py-2">
                                    <Select
                                      onValueChange={(val) =>
                                        updateVariantField(v.id, "taxType", val)
                                      }
                                    >
                                      <SelectTrigger className="w-36">
                                        <SelectValue
                                          placeholder={v.taxType || "Select"}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="inclusive">
                                          Inclusive
                                        </SelectItem>
                                        <SelectItem value="exclusive">
                                          Exclusive
                                        </SelectItem>
                                        <SelectItem value="none">
                                          None
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>

                                  <td className="py-2">
                                    <div className="flex gap-2">
                                      <Select
                                        onValueChange={(val) =>
                                          updateVariantField(
                                            v.id,
                                            "discountType",
                                            val
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-36">
                                          <SelectValue
                                            placeholder={
                                              v.discountType || "Type"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="percentage">
                                            Percentage
                                          </SelectItem>
                                          <SelectItem value="fixed">
                                            Fixed
                                          </SelectItem>
                                          <SelectItem value="none">
                                            No Discount
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Input
                                        type="number"
                                        value={v.discountValue as any}
                                        onChange={(e) =>
                                          updateVariantField(
                                            v.id,
                                            "discountValue",
                                            e.target.value === ""
                                              ? ""
                                              : Number(e.target.value)
                                          )
                                        }
                                        className="w-20"
                                      />
                                    </div>
                                  </td>

                                  <td className="py-2">
                                    <Input
                                      type="number"
                                      value={v.quantityAlert as any}
                                      onChange={(e) =>
                                        updateVariantField(
                                          v.id,
                                          "quantityAlert",
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                        )
                                      }
                                      className="w-24"
                                    />
                                  </td>
                                  <td className="py-2 align-middle">
                                    <div className="flex justify-center items-center">
                                      <Button
                                        variant="outline"
                                        className="h-7 w-7 p-0 text-red-500 border-red-400 hover:bg-red-100"
                                        onClick={() => deleteVariant(v.id)}
                                      >
                                        x
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* IMAGES  */}
        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
            type="button"
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
                      type="button"
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

        {/* Custom and Fields */}

        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group"
            type="button"
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
                    <Select
                      value={customFeild.warranty}
                      onValueChange={(val) =>
                        setcustomFeild((prev) => ({
                          ...prev,
                          warranty: val,
                        }))
                      }
                    >
                      <SelectTrigger
                        id="warrantyType"
                        className="w-full"
                        name="warranty"
                      >
                        <SelectValue placeholder="Select Warranty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1-year</SelectItem>
                        <SelectItem value="2-year">2-year</SelectItem>
                        <SelectItem value="3-year">3-year</SelectItem>
                      </SelectContent>
                    </Select>
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
                    name="manufacturer"
                    value={customFeild.manufacturer}
                    onChange={handleCustomFeildChange}
                  />
                </div>

                {/* Manufactured Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufactured Date <span className="text-red-500">*</span>
                  </label>
                  <div className="">
                    <Input
                      type="date"
                      name="manufacturedDate"
                      //className="w-full  text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      // placeholder="DD-MM-YYYY"
                      value={customFeild.manufacturedDate}
                      onChange={handleCustomFeildChange}
                    />
                  </div>
                </div>

                {/* Expiry Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry On <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="Date"
                      name="expiryDate"
                      value={customFeild.expiryDate}
                      onChange={handleCustomFeildChange}

                      //className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      // placeholder="DD-MM-YYYY"
                    />
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
            <Button onClick={handleSubmit}>Add Product</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProduct;

// export default CreateProduct;
