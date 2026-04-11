import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge } from "@/components/StatusBadge";
import {
  getCustomerOverviews, getTrackerRows, getRmDetailRows,
  getActionDetailRows, getKeyDateRows, getRenewalRows, seed,
} from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import {
  AlertTriangle, TrendingUp, Calendar, Users, Shield, Clock,
  FileText, Layers, Target, Activity, ChevronRight,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(218,88%,62%)", "hsl(142,60%,45%)", "hsl(38,92%,50%)",
  "hsl(0,72%,55%)", "hsl(270,60%,55%)", "hsl(180,60%,45%)",
  "hsl(330,60%,55%)", "hsl(45,90%,55%)",
];

const HEALTH_COLORS: Record<string, string> = {
  "On Track": "hsl(142,60%,45%)",
  "Caution": "hsl(38,92%,50%)",
  "At Risk": "hsl(0,72%,55%)",
};

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "hsl(220,15%,55%)",
  "Discovery": "hsl(270,50%,55%)",
  "Drafting Spec": "hsl(200,60%,50%)",
  "Spec Review": "hsl(200,45%,55%)",
  "In Development": "hsl(218,80%,55%)",
  "In Testing": "hsl(38,90%,50%)",
  "Ready to Deploy": "hsl(142,55%,45%)",
  "Complete": "hsl(142,70%,35%)",
  "Blocked": "hsl(0,72%,50%)",
  "Monitoring": "hsl(180,50%,45%)",
};

export default function ExecutiveDashboardPage() {
  const customers = getCustomerOverviews();
  const trackerRows = getTrackerRows();
  const rmRows = getRmDetailRows();
  const actionRows = getActionDetailRows();
  const keyDates = getKeyDateRows();
  const renewals = getRenewalRows();

  const now = Date.now();
  const openItems = trackerRows.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status)).length;
  const openRm = rmRows.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).length;
  const atRiskCount = customers.filter((c) => c.health === "At Risk").length;
  const blockerCount = seed.blockers.length;
  const highUrgency = actionRows.filter((a) => a.urgency === "high").length;
  const overdueActions = actionRows.filter((a) => a.due_date && new Date(a.due_date).getTime() < now).length;
  const missingSpecs = customers.reduce((s, c) => s + c.missingSpecCount, 0);
  const staleRms = customers.reduce((s, c) => s + c.staleRmCount, 0);

  // Health donut
  const healthData = [
    { name: "On Track", value: customers.filter((c) => c.health === "On Track").length },
    { name: "Caution", value: customers.filter((c) => c.health === "Caution").length },
    { name: "At Risk", value: customers.filter((c) => c.health === "At Risk").length },
  ].filter((d) => d.value > 0);

  // RM by status
  const rmStatusCounts: Record<string, number> = {};
  rmRows.forEach((r) => { rmStatusCounts[r.normalizedStatus] = (rmStatusCounts[r.normalizedStatus] || 0) + 1; });
  const rmStatusData = Object.entries(rmStatusCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "hsl(220,15%,55%)" }));

  // RM by customer (open only)
  const rmByCustomer: Record<string, number> = {};
  rmRows.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus))
    .forEach((r) => { rmByCustomer[r.customer_name] = (rmByCustomer[r.customer_name] || 0) + 1; });
  const rmByCustomerData = Object.entries(rmByCustomer).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));

  // Owner workload
  const ownerCounts: Record<string, number> = {};
  trackerRows.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status))
    .forEach((t) => { ownerCounts[t.owner] = (ownerCounts[t.owner] || 0) + 1; });
  const ownerData = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));

  // Aging buckets for open RMs
  const agingBuckets = useMemo(() => {
    const buckets = { "0–7d": 0, "8–14d": 0, "15–30d": 0, "31–60d": 0, "61+d": 0 };
    rmRows.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).forEach((r) => {
      const age = r.created_date ? Math.floor((now - new Date(r.created_date).getTime()) / 86400000) : 99;
      if (age <= 7) buckets["0–7d"]++;
      else if (age <= 14) buckets["8–14d"]++;
      else if (age <= 30) buckets["15–30d"]++;
      else if (age <= 60) buckets["31–60d"]++;
      else buckets["61+d"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [rmRows]);

  // Upcoming dates (next 30 days)
  const upcoming = keyDates
    .filter((d) => { const ms = Date.parse(d.date ?? ""); return Number.isFinite(ms) && ms >= now && ms <= now + 30 * 86400000; })
    .slice(0, 6);

  // Top action items (high urgency, open)
  const topActions = actionRows
    .filter((a) => !["Complete", "Done"].includes(a.normalizedStatus))
    .sort((a, b) => {
      const o = { high: 0, medium: 1, normal: 2 };
      return (o[(a.urgency as keyof typeof o) ?? "normal"] ?? 2) - (o[(b.urgency as keyof typeof o) ?? "normal"] ?? 2);
    })
    .slice(0, 8);

  return (
    <AppShell
      title="Executive Dashboard"
      subtitle={`NÈKO · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`}
      onExportExcel={() => downloadCsv("neko-executive-summary.csv", customers.map((c) => ({
        Customer: c.customer_name, Health: c.health, Projects: c.projectCount,
        "Open Items": c.openItems, "Open RM": c.openRm, Blockers: c.blockerCount,
      })))}
      onExportPdf={exportPdf}
    >
      {/* KPI Row 1 */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Customers" value={customers.length} sub="active" />
        <KpiCard label="Initiatives" value={seed.projects.length} sub="in flight" />
        <KpiCard label="Open Items" value={openItems} color="text-status-caution" sub={`of ${trackerRows.length}`} />
        <KpiCard label="Open RMs" value={openRm} color="text-status-at-risk" sub={`of ${rmRows.length}`} />
        <KpiCard label="At Risk" value={atRiskCount} color={atRiskCount > 0 ? "text-destructive" : ""} sub="customers" />
        <KpiCard label="Blockers" value={blockerCount} color={blockerCount > 0 ? "text-destructive" : ""} sub="active" />
        <KpiCard label="High Urgency" value={highUrgency} color="text-status-caution" sub="actions" />
        <KpiCard label="Overdue" value={overdueActions} color={overdueActions > 0 ? "text-destructive" : "text-status-on-track"} sub="items" />
      </section>

      {/* KPI Row 2 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Missing Specs" value={missingSpecs} color={missingSpecs > 0 ? "text-status-caution" : ""} />
        <KpiCard label="Stale RMs" value={staleRms} color={staleRms > 0 ? "text-status-caution" : ""} sub="> 21 days" />
        <KpiCard label="Renewals" value={renewals.length} sub="tracked" />
        <KpiCard label="Key Dates" value={keyDates.length} sub="upcoming" />
      </section>

      {/* Charts Row 1 */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Portfolio Health */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Portfolio Health</h3>
          <p className="text-xs text-muted-foreground mb-4">Customer health distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {healthData.map((e) => <Cell key={e.name} fill={HEALTH_COLORS[e.name]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RM Status Distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">RM Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">All Redmine tickets by status</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={rmStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={2} dataKey="value">
                {rmStatusData.map((e, i) => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Aging Buckets */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">RM Aging Buckets</h3>
          <p className="text-xs text-muted-foreground mb-4">Open tickets by age</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agingBuckets} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {agingBuckets.map((_, i) => (
                  <Cell key={i} fill={["hsl(142,60%,45%)", "hsl(180,50%,45%)", "hsl(38,90%,50%)", "hsl(0,60%,55%)", "hsl(0,72%,50%)"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Charts Row 2 */}
      <section className="grid lg:grid-cols-2 gap-4">
        {/* Open RMs by Customer */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Open RMs by Customer</h3>
          <p className="text-xs text-muted-foreground mb-4">Workload distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rmByCustomerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workload by Owner */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Workload by Owner</h3>
          <p className="text-xs text-muted-foreground mb-4">Open items assigned per person</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {ownerData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Panels */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Customer Health Grid */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Customer Health</h3>
              <p className="text-xs text-muted-foreground">Quick-scan portfolio status</p>
            </div>
            <Link to="/portfolio" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {customers.sort((a, b) => {
              const order = { "At Risk": 0, "Caution": 1, "On Track": 2 };
              return (order[a.health as keyof typeof order] ?? 2) - (order[b.health as keyof typeof order] ?? 2);
            }).slice(0, 10).map((c) => (
              <Link key={c.customer_id} to={`/customers/${c.slug}`}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <HealthBadge health={c.health} />
                  <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{c.customer_name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                  <span>{c.openRm} RMs</span>
                  <span>{c.openItems} items</span>
                  {c.blockerCount > 0 && <span className="text-destructive font-medium">{c.blockerCount} blocked</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Action Items */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Action Items</h3>
              <p className="text-xs text-muted-foreground">Highest urgency open items</p>
            </div>
            <Link to="/action-items" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topActions.map((a) => (
              <div key={a.action_item_id} className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <p className="text-sm text-foreground line-clamp-1">{a.description}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span className="text-primary">{a.customer_name}</span>
                  <span>·</span>
                  <span>{a.owner}</span>
                  {a.due_date && (
                    <>
                      <span>·</span>
                      <span className={new Date(a.due_date).getTime() < now ? "text-destructive font-medium" : ""}>
                        {a.due_date}
                      </span>
                    </>
                  )}
                  {a.urgency === "high" && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">HIGH</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Dates */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Upcoming Key Dates</h3>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </div>
            <Link to="/key-dates" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No dates in the next 30 days</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((d, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{d.milestone}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{d.displayDate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.customer} · {d.project}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Attention Flags */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-1">Attention Required</h3>
        <p className="text-xs text-muted-foreground mb-4">Items needing immediate focus</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/rm-issues" className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-foreground">Blocked Items</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{blockerCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Require intervention</p>
          </Link>
          <Link to="/action-items" className="p-4 rounded-xl border border-status-caution/20 bg-status-caution-bg hover:opacity-80 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-status-caution" />
              <span className="text-sm font-semibold text-foreground">Overdue Actions</span>
            </div>
            <p className="text-2xl font-bold text-status-caution">{overdueActions}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Past due date</p>
          </Link>
          <Link to="/specs" className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Missing Specs</span>
            </div>
            <p className="text-2xl font-bold text-primary">{missingSpecs}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Need specification work</p>
          </Link>
          <Link to="/rm-issues" className="p-4 rounded-xl border border-status-caution/20 bg-status-caution-bg hover:opacity-80 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-status-caution" />
              <span className="text-sm font-semibold text-foreground">Stale RMs</span>
            </div>
            <p className="text-2xl font-bold text-status-caution">{staleRms}</p>
            <p className="text-xs text-muted-foreground mt-0.5">No update in 21+ days</p>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
