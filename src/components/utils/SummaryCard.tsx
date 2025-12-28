import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  bg: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  value,
  label,
  bg,
}) => {
  return (
    <div
      className={`${bg} text-white rounded-md p-5 flex items-center justify-between`}
    >
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-l mt-1 opacity-90">{label}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
};
