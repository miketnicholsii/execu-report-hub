import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { getActionDetailRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";

const allRows = getActionDetailRows();

export default function ActionItemsPage() {
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const owners = Array.from(new Set(allRows.map((r) => r.owner))).sort();
  const customers = Array.from(new Set(allRows.map((r) => r.customer_name))).sort();

  const rows = useMemo(() => allRows.filter((r) => {
    if (ownerFilter !== "all" && r.owner !== ownerFilter) return false;
    if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
    if (urgencyFilter !== "all" && (r.urgency ?? "normal") !== urgencyFilter) return false;
    if (query) return r.description.toLowerCase().includes(query.toLowerCase());
    return true;
  }), [query, ownerFilter, customerFilter, urgencyFilter]);

  const highCount = rows.filter((r) => r.urgency === "high").length;

  const exportExcel = () => downloadCsv("cfs-action-items.csv", rows.map((r) => ({
    Customer: r.customer_name, Project: r.project_name, Description: r.description,
    Owner: r.owner, Due_Date: r.due_date ?? "TBD", Urgency: r.urgency ?? "normal",
  })));

  return (
    <AppShell title="Action Center" subtitle="All action items across the portfolio" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Actions" value={rows.length} />
        <KpiCard label="High Urgency" value={highCount} color="text-destructive" />
        <KpiCard label="Owners" value={owners.length} />
        <KpiCard label="Customers" value={customers.length} />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search actions..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>{customers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="all">All Owners</option>{owners.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
            <option value="all">All Urgency</option><option value="high">High</option><option value="medium">Medium</option><option value="normal">Normal</option>
          </select>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2.5 px-3">Customer</th><th className="px-3">Project</th><th className="px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Urgency</th>
          </tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.action_item_id} className="border-b hover:bg-muted/30 transition-colors align-top">
              <td className="py-2.5 px-3"><Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline text-xs">{r.customer_name}</Link></td>
              <td className="px-3 text-xs">{r.project_name}</td>
              <td className="px-3 text-foreground">{r.description}</td>
              <td className="px-3">{r.owner}</td>
              <td className="px-3 text-xs text-muted-foreground">{r.due_date ?? "TBD"}</td>
              <td className="px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${r.urgency === "high" ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-muted text-muted-foreground border-border"}`}>
                  {r.urgency ?? "normal"}
                </span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </AppShell>
  );
}
