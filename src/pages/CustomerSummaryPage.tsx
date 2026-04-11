import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { StatusBadge, HealthBadge } from "@/components/StatusBadge";
import { getCustomerOverviews } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";

const customers = getCustomerOverviews();
type SortKey = "customer_name" | "projectCount" | "openItems" | "openRm" | "health";

export default function CustomerSummaryPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("customer_name");
  const [healthFilter, setHealthFilter] = useState("all");

  const rows = useMemo(() => {
    let filtered = customers.filter((r) =>
      r.customer_name.toLowerCase().includes(query.toLowerCase()) &&
      (healthFilter === "all" || r.health === healthFilter)
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "customer_name") return a.customer_name.localeCompare(b.customer_name);
      if (sortBy === "health") return a.health.localeCompare(b.health);
      return (b[sortBy] as number) - (a[sortBy] as number);
    });
  }, [query, sortBy, healthFilter]);

  const exportExcel = () => downloadCsv("customer-summary.csv", rows.map((c) => ({
    Customer: c.customer_name, Health: c.health, Projects: c.projectCount,
    "Open Items": c.openItems, "Complete Items": c.completeItems, "Open RM": c.openRm,
    Actions: c.actionCount, Blockers: c.blockerCount, "Next Milestone": c.nextMilestone,
  })));

  return (
    <AppShell title="Customer Summary" subtitle="All customers at a glance" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search customer..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="all">All Health</option><option value="On Track">On Track</option><option value="Caution">Caution</option><option value="At Risk">At Risk</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
            <option value="customer_name">Sort: Customer</option><option value="openItems">Sort: Open Items</option><option value="openRm">Sort: Open RM</option><option value="projectCount">Sort: Projects</option>
          </select>
        </div>
      </section>

      {/* Summary Cards per Customer */}
      <section className="space-y-3">
        {rows.map((c) => (
          <div key={c.customer_id} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Link to={`/customers/${c.slug}`} className="text-lg font-semibold text-primary hover:underline">{c.customer_name}</Link>
                <HealthBadge health={c.health} />
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{c.projectCount} projects</span>
                <span>{c.openItems} open / {c.totalItems} total</span>
                <span>{c.openRm} RM open</span>
                <span>{c.actionCount} actions</span>
                {c.blockerCount > 0 && <span className="text-destructive font-medium">{c.blockerCount} blockers</span>}
              </div>
            </div>

            {/* Project sub-rows */}
            <div className="mt-3 space-y-1.5">
              {c.projects.map((p) => (
                <div key={p.project_id} className="flex items-center gap-3 text-sm py-1 border-t border-border/50">
                  <span className="font-medium text-foreground min-w-[200px]">{p.project_name}</span>
                  {p.deliverable && <span className="text-muted-foreground text-xs">· {p.deliverable}</span>}
                  <StatusBadge status={p.normalizedStatus} />
                  <span className="text-xs text-muted-foreground ml-auto">Owner: {p.owner}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Next milestone: {c.nextMilestone}
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
