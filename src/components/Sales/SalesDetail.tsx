import { ArrowLeft, FileText, Printer } from "lucide-react";
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
import { Textarea } from "../ui/textarea";

export type SalesItemDetail = {
  sales_item_id: string;
  product_variant_id: string;
  warehouse_id: string;
  total_returned_qty: number;
  original_quantity: number;
  effective_quantity: number;
  effective_sub_total: number;
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

type Props = {
  open: boolean;
  onClose: () => void;
  sales: SalesDetail | null;
};

export const SalesDetailsDialog = ({ open, onClose, sales }: Props) => {
  const statusConfig = {
    // Order Status Styles (Solid Backgrounds)
    order: {
      INPROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-600",
    },
    // Payment Status Styles (Light Backgrounds with Borders)
    payment: {
      UNPAID: "border-gray-300 text-gray-600",
      PAID: "border-green-400 text-green-700",
      PARTIALLY_PAID: "border-orange-400 text-orange-700",
      OVERDUE: "border-red-400 text-red-700",
      default: "border-gray-300 text-gray-600",
    },
  };
  return (
    <>
      {/* Increased max-width to 7xl for a wider view */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto  bg-white p-0  border-none flex flex-col ">
          {/* Top Header Bar - Fixed */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <h2 className="text-xl font-semibold text-slate-800">
              Sales Detail
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
              >
                <FileText size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <Printer size={20} />
              </Button>
              <Button
                variant="default"
                className="bg-[#0f172a] text-white flex gap-2 items-center"
              >
                <ArrowLeft size={16} /> Back to Sales
              </Button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Customer Info</h3>
                <div className="text-sm text-slate-600">
                  <p className="font-bold text-base text-slate-900">
                    {sales?.customer?.firstName}{" "}
                    {sales?.customer?.lastName || "Carl Evans"}
                  </p>
                  <p>
                    <span className="font-bold">Address :</span>:{" "}
                    {sales?.customer?.address}
                  </p>
                  <p>
                    <span className="font-bold">Email :</span>{" "}
                    {sales?.customer?.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone :</span>{" "}
                    {sales?.customer?.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Company Info</h3>
                <div className="text-sm text-slate-600">
                  <p className="font-bold text-base text-slate-900">DGT</p>
                  <p>2077 Chicago Avenue Orosi, CA 93647</p>
                  <p>Email: admin@example.com</p>
                  <p>Phone: +1 893 174 0385</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-700">Invoice Info</h3>

                {/* Added items-center to align labels with badges and gap-y-3 for spacing */}
                <div className="text-sm text-slate-600 grid grid-cols-2 gap-y-3 items-center">
                  {/* Reference Row */}
                  <span className="text-slate-400">Reference:</span>
                  <span className="text-blue-500 font-bold tracking-tight">
                    {sales?.invoice_no}
                  </span>

                  {/* Date Row */}
                  <span className="text-slate-400">Date:</span>
                  <span className="font-medium">{sales?.sale_date}</span>

                  {/* Status Row */}
                  <span className="text-slate-400">Status:</span>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider
                         ${statusConfig.order[sales?.status ?? "INPROGRESS"] || statusConfig.order.default}`}
                    >
                      {sales?.status ?? "Unknown"}
                    </span>
                  </div>

                  {/* Payment Status Row */}
                  <span className="text-slate-400">Payment:</span>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors
                         ${statusConfig.payment[sales?.payment_status ?? "UNPAID"] || statusConfig.payment.default}`}
                    >
                      • {sales?.payment_status ?? "UNPAID"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section with Scrollable Area */}
            <div>
              <h3 className="font-bold text-slate-700 mb-4">Order Summary</h3>
              <div className="border rounded-md overflow-hidden">
                {/* max-h-[400px] roughly accounts for 10 rows (approx 40px each). 
              Adjust this value if your row height differs. 
          */}
                <div className="max-h-[440px] overflow-y-auto relative custom-scrollbar">
                  <Table>
                    <TableHeader className="bg-blue-500 sticky top-0 z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          SR No
                        </TableHead>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Product
                        </TableHead>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Quantity
                        </TableHead>
                        {/* <TableHead className="text-white font-semibold bg-blue-500">
                          Return Qty
                        </TableHead> */}
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Price(₹)
                        </TableHead>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Discount(₹)
                        </TableHead>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Tax(%)
                        </TableHead>
                        <TableHead className="text-white font-semibold bg-blue-500">
                          Tax Amount(₹)
                        </TableHead>
                        <TableHead className="text-white font-semibold text-right bg-blue-500">
                          Total Cost(₹)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Simulated 12 items to demonstrate scrolling */}
                      {sales?.sales_items?.map((item, index) => (
                        <TableRow
                          key={item.product_variant_id}
                          className="bg-blue-100 border-b-1 border-gray-400"
                        >
                          {" "}
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium text-slate-700">
                            {item.variant.productName}-(
                            {item.variant.variant_label})
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          {/* <TableCell>{item.total_returned_qty}</TableCell> */}
                          <TableCell>{item.variant.price}</TableCell>
                          <TableCell>{item.discount}</TableCell>
                          <TableCell>{item.tax} %</TableCell>
                          <TableCell>{item.tax_amount}</TableCell>
                          <TableCell className="text-right">
                            {item.total}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Totals Section */}

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-full sm:w-[380px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Order Tax ({sales?.order_tax}%)</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                      ₹
                      {(
                        (Number(sales?.order_tax ?? 0) *
                          Number(sales?.grand_total ?? 0)) /
                          100 +
                        Number(sales?.shipping ?? 0) -
                        Number(sales?.discount ?? 0)
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums text-red-500">
                      - ₹
                      {Number(sales?.discount ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                      + ₹
                      {Number(sales?.shipping ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
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
                      {Number(sales?.grand_total ?? 0).toLocaleString(
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
                      {Number(sales?.paid_amount ?? 0).toLocaleString(
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
                      {Number(sales?.due_amount ?? 0).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed */}
          <div className="flex justify-end gap-3 p-6 bg-white border-t shrink-0">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
