import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { getKeyDateRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";

const allRows = getKeyDateRows();

export default function KeyDatesPage() {
  const [customerFilter, setCustomerFilter] = useState("all");
  const [confFilter, setConfFilter] = useState("all");
  const customers = Array.from(new Set(allRows.map((r) => r.customer))).sort();

  const rows = useMemo(() => allRows.filter((r) => {
    if (customerFilter !== "all" && r.customer !== customerFilter) return false;
    if (confFilter !== "all" && r.confidence !== confFilter) return false;
    return true;
  }), [customerFilter, confFilter]);

  const pastDue = rows.filter((r) => r.isPast).length;
  const vague = rows.filter((r) => r.isVague).length;

  const exportExcel = () => downloadCsv("cfs-key-dates.csv", rows.map((r) => ({
    Customer: r.customer, Project: r.project, Milestone: r.milestone,
    Date: r.date ?? "TBD", Display_Date: r.displayDate, Confidence: r.confidence,
    Is_Past: r.isPast ? "Yes" : "No",
  })));

  return (
    <AppShell title="Key Dates" subtitle="All milestones and deadlines" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Dates" value={rows.length} />
        <KpiCard label="Past Due" value={pastDue} color="text-destructive" />
        <KpiCard label="Vague / TBD" value={vague} color="text-status-caution" />
        <KpiCard label="High Confidence" value={rows.filter((r) => r.confidence === "high").length} color="text-status-on-track" />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-2 gap-2">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>{customers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={confFilter} onChange={(e) => setConfFilter(e.target.value)}>
            <option value="all">All Confidence</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2.5 px-3">Customer</th><th className="px-3">Project</th><th className="px-3">Milestone</th><th className="px-3">Date</th><th className="px-3">Confidence</th><th className="px-3">Status</th>
          </tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className={`border-b hover:bg-muted/30 transition-colors ${r.isPast ? "bg-destructive/5" : ""}`}>
              <td className="py-2.5 px-3 font-medium">{r.customer}</td>
              <td className="px-3 text-xs">{r.project}</td>
              <td className="px-3">{r.milestone}</td>
              <td className="px-3 text-xs">{r.displayDate}</td>
              <td className="px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                  r.confidence === "high" ? "bg-status-on-track/15 text-status-on-track border-status-on-track/30" :
                  r.confidence === "medium" ? "bg-status-caution/15 text-status-caution border-status-caution/30" :
                  "bg-muted text-muted-foreground border-border"
                }`}>{r.confidence}</span>
              </td>
              <td className="px-3 text-xs">{r.isPast ? <span className="text-destructive font-medium">Past</span> : r.isVague ? <span className="text-status-caution">Estimated</span> : <span className="text-status-on-track">Upcoming</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </AppShell>
  );
}
