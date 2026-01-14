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
function Dashboard() {
  return (
    <>
      <div>
        <div className="p-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatCard
              icon={<ShoppingBag />}
              amount="$307144"
              label="Total Purchase Due"
              bg="bg-orange-100"
              bgText="text-orange-600"
            />
            <StatCard
              icon={<BadgeIndianRupee />}
              amount="$307144"
              label="Total Purchase Due"
              bg="bg-green-100"
              bgText="text-green-600"
            />
            <StatCard
              icon={<ArrowDownFromLine />}
              amount="$307144"
              label="Total Purchase Due"
              bg="bg-blue-100"
              bgText="text-blue-600"
            />
            <StatCard
              icon={<ArrowUpFromLine />}
              amount="$307144"
              label="Total Purchase Due"
              bg="bg-red-100"
              bgText="text-red-600"
            />
          </div>
          <div className="grid grid-cols-1  md:grid-cols-4 gap-4 ">
            <SummaryCard
              icon={<User className="w-12 h-12" />}
              value="100"
              label="Suppliers"
              bg="bg-orange-300"
            />
            <SummaryCard
              icon={<UserCheck className="w-12 h-12" />}
              value="110"
              label="Customers"
              bg="bg-blue-400"
            />
            <SummaryCard
              icon={<ScrollText className="w-12 h-12" />}
              value="150"
              label="Purchase Invoice"
              bg="bg-blue-900"
            />
            <SummaryCard
              icon={<ReceiptText className="w-12 h-12" />}
              value="170"
              label="Sales Invoice"
              bg="bg-green-500"
            />
          </div>
          <div className="p-6 bg-white rounded-md w-full  shadow  dark:bg-neutral-900">
            <div className="text-xl pb-4 border-b-2 mb-5 font-semibold">
              <p>Purchase & Sales</p>
            </div>
            <SalesPurchaseChart />
          </div>
          <div>
            <div className="bg-white p-4 rounded-md font-semibold text-xl border-b-2">
              <p>Recent Invoices</p>
            </div>
            <InvoiceDataTable />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
