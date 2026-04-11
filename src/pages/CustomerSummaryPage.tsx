import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { HealthBadge, StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInitiatives } from "@/hooks/useSupabaseInitiatives";
import { useSupabaseRmTickets } from "@/hooks/useSupabaseRmTickets";
import { useSupabaseActionItems } from "@/hooks/useSupabaseActionItems";
import { downloadCsvFile } from "@/lib/exportUtils";
import { Search, Users, Plus, X } from "lucide-react";
import { toast } from "sonner";

type SortKey = "name" | "initiatives" | "tickets" | "actions" | "health";

export default function CustomerSummaryPage() {
  const { customers, addCustomer } = useSupabaseCustomers();
  const { initiatives } = useSupabaseInitiatives();
  const { tickets } = useSupabaseRmTickets();
  const { actionItems } = useSupabaseActionItems();

  const [query, setQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const enriched = useMemo(() => customers.map((c) => {
    const ci = initiatives.filter((i) => i.customer_id === c.id);
    const ct = tickets.filter((t) => t.customer_id === c.id);
    const ca = actionItems.filter((a) => a.customer_id === c.id);
    const openTickets = ct.filter((t) => !["Complete", "Deployed", "Closed"].includes(t.status));
    const openActions = ca.filter((a) => a.status !== "Done" && a.status !== "Complete");
    return { ...c, initiativeCount: ci.length, ticketCount: ct.length, openTickets: openTickets.length, actionCount: ca.length, openActions: openActions.length, initiatives: ci };
  }), [customers, initiatives, tickets, actionItems]);

  const rows = useMemo(() => {
    let filtered = enriched.filter((r) =>
      r.customer_name.toLowerCase().includes(query.toLowerCase()) &&
      (healthFilter === "all" || r.health === healthFilter)
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.customer_name.localeCompare(b.customer_name);
      if (sortBy === "health") return a.health.localeCompare(b.health);
      if (sortBy === "initiatives") return b.initiativeCount - a.initiativeCount;
      if (sortBy === "tickets") return b.openTickets - a.openTickets;
      return b.openActions - a.openActions;
    });
  }, [enriched, query, sortBy, healthFilter]);

  const handleAddCustomer = () => {
    if (!newName.trim()) return;
    const slug = newName.trim().replace(/\s+/g, "-").toLowerCase();
    addCustomer.mutate({ customer_name: newName.trim(), slug });
    setNewName("");
    setShowAdd(false);
  };

  const exportExcel = () => {
    downloadCsvFile("customer-summary.csv", rows.map((c) => ({
      Customer: c.customer_name, Health: c.health, Status: c.status,
      Initiatives: c.initiativeCount, "Open RM Tickets": c.openTickets,
      "Total RM Tickets": c.ticketCount, "Open Actions": c.openActions,
      "Total Actions": c.actionCount,
    })));
    toast.success("Customer summary exported");
  };

  return (
    <AppShell title="Customer Summary" subtitle="All customers at a glance" onExportExcel={exportExcel}>
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Customers" value={rows.length} />
        <KpiCard label="Active" value={rows.filter((r) => r.status === "Active").length} color="text-status-on-track" />
        <KpiCard label="Total Initiatives" value={rows.reduce((s, r) => s + r.initiativeCount, 0)} />
        <KpiCard label="Open RM Tickets" value={rows.reduce((s, r) => s + r.openTickets, 0)} color="text-status-caution" />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="all">All Health</option><option value="Healthy">Healthy</option><option value="Caution">Caution</option><option value="At Risk">At Risk</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
            <option value="name">Sort: Name</option><option value="initiatives">Sort: Initiatives</option><option value="tickets">Sort: Open RMs</option><option value="actions">Sort: Open Actions</option>
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Customer"}
          </button>
        </div>
      </section>

      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm print:hidden">
          <div className="flex gap-3">
            <input className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Customer name *" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCustomer()} />
            <button onClick={handleAddCustomer} disabled={!newName.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Save</button>
          </div>
        </section>
      )}

      {/* Customer Cards */}
      <section className="space-y-3">
        {rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No customers yet</h3>
            <p className="text-sm text-muted-foreground">Add your first customer to start tracking.</p>
          </div>
        )}
        {rows.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Link to={`/customer-drilldown/${c.id}`} className="text-lg font-semibold text-primary hover:underline">{c.customer_name}</Link>
                <HealthBadge health={c.health} />
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{c.initiativeCount} initiatives</span>
                <span>{c.openTickets} open / {c.ticketCount} total RMs</span>
                <span>{c.openActions} open actions</span>
              </div>
            </div>

            {c.initiatives.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {c.initiatives.slice(0, 5).map((init) => (
                  <div key={init.id} className="flex items-center gap-3 text-sm py-1 border-t border-border/50">
                    <span className="font-medium text-foreground min-w-[200px]">{init.title}</span>
                    {init.rm_number && <span className="font-mono text-xs text-primary">{init.rm_number}</span>}
                    <StatusBadge status={init.status} />
                    <PriorityBadge priority={init.priority} />
                    <span className="text-xs text-muted-foreground ml-auto">{init.owner || "—"}</span>
                  </div>
                ))}
                {c.initiatives.length > 5 && <p className="text-xs text-muted-foreground pt-1">+{c.initiatives.length - 5} more initiatives</p>}
              </div>
            )}
          </div>
        ))}
      </section>
    </AppShell>
  );
}
