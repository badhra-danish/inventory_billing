import type { PurchaseOrder } from "./PurchaseOrderDatable";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";

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
  purchaseOrder: PurchaseOrder | null;
};

export const PurchaseOrderDetailsDialog = ({
  open,
  onClose,
  purchaseOrder,
}: Props) => {
  return (
    <>
      {/* Increased max-width to 7xl for a wider view */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto  bg-white p-0  border-none flex flex-col ">
          {/* Top Header Bar - Fixed */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <h2 className="text-xl font-semibold text-slate-800">
              Purchase Order Detail
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
                <ArrowLeft size={16} /> Back to Purchase Order
              </Button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Supplier Info</h3>
                <div className="text-sm text-slate-600">
                  <p className="font-bold text-base text-slate-900">
                    {purchaseOrder?.supplier?.firstName}{" "}
                    {purchaseOrder?.supplier?.lastName || "Carl Evans"}
                  </p>

                  <p>
                    <span className="font-bold">Email :</span>{" "}
                    {purchaseOrder?.supplier?.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone :</span>{" "}
                    {purchaseOrder?.supplier?.phone}
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
                <h3 className="font-bold text-slate-700">Order Info</h3>

                {/* Added items-center to align labels with badges and gap-y-3 for spacing */}
                <div className="text-sm text-slate-600 grid grid-cols-2 gap-y-3 items-center">
                  {/* Reference Row */}
                  <span className="text-slate-400">Reference:</span>
                  <span className="text-blue-500 font-bold tracking-tight">
                    {purchaseOrder?.po_number}
                  </span>

                  {/* Date Row */}
                  <span className="text-slate-400">Date:</span>
                  <span className="font-medium">{purchaseOrder?.po_date}</span>

                  {/* Status Row */}
                  <span className="text-slate-400">Status:</span>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider
                        `}
                    >
                      {purchaseOrder?.status ?? "Unknown"}
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
                          Quantity(₹)
                        </TableHead>
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
                      {purchaseOrder?.items?.map((item, index) => (
                        <TableRow
                          key={item.product_variant_id}
                          className="bg-blue-100 border-b-1 border-gray-400"
                        >
                          {" "}
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium text-slate-700">
                            {item.variant.product.productName}-(
                            {item.variant.variant_label})
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit_price}</TableCell>
                          <TableCell>{item.discount}</TableCell>
                          <TableCell>{item.tax} %</TableCell>
                          <TableCell>{item.tax_amount}</TableCell>
                          <TableCell className="text-right">
                            {item.total_amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Totals Section */}

            <div className="flex items-center justify-end">
              <div className="w-110 rounded-lg border shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {/* <tr className="border-b last:border-none">
                      <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border  bg-gray-50">
                        Sub Total
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {" "}
                        $ {orderSummary.total.toFixed(2)}
                      </td>
                    </tr> */}
                    <tr className="border-b last:border-none">
                      <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border  bg-gray-50">
                        Order Tax ({purchaseOrder?.order_tax}%)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {purchaseOrder?.order_tax}
                      </td>
                    </tr>

                    <tr className="border-b last:border-none">
                      <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                        Discount
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {purchaseOrder?.discount_amt}
                      </td>
                    </tr>

                    <tr className="border-b last:border-none">
                      <td className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-200 border bg-gray-50">
                        Shipping
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {purchaseOrder?.shipping}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-neutral-800 dark:text-neutral-100 border bg-gray-50">
                        Grand Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-neutral-900 dark:text-neutral-50 border">
                        {purchaseOrder?.grand_total}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
