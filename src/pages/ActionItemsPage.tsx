import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge, PriorityBadge, UrgencyBadge } from "@/components/StatusBadge";
import { EditableText, EditableSelect } from "@/components/EditableCell";
import { getActionDetailRows, seed, customerById } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, Clock, Filter, SortAsc } from "lucide-react";

const allRows = getActionDetailRows();

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

export default function ActionItemsPage() {
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"urgency" | "owner" | "customer" | "due">("urgency");

  const owners = Array.from(new Set(allRows.map((r) => r.owner))).sort();
  const customers = Array.from(new Set(allRows.map((r) => r.customer_name))).sort();

  const rows = useMemo(() => {
    let filtered = allRows.filter((r) => {
      if (ownerFilter !== "all" && r.owner !== ownerFilter) return false;
      if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
      if (urgencyFilter !== "all" && (r.urgency ?? "normal") !== urgencyFilter) return false;
      if (statusFilter !== "all" && r.normalizedStatus !== statusFilter) return false;
      if (query) return r.description.toLowerCase().includes(query.toLowerCase());
      return true;
    });
    // Sort
    if (sortBy === "urgency") filtered.sort((a, b) => { const o = { high: 0, medium: 1, normal: 2 }; return (o[(a.urgency as keyof typeof o) ?? "normal"] ?? 2) - (o[(b.urgency as keyof typeof o) ?? "normal"] ?? 2); });
    else if (sortBy === "owner") filtered.sort((a, b) => a.owner.localeCompare(b.owner));
    else if (sortBy === "customer") filtered.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
    else if (sortBy === "due") filtered.sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
    return filtered;
  }, [query, ownerFilter, customerFilter, urgencyFilter, statusFilter, sortBy]);

  const highCount = rows.filter((r) => r.urgency === "high").length;
  const overdueCount = rows.filter((r) => r.due_date && new Date(r.due_date) < new Date()).length;
  const openCount = rows.filter((r) => !["Complete", "Done"].includes(r.normalizedStatus)).length;

  // Charts
  const byOwner: Record<string, number> = {};
  rows.forEach((r) => { byOwner[r.owner] = (byOwner[r.owner] || 0) + 1; });
  const ownerData = Object.entries(byOwner).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  const byUrgency = [
    { name: "High", value: rows.filter((r) => r.urgency === "high").length, fill: "hsl(0,72%,51%)" },
    { name: "Medium", value: rows.filter((r) => r.urgency === "medium").length, fill: "hsl(38,92%,50%)" },
    { name: "Normal", value: rows.filter((r) => !r.urgency || r.urgency === "normal").length, fill: "hsl(220,15%,60%)" },
  ].filter((d) => d.value > 0);

  const exportExcel = () => downloadCsv("cfs-action-items.csv", rows.map((r) => ({
    Customer: r.customer_name, Project: r.project_name, Description: r.description,
    Owner: r.owner, Due_Date: r.due_date ?? "TBD", Urgency: r.urgency ?? "normal",
    Status: r.normalizedStatus, Days_Open: daysSince(r.due_date) ?? "",
  })));

  return (
    <AppShell title="Action Center — Hit List" subtitle="Every action item across the CFS portfolio" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Total Actions" value={rows.length} />
        <KpiCard label="Open" value={openCount} color="text-status-caution" />
        <KpiCard label="High Urgency" value={highCount} color="text-destructive" />
        <KpiCard label="Overdue" value={overdueCount} color={overdueCount > 0 ? "text-destructive" : ""} />
        <KpiCard label="Owners" value={owners.length} />
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions by Owner</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(220,70%,50%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions by Urgency</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={byUrgency} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {byUrgency.map((e) => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-6 gap-2">
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
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option><option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Complete">Complete</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="urgency">Sort: Urgency</option><option value="owner">Sort: Owner</option><option value="customer">Sort: Customer</option><option value="due">Sort: Due Date</option>
          </select>
        </div>
      </section>

      {/* Action Items Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2.5 px-3">Customer</th><th className="px-3">Project</th><th className="px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Urgency</th><th className="px-3">Status</th><th className="px-3">Age</th>
          </tr></thead>
          <tbody>{rows.map((r) => {
            const age = daysSince(r.due_date);
            const overdue = r.due_date && new Date(r.due_date) < new Date();
            return (
              <tr key={r.action_item_id} className={`border-b hover:bg-muted/30 transition-colors align-top ${overdue ? "bg-destructive/5" : ""}`}>
                <td className="py-2.5 px-3"><Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline text-xs">{r.customer_name}</Link></td>
                <td className="px-3 text-xs">{r.project_name}</td>
                <td className="px-3 text-foreground max-w-[300px]">
                  <EditableText entityId={r.action_item_id} field="description" defaultValue={r.description} />
                </td>
                <td className="px-3 text-xs">
                  <EditableText entityId={r.action_item_id} field="owner" defaultValue={r.owner} />
                </td>
                <td className={`px-3 text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>{r.due_date ?? "TBD"}</td>
                <td className="px-3"><UrgencyBadge urgency={r.urgency ?? "normal"} /></td>
                <td className="px-3">
                  <EditableSelect entityId={r.action_item_id} field="status" defaultValue={r.normalizedStatus} options={["Open", "In Progress", "Complete", "Done", "Waiting", "On Hold"]} renderBadge={(v) => <StatusBadge status={v} />} />
                </td>
                <td className="px-3 text-xs text-muted-foreground">
                  {age !== null && <span className={age > 14 ? "text-destructive font-medium" : age > 7 ? "text-status-caution" : ""}>{age}d</span>}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </section>
    </AppShell>
  );
}
