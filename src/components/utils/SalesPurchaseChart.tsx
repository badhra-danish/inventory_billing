import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Line,
} from "recharts";
import { CustomTooltip } from "./CustomtoolTipCharts";
type SalesData = {
  month: string;
  sales: number;
  purchase: number;
};

const data: SalesData[] = [
  { month: "Jan", sales: 4000, purchase: 2400 },
  { month: "Feb", sales: 3000, purchase: 2210 },
  { month: "Mar", sales: 5000, purchase: 2900 },
  { month: "Apr", sales: 4780, purchase: 2500 },
  { month: "May", sales: 5890, purchase: 3200 },
  { month: "Jun", sales: 6390, purchase: 4000 },
  { month: "Jul", sales: 4290, purchase: 1000 },
];

const SalesPurchaseChart: React.FC = () => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="sales" fill="#16A34A" name="Sales" />
          {/* <Bar dataKey="purchase" fill="#DC2626" name="Purchase" /> */}
          <Line
            type="monotone"
            dataKey="purchase"
            stroke="#DC2626"
            strokeWidth={3}
            name="Purchase"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchaseChart;
