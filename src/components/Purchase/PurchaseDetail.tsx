import type { Purchase } from "./PurchaseDataTable";
import {
  ArrowLeft,
  Building2,
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
type Props = {
  open: boolean;
  onClose: () => void;
  purchase: Purchase | null;
};

export const PurchaseDetailsDialog = ({ open, onClose, purchase }: Props) => {
  const statusConfig = {
    // Order Status Styles (Solid Backgrounds)
    order: {
      PENDING: "bg-gray-100 text-gray-800",
      ORDERED: "bg-blue-100 text-blue-800",
      RECEIVED: "bg-green-100 text-green-800",
      PARTIAL: "bg-orange-100 text-orange-800",
      INPROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-600",
    },
    // Payment Status Styles (Light Backgrounds with Borders)
    payment: {
      UNPAID: "border-gray-300 text-gray-600",
      PAID: "border-green-400 text-green-700",
      PARTIAL: "border-orange-400 text-orange-700",
      PARTIALLY_PAID: "border-orange-400 text-orange-700",
      OVERDUE: "border-red-400 text-red-700",
      default: "border-gray-300 text-gray-600",
    },
  };
  return (
    <>
      {/* Increased max-width to 7xl for a wider view */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] bg-white dark:bg-slate-950 p-0 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* =========================================
              HEADER
              ========================================= */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Purchase Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reference:{" "}
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {purchase?.reference_no}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-none px-3 h-9 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                  title="Export PDF"
                >
                  <FileText size={16} className="mr-2" /> PDF
                </Button>
                <div className="w-[1px] bg-slate-200 dark:bg-slate-700" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-none px-3 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Print Purchase"
                >
                  <Printer size={16} className="mr-2" /> Print
                </Button>
              </div>

              <Button
                variant="default"
                onClick={onClose}
                className="h-9 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm transition-all"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
            </div>
          </div>

          {/* =========================================
              SCROLLABLE CONTENT
              ========================================= */}
          <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-slate-950">
            {/* --- INFO CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Supplier Card */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-200 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                    <User size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-white uppercase tracking-wider">
                    Supplier
                  </h3>
                </div>
                <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    {purchase?.supplier?.firstName}{" "}
                    {purchase?.supplier?.lastName || "Carl Evans"}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-slate-500 w-16 shrink-0">
                      Address:
                    </span>
                    <span className="flex-1">
                      {purchase?.supplier?.address}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500 w-16 shrink-0">
                      Email:
                    </span>
                    <span className="truncate">
                      {purchase?.supplier?.email}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500 w-16 shrink-0">
                      Phone:
                    </span>
                    <span>{purchase?.supplier?.phone}</span>
                  </p>
                </div>
              </div>

              {/* Company Card */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-200 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-blue-600 rounded-lg">
                    <Building2 size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-white uppercase tracking-wider">
                    Company
                  </h3>
                </div>
                <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    DGT
                  </p>
                  <p>2077 Chicago Avenue Orosi, CA 93647</p>
                  <p className="truncate">Email: admin@example.com</p>
                  <p>Phone: +1 893 174 0385</p>
                </div>
              </div>

              {/* Invoice Status Card */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-200 dark:bg-slate-900 shadow-sm flex flex-col justify-center">
                <div className="grid grid-cols-[80px_1fr] gap-y-4 items-center text-sm">
                  <span className="text-slate-500 font-semibold">Date:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {purchase?.purchase_date}
                  </span>

                  <span className="text-slate-500 font-semibold">Status:</span>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest inline-flex items-center
                      ${statusConfig.order[purchase?.status ?? "INPROGRESS"] || statusConfig.order.default}`}
                    >
                      {purchase?.status ?? "Unknown"}
                    </span>
                  </div>

                  <span className="text-slate-500 font-semibold">Payment:</span>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest inline-flex items-center
                      ${statusConfig.payment[purchase?.payment_status ?? "UNPAID"] || statusConfig.payment.default}`}
                    >
                      {purchase?.payment_status ?? "UNPAID"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                Order Items
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 py-0.5 px-2 rounded-full text-xs font-medium">
                  {purchase?.purchase_items?.length || 0}
                </span>
              </h3>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="max-h-[380px] overflow-y-auto custom-scrollbar relative bg-white dark:bg-slate-950">
                  <Table>
                    <TableHeader className="bg-blue-500 dark:bg-slate-900/80 sticky top-0 z-10 shadow-sm border-b border-slate-200 dark:border-slate-800">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider w-16 text-center">
                          #
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider min-w-[200px]">
                          Product
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right w-24">
                          Qty
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right w-28">
                          Price (₹)
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right w-28">
                          Disc. (₹)
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right w-24">
                          Tax (%)
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-semibold text-xs uppercase tracking-wider text-right w-32">
                          Tax Amt (₹)
                        </TableHead>
                        <TableHead className="text-white dark:text-slate-400 font-bold text-xs uppercase tracking-wider text-right w-32 dark:bg-slate-800/50">
                          Total (₹)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {purchase?.purchase_items?.map((item, index) => (
                        <TableRow
                          key={item.product_variant_id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                        >
                          <TableCell className="text-center text-slate-400 text-xs">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {item.variant.productName}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                              {item.variant.variant_label}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-700 dark:text-slate-300">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-slate-600 dark:text-slate-400">
                            {item.variant.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-slate-600 dark:text-slate-400">
                            {item.discount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-slate-600 dark:text-slate-400">
                            {item.tax}%
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-slate-600 dark:text-slate-400">
                            {item.tax_amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-900 dark:text-white tabular-nums bg-slate-50/50 dark:bg-slate-900/20">
                            {item.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* --- TOTALS SECTION --- */}
            <div className="flex justify-end">
              <div className="w-full sm:w-[380px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Order Tax ({purchase?.order_tax}%)</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                      ₹
                      {(
                        (Number(purchase?.order_tax ?? 0) *
                          Number(purchase?.grand_total ?? 0)) /
                          100 +
                        Number(purchase?.shipping ?? 0) -
                        Number(purchase?.discount ?? 0)
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums text-red-500">
                      - ₹
                      {Number(purchase?.discount ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                      + ₹
                      {Number(purchase?.shipping ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      Grand Total
                    </span>
                    <span className="font-black text-xl text-primary tabular-nums">
                      ₹
                      {Number(purchase?.grand_total ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full my-2" />

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Paid Amount
                    </span>
                    <span className="font-bold tabular-nums text-green-600 dark:text-green-500">
                      ₹
                      {Number(purchase?.paid_amount ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Balance Due
                    </span>
                    <span className="font-bold tabular-nums text-red-600 dark:text-red-500">
                      ₹
                      {Number(purchase?.due_amount ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              FOOTER
              ========================================= */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-24 bg-white dark:bg-slate-950"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
