import { UpcomingDate } from "@/data/types";

interface Props {
  dates: UpcomingDate[];
}

const typeColors: Record<string, string> = {
  "Go-Live": "bg-[hsl(var(--phase-golive-bg))] text-[hsl(var(--phase-golive))]",
  Training: "bg-[hsl(var(--phase-planning-bg))] text-[hsl(var(--phase-planning))]",
  Install: "bg-[hsl(var(--phase-development-bg))] text-[hsl(var(--phase-development))]",
  Milestone: "bg-status-info-bg text-status-info",
  Deployment: "bg-[hsl(var(--phase-testing-bg))] text-[hsl(var(--phase-testing))]",
  Renewal: "bg-status-caution-bg text-status-caution",
};

export default function UpcomingDatesTable({ dates }: Props) {
  return (
    <section className="print-avoid-break">
      <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Key Dates</h2>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Topic</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((d, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-foreground">{d.customer}</td>
                  <td className="p-3 text-foreground">{d.topic}</td>
                  <td className="p-3 text-foreground whitespace-nowrap">{d.date}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColors[d.type] || "bg-secondary text-secondary-foreground"}`}>
                      {d.type}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{d.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
