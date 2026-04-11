import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { HealthBadge, StatusBadge, PriorityBadge, FlagBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsvFile } from "@/lib/exportUtils";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Search, Users, Plus, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type SortKey = "name" | "initiatives" | "tickets" | "actions" | "health" | "risk";

export default function CustomerSummaryPage() {
  const { customers, initiatives, addCustomer, kpis } = useUnifiedData();

  const [query, setQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const rows = useMemo(() => {
    let filtered = customers.filter(c =>
      c.customer_name.toLowerCase().includes(query.toLowerCase()) &&
      (healthFilter === "all" || c.health === healthFilter)
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.customer_name.localeCompare(b.customer_name);
      if (sortBy === "health") return a.health.localeCompare(b.health);
      if (sortBy === "initiatives") return b.initiativeCount - a.initiativeCount;
      if (sortBy === "tickets") return b.openRmTickets - a.openRmTickets;
      if (sortBy === "risk") {
        const o: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (o[a.riskLevel] ?? 2) - (o[b.riskLevel] ?? 2);
      }
      return b.openActionItems - a.openActionItems;
    });
  }, [customers, query, sortBy, healthFilter]);

  const handleAddCustomer = () => {
    if (!newName.trim()) return;
    const slug = newName.trim().replace(/\s+/g, "-").toLowerCase();
    addCustomer.mutate({ customer_name: newName.trim(), slug });
    setNewName("");
    setShowAdd(false);
  };

  const exportExcel = () => {
    downloadCsv("neko-customer-summary.csv", rows.map(c => ({
      Customer: c.customer_name, Health: c.health, Status: c.status,
      Initiatives: c.initiativeCount, "Open RMs": c.openRmTickets,
      "Total RMs": c.totalRmTickets, "Stale RMs": c.staleRmTickets,
      "Open Actions": c.openActionItems, "Total Actions": c.totalActionItems,
      Blockers: c.blockerCount, Risk: c.riskLevel,
    })));
    toast.success("Customer summary exported");
  };

  // Get initiatives for each customer for the inline preview
  const customerInitiatives = useMemo(() => {
    const map = new Map<string, typeof initiatives>();
    customers.forEach(c => {
      const ci = initiatives.filter(i =>
        i.customer_name.toLowerCase() === c.customer_name.toLowerCase() ||
        (i.customer_id && i.customer_id === c.id)
      );
      map.set(c.slug, ci);
    });
    return map;
  }, [customers, initiatives]);

  return (
    <AppShell title="Customer Summary" subtitle={`All ${kpis.totalCustomers} customers at a glance`} onExportExcel={exportExcel} onExportPdf={exportPdf}>
      {/* KPIs — same numbers as Executive Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Total Customers" value={kpis.totalCustomers} />
        <KpiCard label="At Risk" value={kpis.atRiskCustomers} color={kpis.atRiskCustomers > 0 ? "text-destructive" : ""} />
        <KpiCard label="Total Initiatives" value={kpis.totalInitiatives} />
        <KpiCard label="Open RMs" value={kpis.openRm} color="text-status-caution" />
        <KpiCard label="Open Actions" value={kpis.openActions} color="text-status-caution" />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" placeholder="Search customers..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={healthFilter} onChange={e => setHealthFilter(e.target.value)}>
            <option value="all">All Health</option><option value="Healthy">Healthy</option><option value="On Track">On Track</option><option value="Caution">Caution</option><option value="At Risk">At Risk</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
            <option value="name">Sort: Name</option><option value="risk">Sort: Risk</option><option value="initiatives">Sort: Initiatives</option><option value="tickets">Sort: Open RMs</option><option value="actions">Sort: Open Actions</option>
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
            <input className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Customer name *" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddCustomer()} />
            <button onClick={handleAddCustomer} disabled={!newName.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Save</button>
          </div>
        </section>
      )}

      {/* Customer Cards */}
      <section className="space-y-3">
        {rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No customers found</h3>
            <p className="text-sm text-muted-foreground">Adjust your filters or add a customer.</p>
          </div>
        )}
        {rows.map(c => {
          const inits = customerInitiatives.get(c.slug) || [];
          return (
            <div key={c.slug} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Link to={`/customers/${c.slug}`} className="text-lg font-semibold text-primary hover:underline">{c.customer_name}</Link>
                  <HealthBadge health={c.health} />
                  {c.riskLevel === "High" && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">HIGH RISK</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">{c.initiativeCount}</strong> initiatives</span>
                  <span><strong className="text-foreground">{c.openRmTickets}</strong> open / <strong>{c.totalRmTickets}</strong> total RMs</span>
                  <span><strong className="text-foreground">{c.openActionItems}</strong> open actions</span>
                  {c.staleRmTickets > 0 && <span className="text-status-caution"><strong>{c.staleRmTickets}</strong> stale</span>}
                  <Link to={`/customers/${c.slug}`} className="flex items-center gap-0.5 text-primary hover:underline">
                    Drill down <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {inits.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {inits.slice(0, 5).map(init => (
                    <div key={init.id} className="flex items-center gap-3 text-sm py-1 border-t border-border/50">
                      <span className="font-medium text-foreground min-w-[200px]">{init.title}</span>
                      {init.rm_number && <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">{init.rm_number}</span>}
                      <StatusBadge status={init.status} />
                      <PriorityBadge priority={init.priority} />
                      <span className="text-xs text-muted-foreground ml-auto">{init.owner || "—"}</span>
                    </div>
                  ))}
                  {inits.length > 5 && <p className="text-xs text-muted-foreground pt-1">+{inits.length - 5} more initiatives</p>}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
