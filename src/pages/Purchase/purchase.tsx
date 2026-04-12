import { Button } from "@/components/ui/button";
import pdfImg from "../../assets/images/pdf.jpg";
import xslImg from "../../assets/images/xls.png";
import { CirclePlus, IndianRupee, Receipt, RefreshCcw } from "lucide-react";
// import {
//   Dialog,
//   DialogFooter,
//   DialogHeader,
//   DialogTrigger,
//   DialogContent,
// } from "@/components/ui/dialog";
import PurchaseDataTable from "@/components/Purchase/PurchaseDataTable";
import { useNavigate } from "react-router-dom";

export default function Purchase() {
  const navigate = useNavigate();

  const kpiData = [
    {
      title: "Total Amount ",
      value: "$45,231",
      icon: IndianRupee,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Collected",
      value: "356",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Due",
      value: "$127.05",
      icon: IndianRupee,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Total Purchase",
      value: "12",
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // const [open, setOpen] = React.useState(false);
  // const [refresh, setRefresh] = React.useState(false);
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold text-xl">Purchase </p>
          <p>Manage Your Purchase Order</p>
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
          <Button onClick={() => navigate("/shop/add-purchase")}>
            <CirclePlus />
            Add Purchase
          </Button>
        </div>
      </div>
      {/* Added KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-blue-50/100 p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md"
            >
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {kpi.title}
                </p>
                <h3
                  className={`text-2xl font-bold  text-gray-800 ${kpi.color}`}
                >
                  {kpi.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${kpi.bgColor} ${kpi.color}`}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>
      <PurchaseDataTable />
    </>
  );
}
