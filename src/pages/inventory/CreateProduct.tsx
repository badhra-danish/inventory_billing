import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
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
import { getAllVaariantAttributeAll } from "@/api/VariantAttribute/Attributeclinet";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { createCategory } from "@/api/Category-subCategory/ApiClient";
import toast from "react-hot-toast";
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
    warranty: "",
  });

  const {
    categories,
    brand,
    subCategories,
    unit,
    refreshBrand,
    refreshCategories,
    refreshSubCategories,
    refreshUnit,
  } = useCategory();

  useEffect(() => {
    refreshBrand();
    refreshCategories();
    refreshUnit();
  }, []);

  useEffect(() => {
    if (!productInformation.category) return;
    refreshSubCategories(productInformation.category);
  }, [productInformation.category]);

  interface VariantAttributeDetail {
    attributeID: string;
    attributeName: string;
    attributeValueID: string;
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
    attributeID: string;
    name: string;
    values: { attributeValueID: string; value: string }[];
    valuesList: { attributeValueID: string; value: string }[];
  }
  const [AllAttribute, setAllAttribute] = React.useState<VariantAttribute[]>(
    []
  );
  const [selectedAttribute, setSelectedAttribute] = React.useState<string>("");
  const [attribute, setAttribute] = React.useState<VariantAttribute[]>([]);
  const [productType, setProductType] = React.useState<
    "single" | "variable" | ""
  >("single");
  const [isOpen, setIsOpen] = React.useState(true);
  const [customFeild, setcustomFeild] = React.useState({
    warranty: "",
    manufacturer: "",
    manufacturedDate: "",
    expiryDate: "",
  });
  const [singleProductInfo, setSingleProductInfo] = React.useState({
    quantity: "",
    price: "",
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: "",
    quantityAlert: "",
    skuCode: "",
  });

  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [image, setImage] = React.useState<File>();
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [isExpanded, setIsExpanded] = React.useState(true);
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
    >
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
      if (res.statusCode === 200) {
        setAllAttribute(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllAttribute();
  }, []);
  // console.log(AllAttribute);
  const handleSingleProduct = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const addAttribute = (obj: VariantAttribute) => {
    setAttribute((prev) => {
      const exists = prev.some((a) => a.attributeID === obj.attributeID);
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
    setAttribute((prev) =>
      prev.map((a) => {
        if (a.attributeID !== attributeId) return a;
        // check duplicates
        const exists = a.valuesList?.some(
          (v) => v.value.trim().toLowerCase() === obj.value.trim().toLowerCase()
        );
        if (exists) return a;
        // otherwise push new value
        return {
          ...a,
          valuesList: [
            ...(a.valuesList ?? []),
            { attributeValueID: obj.attributeValueID, value: obj.value },
          ],
        };
      })
    );
  };

  const removeAttribute = (attributeId: string) => {
    setAttribute((prev) => prev.filter((a) => a.attributeID !== attributeId));
  };

  const removeOption = (attributeId: string, optionId: string) => {
    setAttribute((prev) =>
      prev.map((a) =>
        a.attributeID === attributeId
          ? {
              ...a,
              valuesList: a.valuesList.filter(
                (o) => o.attributeValueID !== optionId
              ),
            }
          : a
      )
    );
  };

  const generateVariants = () => {
    if (attribute.length === 0) return;
    const arrays = attribute.map((a) =>
      a.valuesList.map((o) => ({
        attributeID: a.attributeID,
        attributeName: a.name,
        attributeValueID: o.attributeValueID,
        attributeValueName: o.value,
      }))
    );
    // cartesian product
    let combos: Array<Array<VariantAttributeDetail>> = [[]];

    for (const arr of arrays) {
      combos = combos.flatMap((prev) => arr.map((item) => [...prev, item]));
    }

    const newVariants: Variant[] = combos.map((combo) => ({
      id: Math.random().toString(36).slice(2, 9),
      // attributes: combo.reduce(
      //   (acc, cur) => ({ ...acc, [cur.attributeID]: cur.attributeValueID }),
      //   {} as Record<string, string>
      // ),
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
  const prepareProductPayload = () => {
    if (productType == "single") {
      const singlePayload = {
        name: productInformation.productName,
        slug: productInformation.slugName,
        sellingType: productInformation.sellingType,
        description: productInformation.description,
        categoryID: productInformation.category,
        subCategoryID: productInformation.subCategory,
        brandID: productInformation.brand,
        unitID: productInformation.unit,
        productType: productType,
        quantity: Number(singleProductInfo.quantity),
        price: Number(singleProductInfo.price),
        taxType: singleProductInfo.taxType,
        taxValue: Number(singleProductInfo.tax),
        discountType: singleProductInfo.discountType,
        discountValue: Number(singleProductInfo.discountValue),
        quantityAlert: Number(singleProductInfo.quantityAlert),
        skuCode: singleProductInfo.skuCode,
        image: image,
        ...customFeild,
      };
      console.log(singlePayload);
    } else {
      const variablePayload = {
        name: productInformation.productName,
        slug: productInformation.slugName,
        sellingType: productInformation.sellingType,
        description: productInformation.description,
        categoryID: productInformation.category,
        subCategoryID: productInformation.subCategory,
        brandID: productInformation.brand,
        unitID: productInformation.unit,
        productType: productType,
        productVariations: variants.map((v) => ({
          sku: v.sku,
          price: Number(v.price),
          quantity: Number(v.quantity),
          taxType: v.taxType,
          taxValue: Number(v.taxValue || 0),
          discountType: v.discountType,
          discountValue: Number(v.discountValue || 0),
          quantityAlert: Number(v.quantityAlert || 0),
          image: v.image,
          variationOptionModels: v.attributeDetails?.map((d) => ({
            attributeID: d.attributeID,
            attributeValueID: d.attributeValueID,
          })),
        })),
        ...customFeild,
      };
      console.log(variablePayload);
    }
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

  const handleVariantImage = (variantId: string, file: File) => {
    const imageURL = URL.createObjectURL(file); // preview before upload

    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId ? { ...v, image: file, imageUrl: imageURL } : v
      )
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // pick only first file
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImage(file);
  };

  // const handleRemoveImage = (id: string) => {
  //   setImages((prev) => prev.filter((img) => img.id !== id));
  // };

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
                          <SelectItem value={cat.categoryID}>
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
                              <SelectItem value={subcat.subCategoryID}>
                                {subcat.name}
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
                          <SelectItem value={brand.brandID}>
                            {brand.name}
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
                          <SelectItem value={u.unitID}>{u.name}</SelectItem>
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
                        name="quantity"
                        onChange={handleSingleProduct}
                        value={singleProductInfo.quantity}
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
                      <Select
                        value={singleProductInfo.tax}
                        onValueChange={(val) =>
                          setSingleProductInfo((prev) => ({
                            ...prev,
                            tax: val,
                          }))
                        }
                      >
                        <SelectTrigger id="tax" className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">GST 5%</SelectItem>
                          <SelectItem value="12">GST 12%</SelectItem>
                          <SelectItem value="18">GST 18%</SelectItem>
                          <SelectItem value="28">GST 28%</SelectItem>
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
                        name="discountValue"
                        onChange={handleSingleProduct}
                        value={singleProductInfo.discountValue}
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
                        name="quantityAlert"
                        onChange={handleSingleProduct}
                        value={singleProductInfo.quantityAlert}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
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
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    {/* Attributes manager */}
                    <div className="p-4 border rounded space-y-4">
                      <Label className="text-sm font-medium">Attributes</Label>
                      <div className="flex gap-2">
                        <Select
                          value={selectedAttribute}
                          onValueChange={(value) => setSelectedAttribute(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Attribute">
                              Select Attribute
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {AllAttribute.map((attr) => (
                              <SelectItem
                                key={attr.attributeID}
                                value={JSON.stringify(attr)}
                              >
                                {attr.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => {
                            if (!selectedAttribute) return;
                            const obj = JSON.parse(selectedAttribute);
                            console.log(obj);

                            addAttribute(obj);
                            setSelectedAttribute("");
                          }}
                        >
                          <PlusCircle />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {attribute.length === 0 && (
                          <p className="text-sm text-gray-500">
                            No attributes added yet. Add an attribute name, then
                            add options.
                          </p>
                        )}

                        {attribute.map((attr) => (
                          <div
                            key={attr.attributeID}
                            className="border p-3 rounded"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{attr.name}</div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() =>
                                    removeAttribute(attr.attributeID)
                                  }
                                  className="bg-transparent px-2 py-1 border-0 "
                                  variant="outline"
                                >
                                  <Trash
                                    className="text-red-500 stroke-3"
                                    size={22}
                                  />
                                </Button>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => {
                                    const obj = JSON.parse(value);
                                    console.log(obj);

                                    addValues(attr.attributeID, obj);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={`Add Values for ${attr.name} `}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {attr.values?.map((val) => (
                                      <SelectItem
                                        key={val.attributeValueID}
                                        value={JSON.stringify(val)}
                                      >
                                        {val.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {/* <Input
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
                                /> */}
                                {/* <Button
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
                                </Button> */}
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {attr.valuesList?.map((opt) => (
                                  <div
                                    key={opt.attributeValueID}
                                    className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
                                  >
                                    <span className="text-sm">{opt.value}</span>
                                    <button
                                      onClick={() =>
                                        removeOption(
                                          attr.attributeID,
                                          opt.attributeValueID
                                        )
                                      }
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

                        {attribute.length > 0 && (
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
                        <div className="overflow-x-auto max-w-full max-h-[400px] border rounded p-2">
                          <table className="min-w-max w-full text-sm table-auto">
                            <thead>
                              <tr className="text-left bg-gray-200">
                                {attribute.map((a) => (
                                  <th key={a.attributeID} className="px-2 py-3">
                                    {a.name}
                                  </th>
                                ))}
                                <th className="px-2 py-3">Price</th>
                                <th className="px-2 py-3">Quantity</th>
                                <th className="px-2 py-3">SKU</th>
                                <th className="px-2 py-3">Tax Type</th>
                                <th className="px-2 py-3">Discount</th>
                                <th className="px-2 py-3">Discount value</th>
                                <th className="px-2 py-3">Qty Alert</th>
                                <th className="px-2 py-3">Img</th>
                                <th className="px-2 py-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants.map((v) => (
                                <tr key={v.id} className="border-t">
                                  {attribute.map((a) => (
                                    <td
                                      key={a.attributeID}
                                      className="px-2 py-3 align-middle"
                                    >
                                      <div className="bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                                        {
                                          v.attributeDetails?.find(
                                            (d) =>
                                              d.attributeID === a.attributeID
                                          )?.attributeValueName
                                        }
                                      </div>
                                    </td>
                                  ))}

                                  <td className="px-2 py-3 align-middle">
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

                                  <td className="px-2 py-3 align-middle">
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

                                  <td className="px-2 py-4 align-middle">
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

                                  <td className="px-2 py-4 align-middle">
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

                                  <td className="px-2 py-4 align-middle">
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
                                    </div>
                                  </td>

                                  <td className="px-2 py-4 align-middle">
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
                                  <td className="px-2 py-4 align-middle">
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
                                  <td className="px-2 py-4 align-middle">
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file)
                                            handleVariantImage(v.id, file);
                                        }}
                                      />
                                      {v.imageUrl ? (
                                        <img
                                          src={v.imageUrl}
                                          className="w-12 h-12 object-cover rounded border"
                                        />
                                      ) : (
                                        <div className="w-15 h-10 border rounded flex items-center justify-center text-xs text-white bg-blue-500">
                                          Upload
                                        </div>
                                      )}
                                    </label>
                                  </td>

                                  <td className="px-3 py-4 align-middle">
                                    <Button
                                      variant="outline"
                                      className="h-8 w-8 p-0 text-red-500 border-red-400 hover:bg-red-100"
                                      onClick={() => deleteVariant(v.id)}
                                    >
                                      x
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
                {image && (
                  <>
                    {" "}
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 group">
                      <img
                        src={imageUrl}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </>
                )}
              </div>

              {!image && (
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
            <Button onClick={prepareProductPayload}>Add Product</Button>
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
