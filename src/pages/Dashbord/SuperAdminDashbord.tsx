import React from "react";
import { Store, ShieldCheck, TrendingUp } from "lucide-react";
import { getDashbordSate } from "@/api/superAdmin/superAdmin";
import UserDataTable from "@/components/superAdmin/ShopUserDataTable";

// You can pass your API data response directly into this component
const SuperAdminDashbord = () => {
  const [stats, setStats] = React.useState({
    totalShops: 0,
    totalAdmins: 0,
    activeShops: 0,
    newShops: 0,
  });
  const fetchSate = async () => {
    try {
      const res = await getDashbordSate();
      if ((res.status = "OK")) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchSate();
  }, []);

  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Shops Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-500">
              Total Shops
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Store size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {stats.totalShops}
            </h3>
          </div>
        </div>

        {/* Total Admins Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-500">
              Total Admins
            </span>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <ShieldCheck size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {stats.totalAdmins}
            </h3>
          </div>
        </div>

        {/* New Shops Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-500">
              New Shops
            </span>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {stats.newShops}
            </h3>
            <span className="text-[13px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Recently Added
            </span>
          </div>
        </div>
      </div>

      <div>
        <UserDataTable />
      </div>
    </div>
  );
};

export default SuperAdminDashbord;
