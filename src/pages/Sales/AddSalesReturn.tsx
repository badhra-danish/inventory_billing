import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Ban,
  Box,
  Check,
  FileText,
  Loader2,
  Minus,
  Package,
  PackageX,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { getAllCustomer } from "@/api/Coustomer/CustomerClient";
import { getAllVariantInstock } from "@/api/Stock/Stockclinet";
import Loader from "@/components/commen/loader";
import {
  createSales,
  getAllInvoiceInfo,
  getAllInvoiceNo,
  getSaleById,
} from "@/api/Sales/SalesClient";
import toast from "react-hot-toast";
import { getAllWarehouse } from "@/api/WareHouse/WareHouse";
import WarehouseSearch from "@/components/utils/WarehouseSerche";
import { createSaleReturn } from "@/api/SalesReturn/SaleReturnClient";
export type SalesItemDetail = {
  sales_item_id: string;
  product_variant_id: string;
  warehouse_id: string;
  quantity: number;
  discount: number;
  tax: number;
  tax_amount: number;
  total: number;

  variant: {
    skuCode: string | null;
    variant_label: string | null;
    price: number | null;
    productName: string | null;
  };
};
export type CustomerDetail = {
  customer_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  location: Location;
  status: "ACTIVE" | "INACTIVE";
};
export type Location = {
  city: string;
  state: string;
  postalCode: string;
};

export type SalesDetail = {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
  order_tax: number;
  shipping: number;
  discount: number;
  status: "INPROGRESS" | "COMPLETED" | "CANCELLED";

  grand_total: number;
  paid_amount: number;
  due_amount: number;

  payment_status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "OVERDUE";

  customer: CustomerDetail | null;

  sales_items: SalesItemDetail[];
};
type InfovoiceInfo = {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
};
type ProductRow = {
  sale_item_id: string;
  variant_id: string;
  warehouse_id: string;
  return_qty: number;
  skuCode: string;
  ProductName: string;
  variant_label: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  tax_amount: number;
  total: number;
};

type customer = {
  customer_id: string;
  firstName: string;
  lastName: string;
};
type Product = {
  product_variant_id: string;
  skuCode: string;
  price: number;
  variant_label: string;
  warehouse_id: string;
  quantity: number;
  productName: string;
};
type warehouse = {
  warehouse_id: string;
  warehouseName: string;
};
export default function AddSales() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [variant, setVariant] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [customer, setCustomer] = React.useState<customer[]>([]);
  const [warehouse, setWareHouse] = React.useState<warehouse[]>([]);
  const [selectedVariant, setSelectedVariant] = React.useState({
    product_variant_id: "",
    skuCode: "",
    price: 0,
    variant_label: "",
    productName: "",
  });

  const [formData, setFormData] = React.useState({
    srn_no: "",
    sale_id: "",
    sale_return_date: "",
    order_tax: 0,
    shipping: 0,
    discount: 0,
    status: "PENDING",
    payment_status: "",
  });
  const [salesDetail, setSalesDetial] = React.useState<SalesDetail>();
  const [Invoiceinfo, setInvoiceInfo] = React.useState<InfovoiceInfo[]>([]);
  const getAllInvoiceinfo = async () => {
    try {
      const res = await getAllInvoiceNo();
      if (res.status == "OK") {
        setInvoiceInfo(res.data || []);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  console.log(Invoiceinfo);

  const getSales = async () => {
    try {
      const sale_id = formData.sale_id;
      if (!sale_id) return;
      const res = await getSaleById(sale_id);
      if (res.status == "OK") {
        setSalesDetial(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getSales();
  }, [formData.sale_id]);

  useEffect(() => {
    if (!salesDetail?.sales_items?.length) return;

    const formattedRows: ProductRow[] = salesDetail.sales_items.map((item) => ({
      sale_item_id: item.sales_item_id,
      variant_id: item.product_variant_id,
      return_qty: 0,
      skuCode: item.variant?.skuCode ?? "",
      ProductName: item.variant?.productName ?? "",
      variant_label: item.variant?.variant_label ?? "",
      warehouse_id: item.warehouse_id,
      quantity: item.quantity,
      price: item.variant.price ?? 0,

      discount: Number(item.discount) ?? 0,
      tax: item.tax ?? 0,
      tax_amount: item.tax_amount ?? 0,
      total: item.total ?? 0,
    }));
    setFormData((prev) => ({
      ...prev,
      order_tax: Number(salesDetail.order_tax),
      shipping: Number(salesDetail.shipping),
      discount: Number(salesDetail.discount),
      status: salesDetail.status,
    }));
    setRows(formattedRows);
  }, [salesDetail]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getallWareHouse = async () => {
    try {
      const res = await getAllWarehouse();
      if (res.status === "OK") {
        setWareHouse(res.data || []);
      }
    } catch (error) {
      console.error;
    }
  };
  React.useEffect(() => {
    getallWareHouse();
    getAllInvoiceinfo();
  }, []);
  const handleCancel = () => {
    navigate("/sales");
  };

  // // Add row to table
  const addProductToTable = (variant: Product) => {
    setRows((prev) => {
      const exists = prev.find(
        (row) => row.variant_id === variant.product_variant_id,
      );

      if (exists) {
        // Increase quantity instead of duplicate row
        return prev.map((row) =>
          row.variant_id === variant.product_variant_id
            ? {
                ...row,
                quantity: row.quantity + 1,
                total:
                  (row.quantity + 1) * row.price -
                  row.discount +
                  ((row.quantity + 1) * row.price * row.tax) / 100,
                tax_amount: ((row.quantity + 1) * row.price * row.tax) / 100,
              }
            : row,
        );
      }

      // If not exists → add new row
      return [
        ...prev,
        {
          sale_item_id: "",
          variant_id: variant.product_variant_id,
          skuCode: variant.skuCode,
          ProductName: variant.productName,
          warehouse_id: variant.warehouse_id,
          return_qty: 0,
          variant_label: variant.variant_label,
          quantity: 1,
          price: variant.price,
          discount: 0,
          tax: 0,
          tax_amount: 0,
          total: variant.price,
        },
      ];
    });

    setQuery("");
  };

  const updateRow = (
    id: string,
    field: keyof ProductRow,
    value: number | string | null,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.variant_id !== id) return row;

        const updatedRow = {
          ...row,
          [field]: value,
        };

        const subtotal = updatedRow.price * updatedRow.return_qty;
        const taxAmount = (subtotal * updatedRow.tax) / 100;

        return {
          ...updatedRow,
          tax_amount: taxAmount,
          total: subtotal - updatedRow.discount + taxAmount,
        };
      }),
    );
  };

  const removeRows = (id: string) => {
    setRows((prev) => prev.filter((row) => row.variant_id !== id));
  };
  React.useEffect(() => {
    if (!query.trim()) {
      setVariant([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getAllVariantInstock(query);
        if (res.status === "OK") {
          setVariant(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const getallCustomer = async () => {
    try {
      const res = await getAllCustomer();
      if (res.status === "OK") {
        setCustomer(res.data || []);
      }
    } catch (error) {
      console.error;
    }
  };
  React.useEffect(() => {
    getallCustomer();
  }, []);
  console.log(rows);

  const orderSummary = rows.reduce(
    (acc, row) => {
      acc.subtotal += row.price * row.return_qty;
      acc.tax += row.tax_amount;
      acc.discount += row.discount;
      acc.total += row.total;
      return acc;
    },
    { subtotal: 0, tax: 0, discount: 0, total: 0 },
  );
  const orderTax = (orderSummary.total * Number(formData.order_tax)) / 100;
  const grand_total =
    orderSummary.total +
    orderTax +
    Number(formData.shipping) -
    Number(formData.discount);

  const handleCreateSale = () => {
    if (!rows.length) {
      toast.error("Add at least one product!");
      return;
    }

    if (!formData.sale_id) {
      toast.error("Select a Invoice!");
      return;
    }

    const payload = {
      ...formData,
      order_tax: Number(formData.order_tax || 0),
      shipping: Number(formData.shipping || 0),
      discount: Number(formData.discount || 0),
      salesReturnItems: rows.map((row) => ({
        sale_item_id: row.sale_item_id,
        product_variant_id: row.variant_id,
        price: row.price,
        warehouse_id: row.warehouse_id,
        return_qty: row.return_qty,
        quantity: row.quantity,
        tax: row.tax,
        discount: row.discount,
        total_amt: row.total,
      })),
    };
    console.log(payload);

    const saleReturnPromise = createSaleReturn(payload);

    toast.promise(saleReturnPromise, {
      loading: "Creating Sale ..",
      success: (res) => {
        setRows([]);
        setQuery("");
        setFormData({
          sale_id: "",
          srn_no: "",
          sale_return_date: "",
          order_tax: 0,
          shipping: 0,
          discount: 0,
          status: "",
          payment_status: "",
        });
        navigate("/shop/sales-return");
        return res.message || "SaleReturn created successfully!";
      },
      error: (err) => {
        return (
          err.response?.data?.message ||
          err.message ||
          "Failed to create saleReturn!"
        );
      },
    });
  };

  return (
    <>
      {" "}
      <div className="max-w-7xl mx-auto pb-10">
        {/* =========================================
          PAGE HEADER
          ========================================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Add Sales Return
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add a Sales Return and manage Sales details.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="hidden sm:flex"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" /> Save Order
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* =========================================
            LEFT COLUMN: Main Form Elements (Takes up 2/3 width on large screens)
            ========================================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- SECTION 1: ORDER DETAILS --- */}
            <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-5 text-gray-900 dark:text-gray-100">
                <FileText className="w-5 h-5 text-primary" /> Order Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    SRN Code.
                  </Label>
                  <Input
                    type="text"
                    value={formData.srn_no}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        srn_no: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Sale Return Date
                  </Label>
                  <Input
                    type="date"
                    className="bg-gray-50 dark:bg-gray-900"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_return_date: e.target.value,
                      })
                    }
                    value={formData.sale_return_date}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    value={formData.status}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="RECEIVED">Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid  gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Select Invoice
                  </Label>
                  <Select
                    value={formData.sale_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, sale_id: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Invoice For Sales Detail" />
                    </SelectTrigger>
                    <SelectContent>
                      {Invoiceinfo?.map((inv) => (
                        <SelectItem
                          key={inv.sale_id}
                          value={String(inv.sale_id)}
                        >
                          {inv.invoice_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>{" "}
                </div>{" "}
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Payment Status
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_status: value })
                    }
                    value={formData.payment_status}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value=" ">Parrialy_paid</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: PRODUCT SELECTION & TABLE --- */}
            <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-5 text-gray-900 dark:text-gray-100">
                <ShoppingCart className="w-5 h-5 text-primary" /> Products
              </h2>

              {/* Product Search Bar */}
              <div className="grid gap-4 relative mb-5">
                <Label>Product Search</Label>
                <Input
                  type="text"
                  placeholder="Search Product By Code or Name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900"
                />
                {query && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 w-full transform transition-all duration-200 ease-in-out">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden ring-1 ring-black/5">
                      {/* Header */}
                      {!loading && variant.length > 0 && (
                        <div className="bg-neutral-50/90 dark:bg-neutral-800/90 backdrop-blur-md px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center sticky top-0 z-10">
                          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                            Inventory Search
                          </p>
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            {variant.length} RESULTS
                          </span>
                        </div>
                      )}

                      {/* List Container */}
                      <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                            <p className="text-sm font-medium">
                              Searching catalog...
                            </p>
                          </div>
                        ) : variant.length > 0 ? (
                          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {variant.map((item) => {
                              const isSelected =
                                selectedVariant?.product_variant_id ===
                                item.product_variant_id;

                              // --- STOCK LOGIC ---
                              const stockCount = item.quantity || 0;
                              const isOutOfStock = stockCount === 0;
                              const isLowStock =
                                stockCount > 0 && stockCount < 10;
                              // -------------------

                              return (
                                <li
                                  key={item.product_variant_id}
                                  onClick={() =>
                                    !isOutOfStock && addProductToTable(item)
                                  }
                                  className={`
                      group relative p-3.5 transition-all duration-200
                      ${
                        isOutOfStock
                          ? "opacity-60 bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed grayscale-[0.8]"
                          : "cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                      }
                      ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                    `}
                                >
                                  {/* Active Left Border Indicator */}
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200 ${isSelected ? "bg-blue-600" : "bg-transparent group-hover:bg-blue-300"}`}
                                  />

                                  <div className="flex items-start justify-between gap-3 pl-2">
                                    {/* --- LEFT SIDE: Info --- */}
                                    <div className="flex-1 min-w-0">
                                      {/* Row 1: Name & Variant Badge */}
                                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                        <h4
                                          className={`text-sm font-bold leading-tight ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-neutral-900 dark:text-neutral-100"}`}
                                        >
                                          {item.productName}
                                        </h4>

                                        {/* Interactive Variant Badge */}
                                        <span
                                          className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                            ${
                              isSelected
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                            }
                          `}
                                        >
                                          <Tag className="w-3 h-3 mr-1 opacity-70" />
                                          {item.variant_label}
                                        </span>
                                      </div>

                                      {/* Row 2: SKU & Stock Status */}
                                      <div className="flex items-center gap-3">
                                        {/* SKU Chip */}
                                        <span className="text-[10px] font-mono text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded shadow-sm">
                                          SKU: {item.skuCode}
                                        </span>

                                        {/* Stock Indicator Dot */}
                                        {!isOutOfStock && (
                                          <div className="flex items-center gap-1.5">
                                            <span
                                              className={`block w-1.5 h-1.5 rounded-full ${isLowStock ? "bg-orange-500 animate-pulse" : "bg-green-500"}`}
                                            />
                                            <span
                                              className={`text-xs font-medium ${isLowStock ? "text-orange-600" : "text-green-600"}`}
                                            >
                                              {stockCount} in stock
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* --- RIGHT SIDE: Price & Action --- */}
                                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                      {/* Price */}
                                      <span className="text-base font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">
                                        ₹{item.price.toLocaleString()}
                                      </span>

                                      {/* Interactive Action State */}
                                      <div className="h-7 flex items-center justify-end">
                                        {isOutOfStock ? (
                                          <span className="flex items-center text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900">
                                            <Ban className="w-3 h-3 mr-1" /> No
                                            Stock
                                          </span>
                                        ) : isSelected ? (
                                          <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-right-2">
                                            <Check className="w-3.5 h-3.5 mr-1" />{" "}
                                            Added
                                          </span>
                                        ) : (
                                          <button
                                            className="
                                    flex items-center text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 
                                    px-3 py-1 rounded shadow-sm 
                                    opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 
                                    transition-all duration-200 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white
                                "
                                          >
                                            <Plus className="w-3.5 h-3.5 mr-1" />{" "}
                                            Add
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          // Empty State
                          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-full mb-3 ring-8 ring-neutral-50 dark:ring-neutral-800">
                              <PackageX className="h-8 w-8 text-neutral-400" />
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                              No products found
                            </p>
                            <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                              We couldn't find inventory matching "{query}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Hint */}
                      {!loading && variant.length > 0 && (
                        <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-center gap-4 text-[10px] text-neutral-400">
                          <span className="flex items-center">
                            <kbd className="font-sans bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-1.5 py-0.5 mr-1 shadow-sm">
                              ↓
                            </kbd>
                            Navigate
                          </span>
                          <span className="flex items-center">
                            <kbd className="font-sans bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-1.5 py-0.5 mr-1 shadow-sm">
                              ↵
                            </kbd>
                            Select
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Table - PROFESSIONALLY ADJUSTED */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-blue-500 dark:bg-gray-900/80 text-white dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                    <tr>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 w-[150px]">
                        Product
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 w-[140px]">
                        Warehouse
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-center w-[120px]">
                        Qty
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-center w-[120px]">
                        Return Qty
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-right w-[100px]">
                        Price
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-right w-[80px]">
                        Disc.
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-right w-[80px]">
                        Tax %
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-right w-[100px]">
                        Total
                      </th>
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-8 text-center text-gray-500 dark:text-gray-400 italic bg-gray-50/30 dark:bg-gray-900/20"
                        >
                          No products added yet. Search above to add items.
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr
                          key={row.variant_id}
                          className="hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <td className="px-2 py-2 font-medium truncate max-w-[150px] w-[150px]">
                            {row.ProductName}
                            <span className="block text-[11px] text-gray-500 font-normal mt-0.5 truncate">
                              {row.variant_label}
                            </span>
                          </td>
                          <td className="px-2 py-2 w-[140px]">
                            <div className="w-full">
                              <WarehouseSearch
                                warehouses={warehouse}
                                row={row}
                                updateRow={updateRow}
                              />
                            </div>
                          </td>
                          <td className="px-2 py-2 w-[120px]">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                                <button
                                  disabled
                                  onClick={() =>
                                    updateRow(
                                      row.variant_id,
                                      "quantity",
                                      Math.max(1, row.quantity - 1),
                                    )
                                  }
                                  className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>

                                <input
                                  type="number"
                                  min={1}
                                  readOnly
                                  className="w-10 text-center text-sm font-medium border-none focus:ring-0 p-0 bg-transparent [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    updateRow(
                                      row.variant_id,
                                      "quantity",
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                />

                                <button
                                  disabled
                                  onClick={() =>
                                    updateRow(
                                      row.variant_id,
                                      "quantity",
                                      row.quantity + 1,
                                    )
                                  }
                                  className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </td>{" "}
                          <td className="px-2 py-2 w-[100px]">
                            <Input
                              type="number"
                              value={row.return_qty}
                              onChange={(e) =>
                                updateRow(
                                  row.variant_id,
                                  "return_qty",
                                  Number(e.target.value),
                                )
                              }
                              className="h-8 w-full text-right px-2 py-1 text-sm bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-gray-900/50 dark:border-transparent dark:hover:border-gray-700 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-2 w-[100px]">
                            <Input
                              type="number"
                              value={row.price}
                              readOnly
                              onChange={(e) =>
                                updateRow(
                                  row.variant_id,
                                  "price",
                                  Number(e.target.value),
                                )
                              }
                              className="h-8 w-full text-right px-2 py-1 text-sm bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-gray-900/50 dark:border-transparent dark:hover:border-gray-700 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-2 w-[80px]">
                            <Input
                              type="number"
                              value={row.discount}
                              readOnly
                              onChange={(e) =>
                                updateRow(
                                  row.variant_id,
                                  "discount",
                                  Number(e.target.value),
                                )
                              }
                              className="h-8 w-full text-right px-2 py-1 text-sm bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-gray-900/50 dark:border-transparent dark:hover:border-gray-700 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-2 w-[80px]">
                            <Input
                              type="number"
                              value={row.tax}
                              readOnly
                              onChange={(e) =>
                                updateRow(
                                  row.variant_id,
                                  "tax",
                                  Number(e.target.value),
                                )
                              }
                              className="h-8 w-full text-right px-2 py-1 text-sm bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-gray-900/50 dark:border-transparent dark:hover:border-gray-700 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary shadow-none transition-all"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-gray-100 tabular-nums w-[100px]">
                            ₹{row.total.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center w-12">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRows(row.variant_id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* =========================================
            RIGHT COLUMN: Sidebar (Summary & Extra Fees)
            ========================================= */}
          <div className=" gap-6 grid lg:grid-cols-1 col-span-2">
            {/* --- SECTION 3: ADDITIONAL CHARGES --- */}
            {/* <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm p-6 w-full">
              <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-gray-100">
                Order Adjustments
              </h2>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Order Tax (₹)
                  </Label>
                  <Input
                    type="number"
                    name="order_tax"
                    value={formData.order_tax || 0}
                    onChange={handleInputChange}
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Overall Discount (₹)
                  </Label>
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount || 0}
                    onChange={handleInputChange}
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Shipping Charges (₹)
                  </Label>
                  <Input
                    type="number"
                    name="shipping"
                    value={formData.shipping || 0}
                    onChange={handleInputChange}
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              </div>
            </div> */}

            {/* --- SECTION 4: FINAL SUMMARY --- */}
            <div className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm p-6 w-[50%]">
              <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ₹{orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Order Tax:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    + ₹{orderTax || 0}
                  </span>
                </div>{" "}
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>- ₹{formData.discount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    + ₹{formData.shipping || 0}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    ₹{grand_total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCreateSale}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
