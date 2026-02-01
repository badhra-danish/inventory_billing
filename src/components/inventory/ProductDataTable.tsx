import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Barcode,
  ChevronDown,
  CircleAlert,
  CirclePlus,
  Edit,
  Eye,
  List,
  Plus,
  PlusCircle,
  Printer,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import trashImg from "../../assets/images/trash.jpg";
import {
  createVariant,
  deleteProduct,
  deleteVariant,
  getAllProductPage,
  getAllVariantByProduct,
  updateProduct,
  updateVariant,
} from "@/api/CreateProduct/ProductClinet";
import Loader from "../commen/loader";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";
import { getAllVaariantAttributeAll } from "@/api/VariantAttribute/Attributeclinet";
import { Textarea } from "../ui/textarea";
import { useCategory } from "@/context/Category-SubCategory/Category-Sub";
import BarcodeView from "../utils/Barcode";

// ];

//add the Variants
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

//product
export type Product = {
  description: string;
  selling_type: string;
  slugName: string;
  product_id: string;
  productName: string;
  product_type: string;
  manufacturer_date: Date;
  manufacturer: string;
  expiry_date: Date;
  unitName: string;
  subCategoryName: string;
  variant_count: number;
  categoryName: string;
  brandName: string;
  category_id: string;
  subCategory_id: string;
  brand_id: string;
  unit_id: string;
  warranty_id: string;
};

// upadate variant
export type VariantAttributes = {
  attributeName: string;
  attributeValue: string;
};
export type Variants = {
  product_variant_id: string;
  skuCode: string;
  variant_label: string;
  price: number;
  tax_type: string;
  tax_value: number;
  barcode: string;
  discount_type: string;
  discount_value: number;
  attributes: VariantAttributes[];
};
export default function Products() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedBrand, setSelectedBrand] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [productData, setProductData] = React.useState([]);
  //const [selectedProduct, setSelectedProduct] = React.useState({});
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});
  const [variantsMap, setVariantsMap] = React.useState<
    Record<string, Variants[]>
  >({});
  const [loadingVariants, setLoadingVariants] = React.useState<
    Record<string, boolean>
  >({});
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    hasnextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [openVariant, setOpenVariant] = React.useState(false);
  const [openAddVariant, setOpenAddVariant] = React.useState(false);
  const [openUpdateProduct, setOpenUpdateProduct] = React.useState(false);
  const [openDeleteVariant, setOpenDeleteVariant] = React.useState(false);
  const [openDeleteProduct, setOpenDeleteProduct] = React.useState(false);
  const [openBarcode, setOpenBarcode] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState({
    variant_id: "",
    skuCode: "",
    price: 0,
    tax_type: "",
    tax_value: 0,
    barcode: "",
    discount_type: "",
    discount_value: 0,
    product_id: "",
  });
  const [selectedProduct, setSelectedProduct] = React.useState({
    product_id: "",
    product_name: "",
  });
  //Add the variants State
  const [AllAttribute, setAllAttribute] = React.useState<VariantAttribute[]>(
    [],
  );
  const [selectedAttribute, setSelectedAttribute] =
    React.useState<VariantAttribute | null>(null);
  const [attribute, setAttribute] = React.useState<VariantAttribute[] | null>(
    [],
  );
  const [variants, setVariants] = React.useState<Variant[] | null>([]);
  // update Product Info
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

  React.useEffect(() => {
    refreshBrand();
    refreshWarranty();
    refreshCategories();
    refreshUnit();
  }, []);

  React.useEffect(() => {
    if (!productInformation.category) return;
    refreshSubCategories(productInformation.category);
  }, [productInformation.category]);

  const [customFeild, setcustomFeild] = React.useState({
    warranty_id: "",
    manufacturer: "",
    manufacturer_date: "",
    expiry_date: "",
  });
  const getSelectedVariant = (
    id: string,
    code: string,
    price: number,
    tx_t: string,
    tx_v: number,
    dis_t: string,
    barcode: string,
    dis_v: number,
    product_id: string,
  ) => {
    setSelectedVariant((prev) => ({
      ...prev,
      variant_id: id,
      skuCode: code,
      barcode: barcode,
      price: price,
      tax_type: tx_t,
      tax_value: tx_v,
      discount_type: dis_t,
      discount_value: dis_v,
      product_id: product_id,
    }));
  };
  console.log(selectedVariant);

  // get all Attributes . .
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

  const handlePrint = () => {
    const element = document.getElementById("barcode-print");
    if (!element) return;

    const w = window.open("", "_blank");
    if (!w) return;

    const clone = element.cloneNode(true) as Element;

    w.document.write(`
    <html>
      <head>
        <style>
          @page {
            size: 50mm 25mm;
            margin: 0;
          }

          html, body {
            width: 50mm;
            height: 25mm;
            margin: 0;
            padding: 0;
          }

          #barcode-print {
            width: 50mm;
            height: 25mm;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          svg, canvas, img {
            max-width: 100%;
            max-height: 100%;
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);

    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  // All finctions of the Add the varints opreations
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
  const deleteVariants = (id: string) => {
    setVariants((prev) => {
      if (!prev) return prev;
      return prev.filter((v) => v.id !== id);
    });
  };

  const handleCreateVariant = async () => {
    const variantPayload = {
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
    const product_id = selectedProduct.product_id;
    if (!product_id) return;
    const createPromise = createVariant(product_id, variantPayload);
    toast.promise(createPromise, {
      loading: "Creating Product",
      success: (res) => {
        setOpenAddVariant(false);
        fetchAllVariant(product_id);
        setVariantsMap({});
        setVariants([]);
        setAttribute([]);
        return res.message;
      },
      error: (err) => {
        return err?.response?.data?.message || "Failed to Add variant";
      },
    });
  };
  //update Variant Feild
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
  //get All Products....
  const getAllProduct = async () => {
    try {
      setIsLoading(true);
      const res = await getAllProductPage(page, 10);
      if (res.status === "OK") {
        setProductData(res.data || []);
        setPageMetaData(res.pageMetaData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch al, the Variants..
  const fetchAllVariant = async (product_id: string) => {
    try {
      setLoadingVariants((prev) => ({ ...prev, [product_id]: true }));

      // call your API to get variants for this product
      const res = await getAllVariantByProduct(product_id); // API you already have

      if (res.status === "OK") {
        setVariantsMap((prev) => ({
          ...prev,
          [product_id]: res.data, // save variants for this product
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVariants((prev) => ({ ...prev, [product_id]: false }));
    }
  };
  //Expalnd or the veiw the Variants
  const handleViewClick = (product_id: string) => {
    // toggle expanded row
    setExpandedRows((prev) => ({
      ...prev,
      [product_id]: !prev[product_id],
    }));

    // fetch variants only if not already loaded
    if (!variantsMap[product_id]) {
      fetchAllVariant(product_id);
    }
  };
  React.useEffect(() => {
    if (selectedVariant.discount_type === "NONE") {
      setSelectedVariant((prev) => ({
        ...prev,
        discount_value: 0,
      }));
    }
    if (selectedVariant.tax_type === "NONE") {
      setSelectedVariant((prev) => ({
        ...prev,
        tax_value: 0,
      }));
    }
  }, [selectedVariant.discount_type, selectedVariant.tax_type]);

  React.useEffect(() => {
    getAllProduct();
  }, [page]);

  // Handle update VAriants ...
  const handleupdateVariant = () => {
    const id = selectedVariant.variant_id;
    if (!id) return;

    const payload = {
      skuCode: selectedVariant.skuCode,
      price: selectedVariant.price,
      tax_type: selectedVariant.tax_type,
      tax_value: selectedVariant.tax_value,
      discount_type: selectedVariant.discount_type,
      discount_value: selectedVariant.discount_value,
    };

    toast.promise(updateVariant(id, payload), {
      loading: "Updating Variant...",
      success: (res) => {
        fetchAllVariant(selectedVariant.product_id);
        setOpenVariant(false);
        setSelectedVariant({
          variant_id: "",
          skuCode: "",
          price: 0,
          tax_type: "",
          barcode: "",
          tax_value: 0,
          discount_type: "",
          discount_value: 0,
          product_id: "",
        });
        return res.message || "Variant updated successfully";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to update variant",
    });
  };
  const handleUpdateProduct = async () => {
    const payload = {
      updateProductData: {
        productName: productInformation.productName,
        slugName: productInformation.slugName,
        selling_type: productInformation.sellingType,
        category_id: productInformation.category,
        subcategory_id: productInformation.subCategory,
        unit_id: productInformation.unit,
        brand_id: productInformation.brand,
        description: productInformation.description,
        warranty_id: customFeild.warranty_id,
        manufacturer: customFeild.manufacturer,
        manufacturer_date: customFeild.manufacturer_date,
        expiry_date: customFeild.expiry_date,
      },
    };
    const product_id = selectedProduct.product_id;
    if (!product_id) return;
    const updatePromise = updateProduct(product_id, payload);
    toast.promise(updatePromise, {
      loading: "Updating Product...",
      success: (res) => {
        setOpenUpdateProduct(false);
        getAllProduct();
        return res.message;
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to update variant",
    });
  };

  // Delete Variant

  const handleDeleteVariant = () => {
    const variant_id = selectedVariant.variant_id;

    const deletePromise = deleteVariant(variant_id);
    toast.promise(deletePromise, {
      loading: "Variant Deleting ...",
      success: (res) => {
        setOpenDeleteVariant(false);
        fetchAllVariant(selectedVariant.product_id);
        return res.message;
      },
      error: (err) => err.response.data.message,
    });
  };
  console.log(selectedProduct.product_id);

  const handleDeleteProduct = () => {
    const product_id = selectedProduct.product_id;
    if (!product_id) return;
    const deletePromise = deleteProduct(product_id);
    toast.promise(deletePromise, {
      loading: "Product Deleting ...",
      success: (res) => {
        getAllProduct();
        setOpenDeleteProduct(false);
        return res.message;
      },
      error: (err) => err.response.data.message,
    });
  };
  console.log("ks;mdaks", variantsMap);
  const data: Product[] = productData;
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="checked:text-white"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "productName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-white"
          >
            Product Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-bold">
          {row.getValue("productName")}
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: () => <div className="text-left text-white">Category</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("categoryName")}
          </div>
        );
      },
    },
    {
      accessorKey: "subCategoryName",
      header: () => <div className="text-left text-white">SubCategory</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            {row.getValue("subCategoryName")}
          </div>
        );
      },
    },
    {
      accessorKey: "brandName",
      header: () => <div className="text-left text-white">Brand</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">
            {row.getValue("brandName")}
          </div>
        );
      },
    },
    {
      accessorKey: "unitName",
      header: () => <div className="text-left text-white">Units</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">{row.getValue("unitName")}</div>
        );
      },
    },
    {
      accessorKey: "warrantyName",
      header: () => <div className="text-left text-white">Warranty</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            {row.getValue("warrantyName")}
          </div>
        );
      },
    },
    {
      accessorKey: "product_type",
      header: () => <div className="text-left text-white">Product-Type</div>,
      cell: ({ row }) => {
        return (
          <div className=" text-left capitalize">
            {row.getValue("product_type")}
          </div>
        );
      },
    },
    {
      accessorKey: "variant_count",
      header: () => <div className="text-left text-white">Variants</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            {row.getValue("variant_count")}
          </div>
        );
      },
    },

    {
      accessorKey: "manufacturer_date",
      header: () => (
        <div className="text-left text-white">Manufacturer-Date</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">
            {row.getValue("manufacturer_date")}
          </div>
        );
      },
    },

    {
      id: "actions",
      // header: () => <div className="text-left">Action</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            {product.product_type === "VARIABLE" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpenAddVariant(true);
                    setSelectedProduct((prev) => ({
                      ...prev,
                      product_id: product.product_id,
                      product_name: product.productName,
                    }));
                  }}
                >
                  <CirclePlus />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewClick(product.product_id)}
              className={`transition-transform ${
                expandedRows ? "rotate-180" : ""
              }`}
            >
              <Eye />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenUpdateProduct(true);
                setSelectedProduct((prev) => ({
                  ...prev,
                  product_id: product.product_id,
                  product_name: product.productName,
                }));
                setProductInformation((prev) => ({
                  ...prev,
                  productName: product.productName,
                  slugName: product.slugName,
                  sellingType: product.selling_type,
                  category: product.category_id,
                  subCategory: product.subCategory_id,
                  brand: product.brand_id,
                  unit: product.unit_id,
                  description: product.description,
                }));
                setcustomFeild((prev) => ({
                  ...prev,
                  warranty_id: product.warranty_id,
                  manufacturer: product.manufacturer,
                  manufacturer_date: product.manufacturer_date
                    ? new Date(product.manufacturer_date)
                        .toISOString()
                        .split("T")[0]
                    : "",
                  expiry_date: product.expiry_date
                    ? new Date(product.expiry_date).toISOString().split("T")[0]
                    : "",
                }));
              }}
            >
              <Edit />
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setOpenDeleteProduct(true);
                setSelectedProduct((prev) => ({
                  ...prev,
                  product_id: product.product_id,
                  product_name: product.productName,
                }));
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter, // add this
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });
  const categoryOptions = [{ name: "All", category_id: 0 }, ...categories];
  const brandOptions = [{ brandName: "All", brand_id: 0 }, ...brand];
  return (
    <div className="w-full bg-white rounded-md shadow-md p-4">
      {/*  Top Toolbar */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search....."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-gray-300 focus-visible:ring-gray-500"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Category: {selectedCategory}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="shadow-lg custom-scrollbar"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat.category_id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    const categoryColumn = table.getColumn("categoryName");
                    if (categoryColumn) {
                      categoryColumn.setFilterValue(
                        cat.name === "All" ? "" : cat.name,
                      );
                    }
                  }}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="hover:bg-blue-500 hover:text-white"
            >
              <Button variant="outline" className="ml-auto">
                Brand: {selectedBrand} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter By Brand
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {brandOptions.map((brand) => (
                <DropdownMenuItem
                  key={brand.brand_id}
                  onClick={() => {
                    setSelectedBrand(brand.brandName);
                    const brandColumn = table.getColumn("brandName");
                    if (brandColumn) {
                      brandColumn.setFilterValue(
                        brand.brandName === "All" ? "" : brand.brandName,
                      );
                    }
                  }}
                >
                  {brand.brandName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/*  Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-blue-500 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-gray-800  tracking-wide px-4 py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const product = row.original;
                console.log(product);

                const isExpanded = expandedRows[product.product_id]; // <-- state to track expanded rows
                const attributeHeaders = Array.from(
                  new Set(
                    variantsMap[product.product_id]?.flatMap((variant) =>
                      variant.attributes?.map((attr) => attr.attributeName),
                    ) || [],
                  ),
                );

                return (
                  <React.Fragment key={row.id}>
                    {/* Main product row */}
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors capitalize"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700 capitalize"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Expanded variant row */}
                    {isExpanded && (
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableCell
                          colSpan={columns.length}
                          className="p-0 border-b border-slate-200"
                        >
                          <div className="px-10 py-6 animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                            {loadingVariants[product.product_id] ? (
                              <div className="flex items-center justify-center py-10">
                                <Loader />
                              </div>
                            ) : variantsMap[product.product_id]?.length ? (
                              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                {/* Table Header 
               Adjusted Grid: 3 (Attr) + 2 (SKU) + 2 (Price) + 2 (Tax) + 1 (Disc) + 2 (Actions) = 12
            */}
                                <div className="grid grid-cols-12 gap-4 bg-slate-50 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                  <div className="col-span-3">
                                    Attribute Details
                                  </div>
                                  <div className="col-span-2">SKU Code</div>
                                  <div className="col-span-2">Base Price</div>
                                  <div className="col-span-2">Tax/GST</div>
                                  <div className="col-span-1">Discount</div>
                                  <div className="col-span-2 text-right">
                                    Actions
                                  </div>
                                </div>

                                {/* Table Rows Container */}
                                <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 custom-scrollbar">
                                  {variantsMap[product.product_id].map(
                                    (variant) => (
                                      <div
                                        key={variant.product_variant_id}
                                        className="grid grid-cols-12 gap-4 items-center px-6 py-4 text-sm hover:bg-slate-50 transition-colors duration-150 group"
                                      >
                                        {/* Label / Attribute (Col Span 3) */}
                                        <div className="col-span-3">
                                          <span className="inline-flex items-center font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 text-xs">
                                            {variant.variant_label}
                                          </span>
                                        </div>

                                        {/* SKU (Col Span 2) */}
                                        <div className="col-span-2 font-mono text-xs text-slate-500 font-medium">
                                          {variant.skuCode}
                                        </div>

                                        {/* Price (Col Span 2) */}
                                        <div className="col-span-2 font-semibold text-slate-900">
                                          ₹{variant.price.toLocaleString()}
                                        </div>

                                        {/* Tax (Col Span 2) */}
                                        <div className="col-span-2">
                                          <div className="flex flex-col">
                                            <span className="text-slate-700 font-medium text-xs">
                                              {variant.tax_value}%
                                            </span>
                                            <span className="text-[10px] text-slate-400 uppercase leading-none mt-0.5">
                                              {variant.tax_type}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Discount (Col Span 1) */}
                                        <div className="col-span-1">
                                          {variant.discount_value > 0 ? (
                                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                                              -{variant.discount_value}%
                                            </span>
                                          ) : (
                                            <span className="text-slate-300 font-medium">
                                              —
                                            </span>
                                          )}
                                        </div>

                                        {/* Actions (Col Span 2 - Right Aligned) */}
                                        <div className="col-span-2 flex justify-end items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-3 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
                                            onClick={() => {
                                              setOpenBarcode(true);
                                              getSelectedVariant(
                                                variant.product_variant_id,
                                                variant.skuCode,
                                                variant.price,
                                                variant.tax_type,
                                                variant.tax_value,
                                                variant.discount_type,
                                                variant.barcode,
                                                variant.discount_value,
                                                product.product_id,
                                              );
                                            }}
                                          >
                                            Barcode
                                          </Button>

                                          <div className="flex items-center border-l border-slate-200 pl-2 gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                                              onClick={() => {
                                                setOpenVariant(true);
                                                getSelectedVariant(
                                                  variant.product_variant_id,
                                                  variant.skuCode,
                                                  variant.price,
                                                  variant.tax_type,
                                                  variant.tax_value,
                                                  variant.discount_type,
                                                  variant.barcode,
                                                  variant.discount_value,
                                                  product.product_id,
                                                );
                                              }}
                                            >
                                              <Edit className="w-3.5 h-3.5" />
                                            </Button>

                                            {product.product_type ===
                                              "VARIABLE" && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                                                onClick={() => {
                                                  setOpenDeleteVariant(true);
                                                  getSelectedVariant(
                                                    variant.product_variant_id,
                                                    variant.skuCode,
                                                    variant.price,
                                                    variant.tax_type,
                                                    variant.tax_value,
                                                    variant.discount_type,
                                                    variant.barcode,
                                                    variant.discount_value,
                                                    product.product_id,
                                                  );
                                                }}
                                              >
                                                <Trash className="w-3.5 h-3.5" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed border-slate-200 bg-white">
                                <p className="text-sm font-medium text-slate-400">
                                  No variants found for this product.
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500 capitalize"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*  Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMeteData.hasPrevPage === false}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPage, p + 1))
            }
            disabled={pageMeteData.hasnextPage === false}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialog Box for the Variant Updated */}
      <Dialog open={openVariant} onOpenChange={setOpenVariant}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <p> Edit Variant Details..</p>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 pt-5 mt-3 border-t-2">
            <div className="flex gap-4 w-full">
              {" "}
              <div className="grid gap-3 w-full">
                <Label>SkuCode:</Label>
                <Input
                  type="text"
                  name="skuCode"
                  value={selectedVariant.skuCode}
                  onChange={(e) =>
                    setSelectedVariant((prev) => ({
                      ...prev,
                      skuCode: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-3 w-full">
                <Label>Price:</Label>
                <Input
                  type="number"
                  name="price"
                  value={selectedVariant.price}
                  onChange={(e) =>
                    setSelectedVariant((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 w-full">
              {" "}
              <div className="grid gap-3 w-full">
                <Label>Tax Type:</Label>
                <Select
                  value={selectedVariant?.tax_type}
                  onValueChange={(value) =>
                    setSelectedVariant((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        tax_type: value,
                      };
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Tax Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCLUSIVE">Inclusive</SelectItem>
                    <SelectItem value="EXCLUSIVE">Exclusive</SelectItem>
                    <SelectItem value="NONE">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 w-full">
                <Label>Tax Value:</Label>
                <Input
                  type="text"
                  disabled={selectedVariant.tax_type === "NONE"}
                  value={selectedVariant.tax_value}
                  onChange={(e) =>
                    setSelectedVariant((prev) => ({
                      ...prev,
                      tax_value: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 w-full">
              {" "}
              <div className="grid gap-3 w-full">
                <Label>Discount Type:</Label>
                <Select
                  value={selectedVariant?.discount_type}
                  onValueChange={(value) =>
                    setSelectedVariant((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        discount_type: value,
                      };
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Discount Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="NONE">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 w-full">
                <Label>Discount value:</Label>
                <Input
                  type="text"
                  disabled={selectedVariant?.discount_type === "NONE"}
                  value={selectedVariant.discount_value}
                  onChange={(e) =>
                    setSelectedVariant((prev) => ({
                      ...prev,
                      discount_value: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleupdateVariant}>Update Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* For the Add the Variants of the Products */}

      <Dialog open={openAddVariant} onOpenChange={setOpenAddVariant}>
        <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50/50">
          {/* Header */}
          <DialogHeader className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">
                  Variant Configuration
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Configure attributes and generate SKUs for{" "}
                  <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {selectedProduct.product_name}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Main Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT SIDE: Attribute Manager (Takes 4 cols on large screens) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      1. Define Attributes
                    </Label>
                    <span className="text-xs text-slate-400">Step 1 of 2</span>
                  </div>

                  {/* Add Attribute Controls */}
                  <div className="flex gap-2 mb-6">
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
                      <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 focus:ring-blue-500">
                        <SelectValue placeholder="Select Attribute (e.g., Color)" />
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
                    <Button
                      onClick={() => {
                        if (!selectedAttribute) return;
                        addAttribute(selectedAttribute);
                        setSelectedAttribute(null);
                      }}
                      className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  {/* Active Attributes List */}
                  <div className="space-y-4">
                    {attribute?.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                        <p className="text-sm text-slate-500">
                          No attributes selected.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Select an attribute above to start.
                        </p>
                      </div>
                    )}

                    {attribute?.map((attr) => (
                      <div
                        key={attr.attribute_id}
                        className="group border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-blue-300 hover:shadow-md bg-white"
                      >
                        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-100">
                          <span className="font-semibold text-sm text-slate-700">
                            {attr.attributeName}
                          </span>
                          <Button
                            onClick={() => removeAttribute(attr.attribute_id)}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>

                        <div className="p-3 bg-white">
                          <Select
                            onValueChange={(value) => {
                              const obj = JSON.parse(value);
                              addValues(attr.attribute_id, obj);
                            }}
                          >
                            <SelectTrigger className="w-full h-9 text-xs mb-3 border-slate-200">
                              <SelectValue
                                placeholder={`+ Add ${attr.attributeName} option`}
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

                          <div className="flex flex-wrap gap-2">
                            {attr.valuesList?.length === 0 && (
                              <span className="text-[10px] text-slate-400 italic">
                                No options selected
                              </span>
                            )}
                            {attr.valuesList?.map((opt) => (
                              <span
                                key={opt.attribute_value_id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {opt.value}
                                <button
                                  onClick={() =>
                                    removeOption(
                                      attr.attribute_id,
                                      opt.attribute_value_id,
                                    )
                                  }
                                  className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                                >
                                  <span className="sr-only">Remove</span>
                                  <span aria-hidden="true">×</span>
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {attribute && attribute?.length > 0 && (
                      <Button
                        onClick={generateVariants}
                        className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white shadow-md h-11"
                      >
                        Generate Combinations
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Variants Table (Takes 8 cols) */}
              <div className="lg:col-span-8 h-full">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        2. Variant Pricing & SKU
                      </Label>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {variants?.length || 0} Generated
                      </span>
                    </div>
                  </div>

                  {variants?.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-slate-50/30">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        No Combinations Yet
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-xs">
                        Add attributes and options on the left, then click
                        "Generate Combinations".
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto custom-scrollbar relative">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            {attribute?.map((a) => (
                              <th
                                key={a.attribute_id}
                                className="px-4 py-3 font-semibold whitespace-nowrap bg-slate-50"
                              >
                                {a.attributeName}
                              </th>
                            ))}
                            <th className="px-4 py-3 font-semibold min-w-[100px] bg-slate-50">
                              Price <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 font-semibold min-w-[120px] bg-slate-50">
                              SKU Code
                            </th>
                            <th className="px-4 py-3 font-semibold min-w-[140px] bg-slate-50">
                              Tax Details
                            </th>
                            <th className="px-4 py-3 font-semibold min-w-[100px] bg-slate-50">
                              Tax %
                            </th>
                            <th className="px-4 py-3 font-semibold min-w-[140px] bg-slate-50">
                              Discount Type
                            </th>
                            <th className="px-4 py-3 font-semibold min-w-[100px] bg-slate-50">
                              Value
                            </th>
                            <th className="px-4 py-3 font-semibold text-center bg-slate-50 w-[50px]"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {variants?.map((v) => (
                            <tr
                              key={v.id}
                              className="hover:bg-blue-50/30 transition-colors group"
                            >
                              {attribute?.map((a) => (
                                <td
                                  key={a.attribute_id}
                                  className="px-4 py-3 whitespace-nowrap"
                                >
                                  <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                    {
                                      v.attributeDetails?.find(
                                        (d) =>
                                          d.attribute_id === a.attribute_id,
                                      )?.attributeValueName
                                    }
                                  </span>
                                </td>
                              ))}

                              {/* Price Input */}
                              <td className="px-4 py-3">
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    ₹
                                  </span>
                                  <Input
                                    type="number"
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
                                    className="w-24 pl-6 h-9 focus-visible:ring-blue-500"
                                    placeholder="0.00"
                                  />
                                </div>
                              </td>

                              {/* SKU Input */}
                              <td className="px-4 py-3">
                                <Input
                                  value={v.sku}
                                  onChange={(e) =>
                                    updateVariantField(
                                      v.id,
                                      "sku",
                                      e.target.value,
                                    )
                                  }
                                  className="w-32 h-9 font-mono text-xs uppercase"
                                  placeholder="AUTO-GEN"
                                />
                              </td>

                              {/* Tax Type */}
                              <td className="px-4 py-3">
                                <Select
                                  onValueChange={(val) =>
                                    updateVariantField(v.id, "taxType", val)
                                  }
                                >
                                  <SelectTrigger className="w-32 h-9 text-xs">
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
                                    <SelectItem value="none">No Tax</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>

                              {/* Tax Value */}
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
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
                                  className="w-20 h-9"
                                  disabled={v.taxType === "none"}
                                />
                              </td>

                              {/* Discount Type */}
                              <td className="px-4 py-3">
                                <Select
                                  onValueChange={(val) =>
                                    updateVariantField(
                                      v.id,
                                      "discountType",
                                      val,
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-32 h-9 text-xs">
                                    <SelectValue
                                      placeholder={v.discountType || "None"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="percentage">
                                      % Percentage
                                    </SelectItem>
                                    <SelectItem value="fixed">
                                      ₹ Fixed
                                    </SelectItem>
                                    <SelectItem value="none">
                                      No Discount
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>

                              {/* Discount Value */}
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
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
                                  className="w-20 h-9"
                                  disabled={v.discountType === "none"}
                                />
                              </td>

                              {/* Delete Action */}
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => deleteVariants(v.id)}
                                  tabIndex={-1}
                                >
                                  <Trash className="w-4 h-4" />
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
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-white border-t border-slate-200 shrink-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreateVariant}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] shadow-sm"
              disabled={!variants || variants.length === 0}
            >
              {(variants?.length ?? 0) > 0
                ? `Save ${variants?.length ?? 0} Variants`
                : "Save Variants"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPDATE PRODUCT INFO  */}
      <Dialog open={openUpdateProduct} onOpenChange={setOpenUpdateProduct}>
        <DialogContent className="max-w-[90vw] w-full lg:max-w-5xl h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* product Info */}
            <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
              <button
                // onClick={() => setIsOpen((o) => !o)}
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
              </button>

              {/* Detail section */}

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
                      value={productInformation?.productName}
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
                      value={productInformation.slugName}
                      onChange={handleProductInfoChange}
                    />
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
                        <SelectItem value="RETAIL">Retail</SelectItem>
                        <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                        <SelectItem value="BOTH">Both</SelectItem>
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
                        //   onClick={() => setOpenCreateCategory(true)}
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
                        <SelectValue placeholder="Select Category">
                          {categories.find(
                            (c) =>
                              String(c.category_id) ===
                              productInformation.category,
                          )?.name || "Select Category"}
                        </SelectValue>
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
                        <SelectValue placeholder="Select SubCategory">
                          {subCategories.find(
                            (c) =>
                              String(c.subCategory_id) ===
                              productInformation.subCategory,
                          )?.subCategoryName || "Select SUbCategory"}
                        </SelectValue>
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
                        <SelectValue placeholder="Select">
                          {unit.find(
                            (c) =>
                              String(c.unit_id) === productInformation.unit,
                          )?.unitName || "Select unit"}
                        </SelectValue>
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
            </div>
            {/* customFeild Info Change */}
            <div className="bg-white p-4 border-1 border-gray-300 rounded-sm mt-5">
              <button
                // onClick={() => setIsCustomOpen((o) => !o)}
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
                {/* <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isCustomOpen ? "transform rotate-180" : ""
                  }`}
                /> */}
              </button>

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
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateProduct}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* doaliog for the Delete Varaint */}
      <Dialog open={openDeleteVariant} onOpenChange={setOpenDeleteVariant}>
        {" "}
        <DialogContent className="flex flex-col items-center text-center">
          <DialogHeader className="flex flex-col items-center ">
            <div className="w-14 h-14 border-2 rounded-full flex items-center justify-center">
              <img src={trashImg} className="w-20  rounded-full" />
            </div>

            <DialogTitle className="text-lg font-semibold">
              Delete Variant
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to delete this Variant{" "}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-1 flex justify-center space-x-1">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteVariant}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* delete Product Dialog Box */}
      <Dialog open={openDeleteProduct} onOpenChange={setOpenDeleteProduct}>
        <DialogContent className="flex flex-col items-center text-center">
          <DialogHeader className="flex flex-col items-center ">
            <div className="w-14 h-14 border-2 rounded-full flex items-center justify-center">
              <img src={trashImg} className="w-20  rounded-full" />
            </div>

            <DialogTitle className="text-lg font-semibold">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-1 flex justify-center space-x-1">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openBarcode} onOpenChange={setOpenBarcode}>
        <DialogContent className="max-w-[400px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          {/* Screen-Only Header */}
          <DialogHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 print:hidden">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                <Barcode className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  Product Barcode
                </DialogTitle>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                  SKU: {selectedVariant.skuCode}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* The Printable Area */}
          <div
            id="barcode-print"
            className="flex flex-col items-center justify-center p-10 bg-white"
          >
            {/* Visual Wrapper for Screen (removed on print via CSS below) */}
            <div className="print:p-0 p-6 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 print:bg-white print:border-none">
              <div className="bg-white p-4 print:p-0 rounded-lg shadow-sm border border-slate-100 print:border-none print:shadow-none">
                <BarcodeView value={selectedVariant.barcode} />
              </div>
            </div>
          </div>

          {/* Screen-Only Footer */}
          <DialogFooter className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex gap-2 print:hidden">
            <DialogClose asChild>
              <Button variant="ghost" className="flex-1 text-slate-600">
                Close
              </Button>
            </DialogClose>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all active:scale-95"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
