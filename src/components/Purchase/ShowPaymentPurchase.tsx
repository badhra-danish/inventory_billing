import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "../ui/textarea";
import {
  createPayment,
  deletePayment,
  getAllPaymentDetials,
} from "@/api/Sales/SalesClient";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit, Pause, Printer, Salad, Trash, X } from "lucide-react";
import Sales from "@/pages/Sales/Sales";
import { CreatePurchasePaymentDialog } from "./CreatePaymentPurchase";
import type { PurchaseDetails } from "./EditPurchase";
import {
  deletePaymentPurchase,
  getAllPaymentDetialsPurchase,
} from "@/api/PurchaseOrder/PurchaseClient";
import type { Purchase } from "./PurchaseDataTable";
type Props = {
  open: boolean;
  onClose: () => void;
  purchase: Purchase | null;
  payment?: PaymentDetails | null;
};

export type PaymentDetails = {
  payment_id: string;
  purchase_id: string;
  amount: number;
  payment_method: "CASH" | "UPI";
  payment_date: string;
  reference_no?: string;
  note?: string | null;
};

export const ShowPaymentDetail = ({ open, onClose, purchase }: Props) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null,
  );

  const [salesSummary, setSalesSummary] = useState(purchase);
  useEffect(() => {
    setSalesSummary(purchase);
  }, [purchase]);

  const [openupdatePayment, setOpenUpdatePayment] = useState(false);
  const [paymentData, setPaymentData] = React.useState<PaymentDetails[]>([]);
  const getAllPaymentDetail = async () => {
    try {
      const purchase_id = purchase?.purchase_id;
      if (!purchase_id) return;
      const res = await getAllPaymentDetialsPurchase(purchase_id);
      if (res.status === "OK") {
        setPaymentData(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (open) {
      getAllPaymentDetail();
    }
  }, [open, openupdatePayment]);
  const handleDeletePayment = (payment_id: string) => {
    try {
      const payment = paymentData.find((p) => p.payment_id === payment_id);
      if (!payment) return;

      const deletePromise = deletePaymentPurchase(payment_id);

      toast.promise(deletePromise, {
        loading: "Deleting payment...",
        success: (res) => {
          setPaymentData((prev) =>
            prev.filter((p) => p.payment_id !== payment_id),
          );
          setSalesSummary((prev) => {
            if (!prev) return prev;

            const newPaid = Number(prev.paid_amount) - Number(payment.amount);
            const newDue = Number(prev.grand_total) - newPaid;

            return {
              ...prev,
              paid_amount: String(newPaid),
              due_amount: String(newDue),
              payment_status:
                newPaid === 0
                  ? "UNPAID"
                  : newPaid === Number(prev.grand_total)
                    ? "PAID"
                    : "PARTIALLY_PAID",
            };
          });

          return res.message || "Payment deleted successfully";
        },
        error: (err) =>
          err?.response?.data?.message || "Failed to delete payment",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 custom-scrollbar border-none rounded-2xl shadow-2xl">
          {/* Header Section */}
          <DialogHeader className=" p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-[#1e293b]">
              Payments Details.
            </DialogTitle>
            <DialogDescription>
              Payment Details of Customer{" "}
              <span className="text-blue-600 font-bold">
                {" "}
                ( {purchase?.supplier.firstName}-{purchase?.supplier?.lastName})
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50/50 border-b shrink-0">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Payable
              </p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                ₹{Number(salesSummary?.grand_total) || "0.00"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                Total Paid
              </p>
              <p className="text-xl font-bold text-emerald-700 mt-1">
                ₹{Number(salesSummary?.paid_amount).toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
              <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                Balance Due
              </p>
              <p className="text-xl font-bold text-orange-700 mt-1">
                ₹{Number(salesSummary?.due_amount).toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          {/* Table Section */}
          <div className="p-8">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-500 ">
                  <TableRow className="border-b hover:bg-transparent">
                    <TableHead className="text-white font-semibold text-center h-14">
                      Date
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center h-14">
                      Reference
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center h-14">
                      Amount
                    </TableHead>
                    <TableHead className="text-white font-semibold text-center h-14">
                      Paid By
                    </TableHead>
                    <TableHead className="text-transparent h-14 w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Example Row to match image */}

                  {paymentData?.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell className="text-center py-4 text-slate-600 font-medium">
                        {payment.payment_date}
                      </TableCell>

                      <TableCell className="text-center py-4 text-slate-600 font-medium">
                        {payment.reference_no}
                      </TableCell>

                      <TableCell className="text-center py-4 text-slate-600 font-medium">
                        ₹{payment.amount}
                      </TableCell>

                      <TableCell className="text-center py-4 text-slate-600 font-medium">
                        {payment.payment_method}
                      </TableCell>

                      <TableCell className="text-right py-4 pr-6">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-slate-200 text-slate-600"
                            onClick={() =>
                              handleDeletePayment(payment.payment_id)
                            }
                          >
                            <Trash size={18} />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-slate-200 text-slate-600"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setOpenUpdatePayment(true);
                            }}
                          >
                            <Edit size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Bottom Orange Decorative Bar (from image) */}
          </div>
        </DialogContent>
      </Dialog>
      <CreatePurchasePaymentDialog
        open={openupdatePayment}
        onClose={() => setOpenUpdatePayment(false)}
        purchase={purchase}
        payment={selectedPayment}
      />
    </>
  );
};
