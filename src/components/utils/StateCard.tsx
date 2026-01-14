import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  amount: string;
  label: string;
  bg?: string;
  bgText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  amount,
  label,
  bg,
  bgText,
}) => {
  return (
    <div
      className={` bg-white shadow-sm  rounded-md p-6 flex items-center gap-5`}
    >
      <div className={`${bg} ${bgText} p-3 rounded-full text-xl`}>{icon}</div>

      <div>
        <p className="text-xl font-medium">{amount}</p>
        <p className="text-gray-500 text-sm leading-tight mt-1">{label}</p>
      </div>
    </div>
  );
};
