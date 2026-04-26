import { StatCard } from "@/components/utils/StateCard";
import { SummaryCard } from "@/components/utils/SummaryCard";
import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  BadgeIndianRupee,
  ReceiptText,
  ScrollText,
  ShoppingBag,
  User,
  UserCheck,
} from "lucide-react";
import SalesPurchaseChart from "@/components/utils/SalesPurchaseChart";
import InvoiceDataTable from "@/components/Sales/InvoiceDataTable";
import React, { use } from "react";
import { getShopAdminStats } from "@/api/superAdmin/superAdmin";
function Dashboard() {
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalPurchase: 0,
    totalSalesDue: 0,
    totalPurchaseDue: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalSalesInvoices: 0,
    totalPurchaseInvoices: 0,
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?.shop_id) return;
      const res = await getShopAdminStats(user?.shop_id);

      if (res.status === "OK") {
        setStats(res.data);
      }
    };

    fetchStats();
  }, []);
  return (
    <>
      <div className="space-y-8">
        {/* Professional Header Section */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="text-blue-600">Shop Admin</span> 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here is what’s happening with your shop today,{" "}
            <span className="font-semibold text-blue-900/70 dark:text-blue-300/70">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            .
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard
            icon={<ShoppingBag />}
            amount={stats.totalPurchaseDue.toString()}
            label="Total Purchase Due"
            bg="bg-orange-100"
            bgText="text-orange-600"
          />
          <StatCard
            icon={<BadgeIndianRupee />}
            amount={stats.totalSalesDue.toString()}
            label="Total Sales Due"
            bg="bg-green-100"
            bgText="text-green-600"
          />
          <StatCard
            icon={<ArrowDownFromLine />}
            amount={stats.totalPurchase.toString()}
            label="Total Purchase"
            bg="bg-blue-100"
            bgText="text-blue-600"
          />
          <StatCard
            icon={<ArrowUpFromLine />}
            amount={stats.totalSales.toString()}
            label="Total Sales"
            bg="bg-red-100"
            bgText="text-red-600"
          />
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            icon={<User className="w-12 h-12" />}
            value={stats.totalSuppliers.toString()}
            label="Suppliers"
            bg="bg-orange-300"
          />
          <SummaryCard
            icon={<UserCheck className="w-12 h-12" />}
            value={stats.totalCustomers.toString()}
            label="Customers"
            bg="bg-blue-400"
          />
          <SummaryCard
            icon={<ScrollText className="w-12 h-12" />}
            value={stats.totalPurchaseInvoices.toString()}
            label="Purchase Invoice"
            bg="bg-blue-900"
          />
          <SummaryCard
            icon={<ReceiptText className="w-12 h-12" />}
            value={stats.totalSalesInvoices.toString()}
            label="Sales Invoice"
            bg="bg-green-500"
          />
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800">
          <div className="text-xl pb-4 border-b border-gray-100 dark:border-neutral-800 mb-5 font-semibold">
            <p>Purchase & Sales Analytics</p>
          </div>
          <SalesPurchaseChart />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
          <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
            <p className="font-semibold text-xl text-gray-900 dark:text-white">
              Recent Invoices
            </p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <InvoiceDataTable />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
