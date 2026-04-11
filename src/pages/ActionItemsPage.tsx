import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { useSupabaseActionItems } from "@/hooks/useSupabaseActionItems";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { getActionDetailRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, Circle, Plus, X, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

const STATUSES = ["Open", "In Progress", "Complete", "Done", "Waiting", "On Hold"];
const PRIORITIES = ["High", "Medium", "Low"];

export default function ActionItemsPage() {
  const { actionItems, isLoading, addActionItem, updateActionItem, deleteActionItem } = useSupabaseActionItems();
  const { customers } = useSupabaseCustomers();

  // Merge static + DB
  const staticRows = useMemo(() => { try { return getActionDetailRows(); } catch { return []; } }, []);

  const allItems = useMemo(() => {
    const dbItems = actionItems.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description || "",
      owner: a.owner,
      due_date: a.due_date,
      status: a.status,
      priority: a.priority,
      source: a.source || "manual",
      customer_name: customers.find(c => c.id === a.customer_id)?.customer_name || "Unknown",
      customer_slug: customers.find(c => c.id === a.customer_id)?.slug || "",
      from_db: true,
    }));

    const dbTitles = new Set(dbItems.map(d => d.title));
    const staticItems = staticRows.filter(s => !dbTitles.has(s.description)).map(s => ({
      id: s.action_item_id,
      title: s.description,
      description: s.description,
      owner: s.owner,
      due_date: s.due_date || null,
      status: s.normalizedStatus,
      priority: s.urgency === "high" ? "High" : s.urgency === "medium" ? "Medium" : "Low",
      source: "static",
      customer_name: s.customer_name,
      customer_slug: s.customer_slug,
      from_db: false,
    }));

    return [...dbItems, ...staticItems];
  }, [actionItems, customers, staticRows]);

  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showComplete, setShowComplete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCustomerId, setNewCustomerId] = useState("");

  const owners = Array.from(new Set(allItems.map(r => r.owner))).sort();
  const customerNames = Array.from(new Set(allItems.map(r => r.customer_name))).sort();

  const rows = useMemo(() => allItems.filter(r => {
    if (!showComplete && ["Complete", "Done"].includes(r.status)) return false;
    if (ownerFilter !== "all" && r.owner !== ownerFilter) return false;
    if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    const po = { High: 0, Medium: 1, Low: 2 };
    return (po[a.priority as keyof typeof po] ?? 2) - (po[b.priority as keyof typeof po] ?? 2);
  }), [allItems, query, ownerFilter, customerFilter, statusFilter, priorityFilter, showComplete]);

  const openCount = allItems.filter(r => !["Complete", "Done"].includes(r.status)).length;
  const highCount = allItems.filter(r => r.priority === "High" && !["Complete", "Done"].includes(r.status)).length;
  const overdueCount = allItems.filter(r => r.due_date && new Date(r.due_date) < new Date() && !["Complete", "Done"].includes(r.status)).length;
  const completedCount = allItems.filter(r => ["Complete", "Done"].includes(r.status)).length;

  const toggleComplete = (item: typeof rows[0]) => {
    if (!item.from_db) return;
    const newStatus = ["Complete", "Done"].includes(item.status) ? "Open" : "Complete";
    updateActionItem.mutate({ id: item.id, status: newStatus });
    if (newStatus === "Complete") toast.success(`"${item.title}" marked complete`);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addActionItem.mutate({
      title: newTitle,
      owner: newOwner || "Unassigned",
      due_date: newDue || null,
      priority: newPriority,
      status: "Open",
      customer_id: newCustomerId || null,
      description: null,
      initiative_id: null,
      source: "manual",
      source_id: null,
    });
    setNewTitle(""); setNewOwner(""); setNewDue(""); setNewPriority("Medium"); setNewCustomerId("");
    setShowAdd(false);
  };

  // Charts
  const byOwner: Record<string, number> = {};
  rows.forEach(r => { byOwner[r.owner] = (byOwner[r.owner] || 0) + 1; });
  const ownerData = Object.entries(byOwner).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));

  const byPriority = [
    { name: "High", value: rows.filter(r => r.priority === "High").length, fill: "hsl(0,72%,51%)" },
    { name: "Medium", value: rows.filter(r => r.priority === "Medium").length, fill: "hsl(38,92%,50%)" },
    { name: "Low", value: rows.filter(r => r.priority === "Low").length, fill: "hsl(220,15%,60%)" },
  ].filter(d => d.value > 0);

  const exportExcel = () => downloadCsv("neko-action-items.csv", rows.map(r => ({
    Title: r.title, Customer: r.customer_name, Owner: r.owner, Due: r.due_date || "TBD",
    Priority: r.priority, Status: r.status, Source: r.source,
  })));

  return (
    <AppShell title="Action Center" subtitle="Every action item across the CFS portfolio — interactive and trackable" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="TOTAL" value={allItems.length} />
        <KpiCard label="OPEN" value={openCount} color="text-status-caution" />
        <KpiCard label="HIGH PRIORITY" value={highCount} color="text-destructive" />
        <KpiCard label="OVERDUE" value={overdueCount} color={overdueCount > 0 ? "text-destructive" : ""} />
        <KpiCard label="COMPLETED" value={completedCount} color="text-emerald-500" />
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">By Owner</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">By Priority</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={byPriority} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {byPriority.map(e => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-6 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>
            {customerNames.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}>
            <option value="all">All Owners</option>
            {owners.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={showComplete} onChange={e => setShowComplete(e.target.checked)} className="rounded" />
              Show completed
            </label>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Item"}
          </button>
        </div>
      </section>

      {/* Add Panel */}
      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm print:hidden">
          <div className="grid md:grid-cols-5 gap-3">
            <input className="md:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Action item title *" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Owner" value={newOwner} onChange={e => setNewOwner(e.target.value)} />
            <input type="date" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newDue} onChange={e => setNewDue(e.target.value)} />
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newCustomerId} onChange={e => setNewCustomerId(e.target.value)}>
              <option value="">No Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
            </select>
            <button onClick={handleAdd} disabled={!newTitle.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Add Action Item</button>
          </div>
        </section>
      )}

      {/* Action Items Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b">
            <tr className="text-left text-muted-foreground">
              <th className="py-2.5 px-3 w-8"></th>
              <th className="px-3">Action</th>
              <th className="px-3">Customer</th>
              <th className="px-3">Owner</th>
              <th className="px-3">Due</th>
              <th className="px-3">Priority</th>
              <th className="px-3">Status</th>
              <th className="px-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const overdue = r.due_date && new Date(r.due_date) < new Date() && !["Complete", "Done"].includes(r.status);
              const isComplete = ["Complete", "Done"].includes(r.status);
              return (
                <tr key={r.id} className={`border-b hover:bg-muted/30 transition-colors align-top ${overdue ? "bg-destructive/5" : ""} ${isComplete ? "opacity-60" : ""}`}>
                  <td className="py-2.5 px-3">
                    <button onClick={() => toggleComplete(r)} className={`p-0.5 rounded-full transition-colors ${r.from_db ? "cursor-pointer hover:bg-muted" : "cursor-default opacity-30"}`} disabled={!r.from_db}>
                      {isComplete ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className={`px-3 text-foreground max-w-[350px] ${isComplete ? "line-through" : ""}`}>{r.title}</td>
                  <td className="px-3 text-xs">{r.customer_slug ? <Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline">{r.customer_name}</Link> : r.customer_name}</td>
                  <td className="px-3 text-xs">{r.owner}</td>
                  <td className={`px-3 text-xs ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>{r.due_date || "TBD"}</td>
                  <td className="px-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-3"><StatusBadge status={r.status} /></td>
                  <td className="px-3 text-[10px] text-muted-foreground">{r.source}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">No action items match your filters.</div>
        )}
      </section>
    </AppShell>
  );
}
