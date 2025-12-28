import type { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: { value: number }[];
  label?: string | number;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",

          //padding: "10px 12px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            marginBottom: 6,
            opacity: 0.85,
            backgroundColor: "#E5E7EB",
            padding: "5px 10px",
          }}
        >
          {label}
        </p>

        <p style={{ margin: 0, color: "#22C55E", padding: "5px 10px" }}>
          ● Sales: <b>{payload[0].value}</b>
        </p>

        <p style={{ margin: 0, color: "#EF4444", padding: "5px 10px" }}>
          ● Purchase: <b>{payload[1].value}</b>
        </p>
      </div>
    );
  }
  return null;
};
