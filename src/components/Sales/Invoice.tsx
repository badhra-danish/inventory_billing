import React from "react";
import { useParams } from "react-router-dom";
import { getSaleById } from "@/api/Sales/SalesClient";
import type { SalesDetail, SalesItemDetail } from "./SalesDataTable";
import { Printer, Download, Mail, CheckCircle2 } from "lucide-react"; // Professional Icons

export default function ProfessionalInvoice() {
  const { sale_id } = useParams();
  const [invoiceDetail, setInvoiceDetails] = React.useState<SalesDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  const getAllIvoiceInfo = async () => {
    try {
      if (!sale_id) return;
      const res = await getSaleById(sale_id);
      if (res.status === "OK") {
        setInvoiceDetails(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllIvoiceInfo();
  }, [sale_id]);

  const users = JSON.parse(localStorage.getItem("user") || "{}");

  const paginateItems = (items: SalesItemDetail[], itemsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      pages.push(items.slice(i, i + itemsPerPage));
    }
    return pages;
  };

  const productPages = paginateItems(invoiceDetail?.sales_items || [], 10);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Invoice...</div>;

  return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 print:bg-white print:p-0">
        {/* --- INTERACTIVE ACTION BAR --- */}
        <div className="mx-auto mb-8 flex max-w-[210mm] items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-200 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Invoice {invoiceDetail?.invoice_no}</h2>
              <p className="text-xs text-slate-500">Status: <span className="text-green-600 font-semibold">{invoiceDetail?.payment_status}</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Mail size={14} /> Email
            </button>
            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-none transition-all"
            >
              <Printer size={14} /> Print Invoice
            </button>
          </div>
        </div>

        {/* --- INVOICE PAGES --- */}
        {productPages.map((pageItems, pageIndex) => (
            <div
                key={pageIndex}
                className="invoice-page relative mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] box-border print:shadow-nonex`x``  x x x "
            >
              {/* Header */}
              <div className="flex justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                    {users?.shop?.shop_name?.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                      {users?.shop?.shop_name}
                    </h1>
                    <p className="max-w-[250px] text-[10px] leading-relaxed text-slate-500 font-medium">
                      {users?.shop?.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">

                  <h2 className="text-4xl font-light tracking-tighter text-slate-200">INVOICE</h2> <div className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  {invoiceDetail?.invoice_no}
                </div>
                  <p className="text-[10px] text-slate-400 mt-1">Page {pageIndex + 1} of {productPages.length}</p>
                </div>
              </div>

              {/* Client & Date Info */}
              {pageIndex === 0 && (
                  <div className="mt-12 grid grid-cols-3 gap-8 border-y border-slate-100 py-8">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Billed To</p>
                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {invoiceDetail?.customer?.firstName} {invoiceDetail?.customer?.lastName}
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                        {invoiceDetail?.customer?.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Date of Issue</p>
                      <p className="mt-2 text-sm font-bold text-slate-900">{invoiceDetail?.sale_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Amount Due</p>
                      <p className="mt-1 text-2xl font-black text-indigo-600 tracking-tight">
                        ₹{invoiceDetail?.grand_total?.toLocaleString()}
                      </p>
                    </div>
                  </div>
              )}

              {/* Table */}
              <div className="mt-8 min-h-[160mm]">
                <table className="w-full print:break-inside-avoid">
                  <thead>
                  <tr className="border-b border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="pb-4 text-left font-bold">#</th>
                    <th className="pb-4 text-left">Description</th>
                    <th className="pb-4 text-center">Qty</th>
                    <th className="pb-4 text-right">Unit Price</th>
                    <th className="pb-4 text-right">Total</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                  {pageItems.map((item, index) => (
                      <tr key={index} className="group transition-colors hover:bg-slate-50/50">
                        <td className="py-4 text-[10px] font-medium text-slate-400">
                          {String(pageIndex * 10 + index + 1).padStart(2, "0")}
                        </td>
                        <td className="py-4">
                          <p className="text-xs font-bold text-slate-800">{item.variant.productName}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{item.variant.variant_label}</p>
                        </td>
                        <td className="py-4 text-center text-[10px] font-medium text-slate-600">{item.quantity}</td>
                        <td className="py-4 text-right text-[10px] font-medium text-slate-600">₹{item.variant.price}</td>
                        <td className="py-4 text-right text-xs font-bold text-slate-900">₹{item.total}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="invoice-footer mt-12 print:absolute print:bottom-[15mm] print:left-[15mm] print:right-[15mm]">
                {pageIndex === productPages.length - 1 ? (
                    <div className="flex items-end justify-between rounded-2xl bg-slate-900 p-8 text-white shadow-xl">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Terms & Conditions</p>
                        <p className="mt-2 text-[8px] leading-relaxed text-slate-300 max-w-[300px]">
                          This is a computer-generated document. No signature is required. Please quote invoice number for all future correspondence.
                        </p>
                      </div>
                      <div className="w-full max-w-[200px] space-y-3">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Subtotal</span>
                          <span>₹{invoiceDetail?.sub_total}</span>
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Tax (%)</span>
                          <span>{invoiceDetail?.order_tax}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                           <span>Tax Amt </span>
                          <span>{invoiceDetail?.sub_total * invoiceDetail?.order_tax / 100}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Discount</span>
                          <span> - {invoiceDetail?.discount}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Shipping</span>
                          <span> {invoiceDetail?.shipping}</span>
                        </div>
                        <div className="h-px bg-slate-800" />
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Total</span>
                          <span className="text-2xl font-black">₹{invoiceDetail?.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center border-t border-slate-100 py-6">
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">Continued on Page {pageIndex + 2}...</p>
                    </div>
                )}
              </div>
            </div>
        ))}

        <style
            dangerouslySetInnerHTML={{
              __html: `
      @page {
        size: A4;
        margin: 0;
      }

      @media print {
        html, body {
          width: 230mm;
          height: auto;
          margin: 0;
          padding: 0;
          background: #ffffff;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body * {
          visibility: hidden;
        }

        .invoice-page, .invoice-page * {
          visibility: visible;
        }

        .invoice-page {
          position: relative;
          width: 200mm;
          min-height: 297mm;
          margin: 0 auto;
          page-break-after: always;
          break-after: page;
        }

        .invoice-footer {
          position: absolute;
          bottom: 10mm;
          left: 15mm;
          right: 15mm;
        }

        table, tr, td, th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .print\\:hidden {
          display: none !important;
        }
      }
    `,
            }}
        />


      </div>
  );
}