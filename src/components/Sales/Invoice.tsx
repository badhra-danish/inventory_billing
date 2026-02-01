import { getSaleById } from "@/api/Sales/SalesClient";
import React, { use, useState } from "react";
import { useParams } from "react-router-dom";
import type { SalesDetail, SalesItemDetail } from "./SalesDataTable";
import { Button } from "../ui/button";

const invoice = {
  invoice_no: "INV-2026-001",
  sale_date: "27 Jan 2026",
  company: {
    name: "ABC Hardware & Plywood",
    address: "Ahmedabad, Gujarat",
    phone: "9999999999",
    email: "abc@gmail.com",
  },
  customer: {
    name: "Rahul Patel",
    address: "Surat, Gujarat",
    phone: "8888888888",
  },
  items: [
    { name: "Plywood Sheet", quantity: 2, price: 750, tax: 18, total: 1770 },
    { name: "Door Handle", quantity: 1, price: 300, tax: 12, total: 336 },
  ],
  summary: {
    sub_total: 1800,
    tax_total: 306,
    discount: 100,
    grand_total: 2006,
  },
};

export default function Invoice() {
  const { sale_id } = useParams();

  const [invoiceDetail, setInvoiceDetails] = React.useState<SalesDetail>();

  const getAllIvoiceInfo = async () => {
    try {
      if (!sale_id) return;
      const res = await getSaleById(sale_id);
      if (res.status == "OK") {
        setInvoiceDetails(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllIvoiceInfo();
  }, []);
  console.log(invoiceDetail);
  const taxAmount =
    (Number(invoiceDetail?.sub_total) * Number(invoiceDetail?.order_tax)) / 100;
  const paginateItems = (items: SalesItemDetail[], itemsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      pages.push(items.slice(i, i + itemsPerPage));
    }
    return pages;
  };

  const productPages = paginateItems(invoiceDetail?.sales_items || [], 10);
  return (
    <>
      <div className="p-0 sm:p-6 bg-gray-100 min-h-screen print:bg-white print:p-0">
        {/* Action Bar */}
        <div className="flex justify-center mb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            Print Invoice ({productPages.length} Pages)
          </button>
        </div>

        {/* 2. Map over the pages */}
        {productPages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            id="invoice-print"
            className="relative mx-auto bg-white shadow-2xl print:shadow-none 
          w-[210mm] h-[297mm] p-[15mm] text-slate-800 font-sans box-border
          print:break-after-page mb-10 print:mb-0"
          >
            {/* Header (Only show full header on page 1, or repeat on all) */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-black text-indigo-900 leading-none uppercase tracking-tight">
                  STAR HARDWARE & PLYWOOD
                </h1>
                <p className="text-[10px] text-slate-400 mt-2 font-medium max-w-xs leading-relaxed uppercase">
                  AT - LORIYA GROUP, OPP - RAJOSNA BUS STAND, CHHAPI - AHMEDABAD
                  HIGHWAY
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-thin text-slate-300 tracking-tighter">
                  INVOICE
                </h2>
                <p className="text-[10px] text-slate-400 uppercase mt-1">
                  Page {pageIndex + 1} of {productPages.length}
                </p>
              </div>
            </div>

            {/* Client Section (Optionally only on first page) */}
            {pageIndex === 0 && (
              <div className="grid grid-cols-2 gap-10 mt-8 border-b border-slate-50 pb-6">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="text-[9px] font-black text-indigo-900 uppercase tracking-widest mb-1">
                    Billed To
                  </h3>
                  <p className="text-sm font-bold text-slate-900 uppercase">
                    {invoiceDetail?.customer?.firstName}{" "}
                    {invoiceDetail?.customer?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 italic leading-tight">
                    {invoiceDetail?.customer?.address}
                  </p>
                </div>
                <div className="p-4">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Invoice Details
                  </h3>
                  <p className="text-[11px]">
                    No:{" "}
                    <span className="font-bold">
                      {invoiceDetail?.invoice_no}
                    </span>
                  </p>
                  <p className="text-[11px]">
                    Date: {invoiceDetail?.sale_date}
                  </p>
                </div>
              </div>
            )}

            {/* Product Table (Fixed height to ensure consistency) */}
            <div className="mt-6 min-h-[140mm]">
              <table className="w-full border-separate border-spacing-y-1">
                <thead>
                  <tr className="bg-indigo-900 text-white">
                    <th className="text-[9px] uppercase py-3 px-4 text-left rounded-l-lg">
                      #
                    </th>
                    <th className="text-[9px] uppercase py-3 px-4 text-left">
                      Product Description
                    </th>
                    <th className="text-[9px] uppercase py-3 px-4 text-center">
                      Qty
                    </th>
                    <th className="text-[9px] uppercase py-3 px-4 text-right">
                      Price
                    </th>
                    <th className="text-[9px] uppercase py-3 px-4 text-right rounded-r-lg">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b border-slate-50"
                    >
                      <td className="py-3 px-4 text-[10px] text-slate-400 font-bold">
                        {pageIndex * 10 + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                          {item.variant.productName}
                        </p>
                        <p className="text-[8px] text-slate-400 italic font-normal">
                          {item.variant.variant_label}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-center">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-right">
                        ₹{item.variant.price}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-right font-black">
                        ₹{item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Section (Only show summary on the LAST page) */}
            <div className="absolute bottom-12 left-[15mm] right-[15mm]">
              {pageIndex === productPages.length - 1 ? (
                <div className="flex justify-between items-start border-t border-slate-100 pt-6">
                  <div className="w-1/2 pr-10">
                    <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <h4 className="text-[8px] font-black text-slate-400 uppercase mb-1">
                        Notes
                      </h4>
                      <p className="text-[8px] text-slate-500 italic">
                        Certified computer generated invoice.
                      </p>
                    </div>
                  </div>
                  <div className="w-full max-w-[240px] space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase">
                        Grand Total
                      </span>
                      <span className="text-xl text-indigo-900">
                        ₹{invoiceDetail?.grand_total}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center border-t border-slate-100 pt-4">
                  <p className="text-[9px] text-slate-400 italic font-bold uppercase tracking-widest">
                    Continued on Next Page...
                  </p>
                </div>
              )}

              <div className="flex justify-between items-end mt-10">
                <div className="text-[8px] text-slate-400 uppercase tracking-tighter leading-tight">
                  <p>STAR HARDWARE & PLYWOOD - GST Verified</p>
                  <p>Printed: {new Date().toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-200 mb-1"></div>
                  <p className="text-[8px] font-black text-indigo-900 uppercase">
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <style
          dangerouslySetInnerHTML={{
            __html: `
        @media print {
          body { margin: 0; padding: 0; background: white; }
          @page { size: A4; margin: 0; }
          .print\\:break-after-page { page-break-after: always; }
          #invoice-print {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `,
          }}
        />
      </div>
    </>
  );
}
