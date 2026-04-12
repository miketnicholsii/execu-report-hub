import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { HealthBadge, FlagBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Search, Users, Plus, X, ChevronRight, AlertTriangle, Clock, Layers } from "lucide-react";
import { toast } from "sonner";

type SortKey = "name" | "openRms" | "staleRms" | "actions" | "health" | "risk";

export default function CustomerSummaryPage() {
  const { customers, addCustomer, kpis } = useUnifiedData();

  const [query, setQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("risk");
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
      if (sortBy === "openRms") return b.openRmTickets - a.openRmTickets;
      if (sortBy === "staleRms") return b.staleRmTickets - a.staleRmTickets;
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
    downloadCsv("cfs-customer-summary.csv", rows.map(c => ({
      Customer: c.customer_name, Health: c.health, Status: c.status,
      "Open RMs": c.openRmTickets, "Total RMs": c.totalRmTickets,
      "Stale RMs": c.staleRmTickets, "Open Actions": c.openActionItems,
      Blockers: c.blockerCount, Risk: c.riskLevel,
    })));
    toast.success("Customer summary exported");
  };

  return (
    <AppShell title="Customer Portfolio" subtitle={`${kpis.totalCustomers} customers · ${kpis.openRm} open RMs across the portfolio`} onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Customers" value={kpis.totalCustomers} icon={<Users className="h-3.5 w-3.5" />} />
        <KpiCard label="At Risk" value={kpis.atRiskCustomers} color={kpis.atRiskCustomers > 0 ? "text-destructive" : ""} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
        <KpiCard label="Open RMs" value={kpis.openRm} color="text-status-caution" sub={`of ${kpis.totalRm}`} />
        <KpiCard label="Stale RMs" value={kpis.staleRm} color={kpis.staleRm > 0 ? "text-status-caution" : ""} icon={<Clock className="h-3.5 w-3.5" />} />
        <KpiCard label="Open Actions" value={kpis.openActions} color="text-status-caution" />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-3 shadow-sm print:hidden">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs" placeholder="Search customers..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs" value={healthFilter} onChange={e => setHealthFilter(e.target.value)}>
            <option value="all">All Health</option><option value="Healthy">Healthy</option><option value="On Track">On Track</option><option value="Caution">Caution</option><option value="At Risk">At Risk</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
            <option value="risk">Sort: Risk</option><option value="name">Sort: Name</option><option value="openRms">Sort: Open RMs</option><option value="staleRms">Sort: Stale RMs</option><option value="actions">Sort: Actions</option>
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
            {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAdd ? "Cancel" : "Add"}
          </button>
        </div>
      </section>

      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-3 shadow-sm print:hidden">
          <div className="flex gap-2">
            <input className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" placeholder="Customer name" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddCustomer()} />
            <button onClick={handleAddCustomer} disabled={!newName.trim()} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50">Save</button>
          </div>
        </section>
      )}

      {/* Customer Cards */}
      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {rows.length === 0 && (
          <div className="md:col-span-3 rounded-xl border border-border bg-card p-10 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No customers found</h3>
            <p className="text-sm text-muted-foreground">Adjust filters or add a customer.</p>
          </div>
        )}
        {rows.map(c => (
          <Link key={c.slug} to={`/customers/${c.slug}`}
            className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{c.customer_name}</h3>
                <HealthBadge health={c.health} />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
            </div>
            {c.aliases.length > 1 && (
              <p className="text-[10px] text-muted-foreground mb-2 truncate">Aliases: {c.aliases.filter(a => a !== c.customer_name).join(", ")}</p>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Open RMs</p>
                <p className={`text-lg font-bold ${c.openRmTickets > 0 ? "text-foreground" : "text-muted-foreground"}`}>{c.openRmTickets}</p>
                <p className="text-[10px] text-muted-foreground">of {c.totalRmTickets}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Actions</p>
                <p className={`text-lg font-bold ${c.openActionItems > 0 ? "text-foreground" : "text-muted-foreground"}`}>{c.openActionItems}</p>
                <p className="text-[10px] text-muted-foreground">open</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Initiatives</p>
                <p className="text-lg font-bold text-foreground">{c.initiativeCount}</p>
                <p className="text-[10px] text-muted-foreground">tracked</p>
              </div>
            </div>

            {/* Flags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {c.staleRmTickets > 0 && <FlagBadge flag={`${c.staleRmTickets} Stale`} />}
              {c.blockerCount > 0 && <FlagBadge flag={`${c.blockerCount} Blocked`} />}
              {c.riskLevel === "High" && <FlagBadge flag="High Risk" />}
              {c.staleRmTickets === 0 && c.blockerCount === 0 && c.openRmTickets === 0 && (
                <span className="text-[10px] text-muted-foreground italic">All clear</span>
              )}
            </div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
