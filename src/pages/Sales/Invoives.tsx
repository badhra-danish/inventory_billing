import { Button } from "@/components/ui/button";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { RefreshCcw } from "lucide-react";
// import {
//   Dialog,
//   DialogFooter,
//   DialogHeader,
//   DialogTrigger,
//   DialogContent,
// } from "@/components/ui/dialog";
import InvoiceDataTable from "@/components/Sales/InvoiceDataTable";
function Sales() {
  // const [open, setOpen] = React.useState(false);
  // const [refresh, setRefresh] = React.useState(false);
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Invoice </p>
          <p>Manage Your Sales Invoice</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={pdfImg} className="w-5 h-6" />
          </Button>
          <Button className="bg-white border-1 border-gray p-2 hover:bg-gray-100">
            <img src={xslImg} className="w-5 h-6" />
          </Button>
          <Button className="bg-white text-gray-600 border-1 border-gray p-2 hover:bg-gray-100">
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <InvoiceDataTable />
    </>
  );
}

export default Sales;
