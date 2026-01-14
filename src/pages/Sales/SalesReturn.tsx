// import React from "react";
import { Button } from "@/components/ui/button";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { CirclePlus, RefreshCcw } from "lucide-react";
import SalesReturnDataTable from "@/components/Sales/SalesReturnDatatable";
// import {
//   Dialog,
//   DialogFooter,
//   DialogHeader,
//   DialogTrigger,
//   DialogContent,
// } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
function Sales() {
  const navigate = useNavigate();
  // const [open, setOpen] = React.useState(false);
  // const [refresh, setRefresh] = React.useState(false);
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Sales Return</p>
          <p>Manage Your Sales Return</p>
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
          <Button onClick={() => navigate("/add-sales-return")}>
            <CirclePlus />
            Add Sales Return
          </Button>
        </div>
      </div>
      <SalesReturnDataTable />
    </>
  );
}

export default Sales;
