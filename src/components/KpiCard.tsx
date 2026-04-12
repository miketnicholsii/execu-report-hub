import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  color?: string;
  sub?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  pulse?: boolean;
}

export default function KpiCard({ label, value, color, sub, icon, trend, pulse }: Props) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <p className="metric-label leading-tight">{label}</p>
        <div className="flex items-center gap-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-status-on-track" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
          {trend === "flat" && <Minus className="h-3 w-3 text-muted-foreground" />}
          {icon && <span className="text-muted-foreground/60">{icon}</span>}
        </div>
      </div>
      <p className={`mt-2 metric-value ${color ?? "text-foreground"} ${pulse ? "animate-pulse-subtle" : ""}`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{sub}</p>}
    </div>
  );
}
