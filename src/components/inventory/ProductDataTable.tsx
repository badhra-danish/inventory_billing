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
  ChevronDown,
  CircleAlert,
  CirclePlus,
  Edit,
  Eye,
  List,
  Plus,
  PlusCircle,
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
  const [selectedVariant, setSelectedVariant] = React.useState({
    variant_id: "",
    skuCode: "",
    price: 0,
    tax_type: "",
    tax_value: 0,
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
    dis_v: number,
    product_id: string,
  ) => {
    setSelectedVariant((prev) => ({
      ...prev,
      variant_id: id,
      skuCode: code,
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
        return res.message;
      },
      error: (err) => err.response.data.message,
    });
  };
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
                setOpenDeleteVariant(true);
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
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="bg-white py-2"
                        >
                          {loadingVariants[product.product_id] ? (
                            <Loader />
                          ) : variantsMap[product.product_id]?.length ? (
                            <div className="space-y-2">
                              {/* Scroll Container */}
                              <div className="overflow-x-auto">
                                <div className="min-w-max space-y-2">
                                  {/* Header */}
                                  <div
                                    className="grid gap-2 bg-blue-500 py-3 px-3 rounded text-sm font-semibold text-white"
                                    style={{
                                      gridTemplateColumns:
                                        "minmax(0, 2.5fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)",
                                    }}
                                  >
                                    {/* {attributeHeaders.map((attr) => (
                                      <span key={attr}>{attr}</span>
                                    ))} */}
                                    <span>Attribute</span>
                                    <span>SKU</span>
                                    <span>Price</span>
                                    <span>Tax</span>
                                    <span>Discount</span>
                                    <span>Actions</span>
                                  </div>

                                  {/* Rows */}
                                  {variantsMap[product.product_id].map(
                                    (variant) => (
                                      <div
                                        key={variant.product_variant_id}
                                        className="grid gap-2 bg-blue-100 p-2 rounded shadow-sm text-sm"
                                        style={{
                                          gridTemplateColumns:
                                            "minmax(0, 2.5fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)",
                                        }}
                                      >
                                        {/* Dynamic attributes */}
                                        {/* {attributeHeaders.map((attrName) => {
                                          const attr = variant.attributes?.find(
                                            (a) => a.attributeName === attrName,
                                          );
                                          return (
                                            <span key={attrName}>
                                              {attr ? attr.attributeValue : "-"}
                                            </span>
                                          );
                                        })} */}
                                        <span className="font-bold truncate whitespace-nowrap overflow-hidden">
                                          {variant.variant_label}
                                        </span>
                                        {/* Fixed columns */}
                                        <span className="font-medium">
                                          {variant.skuCode}
                                        </span>
                                        <span>₹{variant.price}</span>
                                        <span>
                                          {variant.tax_type} {variant.tax_value}
                                          %
                                        </span>
                                        <span>
                                          {variant.discount_type}{" "}
                                          {variant.discount_value}%
                                        </span>
                                        <span className="flex gap-2">
                                          <Button
                                            variant={"outline"}
                                            size="sm"
                                            onClick={() => (
                                              setOpenVariant(true),
                                              getSelectedVariant(
                                                variant.product_variant_id,
                                                variant.skuCode,
                                                variant.price,
                                                variant.tax_type,
                                                variant.tax_value,
                                                variant.discount_type,
                                                variant.discount_value,
                                                product.product_id,
                                              )
                                            )}
                                          >
                                            <Edit />
                                          </Button>
                                          {product.product_type ===
                                            "VARIABLE" && (
                                            <>
                                              {" "}
                                              <Button
                                                variant={"outline"}
                                                size="sm"
                                                className="hover:bg-red-400 hover:text-white"
                                                onClick={() => (
                                                  setOpenDeleteVariant(true),
                                                  getSelectedVariant(
                                                    variant.product_variant_id,
                                                    variant.skuCode,
                                                    variant.price,
                                                    variant.tax_type,
                                                    variant.tax_value,
                                                    variant.discount_type,
                                                    variant.discount_value,
                                                    product.product_id,
                                                  )
                                                )}
                                              >
                                                <Trash />
                                              </Button>
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center">
                              No variants found
                            </div>
                          )}
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
        <DialogContent className="max-w-[90vw] w-full lg:max-w-4xl h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add the New Variant.</DialogTitle>
            <DialogDescription>
              Add The Variant Of the{" "}
              <span className="text-blue-600 font-bold ">
                {selectedProduct.product_name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Attributes manager */}
              <div className="p-4 border rounded space-y-4">
                <Label className="text-sm font-medium">Attributes</Label>
                <div className="flex gap-2">
                  <Select
                    value={
                      selectedAttribute ? JSON.stringify(selectedAttribute) : ""
                    }
                    // onValueChange={(value) => setSelectedAttribute(value)}
                    onValueChange={(value) => {
                      const attrObj = JSON.parse(value); // convert string back to object
                      setSelectedAttribute(attrObj);
                      console.log("sfldmflds", selectedAttribute);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Attribute" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
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
                      // const obj = selectedAttribute;
                      // console.log(obj);

                      addAttribute(selectedAttribute);
                      setSelectedAttribute(null);
                    }}
                  >
                    <PlusCircle />
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {attribute?.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No attributes added yet. Add an attribute name, then add
                      options.
                    </p>
                  )}

                  {attribute?.map((attr) => (
                    <div key={attr.attribute_id} className="border p-3 rounded">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{attr.attributeName}</div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => removeAttribute(attr.attribute_id)}
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

                              addValues(attr.attribute_id, obj);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={`Add Values for ${attr.attributeName} `}
                              >
                                Select The Values
                              </SelectValue>
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

                        <div className="mt-3 flex flex-wrap gap-2">
                          {attr.valuesList?.map((opt) => (
                            <div
                              key={opt.attribute_value_id}
                              className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
                            >
                              <span className="text-sm">{opt.value}</span>
                              <button
                                onClick={() =>
                                  removeOption(
                                    attr.attribute_id,
                                    opt.attribute_value_id,
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

                  {attribute && attribute?.length > 0 && (
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
                    {variants?.length} variants
                  </div>
                </div>

                {variants?.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No variants generated. Add attributes and click "Generate
                    Variants".
                  </p>
                ) : (
                  <div className="overflow-x-auto max-w-full max-h-[400px] border rounded p-2 custom-scrollbar">
                    <table className="min-w-max w-full text-sm table-auto">
                      <thead>
                        <tr className="text-left bg-gray-200">
                          {attribute?.map((a) => (
                            <th key={a.attribute_id} className="px-2 py-3">
                              {a.attributeName}
                            </th>
                          ))}
                          <th className="px-2 py-3">Price</th>
                          <th className="px-2 py-3">SKU</th>
                          <th className="px-2 py-3">Tax Type</th>
                          <th className="px-2 py-3">Tax Value</th>
                          <th className="px-2 py-3">Discount</th>
                          <th className="px-2 py-3">Discount value</th>
                          <th className="px-2 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants?.map((v) => (
                          <tr key={v.id} className="border-t">
                            {attribute?.map((a) => (
                              <td
                                key={a.attribute_id}
                                className="px-2 py-3 align-middle"
                              >
                                <div className="bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                                  {
                                    v.attributeDetails?.find(
                                      (d) => d.attribute_id === a.attribute_id,
                                    )?.attributeValueName
                                  }
                                </div>
                              </td>
                            ))}

                            <td className="px-2 py-3 align-middle">
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
                                className="w-24"
                              />
                            </td>

                            {/* <td className="px-2 py-3 align-middle">
                                    <Input
                                      type="number"
                                      value={v.quantity}
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
                                  </td> */}

                            <td className="px-2 py-4 align-middle">
                              <Input
                                value={v.sku}
                                onChange={(e) =>
                                  updateVariantField(
                                    v.id,
                                    "sku",
                                    e.target.value,
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
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-2 py-4 align-middle">
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
                                className="w-24"
                                disabled={v.taxType === "none"}
                              />
                            </td>
                            <td className="px-2 py-4 align-middle">
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(val) =>
                                    updateVariantField(
                                      v.id,
                                      "discountType",
                                      val,
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue
                                      placeholder={v.discountType || "Type"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="percentage">
                                      Percentage
                                    </SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
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
                                className="w-24"
                                disabled={v.discountType === "none"}
                              />
                            </td>
                            {/* <td className="px-2 py-4 align-middle">
                                    <Input
                                      type="number"
                                      value={v.quantityAlert}
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
                                  </td> */}

                            <td className="px-3 py-4 align-middle">
                              <Button
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-500 border-red-400 hover:bg-red-100"
                                onClick={() => deleteVariants(v.id)}
                              >
                                <Trash />
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
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleCreateVariant}>Add Variant</Button>
            </DialogClose>
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
    </div>
  );
}
