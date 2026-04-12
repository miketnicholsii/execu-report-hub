import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import CompanySummaryNarrative from "@/components/CompanySummaryNarrative";
import { StatusBadge, HealthBadge, PriorityBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import {
  AlertTriangle, Clock, ChevronRight, Activity, Users, TrendingUp,
  Layers, Target, FileText, Calendar,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(140,14%,22%)", "hsl(155,45%,35%)", "hsl(18,86%,46%)",
  "hsl(0,55%,45%)", "hsl(200,45%,40%)", "hsl(175,30%,38%)",
  "hsl(35,75%,45%)", "hsl(130,5%,39%)",
];
const HEALTH_COLORS: Record<string, string> = {
  Healthy: "hsl(155,45%,35%)", "On Track": "hsl(155,45%,35%)",
  Caution: "hsl(35,75%,45%)", "At Risk": "hsl(18,86%,46%)",
};
const STATUS_COLORS: Record<string, string> = {
  "Not Started": "hsl(20,10%,55%)", Discovery: "hsl(280,35%,50%)",
  "In Development": "hsl(280,28%,42%)", "In Testing": "hsl(35,80%,48%)",
  "In Progress": "hsl(280,28%,42%)", "In Review": "hsl(280,35%,50%)",
  "Drafting Spec": "hsl(280,35%,50%)", "Spec Review": "hsl(280,35%,50%)",
  Complete: "hsl(155,50%,38%)", Deployed: "hsl(155,50%,38%)",
  Blocked: "hsl(0,55%,48%)", Open: "hsl(35,80%,48%)",
  "Waiting on Customer": "hsl(12,60%,50%)", "Waiting on CFS": "hsl(38,35%,65%)",
  Live: "hsl(155,50%,38%)", "Ready to Deploy": "hsl(155,50%,38%)",
  "On Hold": "hsl(20,10%,55%)", Monitoring: "hsl(175,35%,42%)",
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
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "hsl(20,10%,55%)" }));
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

  /* ── Narrative data ── */
  const narrativeData = useMemo(() => {
    const openRms = rmTickets.filter(r => !CLOSED.includes(r.status));
    const staleByCustomer: Record<string, number> = {};
    openRms.filter(r => r.flags.includes("Stale") || r.flags.includes("Aging")).forEach(r => {
      staleByCustomer[r.customer_name] = (staleByCustomer[r.customer_name] || 0) + 1;
    });

    return {
      topCustomersByOpenRms: rmByCustomer.map(c => ({ name: c.name, count: c.value })),
      topCustomersByStale: Object.entries(staleByCustomer).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      waitingOnCustomerCount: rmTickets.filter(r => r.status === "Waiting on Customer").length,
      waitingOnCfsCount: rmTickets.filter(r => r.status === "Waiting on CFS").length,
      inDevelopmentCount: rmTickets.filter(r => r.status === "In Development").length,
      inTestingCount: rmTickets.filter(r => r.status === "In Testing").length,
      completeCount: rmTickets.filter(r => CLOSED.includes(r.status)).length,
      recentlyUpdatedCount: rmTickets.filter(r => r.days_since_update !== null && r.days_since_update <= 7).length,
    };
  }, [rmTickets, rmByCustomer]);

  /* ── Upcoming key dates ── */
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
        <KpiCard label="Customers" value={kpis.totalCustomers} icon={<Users className="h-3.5 w-3.5" />} />
        <KpiCard label="Initiatives" value={kpis.totalInitiatives} icon={<Target className="h-3.5 w-3.5" />} sub="in flight" />
        <KpiCard label="Open RMs" value={kpis.openRm} color="text-status-caution" sub={`of ${kpis.totalRm}`} />
        <KpiCard label="Stale RMs" value={kpis.staleRm} color={kpis.staleRm > 0 ? "text-status-caution" : ""} sub="> 21 days" />
        <KpiCard label="At Risk" value={kpis.atRiskCustomers} color={kpis.atRiskCustomers > 0 ? "text-destructive" : ""} sub="customers" />
        <KpiCard label="Blocked" value={kpis.blockedRm} color={kpis.blockedRm > 0 ? "text-destructive" : ""} />
        <KpiCard label="High Priority" value={kpis.highPriorityActions} color="text-status-caution" sub="actions" />
        <KpiCard label="Overdue" value={kpis.overdueActions} color={kpis.overdueActions > 0 ? "text-destructive" : "text-status-on-track"} sub="items" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Open Actions" value={kpis.openActions} icon={<FileText className="h-3.5 w-3.5" />} sub={`of ${kpis.totalActions}`} />
        <KpiCard label="Renewals" value={kpis.totalRenewals} icon={<TrendingUp className="h-3.5 w-3.5" />} sub="tracked" />
        <KpiCard label="Key Dates" value={kpis.totalKeyDates} icon={<Calendar className="h-3.5 w-3.5" />} sub="upcoming" />
        <KpiCard label="Meetings" value={kpis.totalMeetings} sub="recorded" />
      </section>

      {/* Executive Narrative Summary */}
      <CompanySummaryNarrative kpis={kpis} {...narrativeData} />

      {/* Charts Row 1 */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-1">Portfolio Health</h3>
          <p className="text-xs text-muted-foreground mb-4">Customer health distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {healthData.map(e => <Cell key={e.name} fill={HEALTH_COLORS[e.name] || "hsl(20,10%,55%)"} />)}
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
                  <Cell key={i} fill={["hsl(155,50%,38%)", "hsl(175,35%,42%)", "hsl(35,80%,48%)", "hsl(12,60%,50%)", "hsl(0,55%,48%)"][i]} />
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
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} stroke="hsl(var(--muted-foreground))" />
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
          <div className="space-y-1.5">
            {[...customers]
              .sort((a, b) => {
                const order: Record<string, number> = { "At Risk": 0, Caution: 1, Healthy: 2, "On Track": 2 };
                return (order[a.health] ?? 2) - (order[b.health] ?? 2);
              })
              .slice(0, 12)
              .map(c => (
                <Link key={c.slug} to={`/customers/${c.slug}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-2 min-w-0">
                    <HealthBadge health={c.health} />
                    <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary">{c.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground flex-shrink-0">
                    <span>{c.openRmTickets} RMs</span>
                    <span>{c.openActionItems} acts</span>
                    {c.blockerCount > 0 && <span className="text-destructive font-semibold">{c.blockerCount} blk</span>}
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
          <div className="space-y-1.5">
            {topActions.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No open action items</p>}
            {topActions.map(a => (
              <div key={a.id} className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <p className="text-[13px] text-foreground line-clamp-1">{a.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
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

        {/* Attention Flags */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Attention Required</h3>
              <p className="text-xs text-muted-foreground">Items needing focus</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <Link to="/rm-issues" className="block p-3 rounded-xl border border-destructive/15 bg-destructive/5 hover:bg-destructive/8 transition-colors">
              <div className="flex items-center gap-2 mb-0.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[13px] font-semibold text-foreground">Blocked / High Risk</span>
              </div>
              <p className="text-xl font-bold text-destructive">{kpis.blockedRm}</p>
            </Link>
            <Link to="/action-items" className="block p-3 rounded-xl border border-status-caution/15 bg-status-caution/5 hover:bg-status-caution/8 transition-colors">
              <div className="flex items-center gap-2 mb-0.5">
                <Clock className="h-3.5 w-3.5 text-status-caution" />
                <span className="text-[13px] font-semibold text-foreground">Overdue Actions</span>
              </div>
              <p className="text-xl font-bold text-status-caution">{kpis.overdueActions}</p>
            </Link>
            <Link to="/rm-issues" className="block p-3 rounded-xl border border-status-caution/15 bg-status-caution/5 hover:bg-status-caution/8 transition-colors">
              <div className="flex items-center gap-2 mb-0.5">
                <Activity className="h-3.5 w-3.5 text-status-caution" />
                <span className="text-[13px] font-semibold text-foreground">Stale RMs</span>
              </div>
              <p className="text-xl font-bold text-status-caution">{kpis.staleRm}</p>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Waiting on Cust</p>
                <p className="text-lg font-bold text-foreground">{narrativeData.waitingOnCustomerCount}</p>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Waiting on CFS</p>
                <p className="text-lg font-bold text-foreground">{narrativeData.waitingOnCfsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
