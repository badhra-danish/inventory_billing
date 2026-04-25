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
  Layers,
  Trash2,
  X,
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
      <div className="dark:text-slate-100">
        {/* header of the page */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold dark:text-white">
              Create Product
            </p>
            <p className="text-gray-500 dark:text-slate-400">Create Product</p>
          </div>
          <div>
            <Button
              className="bg-gray border-2 border-blue-400 text-blue-400 hover:text-white dark:bg-transparent dark:hover:bg-blue-400 transition-colors"
              onClick={() => navigate("/products")}
            >
              <ArrowLeft />
              Back To Product
            </Button>
          </div>
        </div>

        {/* Product information */}
        <div className="bg-white dark:bg-slate-900 p-4 border border-gray-300 dark:border-slate-800 rounded-sm mt-5 transition-colors">
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group outline-none"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CircleAlert className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
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
              <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-900 border-t dark:border-slate-800 pt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="productName"
                      className="dark:text-slate-200"
                    >
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      name="productName"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      required
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="slug" className="dark:text-slate-200">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="Enter slug"
                      name="slugName"
                      value={productInformation?.slugName}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      required
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* Selling Type */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="sellingType"
                      className="dark:text-slate-200"
                    >
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
                      <SelectTrigger
                        id="sellingType"
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 grid">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="category" className="dark:text-slate-200">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setOpenCreateCategory(true)}
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-orange-600 dark:text-blue-400"
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
                      <SelectTrigger
                        id="category"
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.category_id}
                            value={cat.category_id}
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub Category */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="subCategory"
                      className="dark:text-slate-200"
                    >
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
                      <SelectTrigger
                        id="subCategory"
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select SubCategory" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {subCategories.length > 0 ? (
                          <>
                            {subCategories.map((subcat) => (
                              <SelectItem
                                key={subcat.subCategory_id}
                                value={subcat.subCategory_id}
                              >
                                {subcat.subCategoryName}
                              </SelectItem>
                            ))}
                          </>
                        ) : (
                          <div className="px-4 py-2 text-sm text-red-500">
                            No SubCategory Found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="brand" className="dark:text-slate-200">
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
                      <SelectTrigger
                        id="brand"
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {brand.map((brand) => (
                          <SelectItem
                            key={brand.brand_id}
                            value={brand.brand_id}
                          >
                            {brand.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-2 grid">
                    <Label htmlFor="unit" className="dark:text-slate-200">
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
                      <SelectTrigger
                        id="unit"
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {unit.map((u) => (
                          <SelectItem key={u.unit_id} value={u.unit_id}>
                            {u.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:col-span-2 grid gap-2">
                    <Label
                      htmlFor="itemBarcode"
                      className="dark:text-slate-200"
                    >
                      Descriptions<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Enter Your Descriptions"
                        rows={6}
                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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
        <div className="bg-white dark:bg-slate-900 p-4 border border-gray-300 dark:border-slate-800 rounded-sm mt-5 transition-colors">
          <button
            onClick={() => setIsPriceOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group outline-none"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pricing & Stocks
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isPriceOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {isPriceOpen && (
            <div className="space-y-6 border-t dark:border-slate-800 pt-6">
              <div>
                <Label className="text-sm font-semibold text-gray-900 dark:text-slate-200 mb-3 block">
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
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-slate-800 cursor-pointer bg-white dark:bg-slate-900 transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-700 peer-data-[state=checked]:border-blue-600 dark:peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50/50 dark:peer-data-[state=checked]:bg-blue-900/20"
                    >
                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                        <Box className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Single Product
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
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
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-slate-800 cursor-pointer bg-white dark:bg-slate-900 transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-700 peer-data-[state=checked]:border-blue-600 dark:peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50/50 dark:peer-data-[state=checked]:bg-blue-900/20"
                    >
                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Variable Product
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Product with multiple options (size/color)
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {productType === "SINGLE" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block"
                    >
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      name="price"
                      onChange={handleSingleProduct}
                      value={singleProductInfo.price}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="taxType"
                      className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block"
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
                      <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="INCLUSIVE">Inclusive</SelectItem>
                        <SelectItem value="EXCLUSIVE">Exclusive</SelectItem>
                        <SelectItem value="NONE">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="tax"
                      className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block"
                    >
                      Tax Value<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="taxvalue"
                      type="number"
                      className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      name="taxValue"
                      disabled={singleProductInfo.taxType === "NONE"}
                      onChange={handleSingleProduct}
                      value={singleProductInfo.taxValue}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="discountType"
                      className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block"
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
                      <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount</SelectItem>
                        <SelectItem value="NONE">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="discountValue"
                      className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 block"
                    >
                      Discount Value <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      name="discountValue"
                      disabled={singleProductInfo.discountType === "NONE"}
                      onChange={handleSingleProduct}
                      value={singleProductInfo.discountValue}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku" className="dark:text-slate-200">
                      SKU Code<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        placeholder="Enter SKU"
                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        name="skuCode"
                        value={singleProductInfo.skuCode}
                        onChange={handleSingleProduct}
                      />
                      <Button
                        type="button"
                        className="text-white px-3 py-5 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* ATTRIBUTE MANAGER */}
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Product Attributes
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Define the options for your product.
                        </p>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-end max-w-2xl">
                        <div className="w-full sm:flex-1 space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                            Choose Attribute
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              setSelectedAttribute(JSON.parse(v))
                            }
                          >
                            <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                              <SelectValue placeholder="Select an attribute..." />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
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
                        <Button
                          onClick={() =>
                            selectedAttribute && addAttribute(selectedAttribute)
                          }
                          className="dark:bg-blue-600 dark:hover:bg-blue-700"
                          size="lg"
                          disabled={!selectedAttribute}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {attribute?.length === 0 ? (
                          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              No attributes added yet.
                            </p>
                          </div>
                        ) : (
                          attribute?.map((attr) => (
                            <div
                              key={attr.attribute_id}
                              className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-4 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {attr.attributeName}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeAttribute(attr.attribute_id)
                                  }
                                  className="text-gray-400 hover:text-red-600 dark:hover:bg-red-900/20"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <Select
                                  onValueChange={(v) =>
                                    addValues(attr.attribute_id, JSON.parse(v))
                                  }
                                >
                                  <SelectTrigger className="w-full sm:w-64 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                                    <SelectValue
                                      placeholder={`+ Add ${attr.attributeName}`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
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
                                <div className="flex flex-wrap gap-2">
                                  {attr.valuesList?.map((opt) => (
                                    <span
                                      key={opt.attribute_value_id}
                                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border dark:border-slate-600 flex items-center gap-1.5"
                                    >
                                      {opt.value}
                                      <button
                                        onClick={() =>
                                          removeOption(
                                            attr.attribute_id,
                                            opt.attribute_value_id,
                                          )
                                        }
                                      >
                                        <X size={12} />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {attribute && attribute.length > 0 && (
                        <div className="flex justify-end pt-2">
                          <Button
                            size="lg"
                            onClick={generateVariants}
                            className="px-8 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 transition-colors"
                          >
                            Generate Variants
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VARIANTS TABLE */}
                  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                      <h3 className="font-semibold dark:text-white">
                        Variants Preview
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-blue-500 text-white dark:bg-blue-600">
                          <tr>
                            {attribute?.map((a) => (
                              <th key={a.attribute_id} className="px-4 py-3">
                                {a.attributeName}
                              </th>
                            ))}
                            <th className="px-4 py-3">Price *</th>
                            <th className="px-4 py-3">SKU</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                          {variants?.map((v) => (
                            <tr
                              key={v.id}
                              className="hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              {attribute?.map((a) => (
                                <td
                                  key={a.attribute_id}
                                  className="px-4 py-3 dark:text-slate-300"
                                >
                                  {
                                    v.attributeDetails?.find(
                                      (d) => d.attribute_id === a.attribute_id,
                                    )?.attributeValueName
                                  }
                                </td>
                              ))}
                              <td className="px-4 py-2">
                                <Input
                                  type="number"
                                  className="h-8 w-24 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                  value={v.price}
                                  onChange={(e) =>
                                    updateVariantField(
                                      v.id,
                                      "price",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="px-4 py-2">
                                <Input
                                  className="h-8 w-32 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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

                              <td>
                                <Button
                                  variant="ghost"
                                  onClick={() => deleteVariant(v.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom and Fields */}
        <div className="bg-white dark:bg-slate-900 p-4 border border-gray-300 dark:border-slate-800 rounded-sm mt-5 transition-colors">
          <button
            onClick={() => setIsCustomOpen((o) => !o)}
            className="flex items-center justify-between w-full mb-6 group outline-none"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <List className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Custom Feild
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${isCustomOpen ? "transform rotate-180" : ""}`}
            />
          </button>
          {isCustomOpen && (
            <div className="p-6 pt-2 border-t dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Warranty <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={customFeild.warranty_id}
                    onValueChange={(val) =>
                      setcustomFeild((prev) => ({ ...prev, warranty_id: val }))
                    }
                  >
                    <SelectTrigger className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                      <SelectValue placeholder="Select Warranty" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      {warranty?.map((war) => (
                        <SelectItem
                          key={war.warranty_id}
                          value={war.warranty_id}
                        >
                          {war.warrantyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter manufacturer"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    name="manufacturer"
                    value={customFeild.manufacturer}
                    onChange={handleCustomFeildChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Manufactured Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    name="manufacturer_date"
                    value={customFeild.manufacturer_date}
                    onChange={handleCustomFeildChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Expiry On <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    name="expiry_date"
                    value={customFeild.expiry_date}
                    onChange={handleCustomFeildChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end mt-5">
          <div className="flex gap-3">
            <Button className="bg-gray border-2 border-blue-500 text-blue-400 hover:text-white dark:bg-transparent transition-colors">
              Cancel
            </Button>
            <Button
              onClick={handleCreateProduct}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* create Category dialog */}
      <Dialog open={openCreateCategory} onOpenChange={setOpenCreateCategory}>
        <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-2 dark:border-slate-800">
            <div className="grid gap-4">
              <Label className="dark:text-slate-200">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                name="categoryname"
                onChange={handleChange}
                value={categoryFormData.categoryname}
              />
            </div>
            <div className="grid gap-4">
              <Label className="dark:text-slate-200">
                Slug Category <span className="text-red-500">*</span>
              </Label>
              <Input
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                name="slugName"
                onChange={handleChange}
                value={categoryFormData.slugName}
              />
            </div>
            <div className="flex items-center justify-between border-b-2 dark:border-slate-800 pb-7">
              <Label className="dark:text-slate-200">
                Status <span className="text-red-500">*</span>
              </Label>
              <Switch
                checked={categoryFormData.status}
                onCheckedChange={(checked) =>
                  setcategoryFormData((prev) => ({ ...prev, status: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                variant={"outline"}
                className="dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreateCategory}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateProduct;

// export default CreateProduct;
