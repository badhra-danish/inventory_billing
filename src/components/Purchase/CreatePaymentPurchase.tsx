import React, { useEffect } from "react";
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
import { Textarea } from "../ui/textarea";
import { createPayment, updatePayment } from "@/api/Sales/SalesClient";
import toast from "react-hot-toast";

import type { Purchase } from "./PurchaseDataTable";
import {
  createPurchase,
  createPurchasePayment,
  updatePaymentPurchase,
} from "@/api/PurchaseOrder/PurchaseClient";
type Props = {
  open: boolean;
  onClose: () => void;
  purchase?: Purchase | null;
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

export function CreatePurchasePaymentDialog({
  open,
  onClose,
  purchase,
  payment,
}: Props) {
  if (!purchase) return null;

  useEffect(() => {
    if (payment) {
      setPaymentFormData({
        amount: String(payment.amount),
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        note: payment.note || "",
      });
    } else {
      setPaymentFormData({
        amount: "",
        payment_method: "",
        payment_date: "",
        note: "",
      });
    }
  }, [payment, open]);

  const [paymentFormData, setPaymentFormData] = React.useState({
    amount: "",
    payment_date: "",
    payment_method: "",
    note: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setPaymentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreatePayment = async () => {
    try {
      if (!paymentFormData.amount || Number(paymentFormData.amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (!paymentFormData.payment_method) {
        toast.error("Please select a payment method");
        return;
      }

      if (!paymentFormData.payment_date) {
        toast.error("Please select payment date");
        return;
      }

      if (!purchase?.purchase_id) {
        toast.error("Invalid sale");
        return;
      }

      const payload = {
        amount: Number(paymentFormData.amount),
        payment_date: paymentFormData.payment_date,
        payment_method: paymentFormData.payment_method,
        note: paymentFormData.note?.trim(),
      };

      const promise = payment
        ? updatePaymentPurchase(payment.payment_id, payload) // UPDATE
        : createPurchasePayment(purchase.purchase_id, payload); // CREATE

      toast.promise(promise, {
        loading: payment ? "Updating payment..." : "Creating payment...",
        success: () => {
          onClose();

          return payment
            ? "Payment updated successfully"
            : "Payment created successfully";
        },
        error: (err) => err?.response?.data?.message || "Operation failed",
      });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Create Payments
          </DialogTitle>
        </DialogHeader>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Row 1: Date & Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  className=" border-gray-300 h-11"
                  name="payment_date"
                  value={paymentFormData.payment_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Reference <span className="text-red-500">*</span>
              </Label>
              <Input
                className="border-gray-300 h-11"
                value={purchase?.reference_no}
                disabled
              />
            </div>
          </div>

          {/* Row 2: Received Amount, Paying Amount, Payment Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Received Amount */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Received Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                  $
                </span>
                <Input
                  className="pl-8 border-gray-300 h-11"
                  type="number"
                  value={purchase?.due_amount}
                  disabled
                />
              </div>
            </div>

            {/* Paying Amount */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Paying Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                  $
                </span>
                <Input
                  className="pl-8 border-gray-300 h-11"
                  type="number"
                  name="amount"
                  onChange={handleChange}
                  value={paymentFormData.amount}
                />
              </div>
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Payment type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={paymentFormData.payment_method}
                onValueChange={(value) =>
                  setPaymentFormData((prev) => ({
                    ...prev,
                    payment_method: value,
                  }))
                }
              >
                <SelectTrigger className="border-gray-300 h-11 text-gray-500 w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Description (Rich Text Editor Mockup) */}
          <div className="space-y-2">
            <Label className="text-gray-600 font-medium">Description</Label>

            <div className="border border-gray-300 rounded-md overflow-hidden">
              {/* Editor Toolbar */}

              {/* Text Area */}
              <Textarea
                className="w-full h-32 p-3 resize-none focus:outline-none text-sm"
                onChange={handleChange}
                name="note"
                value={paymentFormData.note}
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <DialogFooter className="px-6 py-4 border-t bg-white sm:justify-end gap-3">
          <DialogClose>
            <Button
              variant="ghost"
              className="bg-[#0f172a] text-white hover:bg-[#1e293b] hover:text-white px-6 h-10 rounded-md"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className=" text-white px-6 h-10 rounded-md"
            onClick={handleCreatePayment}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
