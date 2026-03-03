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
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { getAllVariantInstock } from "@/api/Stock/Stockclinet";
import { getAllVariantBySearch } from "@/api/CreateProduct/ProductClinet";
import React from "react";
import { getAllSupplier } from "@/api/Supplier/SupplierClient";
import { getAllWarehouse } from "@/api/WareHouse/WareHouse";
import {
  createPurchaseOrder,
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
    getPurchaseOrderData();
  }, [formData.purchase_order_id]);
  console.log(purchaseOrderData);

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
    <div className="max-w-7xl mx-auto pb-10">
      {/* =========================================
          PAGE HEADER
          ========================================= */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Create Purchase
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add a new purchase and manage supplier details.
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

      <div className="grid gap-6 lg:grid-cols-3">
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
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products by SKU or Name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-900 focus-visible:ring-primary"
                />
              </div>

              {/* Search Results Dropdown */}
              {variant.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-xl z-50 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                  {variant.map((p) => (
                    <div
                      key={p.product_variant_id}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center border-b dark:border-gray-800 last:border-0 transition-colors"
                      onClick={() => addProductToTable(p)}
                    >
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {p.productName}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          SKU: {p.skuCode}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="p-4 border-b dark:border-gray-800">
                      Product
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-center w-24">
                      Qty
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-center w-28">
                      Price
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-center w-24">
                      Disc.
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-center w-24">
                      Tax %
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-right">
                      Total
                    </th>
                    <th className="p-4 border-b dark:border-gray-800 text-center w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No products added yet. Search above to add items.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr
                        key={row.variant_id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors"
                      >
                        <td className="p-4 font-medium">
                          {row.ProductName}
                          <span className="block text-xs text-gray-500 font-normal mt-0.5">
                            {row.variant_label}
                          </span>
                        </td>
                        <td className="p-4">
                          <Input
                            type="number"
                            min={1}
                            value={row.quantity}
                            onChange={(e) =>
                              updateRow(
                                row.variant_id,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="h-8 text-center px-1"
                          />
                        </td>
                        <td className="p-4">
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
                            className="h-8 text-right px-2"
                          />
                        </td>
                        <td className="p-4">
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
                            className="h-8 text-center px-1"
                          />
                        </td>
                        <td className="p-4">
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
                            className="h-8 text-center px-1"
                          />
                        </td>
                        <td className="p-4 text-right font-bold text-gray-900 dark:text-gray-100">
                          ₹{row.total.toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRows(row.variant_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 h-8 w-8 p-0"
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
        <div className="space-y-6">
          {/* --- SECTION 3: ADDITIONAL CHARGES --- */}
          <div className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-sm p-6">
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
                <span className="text-2xl font-bold text-primary">
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
  );
}
