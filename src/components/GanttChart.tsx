import { useMemo } from "react";

interface GanttItem {
  id: string;
  label: string;
  customer?: string;
  startDate: string | null;
  endDate: string | null;
  milestones?: { date: string; label: string }[];
  percentComplete?: number;
  status?: string;
  owner?: string;
}

interface Props {
  items: GanttItem[];
  title?: string;
}

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "hsl(var(--primary))",
  "Testing": "hsl(var(--status-caution))",
  "Planning": "hsl(var(--muted-foreground))",
  "Live": "hsl(var(--status-on-track))",
  "Post-Implementation": "hsl(var(--status-on-track))",
  "Complete": "hsl(var(--status-on-track))",
  "Blocked": "hsl(var(--destructive))",
  "Discovery": "hsl(var(--status-info))",
};

export default function GanttChart({ items, title }: Props) {
  const { chartItems, startMs, endMs, months } = useMemo(() => {
    const now = new Date();
    const validItems = items.filter((i) => i.startDate || i.endDate);
    if (!validItems.length) return { chartItems: [], startMs: 0, endMs: 0, months: [] };

    const dates = validItems.flatMap((i) => [i.startDate, i.endDate].filter(Boolean).map((d) => new Date(d!).getTime()));
    const milDates = validItems.flatMap((i) => (i.milestones ?? []).map((m) => new Date(m.date).getTime()));
    const allDates = [...dates, ...milDates, now.getTime()];
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const pad = (maxDate - minDate) * 0.05 || 86400000 * 30;
    const s = minDate - pad;
    const e = maxDate + pad;

    const ms: { label: string; x: number }[] = [];
    const d = new Date(s);
    d.setDate(1);
    while (d.getTime() < e) {
      const x = ((d.getTime() - s) / (e - s)) * 100;
      ms.push({ label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }), x });
      d.setMonth(d.getMonth() + 1);
    }

    return { chartItems: validItems, startMs: s, endMs: e, months: ms };
  }, [items]);

  if (!chartItems.length) return null;

  const range = endMs - startMs;
  const toX = (dateStr: string) => ((new Date(dateStr).getTime() - startMs) / range) * 100;
  const nowX = ((Date.now() - startMs) / range) * 100;
  const rowH = 36;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm overflow-x-auto">
      {title && <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>}
      <div className="relative" style={{ minHeight: chartItems.length * rowH + 40 }}>
        {/* Month lines */}
        {months.map((m, i) => (
          <div key={i} className="absolute top-0 bottom-0" style={{ left: `${m.x}%` }}>
            <div className="absolute -top-0 text-[10px] text-muted-foreground whitespace-nowrap" style={{ transform: "translateX(-50%)" }}>{m.label}</div>
            <div className="absolute top-4 bottom-0 border-l border-border/40" />
          </div>
        ))}
        {/* Today line */}
        <div className="absolute top-4 bottom-0 border-l-2 border-primary/40 z-10" style={{ left: `${nowX}%` }}>
          <div className="absolute -top-4 text-[9px] text-primary font-medium whitespace-nowrap" style={{ transform: "translateX(-50%)" }}>Today</div>
        </div>
        {/* Bars */}
        <div className="pt-5 relative">
          {chartItems.map((item, idx) => {
            const x1 = item.startDate ? toX(item.startDate) : toX(item.endDate!);
            const x2 = item.endDate ? toX(item.endDate) : x1 + 2;
            const width = Math.max(x2 - x1, 1);
            const color = STATUS_COLORS[item.status ?? ""] || "hsl(var(--primary))";
            const pct = item.percentComplete ?? 0;
            return (
              <div key={item.id} className="relative flex items-center" style={{ height: rowH }}>
                <div className="absolute left-0 text-xs text-foreground font-medium truncate pr-2 z-10" style={{ maxWidth: "25%" }}>{item.label}</div>
                <div className="absolute h-5 rounded-full opacity-20" style={{ left: `${x1}%`, width: `${width}%`, backgroundColor: color }} />
                <div className="absolute h-5 rounded-full" style={{ left: `${x1}%`, width: `${width * (pct / 100)}%`, backgroundColor: color }} />
                {/* Milestones */}
                {(item.milestones ?? []).map((m, mi) => {
                  const mx = toX(m.date);
                  return <div key={mi} className="absolute w-2.5 h-2.5 rounded-full bg-primary border-2 border-card z-20" style={{ left: `${mx}%`, top: "50%", transform: "translate(-50%, -50%)" }} title={`${m.label}: ${m.date}`} />;
                })}
                {item.owner && (
                  <div className="absolute text-[10px] text-muted-foreground" style={{ left: `${Math.min(x1 + width + 0.5, 95)}%`, top: "50%", transform: "translateY(-50%)" }}>{item.owner}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
