import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import CopyButton, { rowsToTsv } from "@/components/CopyButton";
import { getTrackerRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";

const allRows = getTrackerRows();

export default function TrackerPage() {
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [showComplete, setShowComplete] = useState(false);

  const customers = Array.from(new Set(allRows.map((r) => r.customer_name))).sort();
  const statuses = Array.from(new Set(allRows.map((r) => r.status))).sort();
  const priorities = Array.from(new Set(allRows.map((r) => r.priority))).sort();
  const owners = Array.from(new Set(allRows.map((r) => r.owner))).sort();

  const rows = useMemo(() => {
    return allRows.filter((r) => {
      if (!showComplete && ["Complete", "Deployed", "Shipped"].includes(r.status)) return false;
      if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
      if (ownerFilter !== "all" && r.owner !== ownerFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return r.topic.toLowerCase().includes(q) || (r.rm_reference || "").toLowerCase().includes(q) || (r.context || "").toLowerCase().includes(q) || (r.notes || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, customerFilter, statusFilter, priorityFilter, ownerFilter, showComplete]);

  const openCount = rows.filter((r) => !["Complete", "Deployed", "Shipped"].includes(r.status)).length;
  const highCount = rows.filter((r) => r.priority === "High" || r.priority === "Highest").length;

  const exportExcel = () => downloadCsv("cfs-issue-tracker.csv", rows.map((r) => ({
    Customer: r.customer_name, Project: r.project_name, Priority: r.priority,
    Topic: r.topic, RM_Reference: r.rm_reference ?? "", Status: r.status,
    Context: r.context ?? "", Last_Update: r.last_update ?? "", Target_ETA: r.target_eta ?? "",
    Notes: r.notes ?? "", Next_Steps: r.next_steps ?? "", Owner: r.owner,
  })));

  return (
    <AppShell title="Issue Tracker" subtitle="All tracked items across customers" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Showing" value={rows.length} sub={`of ${allRows.length} total`} />
        <KpiCard label="Open" value={openCount} color="text-status-caution" />
        <KpiCard label="High / Highest" value={highCount} color="text-destructive" />
        <KpiCard label="Customers" value={customers.length} />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm col-span-2" placeholder="Search topic, RM#, notes..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>{customers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>{priorities.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="all">All Owners</option>{owners.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 mt-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={showComplete} onChange={(e) => setShowComplete(e.target.checked)} className="rounded" />
          Show completed items
        </label>
      </section>

      {/* Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b">
            <tr className="text-left text-muted-foreground">
              <th className="py-2.5 px-3">Priority</th><th className="px-3">Customer</th><th className="px-3">Topic</th>
              <th className="px-3">RM#</th><th className="px-3">Status</th><th className="px-3">Owner</th>
              <th className="px-3">Last Update</th><th className="px-3">ETA</th><th className="px-3">Next Steps</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.item_id} className="border-b hover:bg-muted/30 transition-colors align-top">
                <td className="py-2.5 px-3"><PriorityBadge priority={r.priority} /></td>
                <td className="px-3"><Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline text-xs">{r.customer_name}</Link></td>
                <td className="px-3 max-w-[280px]">
                  <div className="font-medium text-foreground">{r.topic}</div>
                  {r.context && <div className="text-xs text-muted-foreground mt-0.5">{r.context}</div>}
                  {r.notes && <div className="text-xs text-muted-foreground/70 mt-0.5 italic">{r.notes}</div>}
                </td>
                <td className="px-3 font-mono text-xs">{r.rm_reference ?? "—"}</td>
                <td className="px-3"><StatusBadge status={r.status} /></td>
                <td className="px-3 text-xs">{r.owner}</td>
                <td className="px-3 text-xs text-muted-foreground">{r.last_update ?? "—"}</td>
                <td className="px-3 text-xs text-muted-foreground">{r.target_eta ?? "—"}</td>
                <td className="px-3 text-xs max-w-[200px]">{r.next_steps ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No items match filters.</p>}
      </section>
    </AppShell>
  );
}
