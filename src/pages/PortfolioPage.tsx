import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge, PriorityBadge } from "@/components/StatusBadge";
import GanttChart from "@/components/GanttChart";
import { getCustomerOverviews, getTrackerRows, getRmDetailRows, getActionDetailRows, getKeyDateRows, getRenewalRows, seed, projectById, customerById } from "@/lib/cfs/selectors2";
import { weeklySummaries } from "@/data/weeklySummaries";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { AlertTriangle, TrendingUp, Calendar, Target, Users, Package, Shield, Clock, Pin, PinOff, Star } from "lucide-react";

const customers = getCustomerOverviews();
const trackerRows = getTrackerRows();
const rmRows = getRmDetailRows();
const actionRows = getActionDetailRows();
const keyDates = getKeyDateRows();
const renewals = getRenewalRows();

const totalProjects = seed.projects.length;
const openItems = trackerRows.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status)).length;
const openRm = rmRows.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).length;
const atRiskCustomers = customers.filter((c) => c.health === "At Risk").length;
const testingCompleteCount = trackerRows.filter((t) => t.status === "Testing Complete").length;
const pastDueDates = keyDates.filter((d) => d.isPast).length;
const highUrgencyActions = actionRows.filter((a) => a.urgency === "high").length;
const blockerCount = seed.blockers.length;

// Charts
const healthData = [
  { name: "On Track", value: customers.filter((c) => c.health === "On Track").length, fill: "hsl(142,60%,40%)" },
  { name: "Caution", value: customers.filter((c) => c.health === "Caution").length, fill: "hsl(38,92%,50%)" },
  { name: "At Risk", value: customers.filter((c) => c.health === "At Risk").length, fill: "hsl(0,72%,51%)" },
].filter((d) => d.value > 0);

const statusCounts: Record<string, number> = {};
seed.projects.forEach((p) => { statusCounts[p.normalizedStatus] = (statusCounts[p.normalizedStatus] || 0) + 1; });
const projectStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

const STATUS_COLORS: Record<string, string> = {
  "Planning": "hsl(220,15%,60%)", "In Progress": "hsl(220,70%,50%)", "Testing": "hsl(38,92%,50%)",
  "In Review": "hsl(200,60%,50%)", "Live": "hsl(142,60%,40%)", "Post-Implementation": "hsl(142,45%,50%)",
  "TBD": "hsl(0,0%,70%)", "Complete": "hsl(142,70%,35%)", "In Spec": "hsl(200,50%,55%)",
  "Blocked": "hsl(0,72%,51%)", "Open": "hsl(38,92%,50%)",
};

// RM by customer
const rmByCustomer: Record<string, number> = {};
rmRows.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).forEach((r) => { rmByCustomer[r.customer_name] = (rmByCustomer[r.customer_name] || 0) + 1; });
const rmByCustomerData = Object.entries(rmByCustomer).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

// RM by priority
const rmByPriority: Record<string, number> = {};
rmRows.forEach((r) => { const p = (r as any).severity ?? "Medium"; rmByPriority[p] = (rmByPriority[p] || 0) + 1; });
const rmByPriorityData = Object.entries(rmByPriority).map(([name, value]) => ({ name, value }));
const PRIORITY_FILLS: Record<string, string> = { Critical: "hsl(0,72%,51%)", High: "hsl(0,60%,55%)", Medium: "hsl(38,92%,50%)", Low: "hsl(220,15%,60%)" };

// Owner workload
const ownerCounts: Record<string, number> = {};
trackerRows.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status)).forEach((t) => { ownerCounts[t.owner] = (ownerCounts[t.owner] || 0) + 1; });
const ownerData = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

// Initiative types
const typeData: Record<string, number> = {};
seed.projects.forEach((p) => { typeData[p.initiative_type] = (typeData[p.initiative_type] || 0) + 1; });
const initiativeTypeData = Object.entries(typeData).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

// Gantt data
const ganttItems = seed.projects.filter((p) => (p as any).start_date || (p as any).target_date).map((p) => {
  const cust = customerById.get(p.customer_id);
  const ms = seed.milestones.filter((m) => m.project_id === p.project_id && m.date_text && !m.date_text.includes("TBD")).map((m) => ({ date: m.date_text!, label: m.title }));
  return {
    id: p.project_id,
    label: `${cust?.customer_name ?? ""} – ${p.project_name}`,
    customer: cust?.customer_name,
    startDate: (p as any).start_date,
    endDate: (p as any).target_date,
    milestones: ms,
    percentComplete: p.percent_complete,
    status: p.normalizedStatus,
    owner: p.owner,
  };
});

// Latest weekly summary
const latestWeek = weeklySummaries.find((s) => s.level === "portfolio" && s.period === "BOW");

// Primary project customers (those with active High-priority projects)
const primaryCustomers = customers.filter((c) => c.projects.some((p) => p.priority === "High")).sort((a, b) => a.customer_name.localeCompare(b.customer_name));
const miscCustomers = customers.filter((c) => !primaryCustomers.includes(c)).sort((a, b) => a.customer_name.localeCompare(b.customer_name));

const exportAll = () => {
  downloadCsv("cfs-portfolio-overview.csv", customers.map((c) => ({
    Customer: c.customer_name, Health: c.health, Projects: c.projectCount,
    "Open Items": c.openItems, "Total Items": c.totalItems, "Open RM": c.openRm,
    "Action Items": c.actionCount, Blockers: c.blockerCount, "Next Milestone": c.nextMilestone,
    Renewals: c.renewals,
  })));
};

type SavedViewKey =
  | "myActionItems"
  | "overdueItems"
  | "waitingOnCustomer"
  | "specsNeeded"
  | "staleRms"
  | "upcomingMilestones"
  | "recentlyUpdated";

type SavedViewDefinition = {
  key: SavedViewKey;
  label: string;
  subtitle: string;
  metric: () => number;
  customers: () => string[];
};

export default function PortfolioPage() {
  const [activeView, setActiveView] = useState<SavedViewKey>("myActionItems");
  const [preferredOwner, setPreferredOwner] = useState(() => localStorage.getItem("cfs-preferred-owner") ?? "Manny");
  const [favoriteCustomers, setFavoriteCustomers] = useState<string[]>(() => JSON.parse(localStorage.getItem("cfs-fav-customers") ?? "[]"));
  const [favoriteViews, setFavoriteViews] = useState<SavedViewKey[]>(() => JSON.parse(localStorage.getItem("cfs-fav-views") ?? "[]"));
  const [importantRm, setImportantRm] = useState<string[]>(() => JSON.parse(localStorage.getItem("cfs-important-rm") ?? "[]"));

  useEffect(() => localStorage.setItem("cfs-preferred-owner", preferredOwner), [preferredOwner]);
  useEffect(() => localStorage.setItem("cfs-fav-customers", JSON.stringify(favoriteCustomers)), [favoriteCustomers]);
  useEffect(() => localStorage.setItem("cfs-fav-views", JSON.stringify(favoriteViews)), [favoriteViews]);
  useEffect(() => localStorage.setItem("cfs-important-rm", JSON.stringify(importantRm)), [importantRm]);

  const savedViews = useMemo<SavedViewDefinition[]>(() => {
    const now = Date.now();
    const openStatuses = new Set(["Complete", "Deployed", "Shipped"]);
    return [
      {
        key: "myActionItems",
        label: "My Action Items",
        subtitle: "Your assigned actions and RM ownership footprint",
        metric: () => actionRows.filter((a) => a.owner.toLowerCase().includes(preferredOwner.toLowerCase())).length,
        customers: () => Array.from(new Set(actionRows.filter((a) => a.owner.toLowerCase().includes(preferredOwner.toLowerCase())).map((a) => a.customer_name))),
      },
      {
        key: "overdueItems",
        label: "Overdue Items",
        subtitle: "Actionable items that have crossed a target date",
        metric: () => trackerRows.filter((item) => !openStatuses.has(item.status) && !!item.target_eta && new Date(item.target_eta).getTime() < now).length + keyDates.filter((item) => item.isPast).length,
        customers: () => Array.from(new Set([
          ...trackerRows.filter((item) => !openStatuses.has(item.status) && !!item.target_eta && new Date(item.target_eta).getTime() < now).map((item) => item.customer_name),
          ...keyDates.filter((item) => item.isPast).map((item) => item.customer),
        ])),
      },
      {
        key: "waitingOnCustomer",
        label: "Waiting on Customer",
        subtitle: "Dependencies awaiting customer decisions or assets",
        metric: () => trackerRows.filter((item) => `${item.status} ${item.context ?? ""} ${item.next_steps ?? ""}`.toLowerCase().includes("waiting on customer")).length,
        customers: () => Array.from(new Set(trackerRows.filter((item) => `${item.status} ${item.context ?? ""} ${item.next_steps ?? ""}`.toLowerCase().includes("waiting on customer")).map((item) => item.customer_name))),
      },
      {
        key: "specsNeeded",
        label: "Specs Needed",
        subtitle: "Projects blocked on missing or TBD specification detail",
        metric: () => customers.reduce((sum, customer) => sum + customer.missingSpecCount, 0),
        customers: () => customers.filter((customer) => customer.missingSpecCount > 0).map((customer) => customer.customer_name),
      },
      {
        key: "staleRms",
        label: "Stale RMs",
        subtitle: "Redmine records with aging activity",
        metric: () => customers.reduce((sum, customer) => sum + customer.staleRmCount, 0),
        customers: () => customers.filter((customer) => customer.staleRmCount > 0).map((customer) => customer.customer_name),
      },
      {
        key: "upcomingMilestones",
        label: "Upcoming Milestones",
        subtitle: "Upcoming dated milestones in the next 21 days",
        metric: () => keyDates.filter((item) => {
          const ms = Date.parse(item.date ?? "");
          return Number.isFinite(ms) && ms >= now && ms <= now + 21 * 86400000;
        }).length,
        customers: () => Array.from(new Set(keyDates.filter((item) => {
          const ms = Date.parse(item.date ?? "");
          return Number.isFinite(ms) && ms >= now && ms <= now + 21 * 86400000;
        }).map((item) => item.customer))),
      },
      {
        key: "recentlyUpdated",
        label: "Recently Updated",
        subtitle: "Customers touched in the last 7 days",
        metric: () => customers.filter((customer) => customer.lastUpdated && Date.parse(customer.lastUpdated) >= now - 7 * 86400000).length,
        customers: () => customers.filter((customer) => customer.lastUpdated && Date.parse(customer.lastUpdated) >= now - 7 * 86400000).map((customer) => customer.customer_name),
      },
    ];
  }, [preferredOwner]);

  const selectedView = savedViews.find((view) => view.key === activeView) ?? savedViews[0];
  const selectedViewCustomers = selectedView.customers();

  const favoriteCustomerRows = customers.filter((customer) => favoriteCustomers.includes(customer.customer_id));
  const importantRmRows = rmRows.filter((rm) => importantRm.includes(rm.rm_reference));

  const toggleArrayValue = <T extends string>(values: T[], value: T, set: (next: T[]) => void) => {
    set(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <AppShell title="Portfolio Dashboard" subtitle={`NÈKO · ${new Date().toLocaleDateString()}`} onExportExcel={exportAll} onExportPdf={exportPdf}>
      {/* KPIs - Two Rows */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Customers" value={customers.length} sub="active" />
        <KpiCard label="Initiatives" value={totalProjects} sub="in flight" />
        <KpiCard label="Open Items" value={openItems} color="text-status-caution" sub={`of ${trackerRows.length}`} />
        <KpiCard label="Open RM Issues" value={openRm} color="text-status-at-risk" sub={`of ${rmRows.length}`} />
        <KpiCard label="At Risk" value={atRiskCustomers} color="text-destructive" sub="customers" />
        <KpiCard label="Blockers" value={blockerCount} color="text-destructive" sub="active" />
        <KpiCard label="Ready to Deploy" value={testingCompleteCount} color="text-status-on-track" />
        <KpiCard label="Actions Due" value={highUrgencyActions} color="text-status-caution" sub="high urgency" />
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Past Due Dates" value={pastDueDates} color={pastDueDates > 0 ? "text-destructive" : ""} />
        <KpiCard label="Upcoming Renewals" value={renewals.length} />
        <KpiCard label="Key Dates" value={keyDates.length} sub="tracked" />
        <KpiCard label="Action Items" value={actionRows.length} sub="total" />
      </section>

      <section className="grid xl:grid-cols-[1.15fr_1fr] gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Saved Views</h2>
              <p className="text-xs text-muted-foreground">Curated operational lenses with one-click recall.</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Owner Lens</p>
              <input
                value={preferredOwner}
                onChange={(event) => setPreferredOwner(event.target.value)}
                className="mt-1 w-28 rounded-md border border-border bg-background px-2 py-1 text-xs"
                placeholder="Your name"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {savedViews.map((view) => {
              const isFavorite = favoriteViews.includes(view.key);
              return (
                <button
                  key={view.key}
                  onClick={() => setActiveView(view.key)}
                  className={`text-left rounded-xl border p-3 transition-all ${activeView === view.key ? "border-primary/50 bg-primary/10 shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/40"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{view.label}</p>
                    <span
                      className="text-muted-foreground hover:text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleArrayValue(favoriteViews, view.key, setFavoriteViews);
                      }}
                    >
                      <Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{view.subtitle}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{view.metric()}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{selectedView.label}</p>
            <p className="text-sm text-foreground mt-1">{selectedView.subtitle}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedViewCustomers.length === 0 && <span className="text-xs text-muted-foreground">No matching customers in this slice.</span>}
              {selectedViewCustomers.map((name) => (
                <span key={name} className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Personalization</h2>
              <p className="text-xs text-muted-foreground">Pin what matters most to your executive workflow.</p>
            </div>
            <Pin className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Favorite Views</p>
              <div className="flex flex-wrap gap-1.5">
                {favoriteViews.length === 0 && <span className="text-xs text-muted-foreground">Star views above to pin them.</span>}
                {favoriteViews.map((viewKey) => {
                  const view = savedViews.find((item) => item.key === viewKey);
                  if (!view) return null;
                  return (
                    <button key={view.key} onClick={() => setActiveView(view.key)} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {view.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Favorite Customers</p>
              <div className="space-y-1.5 max-h-28 overflow-auto pr-1">
                {customers.slice(0, 14).map((customer) => (
                  <button key={customer.customer_id} onClick={() => toggleArrayValue(favoriteCustomers, customer.customer_id, setFavoriteCustomers)} className="w-full flex items-center justify-between rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted/40">
                    <span className="truncate">{customer.customer_name}</span>
                    {favoriteCustomers.includes(customer.customer_id) ? <Pin className="h-3.5 w-3.5 text-primary" /> : <PinOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Important RM Records</p>
              <div className="space-y-1.5 max-h-28 overflow-auto pr-1">
                {rmRows.slice(0, 10).map((rm) => (
                  <button key={rm.rm_reference} onClick={() => toggleArrayValue(importantRm, rm.rm_reference, setImportantRm)} className="w-full flex items-center justify-between rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted/40">
                    <span className="truncate">{rm.rm_reference} · {rm.customer_name}</span>
                    {importantRm.includes(rm.rm_reference) ? <Pin className="h-3.5 w-3.5 text-primary" /> : <PinOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Week-at-a-Glance from weekly summary */}
      {latestWeek && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">This Week at a Glance</h2>
            <Link to="/weekly-summaries" className="text-xs text-primary hover:underline ml-auto print:hidden">View all summaries →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {latestWeek.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Key Highlights</h4>
                <ul className="space-y-1.5 text-sm">{latestWeek.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-status-on-track mt-0.5">✦</span>{h}</li>
                ))}</ul>
              </div>
            )}
            {latestWeek.openQuestions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Open Questions</h4>
                <ul className="space-y-1.5 text-sm">{latestWeek.openQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-status-caution mt-0.5">?</span>{q}</li>
                ))}</ul>
              </div>
            )}
            {latestWeek.nextSteps.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Priority Next Steps</h4>
                <ul className="space-y-1.5 text-sm">{latestWeek.nextSteps.map((n, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span>{n}</li>
                ))}</ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(favoriteCustomerRows.length > 0 || importantRmRows.length > 0) && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Pin className="h-4 w-4 text-primary" /> Pinned Customers</h3>
            <div className="space-y-1.5">
              {favoriteCustomerRows.map((customer) => (
                <div key={customer.customer_id} className="flex items-center justify-between rounded-lg border border-border/60 px-2.5 py-1.5 text-sm">
                  <Link to={`/customers/${customer.slug}`} className="font-medium text-primary hover:underline">{customer.customer_name}</Link>
                  <span className="text-xs text-muted-foreground">{customer.openItems} open · {customer.openRm} RM</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Pin className="h-4 w-4 text-primary" /> Pinned RM Records</h3>
            <div className="space-y-1.5">
              {importantRmRows.map((rm) => (
                <div key={rm.rm_reference} className="rounded-lg border border-border/60 px-2.5 py-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{rm.rm_reference}</span>
                    <StatusBadge status={rm.normalizedStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rm.customer_name} · {rm.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Charts Row 1 */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Health</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {healthData.map((e) => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Initiatives by Phase</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={projectStatusData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {projectStatusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Open RMs by Customer</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={rmByCustomerData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(220,70%,50%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Charts Row 2 */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">RM Issues by Severity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={rmByPriorityData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {rmByPriorityData.map((e) => <Cell key={e.name} fill={PRIORITY_FILLS[e.name] || "hsl(220,15%,70%)"} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Open Items by Owner</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="hsl(220,70%,50%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Initiative Types</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={initiativeTypeData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-30} textAnchor="end" height={55} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(260,50%,55%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Gantt Timeline */}
      <GanttChart items={ganttItems} title="Initiative Timeline" />

      {/* Primary Customer Callouts */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Primary Project Customers</h2>
        </div>
        <div className="space-y-2">
          {primaryCustomers.map((c) => (
            <div key={c.customer_id} className="rounded-lg border border-border p-3 bg-muted/10 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3 flex-wrap">
                <Link to={`/customers/${c.slug}`} className="font-semibold text-primary hover:underline">{c.customer_name}</Link>
                <HealthBadge health={c.health} />
                <span className="text-xs text-muted-foreground">{c.projectCount} initiatives · {c.openItems} open · {c.openRm} RM</span>
                {c.blockerCount > 0 && <span className="text-xs text-destructive font-medium">⚠ {c.blockerCount} blockers</span>}
                <span className="text-xs text-muted-foreground ml-auto">Next: {c.nextMilestone}</span>
              </div>
              <div className="mt-2 space-y-1">
                {c.projects.filter((p) => p.priority === "High").map((p) => (
                  <div key={p.project_id} className="flex items-center gap-2 text-sm pl-2">
                    <span className="text-muted-foreground">·</span>
                    <Link to={`/initiatives/${p.project_id}`} className="text-foreground hover:text-primary hover:underline">{p.project_name}</Link>
                    <StatusBadge status={p.normalizedStatus} />
                    <span className="text-xs text-muted-foreground">{p.phase} · {p.percent_complete}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Misc Customer Deliverables */}
      {miscCustomers.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Miscellaneous Customer Deliverables</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {miscCustomers.map((c) => (
              <div key={c.customer_id} className="flex items-center justify-between rounded-lg border border-border/50 p-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <Link to={`/customers/${c.slug}`} className="font-medium text-primary hover:underline">{c.customer_name}</Link>
                  <HealthBadge health={c.health} />
                </div>
                <span className="text-xs text-muted-foreground">{c.projectCount} projects · {c.openItems} open</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Portfolio Table */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm overflow-x-auto">
        <h2 className="font-semibold mb-3 text-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Customer Portfolio</h2>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10"><tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-3">Customer</th><th className="pr-3">Health</th><th className="pr-3">Projects</th>
            <th className="pr-3">Open / Total</th><th className="pr-3">Open RM</th><th className="pr-3">Actions</th>
            <th className="pr-3">Stale RM</th><th className="pr-3">Risk</th><th className="pr-3">Missing Spec</th><th className="pr-3">Last Updated</th>
            <th className="pr-3">Blockers</th><th className="pr-3">Deploy Ready</th><th className="pr-3">Next Milestone</th><th>Renewals</th>
          </tr></thead>
          <tbody>{customers.sort((a, b) => a.customer_name.localeCompare(b.customer_name)).map((c) => (
            <tr key={c.customer_id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="py-2.5 pr-3"><Link to={`/customers/${c.slug}`} className="text-primary font-medium hover:underline">{c.customer_name}</Link></td>
              <td className="pr-3"><HealthBadge health={c.health} /></td>
              <td className="pr-3">{c.projectCount}</td>
              <td className="pr-3"><span className="font-medium">{c.openItems}</span> / {c.totalItems}</td>
              <td className="pr-3">{c.openRm}</td>
              <td className="pr-3">{c.actionCount}</td>
              <td className="pr-3">{c.staleRmCount}</td>
              <td className="pr-3"><PriorityBadge priority={c.riskIndicator === "High" ? "High" : c.riskIndicator === "Medium" ? "Medium" : "Low"} /></td>
              <td className="pr-3">{c.missingSpecCount}</td>
              <td className="pr-3 text-xs">{c.lastUpdated ? new Date(c.lastUpdated).toLocaleDateString() : "Unknown"}</td>
              <td className="pr-3">{c.blockerCount > 0 ? <span className="text-destructive font-medium">{c.blockerCount}</span> : "0"}</td>
              <td className="pr-3">{c.deployReady > 0 ? <span className="text-status-on-track font-medium">{c.deployReady}</span> : "0"}</td>
              <td className="pr-3 text-xs">{c.nextMilestone}</td>
              <td>{c.renewals}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      {/* Quick Glance: Dates + Renewals */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Upcoming Key Dates</h2>
            <Link to="/key-dates" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2 text-sm">
            {keyDates.slice(0, 8).map((d) => (
              <div key={d.id} className={`flex items-center justify-between py-1 border-b border-border/50 ${d.isPast ? "text-destructive" : ""}`}>
                <div><span className="font-medium">{d.customer}</span> · {d.milestone}</div>
                <div className="flex items-center gap-2">
                  {d.isPast && <span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/15 text-destructive border border-destructive/30">Past Due</span>}
                  <span className="text-xs text-muted-foreground">{d.displayDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Renewal Pipeline</h2>
            <Link to="/renewals" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2 text-sm">
            {renewals.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1 border-b border-border/50">
                <div><span className="font-medium">{r.customer}</span> · {r.type}</div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-muted-foreground">{r.renewalDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockers Across Portfolio */}
      {seed.blockers.length > 0 && (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <h2 className="font-semibold text-destructive mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Active Blockers ({seed.blockers.length})</h2>
          <div className="space-y-2 text-sm">
            {seed.blockers.map((b) => {
              const project = projectById.get(b.project_id);
              const customer = project ? customerById.get(project.customer_id) : null;
              return (
                <div key={b.blocker_id} className="flex items-start gap-2 py-1 border-b border-destructive/10">
                  <span className="text-destructive font-bold">!</span>
                  <div>
                    <span className="font-medium text-foreground">{customer?.customer_name}</span> · {project?.project_name} — {b.description}
                    <span className="ml-2 text-xs text-muted-foreground">Severity: {b.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Top Action Items */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> High-Urgency Action Items</h2>
          <Link to="/action-items" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="space-y-2 text-sm">
          {actionRows.filter((a) => a.urgency === "high").slice(0, 10).map((a) => (
            <div key={a.action_item_id} className="flex items-start justify-between py-1 border-b border-border/50">
              <div className="flex-1">
                <span className="font-medium text-foreground">{a.customer_name}</span>
                <span className="text-muted-foreground"> · </span>
                <span>{a.description}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{a.owner}</span>
                <span className="text-xs text-muted-foreground">{a.due_date ?? "TBD"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        CFS Projects Team · Last updated {new Date().toLocaleDateString()} · Prepared for Executive Review
      </footer>
    </AppShell>
  );
}
