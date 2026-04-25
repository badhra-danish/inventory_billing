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
  ChevronUp,
  CircleAlert,
  CirclePlus,
  Edit,
  List,
  PackageSearch,
  Plus,
  PlusCircle,
  Printer,
  Trash,
} from "lucide-react";
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
                expandedRows[product.product_id] ? "bg-blue-500 text-white" : ""
              }`}
            >
              {expandedRows[product.product_id] ? (
                <>
                  {" "}
                  <ChevronDown className="stroke-4" />{" "}
                </>
              ) : (
                <>
                  <ChevronUp className="stroke-4" />
                </>
              )}
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
    <div className="w-full bg-white dark:bg-slate-900 rounded-md shadow-md p-4 transition-colors">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search....."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-gray-500"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-slate-200">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-slate-700" />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize dark:text-slate-300 dark:focus:bg-slate-700"
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
              className="hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300"
              >
                Category: {selectedCategory}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="shadow-lg custom-scrollbar dark:bg-slate-800 dark:border-slate-700"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-slate-200">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-slate-700" />

              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat.category_id}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
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
              className="hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Button
                variant="outline"
                className="ml-auto dark:border-slate-700 dark:text-slate-300"
              >
                Brand: {selectedBrand} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-slate-200">
                Filter By Brand
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-slate-700" />

              {brandOptions.map((brand) => (
                <DropdownMenuItem
                  key={brand.brand_id}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
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

      {/* Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 dark:border-slate-800 transition-colors">
        <Table>
          <TableHeader className="bg-blue-500 dark:bg-blue-700 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-none"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-white dark:text-slate-100 tracking-wide px-4 py-3"
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

          <TableBody className="dark:bg-slate-900 transition-colors">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="dark:border-slate-800"
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const product = row.original;
                const isExpanded = expandedRows[product.product_id];

                return (
                  <React.Fragment key={row.id}>
                    {/* Main product row */}
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors capitalize border-gray-200 dark:border-slate-800"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 capitalize"
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
                      <TableRow className="bg-slate-50/50 dark:bg-slate-950/40 border-none transition-all">
                        <TableCell
                          colSpan={columns.length}
                          className="p-0 border-b border-slate-200 dark:border-slate-800"
                        >
                          {/* Container with a slide-down entrance and subtle inner depth. 
          The shadow-[inset...] creates a professional "well" effect.
      */}
                          <div className="px-8 py-6 animate-in fade-in slide-in-from-top-3 duration-500 ease-out shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
                            {loadingVariants[product.product_id] ? (
                              <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <Loader />
                                <span className="text-xs font-medium text-slate-400 animate-pulse uppercase tracking-widest">
                                  Fetching Variants...
                                </span>
                              </div>
                            ) : variantsMap[product.product_id]?.length ? (
                              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all duration-300">
                                {/* Professional Grid Header 
                Using text-[10px] and font-black for a high-end "Utility" dashboard aesthetic.
            */}
                                <div className="grid grid-cols-12 gap-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                  <div className="col-span-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Attribute Details
                                  </div>
                                  <div className="col-span-2">SKU Code</div>
                                  <div className="col-span-2">Base Price</div>
                                  <div className="col-span-2 text-right">
                                    Actions
                                  </div>
                                </div>

                                {/* Content Body with Scroll Limit */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar transition-colors">
                                  {variantsMap[product.product_id].map(
                                    (variant) => (
                                      <div
                                        key={variant.product_variant_id}
                                        className="grid grid-cols-12 gap-4 items-center px-6 py-5 text-sm hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
                                      >
                                        {/* Highlighted Active Tab Style Badge */}
                                        <div className="col-span-3">
                                          <span className="inline-flex items-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20 text-[13px] shadow-sm">
                                            {variant.variant_label}
                                          </span>
                                        </div>

                                        {/* SKU Code with Mono Font for readability */}
                                        <div className="col-span-2 font-mono text-[12px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded w-fit border border-slate-100 dark:border-slate-800">
                                          {variant.skuCode}
                                        </div>

                                        {/* Price Display */}
                                        <div className="col-span-2 font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                                          ₹{variant.price.toLocaleString()}
                                        </div>

                                        {/* Tax Information */}

                                        {/* Discount Badge */}

                                        {/* Action Group with Original Logic */}
                                        <div className="col-span-2 flex justify-end items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-3 text-[10px] font-bold uppercase border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all rounded-lg active:scale-95 shadow-sm"
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

                                          <div className="flex items-center border-l border-slate-200 dark:border-slate-700 pl-2 gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
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
                                                className="h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
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
                              <div className="flex flex-col items-center justify-center py-16 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <PackageSearch className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                  No configurations found
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
                  className="h-24 text-center text-gray-500 dark:text-slate-400 capitalize dark:border-slate-800"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600 dark:text-slate-400">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex gap-2 items-center">
          <div>
            Page {pageMeteData.currentPage} of {pageMeteData.totalPage}
          </div>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMeteData.hasPrevPage === false}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPage, p + 1))
            }
            disabled={pageMeteData.hasnextPage === false}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialog Box for Variant Edit */}
      <Dialog open={openVariant} onOpenChange={setOpenVariant}>
        <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">
              Edit Variant Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 pt-5 mt-3 border-t-2 dark:border-slate-800">
            <div className="flex gap-4 w-full">
              <div className="grid gap-3 w-full">
                <Label className="dark:text-slate-300">SkuCode:</Label>
                <Input
                  type="text"
                  name="skuCode"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
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
                <Label className="dark:text-slate-300">Price:</Label>
                <Input
                  type="number"
                  name="price"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
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
          </div>
          <DialogFooter className="dark:border-slate-800">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleupdateVariant}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Update Variant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Variant Configuration Dialog */}
      <Dialog open={openAddVariant} onOpenChange={setOpenAddVariant}>
        <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950 transition-colors">
          <DialogHeader className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Variant Configuration
                </DialogTitle>
                <DialogDescription className="mt-1 dark:text-slate-400">
                  Configure attributes and generate SKUs for{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                    {selectedProduct.product_name}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                      1. Define Attributes
                    </Label>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Step 1 of 2
                    </span>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <Select
                      value={
                        selectedAttribute
                          ? JSON.stringify(selectedAttribute)
                          : ""
                      }
                      onValueChange={(v) => setSelectedAttribute(JSON.parse(v))}
                    >
                      <SelectTrigger className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-200">
                        <SelectValue placeholder="Select Attribute" />
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
                    <Button
                      onClick={() => {
                        if (!selectedAttribute) return;
                        addAttribute(selectedAttribute);
                        setSelectedAttribute(null);
                      }}
                      className="h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {attribute?.map((attr) => (
                      <div
                        key={attr.attribute_id}
                        className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-800/50"
                      >
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-3 py-2">
                          <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                            {attr.attributeName}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttribute(attr.attribute_id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                        <div className="p-3">
                          <Select
                            onValueChange={(v) =>
                              addValues(attr.attribute_id, JSON.parse(v))
                            }
                          >
                            <SelectTrigger className="w-full h-9 text-xs mb-3 border-slate-200 dark:border-slate-700 dark:bg-slate-800">
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                              >
                                {opt.value}
                                <button
                                  onClick={() =>
                                    removeOption(
                                      attr.attribute_id,
                                      opt.attribute_value_id,
                                    )
                                  }
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {attribute && attribute?.length > 0 && (
                    <Button
                      onClick={generateVariants}
                      className="w-full mt-4 bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md h-11"
                    >
                      Generate Combinations
                    </Button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 h-full">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden transition-colors">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                    <Label className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                      2. Variant Pricing & SKU
                    </Label>
                    <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                      {variants?.length || 0} Generated
                    </span>
                  </div>

                  <div className="flex-1 overflow-auto custom-scrollbar relative">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-10">
                        <tr>
                          {attribute?.map((a) => (
                            <th key={a.attribute_id} className="px-4 py-3">
                              {a.attributeName}
                            </th>
                          ))}
                          <th className="px-4 py-3 min-w-[100px]">Price *</th>
                          <th className="px-4 py-3 min-w-[120px]">SKU Code</th>
                          <th className="px-4 py-3 min-w-[140px]">
                            Tax Details
                          </th>
                          <th className="px-4 py-3">Tax %</th>
                          <th className="px-4 py-3">Discount Type</th>
                          <th className="px-4 py-3">Value</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 transition-colors">
                        {variants?.map((v) => (
                          <tr
                            key={v.id}
                            className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors group"
                          >
                            {attribute?.map((a) => (
                              <td key={a.attribute_id} className="px-4 py-3">
                                <span className="font-medium dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                  {
                                    v.attributeDetails?.find(
                                      (d) => d.attribute_id === a.attribute_id,
                                    )?.attributeValueName
                                  }
                                </span>
                              </td>
                            ))}
                            <td className="px-4 py-3">
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
                                className="w-24 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                              />
                            </td>
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
                                className="w-32 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 uppercase"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                onValueChange={(val) =>
                                  updateVariantField(v.id, "taxType", val)
                                }
                              >
                                <SelectTrigger className="w-32 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                                  <SelectValue
                                    placeholder={v.taxType || "Select"}
                                  />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
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
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                value={v.taxValue}
                                disabled={v.taxType === "none"}
                                onChange={(e) =>
                                  updateVariantField(
                                    v.id,
                                    "taxValue",
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value),
                                  )
                                }
                                className="w-20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                onValueChange={(val) =>
                                  updateVariantField(v.id, "discountType", val)
                                }
                              >
                                <SelectTrigger className="w-32 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                                  <SelectValue
                                    placeholder={v.discountType || "None"}
                                  />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                                  <SelectItem value="percentage">
                                    % Percentage
                                  </SelectItem>
                                  <SelectItem value="fixed">₹ Fixed</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                value={v.discountValue}
                                disabled={v.discountType === "none"}
                                onChange={(e) =>
                                  updateVariantField(
                                    v.id,
                                    "discountValue",
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value),
                                  )
                                }
                                className="w-20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="ghost"
                                onClick={() => deleteVariants(v.id)}
                                className="text-slate-400 hover:text-red-600"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreateVariant}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={!variants || variants.length === 0}
            >
              {(variants?.length ?? 0) > 0
                ? `Save ${variants?.length} Variants`
                : "Save Variants"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Product Info Dialog */}
      <Dialog open={openUpdateProduct} onOpenChange={setOpenUpdateProduct}>
        <DialogContent className="max-w-[90vw] w-full lg:max-w-5xl h-[90vh] overflow-hidden bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-colors">
          <DialogHeader className="border-b dark:border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
              Update Product
            </DialogTitle>
          </DialogHeader>

          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Product Information Section */}
            <div className="bg-white dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-800 rounded-sm mt-5">
              <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CircleAlert className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Product Information
                  </h2>
                </div>
              </div>

              {/* Detail section */}
              <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-900 border-t dark:border-slate-800 pt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="productName"
                      className="text-sm font-medium dark:text-slate-300"
                    >
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      name="productName"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500"
                      value={productInformation?.productName}
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="slug"
                      className="text-sm font-medium dark:text-slate-300"
                    >
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      placeholder="Enter slug"
                      name="slugName"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500"
                      value={productInformation.slugName}
                      onChange={handleProductInfoChange}
                    />
                  </div>

                  {/* Selling Type */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="sellingType"
                      className="text-sm font-medium dark:text-slate-300"
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                        <SelectItem value="RETAIL">Retail</SelectItem>
                        <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                        <SelectItem value="BOTH">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 grid">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="category"
                        className="text-sm font-medium dark:text-slate-300"
                      >
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-orange-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select Category">
                          {categories.find(
                            (c) =>
                              String(c.category_id) ===
                              productInformation.category,
                          )?.name || "Select Category"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
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
                      className="text-sm font-medium dark:text-slate-300"
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select SubCategory">
                          {subCategories.find(
                            (c) =>
                              String(c.subCategory_id) ===
                              productInformation.subCategory,
                          )?.subCategoryName || "Select SubCategory"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                        {subCategories.length > 0 ? (
                          subCategories.map((subcat) => (
                            <SelectItem
                              key={subcat.subCategory_id}
                              value={subcat.subCategory_id}
                            >
                              {subcat.subCategoryName}
                            </SelectItem>
                          ))
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
                    <Label
                      htmlFor="brand"
                      className="text-sm font-medium dark:text-slate-300"
                    >
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                        {brand.map((b) => (
                          <SelectItem key={b.brand_id} value={b.brand_id}>
                            {b.brandName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-2 grid">
                    <Label
                      htmlFor="unit"
                      className="text-sm font-medium dark:text-slate-300"
                    >
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select">
                          {unit.find(
                            (c) =>
                              String(c.unit_id) === productInformation.unit,
                          )?.unitName || "Select unit"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                        {unit.map((u) => (
                          <SelectItem key={u.unit_id} value={u.unit_id}>
                            {u.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Descriptions */}
                  <div className="w-full md:col-span-2 grid gap-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium dark:text-slate-300"
                    >
                      Descriptions<span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter Your Descriptions"
                      rows={6}
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500"
                      value={productInformation.description}
                      name="description"
                      onChange={handleProductInfoChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Field Section */}
            <div className="bg-white dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-800 rounded-sm mt-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <List className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Custom Field
                </h2>
              </div>

              <div className="p-6 pt-2 border-t dark:border-slate-800 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Warranty Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Warranty <span className="text-red-500">*</span>
                    </label>
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
                        className="w-full dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      >
                        <SelectValue placeholder="Select Warranty" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
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

                  {/* Manufacturer Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter manufacturer"
                      name="manufacturer"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500"
                      value={customFeild.manufacturer}
                      onChange={handleCustomFeildChange}
                    />
                  </div>

                  {/* Manufactured Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Manufactured Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      name="manufacturer_date"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500 [color-scheme:dark]"
                      value={customFeild.manufacturer_date}
                      onChange={handleCustomFeildChange}
                    />
                  </div>

                  {/* Expiry Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Expiry On <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      name="expiry_date"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus-visible:ring-blue-500 [color-scheme:dark]"
                      value={customFeild.expiry_date}
                      onChange={handleCustomFeildChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t dark:border-slate-800 pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUpdateProduct}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors"
            >
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialogs */}
      <Dialog open={openDeleteProduct} onOpenChange={setOpenDeleteProduct}>
        <DialogContent className="flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-14 h-14 border-2 dark:border-slate-800 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <img src={trashImg} className="w-10 rounded-full" />
            </div>
            <DialogTitle className="text-lg font-semibold dark:text-white">
              Delete Variant
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Are you sure you want to delete this Variant?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Variant/Product Dialogs */}
      <Dialog open={openDeleteVariant} onOpenChange={setOpenDeleteVariant}>
        <DialogContent className="flex flex-col items-center text-center dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader className="flex flex-col items-center">
            <div className="w-14 h-14 border-2 dark:border-slate-800 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <img src={trashImg} className="w-10 rounded-full" />
            </div>
            <DialogTitle className="text-lg font-semibold dark:text-white">
              Delete Variant
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Are you sure you want to delete this Variant?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteVariant}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Barcode Dialog */}
      <Dialog open={openBarcode} onOpenChange={setOpenBarcode}>
        <DialogContent className="max-w-[400px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl dark:bg-slate-900">
          <DialogHeader className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-b dark:border-slate-700 print:hidden transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Barcode className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Product Barcode
                </DialogTitle>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase">
                  SKU: {selectedVariant.skuCode}
                </p>
              </div>
            </div>
          </DialogHeader>
          <div
            id="barcode-print"
            className="flex flex-col items-center justify-center p-10 bg-white"
          >
            <div className="print:p-0 p-6 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 print:bg-white print:border-none">
              <div className="bg-white p-4 print:p-0 rounded-lg shadow-sm border border-slate-100 print:border-none print:shadow-none transition-all">
                <BarcodeView value={selectedVariant.barcode} />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-slate-50/80 dark:bg-slate-800/80 px-6 py-4 border-t dark:border-slate-700 flex gap-2 print:hidden transition-colors">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="flex-1 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all active:scale-95"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" /> Print Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
