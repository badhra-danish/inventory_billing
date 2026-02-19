import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Ban,
  Box,
  Check,
  Cog,
  Loader2,
  Minus,
  Package,
  PackageX,
  Plus,
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
import { useNavigate, useParams } from "react-router-dom";
import { getAllCustomer } from "@/api/Coustomer/CustomerClient";
import { getAllVariantInstock } from "@/api/Stock/Stockclinet";
import Loader from "@/components/commen/loader";
import { createSales, getSaleById, updateSale } from "@/api/Sales/SalesClient";
import toast from "react-hot-toast";
// type Product = {
//   code: string;
//   name: string;
//   price: number;
// };
import type { SalesDetail } from "./SalesDetail";
import type { SalesItemDetail } from "./SalesDetail";
import type { CustomerDetail } from "./SalesDetail";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
type ProductRow = {
  sales_item_id?: string;
  varint_id: string;
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
  quantity: number;
  productName: string;
};
type SaleStatus = "INPROGRESS" | "COMPLETED" | "CANCELLED";

interface SaleFormData {
  customer_id: string;
  date: string;
  order_tax: number;
  shipping: number;
  discount: number;
  status: SaleStatus;
}

export default function EditSales() {
  const navigate = useNavigate();
  const { sale_id } = useParams();

  const [query, setQuery] = useState("");
  const [variant, setVariant] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  //const [filtered, setFiltered] = useState<Product[]>([]);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [customer, setCustomer] = React.useState<customer[]>([]);

  const [selectedVariant, setSelectedVariant] = React.useState({
    product_variant_id: "",
    skuCode: "",
    price: 0,
    variant_label: "",
    productName: "",
  });
  const [formData, setFormData] = useState<SaleFormData>({
    customer_id: "",
    date: "",
    order_tax: 0,
    shipping: 0,
    discount: 0,
    status: "INPROGRESS",
  });

  const [sales, setSales] = React.useState<SalesDetail>();

  const getSales = async () => {
    try {
      if (!sale_id) return;
      const res = await getSaleById(sale_id);
      if (res.status == "OK") {
        setSales(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getSales();
  }, []);
  console.log(sales);

  useEffect(() => {
    if (!sales?.sales_items?.length) return;

    const formattedRows: ProductRow[] = sales.sales_items.map((item) => ({
      sales_item_id: item.sales_item_id,
      varint_id: item.product_variant_id,

      skuCode: item.variant?.skuCode ?? "",
      ProductName: item.variant?.productName ?? "",
      variant_label: item.variant?.variant_label ?? "",

      quantity: item.quantity,
      price: item.variant.price ?? 0,

      discount: Number(item.discount) ?? 0,
      tax: item.tax ?? 0,
      tax_amount: item.tax_amount ?? 0,
      total: item.total ?? 0,
    }));
    setFormData((prev) => ({
      ...prev,
      customer_id: sales.customer?.customer_id ?? "",
      date: sales.sale_date,
      order_tax: Number(sales.order_tax),
      shipping: Number(sales.shipping),
      discount: Number(sales.discount),
      status: sales.status as SaleStatus,
    }));
    setRows(formattedRows);
  }, [sales]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/sales");
  };
  console.log(rows);

  // // Add row to table
  const addProductToTable = (variant: Product) => {
    setRows((prev) => {
      const exists = prev.find(
        (row) => row.varint_id === variant.product_variant_id,
      );

      if (exists) {
        // Increase quantity instead of duplicate row
        return prev.map((row) =>
          row.varint_id === variant.product_variant_id
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
          varint_id: variant.product_variant_id,
          skuCode: variant.skuCode,
          ProductName: variant.productName,
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

  const updateRow = (id: string, field: keyof ProductRow, value: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.varint_id !== id) return row;

        const updatedRow = {
          ...row,
          [field]: value,
        };

        const subtotal = updatedRow.price * updatedRow.quantity;
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
    setRows((prev) => prev.filter((row) => row.varint_id !== id));
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

  const orderSummary = rows.reduce(
    (acc, row) => {
      acc.subtotal += row.price * row.quantity;
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

    if (!formData.customer_id) {
      toast.error("Select a customer!");
      return;
    }

    const payload = {
      ...formData,
      order_tax: Number(formData.order_tax || 0),
      shipping: Number(formData.shipping || 0),
      discount: Number(formData.discount || 0),

      sales_items: rows.map((row) => ({
        ...(row.sales_item_id && { sales_item_id: row.sales_item_id }),
        product_variant_id: row.varint_id,
        price: row.price,
        quantity: row.quantity,
        tax: row.tax,
        tax_amount: row.tax_amount,
        discount: row.discount,
        total: row.total,
      })),
    };
    console.log(payload);
    const sale_id = sales?.sale_id;
    if (!sale_id) return;
    const updatePromise = updateSale(sale_id, payload);

    toast.promise(updatePromise, {
      loading: "updating Sale ..",
      success: (res) => {
        setRows([]);
        setQuery("");
        setFormData({
          customer_id: "",
          date: "",
          order_tax: 0,
          shipping: 0,
          discount: 0,
          status: "INPROGRESS",
        });
        navigate("/sales");
        return res.message || "Sale created successfully!";
      },
      error: (err) => {
        return (
          err.response?.data?.message || err.message || "Failed to create sale!"
        );
      },
    });
  };

  return (
    <>
      {" "}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Add Sales </p>
          <p>Add Your Sales Order</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-blue-600 hover:bg-blue-500 hover:text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="mt-10 grid gap-6 bg-white p-4 rounded-md">
        <div className="flex justify-center gap-3 items-center ">
          <div className="w-full grid gap-3">
            <Label>Customer Name</Label>

            <Select
              value={formData.customer_id}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  customer_id: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select The Customer" />
              </SelectTrigger>
              <SelectContent>
                {customer?.map((cus) => (
                  <SelectItem value={cus.customer_id}>
                    {cus.firstName}-{cus.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full grid gap-3">
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid gap-4 relative">
          <Label>Product</Label>
          <Input
            type="text"
            placeholder="Search Product By Code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                        const isLowStock = stockCount > 0 && stockCount < 10;
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
                                : "bg-neutral-100 text-neutral-600  border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
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
                                      <Ban className="w-3 h-3 mr-1" /> No Stock
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
                                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
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
        {/* table */}
        <div>
          <div className="w-full mt-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Scroll Wrapper for responsiveness */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white uppercase bg-blue-500 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 backdrop-blur-sm z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product Details</th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Price
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Discount
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Tax %
                    </th>
                    <th className="px-4 py-4 text-right font-semibold">
                      Tax Amt
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Total
                    </th>
                    <th className="px-4 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {rows.map((row) => (
                    <tr
                      key={row.varint_id}
                      className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 "
                    >
                      {/* Product Name & Variant */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                            {row.ProductName}
                          </span>
                          <span className="text-xs text-neutral-500 mt-0.5 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {row.variant_label}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Quantity Stepper */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                            <button
                              onClick={() =>
                                updateRow(
                                  row.varint_id,
                                  "quantity",
                                  Math.max(1, row.quantity - 1),
                                )
                              }
                              disabled={row.quantity <= 1}
                              className="p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              min={1}
                              className="w-10 text-center text-sm font-medium border-none focus:ring-0 p-0 bg-transparent [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                              value={row.quantity}
                              onChange={(e) =>
                                updateRow(
                                  row.varint_id,
                                  "quantity",
                                  Math.max(1, Number(e.target.value)),
                                )
                              }
                            />

                            <button
                              onClick={() =>
                                updateRow(
                                  row.varint_id,
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
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-right tabular-nums text-neutral-600 dark:text-neutral-300">
                        ${Number(row.price).toFixed(2)}
                      </td>

                      {/* Discount Input */}
                      <td className="px-4 py-4">
                        <div className="relative flex items-center justify-center group/input">
                          <div className="absolute left-1/2 -translate-x-12 text-neutral-400 pointer-events-none">
                            {/* Optional icon or currency symbol */}
                          </div>
                          <input
                            type="number"
                            min={0}
                            className="w-20 pl-2 pr-2 py-1.5 text-center bg-neutral-50 dark:bg-neutral-800 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-md transition-all text-sm outline-none"
                            placeholder="0"
                            value={row.discount}
                            onChange={(e) =>
                              updateRow(
                                row.varint_id,
                                "discount",
                                Math.max(0, Number(e.target.value)),
                              )
                            }
                          />
                        </div>
                      </td>

                      {/* Tax % Input */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              className="w-16 pl-2 pr-6 py-1.5 text-right bg-neutral-50 dark:bg-neutral-800 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-md transition-all text-sm outline-none"
                              value={row.tax}
                              onChange={(e) =>
                                updateRow(
                                  row.varint_id,
                                  "tax",
                                  Math.min(
                                    100,
                                    Math.max(0, Number(e.target.value)),
                                  ),
                                )
                              }
                            />
                            <span className="absolute right-2 top-1.5 text-neutral-400 pointer-events-none text-xs font-medium">
                              %
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tax Amount */}
                      <td className="px-4 py-4 text-right tabular-nums text-neutral-500 dark:text-neutral-400">
                        ${Number(row.tax_amount).toFixed(2)}
                      </td>

                      {/* Total Cost */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                          ₹{Number(row.total).toFixed(2)}
                        </span>
                      </td>

                      {/* Delete Action */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => removeRows(row.varint_id)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Empty State Helper (Optional) */}
                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-neutral-400"
                      >
                        No items in the cart
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* checkout-info */}

        <div className="flex items-center justify-end">
          <div className="w-110 rounded-lg border shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border  bg-gray-50">
                    Sub Total
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {" "}
                    $ {Number(orderSummary.total).toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border  bg-gray-50">
                    Order Tax ({formData.order_tax}%)
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {orderTax}
                  </td>
                </tr>

                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                    Discount
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formData.discount}
                  </td>
                </tr>

                <tr className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                    Shipping
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formData.shipping}
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-bold text-neutral-800 dark:text-neutral-100 border bg-gray-50">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-neutral-50 border">
                    {grand_total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* tax-info */}
        <div className="flex gap-2 justify-center items-center">
          <div className="grid gap-4 w-full">
            <Label>Order Tax</Label>
            <Input
              type="number"
              defaultValue={0}
              name="order_tax"
              value={formData.order_tax}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Discount</Label>
            <Input
              type="number"
              defaultValue={0}
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Shipping</Label>
            <Input
              type="number"
              defaultValue={0}
              name="shipping"
              value={formData.shipping}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-4 w-full">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  status: value as SaleStatus,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="INPROGRESS">Inprogress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border-t-1 mt-5">
          <div className="flex gap-3 items-center justify-end mt-5">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleCreateSale}>Submit</Button>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
