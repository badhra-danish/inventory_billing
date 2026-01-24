import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  CircleAlert,
  Plus,
  Package,
  List,
  PlusCircle,
  Trash,
  Settings2,
  Layers,
  Tag,
  Trash2,
  X,
  Sparkles,
  AlertCircle,
  Hash,
  Box,
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
import { getAllVaariantAttributeAll } from "@/api/VariantAttribute/Attributeclinet";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { createCategory } from "@/api/Category-subCategory/ApiClient";
import toast from "react-hot-toast";
import { createProduct } from "@/api/CreateProduct/ProductClinet";

function CreateProduct() {
  const navigate = useNavigate();
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
  });

  const {
    categories,
    brand,
    subCategories,
    unit,
    warranty,
    refreshBrand,
    refreshCategories,
    refreshWarranty,
    refreshSubCategories,
    refreshUnit,
  } = useCategory();

  useEffect(() => {
    refreshBrand();
    refreshWarranty();
    refreshCategories();
    refreshUnit();
  }, []);

  useEffect(() => {
    if (!productInformation.category) return;
    refreshSubCategories(productInformation.category);
  }, [productInformation.category]);

  interface VariantAttributeDetail {
    attribute_id: string;
    attributeName: string;
    attribute_value_id: string;
    attributeValueName: string;
  }
  interface Variant {
    id: string;
    attributeDetails?: VariantAttributeDetail[];
    price?: number | "";
    quantity?: number | "";
    sku?: string;
    taxType?: string;
    taxValue?: string;
    discountType?: string;
    discountValue?: number | "";
    quantityAlert?: number | "";
    imageUrl?: string;
    image?: File;
  }
  interface VariantAttribute {
    attribute_id: string;
    attributeName: string;
    attributeValues: { attribute_value_id: string; value: string }[];
    valuesList: { attribute_value_id: string; value: string }[];
  }
  const [AllAttribute, setAllAttribute] = React.useState<VariantAttribute[]>(
    [],
  );
  const [selectedAttribute, setSelectedAttribute] =
    React.useState<VariantAttribute | null>(null);
  const [attribute, setAttribute] = React.useState<VariantAttribute[] | null>(
    [],
  );
  const [productType, setProductType] = React.useState<
    "SINGLE" | "VARIABLE" | ""
  >("SINGLE");
  const [isOpen, setIsOpen] = React.useState(true);
  const [customFeild, setcustomFeild] = React.useState({
    warranty_id: "",
    manufacturer: "",
    manufacturer_date: "",
    expiry_date: "",
  });
  const [singleProductInfo, setSingleProductInfo] = React.useState({
    price: "",
    taxType: "",
    taxValue: "",
    discountType: "",
    discountValue: "",
    skuCode: "",
  });

  const [variants, setVariants] = React.useState<Variant[] | null>([]);
  const [image, setImage] = React.useState<File[]>([]);
  const [isPriceOpen, setIsPriceOpen] = React.useState(true);
  const [isCustomOpen, setIsCustomOpen] = React.useState(true);
  const [openCreateCategory, setOpenCreateCategory] = React.useState(false);
  const [categoryFormData, setcategoryFormData] = React.useState({
    categoryname: "",
    slugName: "",
    status: false,
  });

  // API Sections
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setcategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateCategory = async () => {
    try {
      const payload = {
        name: categoryFormData.slugName,
        slug: categoryFormData.slugName,
        status: categoryFormData.status ? "ACTIVE" : "INACTIVE",
      };

      const promise = createCategory(payload);

      await toast.promise(promise, {
        loading: "Creating category...",
        success: (res) => {
          setOpenCreateCategory(false);
          refreshCategories();
          return res.message;
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
  const getAllAttribute = async () => {
    try {
      const res = await getAllVaariantAttributeAll();
      if (res.status === "OK") {
        setAllAttribute(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllAttribute();
  }, []);
  console.log(AllAttribute);

  // console.log(AllAttribute);
  const handleSingleProduct = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setSingleProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // accept string from RadioGroup and cast safely
  const handleProductTypeChange = (value: string) => {
    console.log("Selected product type:", value);
    if (value === "SINGLE" || value === "VARIABLE") {
      setProductType(value);
    }
  };

  //dasdasd
  const handleCustomFeildChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    >,
  ) => {
    const { name, value } = e.target;
    setProductInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //sadnsadjsn

  const addAttribute = (obj: VariantAttribute) => {
    setAttribute((prev) => {
      if (!prev) return prev;
      const exists = prev.some((a) => a.attribute_id === obj.attribute_id);
      if (exists) return prev;
      return [
        ...prev,
        {
          ...obj,
          valuesList: [],
        },
      ];
    });
  };

  // const removeAttribute = (id: string) => {
  //   setAttributes((prev) => prev.filter((a) => a.id !== id));
  // };

  const addValues = (attributeId: string, obj: any) => {
    setAttribute((prev) => {
      if (!prev) return prev;
      return prev.map((a) => {
        if (a.attribute_id !== attributeId) return a;
        // check duplicates
        const exists = a.valuesList?.some(
          (v) =>
            v.value.trim().toLowerCase() === obj.value.trim().toLowerCase(),
        );
        if (exists) return a;
        // otherwise push new value
        return {
          ...a,
          valuesList: [
            ...(a.valuesList ?? []),
            { attribute_value_id: obj.attribute_value_id, value: obj.value },
          ],
        };
      });
    });
  };

  const removeAttribute = (attributeId: string) => {
    setAttribute((prev) => {
      if (!prev) return prev;
      return prev.filter((a) => a.attribute_id !== attributeId);
    });
  };

  const removeOption = (attributeId: string, optionId: string) => {
    setAttribute((prev) => {
      if (!prev) return prev;
      return prev.map((a) =>
        a.attribute_id === attributeId
          ? {
              ...a,
              valuesList: a.valuesList.filter(
                (o) => o.attribute_value_id !== optionId,
              ),
            }
          : a,
      );
    });
  };

  const generateVariants = () => {
    if (attribute?.length === 0) return;
    const arrays = attribute?.map((a) =>
      a.valuesList.map((o) => ({
        attribute_id: a.attribute_id,
        attributeName: a.attributeName,
        attribute_value_id: o.attribute_value_id,
        attributeValueName: o.value,
      })),
    );
    // cartesian product
    let combos: Array<Array<VariantAttributeDetail>> = [[]];

    for (const arr of arrays ?? []) {
      combos = combos.flatMap((prev) => arr.map((item) => [...prev, item]));
    }

    const newVariants: Variant[] = combos.map((combo) => ({
      id: Math.random().toString(36).slice(2, 9),
      attributeDetails: combo,
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
  const handleCreateProduct = () => {
    if (productType == "SINGLE") {
      try {
        const singlePayload = {
          product: {
            product_type: productType.toUpperCase(),
            productName: productInformation.productName,
            slugName: productInformation.slugName,
            selling_type: productInformation.sellingType.toUpperCase(),
            description: productInformation.description,
            category_id: productInformation.category,
            subcategory_id: productInformation.subCategory,
            brand_id: productInformation.brand,
            unit_id: productInformation.unit,
            warranty_id: customFeild.warranty_id,
            manufacturer: customFeild.manufacturer
              ? customFeild.manufacturer
              : undefined,
            manufacturer_date: customFeild.manufacturer_date
              ? customFeild.manufacturer_date
              : undefined,
            expiry_date: customFeild.expiry_date
              ? customFeild.expiry_date
              : undefined,
            // ...customFeild,
          },
          productVariants: [
            {
              skuCode: singleProductInfo.skuCode,
              price: Number(singleProductInfo.price),
              tax_type: singleProductInfo.taxType?.toUpperCase(),
              tax_value: Number(singleProductInfo.taxValue || 0),
              discount_type: singleProductInfo.discountType?.toUpperCase(),
              discount_value: Number(singleProductInfo.discountValue || 0),
            },
          ],
        };
        const productPromise = createProduct(singlePayload);
        toast.promise(productPromise, {
          loading: "Creating Product..",
          success: (res) => {
            setProductInformation({
              productName: "",
              slugName: "",
              skuCode: "",
              sellingType: "",
              category: "",
              subCategory: "",
              brand: "",
              unit: "",
              description: "",
            });
            setcustomFeild({
              warranty_id: "",
              manufacturer: "",
              manufacturer_date: "",
              expiry_date: "",
            });
            setSingleProductInfo({
              price: "",
              taxType: "",
              taxValue: "",
              discountType: "",
              discountValue: "",
              skuCode: "",
            });
            return res.message;
          },
          error: (err) => {
            return err.response.data.message;
          },
        });
      } catch (error: any) {
        if (error.response?.data) {
          console.log(error);
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } else {
      try {
        const variablePayload = {
          product: {
            product_type: productType.toUpperCase(),
            productName: productInformation.productName,
            slugName: productInformation.slugName,
            selling_type: productInformation.sellingType.toUpperCase(),
            description: productInformation.description,
            category_id: productInformation.category,
            subcategory_id: productInformation.subCategory,
            brand_id: productInformation.brand,
            unit_id: productInformation.unit,
            ...customFeild,
          },
          productVariants: variants?.map((v) => ({
            skuCode: v.sku,
            price: Number(v.price),
            tax_type: v.taxType?.toUpperCase(),
            tax_value: Number(v.taxValue || 0),
            discount_type: v.discountType?.toUpperCase(),
            discount_value: Number(v.discountValue || 0),
            attribute_value_ids: v.attributeDetails?.map(
              (d) => d.attribute_value_id,
            ),
          })),
        };

        const productPromise = createProduct(variablePayload);
        toast.promise(productPromise, {
          loading: "Creating Product..",
          success: (res) => {
            setProductInformation({
              productName: "",
              slugName: "",
              skuCode: "",
              sellingType: "",
              category: "",
              subCategory: "",
              brand: "",
              unit: "",
              description: "",
            });
            setcustomFeild({
              warranty_id: "",
              manufacturer: "",
              manufacturer_date: "",
              expiry_date: "",
            });
            setAttribute(null);
            setVariants(null);
            return res.message;
          },
          error: (err) => {
            return err.response.data.message;
          },
        });
        console.log(variablePayload);
      } catch (error: any) {
        if (error.response?.data) {
          console.log(error);
        } else {
          toast.error("Something Went Wrong");
        }
      }
    }
  };
  const updateVariantField = (
    variantId: string,
    field: keyof Variant,
    value: any,
  ) => {
    setVariants((prev) => {
      if (!prev) return prev; // or return [] if you want to reset instead
      return prev.map((v) =>
        v.id === variantId ? { ...v, [field]: value } : v,
      );
    });
  };
  const deleteVariant = (id: string) => {
    setVariants((prev) => {
      if (!prev) return prev;
      return prev.filter((v) => v.id !== id);
    });
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
                      required
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
                      required
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* SKU */}
                  {/* <div className="space-y-2 grid">
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
                  </div> */}

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
                        onClick={() => setOpenCreateCategory(true)}
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
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem value={cat.category_id}>
                            {cat.name}
                          </SelectItem>
                        ))}
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
                      disabled={!productInformation.category}
                    >
                      <SelectTrigger id="subCategory" className="w-full">
                        <SelectValue placeholder="Select SubCategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.length > 0 ? (
                          <>
                            {subCategories.map((subcat) => (
                              <SelectItem value={subcat.subCategory_id}>
                                {subcat.subCategoryName}
                              </SelectItem>
                            ))}
                          </>
                        ) : (
                          <>
                            <div className="px-4 py-2 text-sm  text-red-500">
                              No SubCategory Found
                            </div>
                          </>
                        )}
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
                        {brand.map((brand) => (
                          <SelectItem value={brand.brand_id}>
                            {brand.brandName}
                          </SelectItem>
                        ))}
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
                        {unit.map((u) => (
                          <SelectItem value={u.unit_id}>
                            {u.unitName}
                          </SelectItem>
                        ))}
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
            onClick={() => setIsPriceOpen((o) => !o)}
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
                isPriceOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Form Content */}
          {isPriceOpen && (
            <div className="space-y-6 border-t pt-6">
              {/* Product Type */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Product Type <span className="text-red-500">*</span>
                </Label>

                <RadioGroup
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  onValueChange={(v) => handleProductTypeChange(v)}
                  value={productType}
                >
                  {/* Option 1: Single Product */}
                  <div className="relative">
                    <RadioGroupItem
                      value="SINGLE"
                      id="single"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="single"
                      className="
          flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 cursor-pointer bg-white transition-all duration-200
          hover:border-gray-300 hover:bg-gray-50
          peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:shadow-sm
        "
                    >
                      <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600 peer-group-data-[state=checked]:bg-blue-100 peer-group-data-[state=checked]:text-blue-600">
                        <Box className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          Single Product
                        </span>
                        <span className="text-xs text-gray-500">
                          Standalone item with one SKU
                        </span>
                      </div>
                    </Label>
                  </div>

                  {/* Option 2: Variable Product */}
                  <div className="relative">
                    <RadioGroupItem
                      value="VARIABLE"
                      id="variable"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="variable"
                      className="
          flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 cursor-pointer bg-white transition-all duration-200
          hover:border-gray-300 hover:bg-gray-50
          peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:shadow-sm
        "
                    >
                      <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          Variable Product
                        </span>
                        <span className="text-xs text-gray-500">
                          Product with multiple options (size/color)
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Row 1: Quantity, Price, Tax Type */}

              {productType === "SINGLE" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        name="price"
                        onChange={handleSingleProduct}
                        value={singleProductInfo.price}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="taxType"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Tax Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={singleProductInfo.taxType}
                        onValueChange={(val) =>
                          setSingleProductInfo((prev) => ({
                            ...prev,
                            taxType: val,
                          }))
                        }
                      >
                        <SelectTrigger id="taxType" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INCLUSIVE">Inclusive</SelectItem>
                          <SelectItem value="EXCLUSIVE">Exclusive</SelectItem>
                          <SelectItem value="NONE">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="tax"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Tax Value<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="taxvalue"
                        type="number"
                        className="w-full"
                        placeholder=""
                        name="taxValue"
                        disabled={singleProductInfo.taxType === "NONE"}
                        onChange={handleSingleProduct}
                        value={singleProductInfo.taxValue}
                      />
                    </div>
                  </div>

                  {/* Row 2: Tax, Discount Type, Discount Value */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="discountType"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Discount Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={singleProductInfo.discountType}
                        onValueChange={(val) =>
                          setSingleProductInfo((prev) => ({
                            ...prev,
                            discountType: val,
                          }))
                        }
                      >
                        <SelectTrigger id="discountType" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed Amount</SelectItem>
                          <SelectItem value="NONE">None</SelectItem>
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
                        name="discountValue"
                        disabled={singleProductInfo.discountType === "NONE"}
                        onChange={handleSingleProduct}
                        value={singleProductInfo.discountValue}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">
                        SKU Code<span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="sku"
                          placeholder="Enter SKU"
                          name="skuCode"
                          value={singleProductInfo.skuCode}
                          onChange={handleSingleProduct}
                        />
                        <Button
                          type="button"
                          className=" text-white px-3 py-5 size-sm "
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="max-w-7xl mx-auto space-y-8">
                    {/* ---------------------------------------------------------------------------
          SECTION 1: ATTRIBUTE MANAGER
         --------------------------------------------------------------------------- */}
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Product Attributes
                          </h3>
                          <p className="text-sm text-gray-500">
                            Define the options for your product (e.g., Size,
                            Color).
                          </p>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Add New Attribute Control */}
                        <div className="flex flex-col sm:flex-row gap-4 items-end max-w-2xl">
                          {/* Attribute Select Wrapper */}
                          <div className="w-full sm:flex-1 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Choose Attribute
                            </Label>
                            <Select
                              value={
                                selectedAttribute
                                  ? JSON.stringify(selectedAttribute)
                                  : ""
                              }
                              onValueChange={(value) => {
                                const attrObj = JSON.parse(value);
                                setSelectedAttribute(attrObj);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an attribute..." />
                              </SelectTrigger>
                              <SelectContent>
                                {AllAttribute.map((attr) => (
                                  <SelectItem
                                    key={attr.attribute_id}
                                    value={JSON.stringify(attr)}
                                  >
                                    {attr.attributeName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Add Button */}
                          <Button
                            onClick={() => {
                              if (!selectedAttribute) return;
                              addAttribute(selectedAttribute);
                              setSelectedAttribute(null);
                            }}
                            size="lg"
                            disabled={!selectedAttribute}
                            className="w-full sm:w-auto"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Attribute
                          </Button>
                        </div>

                        <hr className="border-gray-100" />

                        {/* List of Added Attributes */}
                        <div className="space-y-4">
                          {attribute?.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                              <p className="text-sm text-gray-500">
                                No attributes added yet.
                              </p>
                            </div>
                          ) : (
                            attribute?.map((attr) => (
                              <div
                                key={attr.attribute_id}
                                className="bg-white border rounded-lg p-4 shadow-sm hover:border-gray-300 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                                      {attr.attributeName.charAt(0)}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {attr.attributeName}
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeAttribute(attr.attribute_id)
                                    }
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                  {/* Select Values */}
                                  <div className="w-full sm:w-64 flex-shrink-0">
                                    <Select
                                      onValueChange={(value) => {
                                        const obj = JSON.parse(value);
                                        addValues(attr.attribute_id, obj);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={`+ Add ${attr.attributeName} value`}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {attr.attributeValues?.map((val) => (
                                          <SelectItem
                                            key={val.attribute_value_id}
                                            value={JSON.stringify(val)}
                                          >
                                            {val.value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Value Chips */}
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {attr.valuesList?.length === 0 && (
                                      <span className="text-xs text-gray-400 italic px-2">
                                        No values selected
                                      </span>
                                    )}
                                    {attr.valuesList?.map((opt) => (
                                      <span
                                        key={opt.attribute_value_id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                      >
                                        {opt.value}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeOption(
                                              attr.attribute_id,
                                              opt.attribute_value_id,
                                            )
                                          }
                                          className="text-gray-400 hover:text-red-500 focus:outline-none"
                                        >
                                          <Trash className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Generate Action */}
                        {attribute && attribute.length > 0 && (
                          <div className="flex justify-end pt-2">
                            <Button
                              size="lg"
                              onClick={generateVariants}
                              className="px-8"
                            >
                              Generate Variants
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ---------------------------------------------------------------------------
          SECTION 2: VARIANTS TABLE
         --------------------------------------------------------------------------- */}
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                      <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Variants Preview
                          </h3>
                          <p className="text-sm text-gray-500">
                            Adjust price, stock, and codes for each variant.
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {variants?.length || 0} items
                        </span>
                      </div>

                      <div className="flex-1 w-full overflow-hidden">
                        {variants?.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-gray-500 font-medium">
                              No variants generated yet
                            </p>
                            <p className="text-sm text-gray-400">
                              Add attributes above and click Generate.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs text-white uppercase bg-blue-500 border-b ">
                                <tr>
                                  {/* Dynamic Attribute Headers */}
                                  {attribute?.map((a) => (
                                    <th
                                      key={a.attribute_id}
                                      className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]"
                                    >
                                      {a.attributeName}
                                    </th>
                                  ))}
                                  <th className="px-4 py-3 font-medium min-w-[120px]">
                                    Price{" "}
                                    <span className="text-red-500">*</span>
                                  </th>
                                  <th className="px-4 py-3 font-medium min-w-[140px]">
                                    SKU
                                  </th>
                                  <th className="px-4 py-3 font-medium min-w-[130px]">
                                    Tax Type
                                  </th>
                                  <th className="px-4 py-3 font-medium min-w-[100px]">
                                    Tax Val
                                  </th>
                                  <th className="px-4 py-3 font-medium min-w-[130px]">
                                    Discount
                                  </th>
                                  <th className="px-4 py-3 font-medium min-w-[100px]">
                                    Disc Val
                                  </th>
                                  <th className="px-4 py-3 font-medium text-center w-[50px]"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {variants?.map((v) => (
                                  <tr
                                    key={v.id}
                                    className="hover:bg-blue-50 group transition-colors"
                                  >
                                    {/* Read-Only Attribute Columns */}
                                    {attribute?.map((a) => (
                                      <td
                                        key={a.attribute_id}
                                        className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium"
                                      >
                                        {
                                          v.attributeDetails?.find(
                                            (d) =>
                                              d.attribute_id === a.attribute_id,
                                          )?.attributeValueName
                                        }
                                      </td>
                                    ))}

                                    {/* Input Fields - Using h-8 for compact look */}
                                    <td className="px-4 py-2">
                                      <Input
                                        type="number"
                                        className="h-8 w-28"
                                        placeholder="0.00"
                                        value={v.price}
                                        onChange={(e) =>
                                          updateVariantField(
                                            v.id,
                                            "price",
                                            e.target.value === ""
                                              ? ""
                                              : Number(e.target.value),
                                          )
                                        }
                                      />
                                    </td>

                                    <td className="px-4 py-2">
                                      <Input
                                        className="h-8 w-32 font-mono text-xs"
                                        placeholder="SKU"
                                        value={v.sku}
                                        onChange={(e) =>
                                          updateVariantField(
                                            v.id,
                                            "sku",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </td>

                                    <td className="px-4 py-2">
                                      <Select
                                        value={v.taxType}
                                        onValueChange={(val) =>
                                          updateVariantField(
                                            v.id,
                                            "taxType",
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-32 text-xs">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="NONE">
                                            None
                                          </SelectItem>
                                          <SelectItem value="INCLUSIVE">
                                            Inclusive
                                          </SelectItem>
                                          <SelectItem value="EXCLUSIVE">
                                            Exclusive
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </td>

                                    <td className="px-4 py-2">
                                      <div className="relative">
                                        <Input
                                          type="number"
                                          className="h-8 w-24 pr-6"
                                          placeholder="0"
                                          disabled={v.taxType === "NONE"}
                                          value={v.taxValue}
                                          onChange={(e) =>
                                            updateVariantField(
                                              v.id,
                                              "taxValue",
                                              e.target.value === ""
                                                ? ""
                                                : Number(e.target.value),
                                            )
                                          }
                                        />
                                        <span className="absolute right-2 top-1.5 text-xs text-gray-400 pointer-events-none">
                                          %
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-4 py-2">
                                      <Select
                                        value={v.discountType}
                                        onValueChange={(val) =>
                                          updateVariantField(
                                            v.id,
                                            "discountType",
                                            val,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-32 text-xs">
                                          <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="NONE">
                                            None
                                          </SelectItem>
                                          <SelectItem value="PERCENTAGE">
                                            Percentage
                                          </SelectItem>
                                          <SelectItem value="FIXED">
                                            Fixed
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </td>

                                    <td className="px-4 py-2">
                                      <Input
                                        type="number"
                                        className="h-8 w-24"
                                        placeholder="0"
                                        disabled={v.discountType === "NONE"}
                                        value={v.discountValue}
                                        onChange={(e) =>
                                          updateVariantField(
                                            v.id,
                                            "discountValue",
                                            e.target.value === ""
                                              ? ""
                                              : Number(e.target.value),
                                          )
                                        }
                                      />
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteVariant(v.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* IMAGES  */}

        {/* Custom and Fields */}

        <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
          <button
            onClick={() => setIsCustomOpen((o) => !o)}
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
                isCustomOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {isCustomOpen && (
            <>
              {" "}
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
                        value={customFeild.warranty_id}
                        onValueChange={(val) =>
                          setcustomFeild((prev) => ({
                            ...prev,
                            warranty_id: val,
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
                          {warranty?.map((war) => (
                            <SelectItem value={war.warranty_id}>
                              {war.warrantyName}
                            </SelectItem>
                          ))}
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
                        name="manufacturer_date"
                        value={customFeild.manufacturer_date}
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
                        name="expiry_date"
                        value={customFeild.expiry_date}
                        onChange={handleCustomFeildChange}

                        //className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                        // placeholder="DD-MM-YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end mt-5">
          <div className="flex gap-3">
            <Button className="bg-gray border-2 border-blue-500 text-blue-400 hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>Add Product</Button>
          </div>
        </div>
      </div>

      {/* create Category dialog */}
      <Dialog open={openCreateCategory} onOpenChange={setOpenCreateCategory}>
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
            <Button onClick={handleCreateCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateProduct;

// export default CreateProduct;
