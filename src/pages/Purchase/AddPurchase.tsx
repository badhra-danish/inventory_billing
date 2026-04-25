import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import {

  FileText,
  Loader2,
  Minus,
  PackageX,
  Plus,
  Save,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { getAllVariantBySearch } from "@/api/CreateProduct/ProductClinet";
import React from "react";
import { getAllSupplier } from "@/api/Supplier/SupplierClient";
import { getAllWarehouse } from "@/api/WareHouse/WareHouse";
import {
  getAllPurchaseOrderNo,
  getPurchaseOrderByID,
} from "@/api/PurchaseOrder/PurchaseOrderClient";
import toast from "react-hot-toast";
import type { PurchaseOrderData } from "@/components/Purchase/PurchaseOrderEdit";
import { createPurchase } from "@/api/PurchaseOrder/PurchaseClient";
type ProductRow = {
  variant_id: string;
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

type Product = {
  product_variant_id: string;
  skuCode: string;
  price: number;
  variant_label: string;
  quantity: number;
  productName: string;
};
type supplier = {
  supplierID: string;
  firstName: string;
  lastName: string;
};
type warehouse = {
  warehouse_id: string;
  warehouseName: string;
};
type purchaseOrderNo = {
  purchase_order_id: string;
  po_number: string;
};
export default function AddPurchaseOrder() {
  const navigate = useNavigate();
  const [supplier, setSupplier] = React.useState<supplier[]>([]);
  const [warehouse, setWareHouse] = React.useState<warehouse[]>([]);
  const [poNumber, setPoNumber] = React.useState<purchaseOrderNo[]>([]);
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ProductRow[]>([]);

  const [formData, setFormData] = useState({
    purchase_order_id: "",
    supplierID: "",
    po_date: "",
    ref_no: "",
    order_tax: 0,
    shipping: 0,
    warehouse_id: "",
    discount: 0,
    status: "PENDING",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getallSupplier = async () => {
    try {
      const res = await getAllSupplier();
      if (res.status === "OK") {
        setSupplier(res.data || []);
      }
    } catch (error) {
      console.error;
    }
  };
  React.useEffect(() => {
    getallSupplier();
  }, []);
  const getallPurchaseOrderNo = async () => {
    try {
      const res = await getAllPurchaseOrderNo();
      if (res.status === "OK") {
        setPoNumber(res.data || []);
      }
    } catch (error) {
      console.error;
    }
  };
  React.useEffect(() => {
    getallPurchaseOrderNo();
  }, []);
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
  }, []);

  const [purchaseOrderData, setPurchaseOrderData] =
    useState<PurchaseOrderData | null>(null);

  const getPurchaseOrderData = async () => {
    try {
      if (!formData.purchase_order_id) return;
      const res = await getPurchaseOrderByID(formData.purchase_order_id);
      if (res.status == "OK") {
        setPurchaseOrderData(res.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!formData.purchase_order_id) return;
    getPurchaseOrderData();
  }, [formData.purchase_order_id]);

  useEffect(() => {
    if (!purchaseOrderData) return;
    const formattedRows: ProductRow[] =
      purchaseOrderData.items?.map((item) => ({
        variant_id: item.product_variant_id,
        skuCode: item.skuCode,
        ProductName: item.productName,
        variant_label: item.product_variant_name,
        quantity: Number(item.quantity),
        price: Number(item.unit_price),
        discount: Number(item.discount),
        tax: Number(item.tax),
        tax_amount: Number(item.tax_amount),
        total: Number(item.total_amount),
      })) || [];
    setFormData((prev) => ({
      ...prev,
      supplierID: purchaseOrderData.supplier_id,
      po_date: purchaseOrderData.po_date,
      warehouse_id: purchaseOrderData.warehouse_id,
      order_tax: Number(purchaseOrderData.order_tax),
      shipping: Number(purchaseOrderData.shipping),
      discount: Number(purchaseOrderData.discount_amt),
      status: purchaseOrderData.status,
    }));
    setRows(formattedRows);
  }, [purchaseOrderData, formData.purchase_order_id]);
  // ==============================
  // SEARCH PRODUCT
  // ==============================
  useEffect(() => {
    if (!query.trim()) {
      setVariant([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getAllVariantBySearch(query);
        if (res.status === "OK") {
          setVariant(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  console.log(variant);

  // ==============================
  // ADD PRODUCT TO TABLE
  // ==============================
  const addProductToTable = (product: Product) => {
    setRows((prev) => {
      const exists = prev.find(
        (row) => row.variant_id === product.product_variant_id,
      );

      if (exists) {
        return prev.map((row) =>
          row.variant_id === product.product_variant_id
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

      return [
        ...prev,
        {
          variant_id: product.product_variant_id,
          skuCode: product.skuCode,
          ProductName: product.productName,
          variant_label: product.variant_label,
          quantity: 1,
          price: product.price,
          discount: 0,
          tax: 0,
          tax_amount: 0,
          total: product.price,
        },
      ];
    });

    setQuery("");
    setVariant([]);
  };

  // ==============================
  // UPDATE ROW
  // ==============================
  const updateRow = (id: string, field: keyof ProductRow, value: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.variant_id !== id) return row;

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
    setRows((prev) => prev.filter((row) => row.variant_id !== id));
  };

  const handleCancel = () => {
    navigate("/purchase-orders");
  };

  // ==============================
  // TOTAL CALCULATION
  // ==============================
  const subTotal = rows.reduce((acc, row) => acc + row.total, 0);
  const orderTax = (subTotal * formData.order_tax) / 100;

  const grandTotal =
    subTotal -
    Number(formData.discount) +
    Number(formData.shipping) +
    Number(orderTax);

  const payload = {
    supplier_id: formData.supplierID,
    warehouse_id: formData.warehouse_id,
    status: formData.status,
    purchase_date: formData.po_date,
    reference_no: formData.ref_no,
    order_tax: Number(formData.order_tax || 0),
    shipping: Number(formData.shipping || 0),
    discount: Number(formData.discount || 0),
    purchase_items: rows.map((row) => ({
      product_variant_id: row.variant_id,
      price: row.price,
      quantity: row.quantity,
      tax: row.tax,
      tax_amount: row.tax_amount,
      discount: row.discount,
      total: row.total,
    })),
  };
  console.log(payload);
  const handleCreatePurchase = () => {
    // Basic validation
    if (!formData.supplierID) {
      toast.error("Supplier is required");
      return;
    }

    if (!rows || rows.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    const payload = {
      supplier_id: formData.supplierID,
      warehouse_id: formData.warehouse_id,
      status: formData.status,
      purchase_date: formData.po_date,
      reference_no: formData.ref_no,
      order_tax: Number(formData.order_tax || 0),
      shipping: Number(formData.shipping || 0),
      discount: Number(formData.discount || 0),
      purchase_items: rows.map((row) => ({
        product_variant_id: row.variant_id,
        price: row.price,
        quantity: row.quantity,
        tax: row.tax,
        tax_amount: row.tax_amount,
        discount: row.discount,
        total: row.total,
      })),
    };
    const createPromise = createPurchase(payload);
    toast.promise(createPromise, {
      loading: "Creating Purchase...",
      success: (res) => {
        if (res?.status === "OK") {
          navigate("/shop/purchase");
          return res.message;
        }
        throw new Error(res?.message || "Failed to create");
      },
      error: (err) => err?.response?.data?.message || "Something went wrong",
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
              Create Sale
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add a new Sales and manage Customer details.
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
                    Purchase Order
                  </Label>
                  <Select
                    value={formData.purchase_order_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        purchase_order_id: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Purchase Order" />
                    </SelectTrigger>
                    <SelectContent>
                      {poNumber?.map((po) => (
                        <SelectItem
                          key={po.purchase_order_id}
                          value={String(po.purchase_order_id)}
                        >
                          {po.po_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Supplier Name
                  </Label>
                  <Select
                    value={formData.supplierID}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, supplierID: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplier?.map((sup) => (
                        <SelectItem
                          key={sup.supplierID}
                          value={String(sup.supplierID)}
                        >
                          {sup.firstName} {sup.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Purchase Date
                  </Label>
                  <Input
                    type="date"
                    className="bg-gray-50 dark:bg-gray-900"
                    onChange={(e) =>
                      setFormData({ ...formData, po_date: e.target.value })
                    }
                    value={formData.po_date}
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
                      <SelectItem value="APPROVED">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Warehouse
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, warehouse_id: value })
                    }
                    value={formData.warehouse_id}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900">
                      <SelectValue placeholder="Select Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouse?.map((war) => (
                        <SelectItem value={war.warehouse_id}>
                          {war.warehouseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>{" "}
                <div className="grid gap-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Refrence No
                  </Label>
                  <Input
                    type="text"
                    className="bg-gray-50 dark:bg-gray-900"
                    onChange={(e) =>
                      setFormData({ ...formData, ref_no: e.target.value })
                    }
                    value={formData.ref_no}
                  />
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
                              return (
                                <li
                                  key={item.product_variant_id}
                                  onClick={() => addProductToTable(item)}
                                  className={`
                      group relative p-3.5 transition-all duration-200
                      ${"cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10"}

                    `}
                                >
                                  {/* Active Left Border Indicator */}
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200 bg-transparent group-hover:bg-blue-300`}
                                  />

                                  <div className="flex items-start justify-between gap-3 pl-2">
                                    {/* --- LEFT SIDE: Info --- */}
                                    <div className="flex-1 min-w-0">
                                      {/* Row 1: Name & Variant Badge */}
                                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                        <h4
                                          className={`text-sm font-bold leading-tight "text-neutral-900 dark:text-neutral-100"}`}
                                        >
                                          {item.productName}
                                        </h4>

                                        {/* Interactive Variant Badge */}
                                        <span
                                          className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                            ${"bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"}
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
                      <th className="px-3 py-3.5 border-b border-gray-200 dark:border-gray-800 text-center w-[120px]">
                        Qty
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
                          {/* <td className="px-2 py-2 w-[140px]">
                            <div className="w-full">
                              <WarehouseSearch
                                warehouses={warehouse}
                                row={row}
                                updateRow={updateRow}
                              />
                            </div>
                          </td> */}
                          <td className="px-2 py-2 w-[120px]">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                                <button
                                  onClick={() =>
                                    updateRow(
                                      row.variant_id,
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
                                      row.variant_id,
                                      "quantity",
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                />

                                <button
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
                          </td>
                          <td className="px-2 py-2 w-[100px]">
                            <Input
                              type="number"
                              value={row.price}
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
          <div className=" gap-6 grid lg:grid-cols-2 col-span-2">
            {/* --- SECTION 3: ADDITIONAL CHARGES --- */}
            <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm p-6 w-full">
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
            </div>

            {/* --- SECTION 4: FINAL SUMMARY --- */}
            <div className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ₹{subTotal.toFixed(2)}
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
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCreatePurchase}
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
