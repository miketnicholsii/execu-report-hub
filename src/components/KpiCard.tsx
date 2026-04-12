interface Props {
  label: string;
  value: number | string;
  color?: string;
  sub?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "flat";
}

export default function KpiCard({ label, value, color, sub, icon }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${color ?? "text-foreground"}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}