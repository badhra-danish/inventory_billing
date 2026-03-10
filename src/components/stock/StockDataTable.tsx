import * as React from "react";
import Img from "../../assets/images/xls.png";
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
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  HelpCircle,
  Layers,
  Package,
  RefreshCw,
  Trash,
} from "lucide-react";
//import { useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import {
  deleteStock,
  getAllStockMovement,
  getAllStockPage,
  updateStockQuantity,
} from "@/api/Stock/Stockclinet";
import toast from "react-hot-toast";

interface StockVariant {
  stock_id: string;
  productName: string;
  skuCode: string;
  price: number;
  variant_label: string;
  quantity: string;
  status: "INSTOCK" | "STOCKOUT";
}
type stockDatatable = {
  refresh: boolean;
};
interface SelectedVariant {
  stock_id: string;
  skuCode: string;
  price: number;
  warehouseName: string;
  variant_label: string;
  productName: string;
  quantity: string;
}
interface stockMovement {
  stock_movement_id: string;
  type: string;
  reason: string;
  quantity: string;
  before_qty: string;
  after_qty: string;
  createdAt: string;
}
export default function StockMangeDatatable({ refresh }: stockDatatable) {
  // const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);

  const [stockhistoryPage, setStockhistoryPage] = React.useState(1);
  const [pageMetaData, setPageMetaData] = React.useState({
    totalPage: 0,
    currentPage: 0,
    totalItems: 0,
    pageSize: 0,
    hasnextPage: false,
    hasPrevPage: false,
  });
  const [stockHistorypageMetaData, setStockHistorypageMetaData] =
    React.useState({
      totalPage: 0,
      currentPage: 0,
      totalItems: 0,
      pageSize: 0,
      hasnextPage: false,
      hasPrevPage: false,
    });
  // DialogBox State Variable
  const [openStockIn, setOpenStockIn] = React.useState(false);
  const [openStockOut, setOpenStockOut] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [resion, setResion] = React.useState("");
  //hggk
  const [stockVariantData, setStockVariantData] = React.useState<
    StockVariant[]
  >([]);
  const [stockMovemetData, setStockMovementData] = React.useState<
    stockMovement[]
  >([]);

  const [selectedVariant, setSelectedVariant] = React.useState<SelectedVariant>(
    {
      stock_id: "",
      productName: "",
      price: 0,
      skuCode: "",
      warehouseName: "",
      variant_label: "",
      quantity: "",
    },
  );
  const [quantityUpdateType, setQuantityUpdateType] = React.useState("");
  const getAllStockData = async () => {
    try {
      const res = await getAllStockPage(page, 10);
      if (res.status == "OK") {
        setStockVariantData(res.data || []);
        setPageMetaData(res.pageMetaData);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };
  const getAllStockHistory = async () => {
    try {
      const res = await getAllStockMovement(
        stockhistoryPage,
        5,
        selectedVariant?.stock_id,
      );
      if (res.status == "OK") {
        setStockMovementData(res.data || []);
        setStockHistorypageMetaData(res.pageMetaData);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllStockData();
  }, [refresh, page]);

  React.useEffect(() => {
    if (openHistory && selectedVariant) {
      getAllStockHistory();
    }
  }, [openHistory, selectedVariant, stockhistoryPage]);

  const handleOpenHistory = async (product: StockVariant) => {
    setVariantValue(product);
    setOpenHistory(true);
  };
  const handleUpdateStockQuantity = async () => {
    const stock_id = selectedVariant.stock_id;

    if (!stock_id) {
      toast.error("Stock ID is missing");
      return;
    }

    const payload = {
      quantity: Number(selectedVariant.quantity),
      type: quantityUpdateType,
      reason: resion,
    };
    console.log(payload);

    const updatePromise = updateStockQuantity(stock_id, payload);

    toast.promise(updatePromise, {
      loading: "Updating stock quantity...",
      success: (res) => {
        if (res?.status === "OK") {
          getAllStockData();
          setOpenStockIn(false);
          setOpenStockOut(false);

          setSelectedVariant({
            stock_id: "",
            productName: "",
            price: 0,
            skuCode: "",
            warehouseName: "",
            variant_label: "",
            quantity: "",
          });

          return res?.message || "Stock updated successfully";
        }

        return "Stock updated";
      },
      error: (err) => {
        return (
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update stock"
        );
      },
    });
  };
  const handleDeleteStock = async () => {
    const stock_id = selectedVariant.stock_id;

    if (!stock_id) {
      toast.error("Stock ID is missing");
      return;
    }

    const deletePromise = deleteStock(stock_id);

    toast.promise(deletePromise, {
      loading: "Deleting stock...",
      success: (res) => {
        getAllStockData();
        setOpenStockIn(false);
        setOpenStockOut(false);
        setOpenDelete(false);
        setSelectedVariant({
          stock_id: "",
          productName: "",
          price: 0,
          warehouseName: "",
          skuCode: "",
          variant_label: "",
          quantity: "",
        });

        return res?.message || "Stock deleted successfully";
      },
      error: (err) => {
        return (
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete stock"
        );
      },
    });
  };

  const setVariantValue = (variant: StockVariant) => {
    setSelectedVariant((prev) => ({
      ...prev,
      stock_id: variant.stock_id,
      skuCode: variant.skuCode,
      price: variant.price,
      quantity: variant.quantity,
      variant_label: variant.variant_label,
      productName: variant.productName,
    }));
  };

  const getMovementConfig = (type: any) => {
    const normalizedType = type?.toLowerCase() || "";

    if (
      normalizedType.includes("in") ||
      normalizedType.includes("purchase") ||
      normalizedType.includes("return")
    ) {
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        sign: "+",
        icon: <ArrowUpRight className="w-3 h-3 mr-1" />,
        label: "Stock In",
      };
    }

    if (
      normalizedType.includes("out") ||
      normalizedType.includes("sale") ||
      normalizedType.includes("damage")
    ) {
      return {
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-100 dark:bg-rose-900/30",
        sign: "-",
        icon: <ArrowDownRight className="w-3 h-3 mr-1" />,
        label: "Stock Out",
      };
    }

    return {
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      sign: "",
      icon: <HelpCircle className="w-3 h-3 mr-1" />,
      label: type,
    };
  };
  const data: StockVariant[] = stockVariantData;
  const columns: ColumnDef<StockVariant>[] = [
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
            Product
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize font-bold flex gap-3">
            {row.getValue("productName")}
          </div>
        );
      },
    },

    {
      accessorKey: "variant_label",
      header: () => <div className="text-left">Code</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("variant_label")}
          </div>
        );
      },
    },
    {
      accessorKey: "skuCode",
      header: () => <div className="text-left">SkuCode</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">{row.getValue("skuCode")}</div>
        );
      },
    },
    {
      accessorKey: "warehouseName",
      header: () => <div className="text-left">Warehouse</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("warehouseName")}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-left"> Quantity</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">
            {row.getValue("quantity")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-left"> Price</div>,
      cell: ({ row }) => {
        return (
          <div className="capitalize text-left ">₹{row.getValue("price")}</div>
        );
      },
    },

    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        const status: string = row.getValue("status");

        const colorClass =
          status === "INSTOCK"
            ? "bg-green-400 text-white"
            : "bg-red-400 text-white";

        return (
          <div className="text-left">
            <span
              className={`capitalize px-1.5 py-1 rounded-sm text-xs font-normal ${colorClass}`}
            >
              {status}
            </span>
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
            {/* Dialog History veiw */}
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-200"
              onClick={() => handleOpenHistory(product)}
            >
              <Eye />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-green-100 text-green-600"
              onClick={() => {
                setOpenStockIn(true);
                setVariantValue(product);
                setQuantityUpdateType("add");
              }}
            >
              <Layers />
              Stock In
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-red-100 text-red-500 text-xs"
              onClick={() => {
                setOpenStockOut(true);
                setVariantValue(product);
                setQuantityUpdateType("remove");
              }}
            >
              <Layers />
              Stock Out
            </Button>
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
            {/* Dialog History veiw */}
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-200"
              onClick={() => {
                setOpenDelete(true);
                setVariantValue(product);
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

  return (
    <div className="w-full bg-white rounded-md shadow-md p-4 custom-scrollbar">
      {/* 🔍 Top Toolbar */}
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
                "Wood",
                "Plywood",
                "Laminates",
                "Veneers",
                "Hardware",
                "Handles & Locks",
                "Hinges & Channels",
                "Screws & Fasteners",
                "Glass",
                "Paints & Coatings",
                "Finishing",
                "Adhesives",
                "Plastic Boards",
                "MDF Boards",
                "Particle Boards",
                "Acrylic Sheets",
                "Cement Sheets",
                "Doors",
                "Flooring",
                "Ceiling Panels",
                "Edge Banding",
                "Tools & Accessories",
                "Electrical Fittings",
                "Kitchen Fittings",
                "Bathroom Fittings",
                "Construction Material",
                "Safety Equipment",
                "Decorative Panels",
                "Sealers & Polishes",
                "Others",
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
                Status: {selectedStatus}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="shadow-lg">
              {["All", "stock In", "out of stock"].map((status) => (
                <DropdownMenuItem
                  //key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    const statusColumn = table.getColumn("status");
                    if (statusColumn) {
                      statusColumn.setFilterValue(
                        status === "All" ? "" : status,
                      );
                    }
                  }}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/*  Data Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 custom-scrollbar">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.depth}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.index}
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.index}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 transition-colors capitalize"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.column.id}
                      className="px-4 py-3 text-sm text-gray-700 capitalize"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination + Footer Info */}
      <div className="flex items-center justify-between py-4 text-sm text-gray-600 dark:text-slate-400 transition-colors">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex items-center gap-3">
          <div className="font-bold font-">
            page {pageMetaData.currentPage} of {pageMetaData.totalPage}
          </div>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageMetaData.hasPrevPage == false}
          >
            Previous
          </Button>
          <Button
            size="sm"
            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() =>
              setPage((p) => Math.min(pageMetaData.totalPage, p + 1))
            }
            disabled={pageMetaData.hasnextPage == false}
          >
            Next
          </Button>
        </div>
      </div>

      {/* All Dialog Box of the Table */}
      <Dialog open={openHistory} onOpenChange={setOpenHistory}>
        <DialogContent className="sm:max-w-4xl">
          {/* Increased width slightly for better breathing room */}
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Package className="w-5 h-5 text-gray-500" />
              Stock History Log -{" "}
              <span className="text-blue-500 font-bold">
                {selectedVariant.variant_label}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Table Container */}
          <div className="max-h-[500px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm text-left">
              {/* Professional Neutral Header */}
              <thead className="sticky top-0 bg-blue-500 dark:bg-gray-900 text-white dark:text-gray-300 uppercase text-xs font-bold shadow-sm z-10">
                <tr>
                  <th className="px-5 py-3 border-b dark:border-gray-800">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b dark:border-gray-800">
                    Type
                  </th>
                  <th className="px-5 py-3 border-b dark:border-gray-800">
                    Reason
                  </th>
                  <th className="px-5 py-3 border-b dark:border-gray-800 text-right">
                    Before
                  </th>
                  <th className="px-5 py-3 border-b dark:border-gray-800 text-center">
                    Change
                  </th>
                  <th className="px-5 py-3 border-b dark:border-gray-800 text-right">
                    After
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-black">
                {/* TIP: Replace stockMovemetData with your paginated array, e.g., stockMovemetData.slice(startIndex, endIndex) */}
                {stockMovemetData?.length > 0 ? (
                  stockMovemetData.map((data) => {
                    const config = getMovementConfig(data.type);

                    return (
                      <tr
                        key={data.stock_movement_id}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                      >
                        {/* Date Column */}
                        <td className="px-5 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(data.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </td>

                        {/* Badge Type Column */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${config.bgColor} ${config.color}`}
                          >
                            {config.icon}
                            {config.label || data.type}
                          </span>
                        </td>

                        {/* Reason Column */}
                        <td
                          className="px-5 py-3 text-gray-600 dark:text-gray-400 max-w-[200px] truncate"
                          title={data.reason}
                        >
                          {data.reason || "-"}
                        </td>

                        {/* Before Qty */}
                        <td className="px-5 py-3 text-right font-mono text-gray-500 dark:text-gray-500 tabular-nums">
                          {data.before_qty}
                        </td>

                        {/* CHANGE QTY (Highlighted) */}
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`inline-block min-w-[3rem] px-2 py-1 rounded-md text-xs font-bold tabular-nums ${config.bgColor} ${config.color}`}
                          >
                            {config.sign}
                            {data.quantity}
                          </span>
                        </td>

                        {/* After Qty */}
                        <td className="px-5 py-3 text-right font-mono font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                          {data.after_qty}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500 flex-col items-center justify-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 opacity-20" />
                        <p>No stock movement history found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =========================================
              PAGINATION & FOOTER SECTION
              ========================================= */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                Page {stockHistorypageMetaData.currentPage} of{" "}
                {stockHistorypageMetaData.totalPage}{" "}
                {/* Replace with your dynamic state: Page {currentPage} of {totalPages} */}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-100 hover:text-black dark:border-gray-800 dark:hover:bg-gray-900"
                  onClick={() => setStockhistoryPage((p) => p - 1)}
                  disabled={stockHistorypageMetaData.hasPrevPage === false}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-100 hover:text-black dark:border-gray-800 dark:hover:bg-gray-900"
                  onClick={() => setStockhistoryPage((p) => p + 1)}
                  disabled={stockHistorypageMetaData.hasnextPage === false}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <DialogClose asChild>
              <Button variant="default" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for StockIn */}
      <Dialog open={openStockIn} onOpenChange={setOpenStockIn}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Add Quantity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  SkuCode <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant?.skuCode}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Variant_label <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant?.variant_label}
                />
              </div>
            </div>
            <div className="flex gap-2 ">
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
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  ProductName <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant.productName}
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
                //  value={selectedVariant?.quantity}
                onChange={(e) =>
                  setSelectedVariant((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-4">
              <Label>
                {" "}
                Resion <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setResion(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="RETURN">RETURN</SelectItem>
                  <SelectItem value="INITIAL">INITIAL</SelectItem>
                  <SelectItem value="DAMAGE">DAMAGE</SelectItem>
                  <SelectItem value="PURCHASE">PURCHASE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* *** */}
          </div>

          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateStockQuantity}>Add Quantity</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for Out of Stock */}
      <Dialog open={openStockOut} onOpenChange={setOpenStockOut}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Remove Quantity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  SkuCode <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant?.skuCode}
                />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Variant_label <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant?.variant_label}
                />
              </div>
            </div>
            <div className="flex gap-2 ">
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
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  ProductName <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="sub-category"
                  readOnly
                  disabled
                  value={selectedVariant?.productName}
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
                //    value={selectedVariant?.quantity}
                onChange={(e) =>
                  setSelectedVariant((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>{" "}
            <div className="grid gap-4">
              <Label>
                {" "}
                Resion <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setResion(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Resion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="RETURN">RETURN</SelectItem>
                  <SelectItem value="INITIAL">INITIAL</SelectItem>
                  <SelectItem value="DAMAGE">DAMAGE</SelectItem>
                  <SelectItem value="PURCHASE">PURCHASE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* *** */}
          </div>

          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateStockQuantity}>
                Remove Quantity
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogbox of the delete Update  */}
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 pt-5 mt-3 border-t-1 pb-3">
            <div className="grid gap-4">
              <Label>
                {" "}
                Product <span className="text-red-500">*</span>
              </Label>
              <Select
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
              </Select>
            </div>

            {/* Product details codec,quantiy */}
            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Code <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>

            <div className="flex gap-2 ">
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Selling Price <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
              <div className="w-full grid gap-3">
                <Label>
                  {" "}
                  Purchase Price <span className="text-red-500">*</span>
                </Label>
                <Input type="text" name="sub-category" readOnly disabled />
              </div>
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input type="text" name="sub-category" />
            </div>
            {/* *** */}
            <div className="grid gap-4">
              <Label>
                {" "}
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => console.log("Selected:", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">InStock</SelectItem>
                  <SelectItem value="hardware">StockOut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t-1 pt-5">
            <DialogFooter>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button>Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="flex flex-col items-center text-center">
          <DialogHeader className="flex flex-col items-center ">
            <div className="w-14 h-14 border-2 rounded-full flex items-center justify-center">
              <img src={trashImg} className="w-20  rounded-full" />
            </div>

            <DialogTitle className="text-lg font-semibold">
              Delete Stock Variant
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Are you sure you want to delete this Stock Variant?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-1 flex justify-center space-x-1">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteStock}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
