import React from "react";
import {
  ArrowLeft,
  Badge,
  Calendar,
  Circle,
  FileText,
  Printer,
  Receipt,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
export interface SaleReturn {
  sale_return_id: string;
  srn_no: string;
  sale_return_date: string;
  status: "PENDING" | "RECEIVED";
  payment_status: "PAID" | "UNPAID" | "PARTIALY_PAID";
  total_amount: number;

  summary: Summary;

  sale: Sale;

  customer: Customer;

  return_items: ReturnItem[];
}

// ----------------------------
// Summary
// ----------------------------
export interface Summary {
  total_items_count: number;
  fully_returned_count: number;
  total_return_qty: number;
  total_tax_amount: number;
  total_discount: number;
  net_return_amount: number;
}

// ----------------------------
// Sale Info
// ----------------------------
export interface Sale {
  sale_id: string;
  invoice_no: string;
  sale_date: string;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  payment_status: "PAID" | "UNPAID" | "PARTIALY_PAID";
  order_tax: number;
  shipping: number;
  discount: number;
}

// ----------------------------
// Customer Info
// ----------------------------
export interface Customer {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

// ----------------------------
// Return Items
// ----------------------------
export interface ReturnItem {
  sale_return_item_id: string;
  sale_item_id: string;
  product_variant_id: string;
  warehouse_id: string;

  product_id: string;
  product_name: string;
  sku_code: string;
  variant_label: string;

  unit_price: number;
  original_sold_qty: number;
  return_quantity: number;
  remaining_qty: number;
  is_fully_returned: boolean;

  discount: number;
  tax: number;
  tax_amount: number;

  sub_total: number;
}

type Props = {
  open: boolean;
  onClose: () => void;
  saleReturn: SaleReturn | null;
};

function saleReturnReturnDetials({ open, onClose, saleReturn }: Props) {
  if (!saleReturn) return null;
  const statusConfig = {
    // Order Status Styles (Solid Backgrounds)
    order: {
      PENDING: "bg-yellow-100 text-yellow-800",
      RECEIVED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-600",
    },
    // Payment Status Styles (Light Backgrounds with Borders)
    payment: {
      UNPAID: "border-gray-300 text-gray-600",
      PAID: "border-green-400 text-green-700",
      PARTIALY_PAID: "border-orange-400 text-orange-700",
      OVERDUE: "border-red-400 text-red-700",
      default: "border-gray-300 text-gray-600",
    },
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[95vh] overflow-hidden bg-white p-0 border-none flex flex-col shadow-2xl">
        {/* --- Top Header Bar --- */}
        <div className="flex items-center justify-between p-5 border-b bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sale Return Details
            </h2>
            <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">
              ID: {saleReturn?.sale_return_id.split("-")[0]}...
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <FileText className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button
              variant="default"
              onClick={onClose}
              className="bg-slate-900 text-white hover:bg-slate-800 flex gap-2 items-center"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="p-8 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Customer Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Customer Info
                </h3>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-lg text-slate-900 tracking-tight">
                  {saleReturn?.customer?.full_name}
                </p>
                <div className="text-sm text-slate-600 space-y-2.5">
                  <p className="flex items-start gap-3">
                    <span className="font-semibold text-slate-400 text-xs w-16 pt-0.5 uppercase">
                      Email
                    </span>
                    <span className="flex-1 truncate">
                      {saleReturn?.customer?.email}
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="font-semibold text-slate-400 text-xs w-16 pt-0.5 uppercase">
                      Phone
                    </span>
                    <span>{saleReturn?.customer?.phone}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="font-semibold text-slate-400 text-xs w-16 pt-0.5 uppercase">
                      Address
                    </span>
                    <span className="flex-1 leading-relaxed italic">
                      "{saleReturn?.customer?.address}"
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Company Info
                </h3>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-lg text-slate-900 tracking-tight">
                  DGT Operations
                </p>
                <div className="text-sm text-slate-500 space-y-1 leading-relaxed">
                  <p>2077 Chicago Avenue</p>
                  <p>Orosi, CA 93647</p>
                  <p className="pt-2 font-medium text-slate-700">
                    admin@example.com
                  </p>
                  <p className="font-medium text-slate-700">+1 893 174 0385</p>
                </div>
              </div>
            </div>

            {/* Invoice Section */}
            <div className="bg-blue-200 p-6 rounded-2xl shadow-xl space-y-5 ">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] ">
                Invoice Metadata
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                  <span className="text-xs  font-medium">Invoice No:</span>
                  <span className="font-mono font-bold text-blue-400 text-sm tracking-widest">
                    {saleReturn?.sale.invoice_no}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs  font-medium">Return Date:</span>
                  <span className="text-sm font-semibold">
                    {formatDate(saleReturn.sale_return_date)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Return Status:</span>
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${statusConfig.order[saleReturn?.status ?? "PENDING"] || statusConfig.order.default}`}
                  >
                    {saleReturn?.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Payment:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${statusConfig.payment[saleReturn?.payment_status ?? "UNPAID"] || statusConfig.payment.default}`}
                  >
                    <Circle size={6} fill="currentColor" />{" "}
                    {saleReturn?.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Return Item Summary
              </h3>
              <span className="text-xs text-slate-400">
                {saleReturn?.return_items.length} Items Listed
              </span>
            </div>
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="max-h-[440px] overflow-y-auto relative custom-scrollbar bg-slate-50/30">
                <Table>
                  <TableHeader className="sticky top-0 z-20">
                    <TableRow className="bg-blue-500 hover:bg-slate-900 border-none">
                      <TableHead className="text-white font-bold h-12 w-16 text-center">
                        #
                      </TableHead>
                      <TableHead className="text-white font-bold h-12">
                        Product Description
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-center">
                        Sold
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-center">
                        Return
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-right">
                        Price
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-right">
                        Discount
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-center">
                        Tax %
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-right">
                        Tax Amt
                      </TableHead>
                      <TableHead className="text-white font-bold h-12 text-right pr-6">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saleReturn?.return_items?.map((item, index) => (
                      <TableRow
                        key={item.product_variant_id}
                        className="hover:bg-slate-100/80 transition-colors border-b"
                      >
                        <TableCell className="text-center font-medium text-slate-400">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900">
                            {item.product_name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium italic">
                            {item.variant_label}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-600">
                          {item.original_sold_qty}
                        </TableCell>
                        <TableCell className="text-center font-bold text-orange-600 bg-orange-50/30">
                          {item.return_quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{item.unit_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-rose-500">
                          -₹{item.discount}
                        </TableCell>
                        <TableCell className="text-center text-slate-500">
                          {item.tax}%
                        </TableCell>
                        <TableCell className="text-right text-slate-600">
                          ₹{item.tax_amount}
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900 pr-6">
                          ₹{item.sub_total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col items-end pt-4">
            <div className="w-full md:w-80 space-y-2">
              <div className="flex justify-between px-4 py-2 text-sm text-slate-500 italic">
                <span>Summary calculated based on return quantities.</span>
              </div>
              <div className="rounded-xl border shadow-sm overflow-hidden border-slate-200">
                <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
                  <span className="text-slate-600 font-semibold">
                    Net Refund Amount
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{saleReturn?.total_amount.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-white grid grid-cols-2 gap-2 text-xs">
                  <span className="text-slate-400 uppercase font-bold tracking-tighter">
                    Items Count:
                  </span>
                  <span className="text-right font-bold text-slate-700">
                    {saleReturn?.summary.total_items_count}
                  </span>
                  <span className="text-slate-400 uppercase font-bold tracking-tighter">
                    Total Tax:
                  </span>
                  <span className="text-right font-bold text-slate-700">
                    ₹{saleReturn?.summary.total_tax_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="flex justify-end gap-3 p-5 bg-slate-50 border-t shrink-0">
          <DialogClose asChild>
            <Button className="hover:bg-slate-200">Close </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default saleReturnReturnDetials;
