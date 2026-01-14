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
import { ArrowUpDown, ChevronDown, Edit, Eye, Trash } from "lucide-react";
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
  getAllProductPage,
  getAllVariantByProduct,
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
// const data: Product[] = [
//   {
//     id: "P001",
//     name: "Plywood Sheet 12mm",
//     category: "Wood & Boards",
//     brand: "GreenPly",
//     unit: "pc",
//     qty: 300,
//     price: 1200,
//     status: "In Stock",
//   },
//   {
//     id: "P002",
//     name: "Laminated Sheet 18mm",
//     category: "Wood & Boards",
//     brand: "Century",
//     unit: "pc",
//     qty: 300,
//     price: 1800,

//     status: "Low Stock",
//   },
//   {
//     id: "P003",
//     name: "Hinges 3-inch",
//     category: "Hardware",
//     brand: "Godrej",
//     unit: "pc",
//     qty: 300,
//     price: 50,

//     status: "Out of Stock",
//   },
//   {
//     id: "P004",
//     name: "Wood Glue 1L",
//     category: "Adhesives",
//     brand: "Fevicol",
//     unit: "pc",
//     qty: 300,
//     price: 250,

//     status: "In Stock",
//   },
//   {
//     id: "P005",
//     name: "Drawer Slide Set",
//     category: "Hardware",
//     brand: "Hettich",
//     unit: "pc",
//     qty: 300,
//     price: 300,

//     status: "In Stock",
//   },
//   {
//     id: "P006",
//     name: "Veneer Sheet 4x8ft",
//     category: "Finishing",
//     brand: "Kitply",
//     unit: "pc",
//     qty: 300,
//     price: 950,

//     status: "Low Stock",
//   },
//   {
//     id: "P007",
//     name: "Screw Pack (100pcs)",
//     category: "Fasteners",
//     brand: "Taparia",
//     unit: "pc",
//     qty: 300,
//     price: 120,

//     status: "Out of Stock",
//   },
//   {
//     id: "P008",
//     name: "Edge Band Roll",
//     category: "Finishing",
//     brand: "Rehau",
//     unit: "pc",
//     qty: 300,
//     price: 200,

//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
//   {
//     id: "P009",
//     name: "PVC Sheet 6mm",
//     category: "Plastic Boards",
//     brand: "Alstone",
//     unit: "pc",
//     qty: 300,
//     price: 1100,

//     status: "Low Stock",
//   },
//   {
//     id: "P010",
//     name: "Fevicol SR 505 (5L)",
//     category: "Adhesives",
//     brand: "Pidilite",
//     unit: "pc",
//     qty: 300,
//     price: 750,
//     status: "In Stock",
//   },
// ];

export type Product = {
  product_id: string;
  productName: string;
  product_type: string;
  manufacturer_date: null;
  expiry_date: Date;
  unitName: string;
  subCategoryName: string;
  variant_count: number;
  categoryName: string;
  brandName: string;
};
export type VariantAttribute = {
  attributeName: string;
  attributeValue: string;
};
export type Variant = {
  product_variant_id: string;
  skuCode: string;
  price: number;
  tax_type: string;
  tax_value: number;
  discount_type: string;
  discount_value: number;
  attributes: VariantAttribute[];
};
export default function Products() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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
    Record<string, Variant[]>
  >({});
  const [loadingVariants, setLoadingVariants] = React.useState<
    Record<string, boolean>
  >({});
  const [pageMeteData, setPageMetaData] = React.useState({
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const [openVariant, setOpenVariant] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState({
    variant_id: "",
    skuCode: "",
    price: 0,
    tax_type: "",
    tax_value: 0,
    discount_type: "",
    discount_value: 0,
  });
  const getSelectedVariant = (
    id: string,
    code: string,
    price: number,
    tx_t: string,
    tx_v: number,
    dis_t: string,
    dis_v: number
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
    }));
  };
  console.log(selectedVariant);

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
      header: () => <div className="text-left">Category</div>,
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
      header: () => <div className="text-left">SubCategory</div>,
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
      header: () => <div className="text-left">Brand</div>,
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
      header: () => <div className="text-left">Units</div>,
      cell: ({ row }) => {
        return (
          <div className="lowercase text-left">{row.getValue("unitName")}</div>
        );
      },
    },
    {
      accessorKey: "warrantyName",
      header: () => <div className="text-left">Warranty</div>,
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
      header: () => <div className="text-left">Product-Type</div>,
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
      header: () => <div className="text-left">Variants</div>,
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
      header: () => <div className="text-left">Manufacturer-Date</div>,
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
            <Button variant="outline" size="sm">
              <Edit />
            </Button>
            {/* <Button variant="outline" size="sm">
              <Trash />
            </Button> */}
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="sm">
                  <Trash />
                </Button>
              </DialogTrigger>

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
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

            <DropdownMenuContent align="end" className="shadow-lg">
              <DropdownMenuLabel className="font-semibold text-gray-700">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                "All",
                "Wood & Boards",
                "Hardware",
                "Finishing",
                "Plastic Boards",
                "Adhesives",
              ].map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const categoryColumn = table.getColumn("category");
                    if (categoryColumn) {
                      categoryColumn.setFilterValue(cat === "All" ? "" : cat);
                    }
                  }}
                >
                  {cat}
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

              {[
                "All",
                "GreenPly",
                "Century",
                "Taparia",
                "Alstone",
                "Pidilite",
              ].map((brand) => (
                <DropdownMenuItem
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const brandColumn = table.getColumn("brand");
                    if (brandColumn) {
                      brandColumn.setFilterValue(brand === "All" ? "" : brand);
                    }
                  }}
                >
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/*  Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-100">
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* <TableBody>
            {isLoading ? (
              <>
                {" "}
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Loader />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <>
                {" "}
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
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
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
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
              </>
            )}
          </TableBody> */}
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
                const isExpanded = expandedRows[product.product_id]; // <-- state to track expanded rows
                const attributeHeaders = Array.from(
                  new Set(
                    variantsMap[product.product_id]?.flatMap((variant) =>
                      variant.attributes?.map((attr) => attr.attributeName)
                    ) || []
                  )
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
                            cell.getContext()
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
                                      gridTemplateColumns: `repeat(${
                                        5 + attributeHeaders.length
                                      }, 160px)`,
                                    }}
                                  >
                                    {attributeHeaders.map((attr) => (
                                      <span key={attr}>{attr}</span>
                                    ))}
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
                                          gridTemplateColumns: `repeat(${
                                            5 + attributeHeaders.length
                                          }, 160px)`,
                                        }}
                                      >
                                        {/* Dynamic attributes */}
                                        {attributeHeaders.map((attrName) => {
                                          const attr = variant.attributes?.find(
                                            (a) => a.attributeName === attrName
                                          );
                                          return (
                                            <span key={attrName}>
                                              {attr ? attr.attributeValue : "-"}
                                            </span>
                                          );
                                        })}

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
                                                variant.discount_value
                                              )
                                            )}
                                          >
                                            <Edit />
                                          </Button>
                                          <Button
                                            variant={"outline"}
                                            size="sm"
                                            className="hover:bg-red-400 hover:text-white"
                                          >
                                            <Trash />
                                          </Button>
                                        </span>
                                      </div>
                                    )
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
            disabled={page == 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageMeteData.totalPages, p + 1))
            }
            disabled={page >= pageMeteData?.totalPages}
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
            <Button>Update Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
