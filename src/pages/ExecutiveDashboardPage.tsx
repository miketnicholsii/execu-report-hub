import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge, PriorityBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import {
  AlertTriangle, Clock, ChevronRight, Layers, Activity, Calendar,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(218,88%,62%)", "hsl(142,60%,45%)", "hsl(38,92%,50%)",
  "hsl(0,72%,55%)", "hsl(270,60%,55%)", "hsl(180,60%,45%)",
  "hsl(330,60%,55%)", "hsl(45,90%,55%)",
];
const HEALTH_COLORS: Record<string, string> = { Healthy: "hsl(142,60%,45%)", "On Track": "hsl(142,60%,45%)", Caution: "hsl(38,92%,50%)", "At Risk": "hsl(0,72%,55%)" };
const STATUS_COLORS: Record<string, string> = {
  "Not Started": "hsl(220,15%,55%)", Discovery: "hsl(270,50%,55%)", "In Development": "hsl(218,80%,55%)",
  "In Testing": "hsl(38,90%,50%)", "In Progress": "hsl(218,80%,55%)", Complete: "hsl(142,70%,35%)",
  Deployed: "hsl(142,70%,35%)", Blocked: "hsl(0,72%,50%)", Open: "hsl(38,92%,50%)",
  "Waiting on Customer": "hsl(0,60%,55%)", "Waiting on CFS": "hsl(0,60%,55%)", Live: "hsl(142,70%,35%)",
};

const CLOSED = ["Complete", "Deployed", "Closed", "Live", "Shipped", "Done"];

export default function ExecutiveDashboardPage() {
  const { customers, rmTickets, actionItems, initiatives, kpis, keyDates, renewals } = useUnifiedData();

  /* ── Health donut ── */
  const healthData = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach(c => { counts[c.health] = (counts[c.health] || 0) + 1; });
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [customers]);

  /* ── RM Status pie ── */
  const rmStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    rmTickets.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "hsl(220,15%,55%)" }));
  }, [rmTickets]);

  /* ── RM Aging buckets ── */
  const agingBuckets = useMemo(() => {
    const buckets = { "0–7d": 0, "8–14d": 0, "15–30d": 0, "31–60d": 0, "61+d": 0 };
    rmTickets.filter(r => !CLOSED.includes(r.status)).forEach(r => {
      const age = r.days_since_update ?? 99;
      if (age <= 7) buckets["0–7d"]++;
      else if (age <= 14) buckets["8–14d"]++;
      else if (age <= 30) buckets["15–30d"]++;
      else if (age <= 60) buckets["31–60d"]++;
      else buckets["61+d"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [rmTickets]);

  /* ── Open RMs by customer ── */
  const rmByCustomer = useMemo(() => {
    const counts: Record<string, number> = {};
    rmTickets.filter(r => !CLOSED.includes(r.status)).forEach(r => { counts[r.customer_name] = (counts[r.customer_name] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
  }, [rmTickets]);

  /* ── Workload by owner ── */
  const ownerData = useMemo(() => {
    const counts: Record<string, number> = {};
    rmTickets.filter(r => !CLOSED.includes(r.status)).forEach(r => { counts[r.owner] = (counts[r.owner] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));
  }, [rmTickets]);

  /* ── Upcoming key dates (next 30 days) ── */
  const now = Date.now();
  const upcoming = useMemo(() =>
    keyDates
      .filter(d => { const ms = Date.parse(d.date ?? ""); return Number.isFinite(ms) && ms >= now && ms <= now + 30 * 86400000; })
      .slice(0, 6),
    [keyDates]
  );

  /* ── Top action items ── */
  const topActions = useMemo(() =>
    actionItems
      .filter(a => !["Complete", "Done"].includes(a.status))
      .sort((a, b) => {
        const o = { High: 0, Medium: 1, Low: 2 };
        return (o[a.priority as keyof typeof o] ?? 2) - (o[b.priority as keyof typeof o] ?? 2);
      })
      .slice(0, 8),
    [actionItems]
  );

  return (
    <AppShell
      title="Executive Dashboard"
      subtitle={`NÈKO · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`}
      onExportExcel={() => downloadCsv("neko-executive-summary.csv", customers.map(c => ({
        Customer: c.customer_name, Health: c.health, Initiatives: c.initiativeCount,
        "Open RMs": c.openRmTickets, "Total RMs": c.totalRmTickets,
        "Open Actions": c.openActionItems, Blockers: c.blockerCount, Risk: c.riskLevel,
      })))}
      onExportPdf={exportPdf}
    >
      {/* KPI Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Customers" value={kpis.totalCustomers} />
        <KpiCard label="Initiatives" value={kpis.totalInitiatives} sub="in flight" />
        <KpiCard label="Open RMs" value={kpis.openRm} color="text-status-caution" sub={`of ${kpis.totalRm}`} />
        <KpiCard label="Stale RMs" value={kpis.staleRm} color={kpis.staleRm > 0 ? "text-status-caution" : ""} sub="> 21 days" />
        <KpiCard label="At Risk" value={kpis.atRiskCustomers} color={kpis.atRiskCustomers > 0 ? "text-destructive" : ""} sub="customers" />
        <KpiCard label="Blocked" value={kpis.blockedRm} color={kpis.blockedRm > 0 ? "text-destructive" : ""} />
        <KpiCard label="High Priority" value={kpis.highPriorityActions} color="text-status-caution" sub="actions" />
        <KpiCard label="Overdue" value={kpis.overdueActions} color={kpis.overdueActions > 0 ? "text-destructive" : "text-status-on-track"} sub="items" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Open Actions" value={kpis.openActions} sub={`of ${kpis.totalActions}`} />
        <KpiCard label="Renewals" value={kpis.totalRenewals} sub="tracked" />
        <KpiCard label="Key Dates" value={kpis.totalKeyDates} sub="upcoming" />
        <KpiCard label="Meetings" value={kpis.totalMeetings} sub="recorded" />
      </section>

      {/* Charts Row 1 */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Portfolio Health</h3>
          <p className="text-xs text-muted-foreground mb-4">Customer health distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {healthData.map(e => <Cell key={e.name} fill={HEALTH_COLORS[e.name] || "hsl(220,15%,55%)"} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">RM Status Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">All {kpis.totalRm} Redmine tickets</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={rmStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={2} dataKey="value">
                {rmStatusData.map(e => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

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
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Open RMs by Customer</h3>
          <p className="text-xs text-muted-foreground mb-4">Workload distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rmByCustomer} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Workload by Owner</h3>
          <p className="text-xs text-muted-foreground mb-4">Open RMs assigned per person</p>
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
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Customer Health</h3>
              <p className="text-xs text-muted-foreground">Quick-scan portfolio</p>
            </div>
            <Link to="/customer-summary" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {[...customers]
              .sort((a, b) => {
                const order: Record<string, number> = { "At Risk": 0, Caution: 1, Healthy: 2, "On Track": 2 };
                return (order[a.health] ?? 2) - (order[b.health] ?? 2);
              })
              .slice(0, 10)
              .map(c => (
                <Link key={c.slug} to={`/customers/${c.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HealthBadge health={c.health} />
                    <span className="text-sm font-medium text-foreground truncate group-hover:text-primary">{c.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                    <span>{c.openRmTickets} RMs</span>
                    <span>{c.openActionItems} actions</span>
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
              <p className="text-xs text-muted-foreground">Highest priority open</p>
            </div>
            <Link to="/action-items" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topActions.map(a => (
              <div key={a.id} className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <p className="text-sm text-foreground line-clamp-1">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span className="text-primary">{a.customer_name}</span>
                  <span>·</span>
                  <span>{a.owner}</span>
                  {a.due_date && (
                    <>
                      <span>·</span>
                      <span className={new Date(a.due_date).getTime() < now ? "text-destructive font-medium" : ""}>{a.due_date}</span>
                    </>
                  )}
                  <PriorityBadge priority={a.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Key Dates */}
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
              <span className="text-sm font-semibold text-foreground">Blocked / High Risk</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{kpis.blockedRm}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Require intervention</p>
          </Link>
          <Link to="/action-items" className="p-4 rounded-xl border border-status-caution/20 bg-status-caution/5 hover:bg-status-caution/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-status-caution" />
              <span className="text-sm font-semibold text-foreground">Overdue Actions</span>
            </div>
            <p className="text-2xl font-bold text-status-caution">{kpis.overdueActions}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Past due date</p>
          </Link>
          <Link to="/rm-issues" className="p-4 rounded-xl border border-status-caution/20 bg-status-caution/5 hover:bg-status-caution/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-status-caution" />
              <span className="text-sm font-semibold text-foreground">Stale RMs</span>
            </div>
            <p className="text-2xl font-bold text-status-caution">{kpis.staleRm}</p>
            <p className="text-xs text-muted-foreground mt-0.5">No update in 21+ days</p>
          </Link>
          <Link to="/renewals" className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Upcoming Renewals</span>
            </div>
            <p className="text-2xl font-bold text-primary">{kpis.totalRenewals}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tracked renewal dates</p>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
