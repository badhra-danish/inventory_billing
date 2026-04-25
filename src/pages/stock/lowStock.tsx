import { Button } from "@/components/ui/button";

// import { Switch } from "@/components/ui/switch";

import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { RefreshCcw } from "lucide-react";

import LowStockDataTable from "@/components/stock/lowStockDatatable";

function StockMangepage() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Low Stock </p>
          <p>Manage Your Low-Stock</p>
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
      <LowStockDataTable />
    </>
  );
}

export default StockMangepage;
