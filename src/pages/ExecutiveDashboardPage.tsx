import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area,
} from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import CompanySummaryNarrative from "@/components/CompanySummaryNarrative";
import { HealthBadge, PriorityBadge, HealthDot, StatusBadge, FlagBadge } from "@/components/StatusBadge";
import CopyButton, { rowsToTsv } from "@/components/CopyButton";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import {
  AlertTriangle, Clock, ChevronRight, Activity, Users, TrendingUp,
  Target, FileText, Calendar, Shield, Zap, BarChart3,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--forest-muted))",
  "hsl(var(--sand))", "hsl(var(--teal-accent))",
];

const HEALTH_COLORS: Record<string, string> = {
  Healthy: "hsl(var(--status-on-track))", "On Track": "hsl(var(--status-on-track))",
  Caution: "hsl(var(--status-caution))", Watch: "hsl(var(--status-caution))",
  "At Risk": "hsl(var(--status-at-risk))", Critical: "hsl(var(--destructive))",
};

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "hsl(var(--muted-foreground))", Discovery: "hsl(var(--chart-5))",
  "In Development": "hsl(var(--status-info))", "In Testing": "hsl(var(--status-caution))",
  "In Progress": "hsl(var(--status-info))", "In Review": "hsl(var(--chart-5))",
  "Drafting Spec": "hsl(var(--chart-5))", "Spec Review": "hsl(var(--chart-5))",
  Complete: "hsl(var(--status-on-track))", Deployed: "hsl(var(--status-on-track))",
  Blocked: "hsl(var(--status-blocked))", Open: "hsl(var(--status-caution))",
  "Waiting on Customer": "hsl(var(--status-waiting))", "Waiting on CFS": "hsl(var(--status-caution))",
  Live: "hsl(var(--status-on-track))", "Ready to Deploy": "hsl(var(--status-on-track))",
  "On Hold": "hsl(var(--muted-foreground))", Monitoring: "hsl(var(--teal-accent))",
};

const CLOSED = ["Complete", "Deployed", "Closed", "Live", "Shipped", "Done"];

export default function ExecutiveDashboardPage() {
  const { customers, rmTickets, actionItems, kpis, keyDates, dataQuality, initiatives } = useUnifiedData();

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
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "hsl(var(--muted-foreground))" }));
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
      .sort((a, b) => Date.parse(a.date ?? "") - Date.parse(b.date ?? ""))
      .slice(0, 5),
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
      .slice(0, 6),
    [actionItems]
  );

  /* ── Critical / flagged RMs ── */
  const criticalRms = useMemo(() =>
    rmTickets
      .filter(r => !CLOSED.includes(r.status) && (r.flags.includes("Blocked") || r.flags.includes("Stale") || r.overdue))
      .sort((a, b) => b.flags.length - a.flags.length)
      .slice(0, 6),
    [rmTickets]
  );

  const agingColors = ["hsl(var(--status-on-track))", "hsl(var(--chart-5))", "hsl(var(--status-caution))", "hsl(var(--status-at-risk))", "hsl(var(--status-blocked))"];

  return (
    <AppShell
      title="Command Center"
      subtitle={`NÈKO · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`}
      onExportExcel={() => downloadCsv("neko-executive-summary.csv", customers.map(c => ({
        Customer: c.customer_name, Health: c.health, Initiatives: c.initiativeCount,
        "Open RMs": c.openRmTickets, "Total RMs": c.totalRmTickets,
        "Open Actions": c.openActionItems, Blockers: c.blockerCount, Risk: c.riskLevel,
      })))}
      onExportPdf={exportPdf}
    >
      {/* ═══ Hero KPI Strip ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 stagger-children">
        <KpiCard label="Customers" value={kpis.totalCustomers} icon={<Users className="h-3.5 w-3.5" />} />
        <KpiCard label="Initiatives" value={kpis.totalInitiatives} icon={<Target className="h-3.5 w-3.5" />} sub="in flight" />
        <KpiCard label="Open RMs" value={kpis.openRm} color="text-status-caution" sub={`of ${kpis.totalRm}`} />
        <KpiCard label="Stale RMs" value={kpis.staleRm} color={kpis.staleRm > 0 ? "text-status-caution" : ""} sub="> 21 days" pulse={kpis.staleRm > 5} />
        <KpiCard label="At Risk" value={kpis.atRiskCustomers} color={kpis.atRiskCustomers > 0 ? "text-destructive" : ""} sub="customers" pulse={kpis.atRiskCustomers > 0} />
        <KpiCard label="Blocked" value={kpis.blockedRm} color={kpis.blockedRm > 0 ? "text-destructive" : ""} />
        <KpiCard label="High Priority" value={kpis.highPriorityActions} color="text-status-caution" sub="actions" />
        <KpiCard label="Overdue" value={kpis.overdueActions} color={kpis.overdueActions > 0 ? "text-destructive" : "text-status-on-track"} sub="items" pulse={kpis.overdueActions > 3} />
      </section>

      {/* ═══ Operational Intelligence Row ═══ */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Data Quality Score */}
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h3 className="section-header">Operational Health Score</h3>
                <p className="section-subtitle">Data hygiene · coverage · freshness</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-black tracking-tight ${dataQuality.score >= 85 ? "text-status-on-track" : dataQuality.score >= 70 ? "text-status-caution" : "text-destructive"}`}>
                {dataQuality.score}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">/ 100</p>
            </div>
          </div>
          {/* Health bar */}
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-700 ${dataQuality.score >= 85 ? "bg-status-on-track" : dataQuality.score >= 70 ? "bg-status-caution" : "bg-destructive"}`}
              style={{ width: `${dataQuality.score}%` }}
            />
          </div>
          <div className="grid sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-border/60 p-3 bg-muted/15">
              <p className="metric-label">Missing Owners</p>
              <p className="text-xl font-bold mt-1">{dataQuality.missingRmOwners + dataQuality.missingActionOwners}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-3 bg-muted/15">
              <p className="metric-label">Stale / Aging</p>
              <p className="text-xl font-bold mt-1">{dataQuality.staleOpenRm}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-3 bg-muted/15">
              <p className="metric-label">Overdue Actions</p>
              <p className="text-xl font-bold mt-1 text-destructive">{dataQuality.overdueOpenActions}</p>
            </div>
            <div className="rounded-xl border border-border/60 p-3 bg-muted/15">
              <p className="metric-label">Due in 14 Days</p>
              <p className="text-xl font-bold mt-1">{dataQuality.upcomingDueIn14Days}</p>
            </div>
          </div>
        </div>

        {/* Next 30 Days */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="section-header">Next 30 Days</h3>
              <p className="section-subtitle">Critical dates approaching</p>
            </div>
            <Link to="/key-dates" className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center italic">No upcoming dates</p>}
            {upcoming.map((d, idx) => (
              <div key={`${d.id}-${idx}`} className="rounded-lg border border-border/50 p-2.5 hover:bg-muted/20 transition-colors">
                <p className="text-xs font-semibold text-foreground truncate">{d.customer}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{d.displayDate} · {d.milestone || "Milestone"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Executive Narrative Summary ═══ */}
      <CompanySummaryNarrative kpis={kpis} {...narrativeData} />

      {/* ═══ Charts Row 1: Health · Status · Aging ═══ */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="section-header mb-1">Portfolio Health</h3>
          <p className="section-subtitle mb-4">Customer distribution by health status</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {healthData.map(e => <Cell key={e.name} fill={HEALTH_COLORS[e.name] || "hsl(var(--muted-foreground))"} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card">
          <h3 className="section-header mb-1">RM Status Distribution</h3>
          <p className="section-subtitle mb-4">All {kpis.totalRm} tickets</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={rmStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={76} paddingAngle={2} dataKey="value">
                {rmStatusData.map(e => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card">
          <h3 className="section-header mb-1">RM Aging</h3>
          <p className="section-subtitle mb-4">Open tickets by days since last update</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agingBuckets} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {agingBuckets.map((_, i) => <Cell key={i} fill={agingColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ═══ Charts Row 2: Customer Workload · Owner Workload ═══ */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-header">Open RMs by Customer</h3>
              <p className="section-subtitle">Workload concentration</p>
            </div>
            <CopyButton content={() => rowsToTsv(rmByCustomer.map(c => ({ Customer: c.name, "Open RMs": c.value })))} label="Copy" iconOnly size="sm" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={rmByCustomer} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-header">Workload by Owner</h3>
              <p className="section-subtitle">Open RMs per person</p>
            </div>
            <CopyButton content={() => rowsToTsv(ownerData.map(o => ({ Owner: o.name, "Open RMs": o.value })))} label="Copy" iconOnly size="sm" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ownerData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {ownerData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ═══ Bottom Intelligence Panels ═══ */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Customer Health Grid */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-header">Customer Health</h3>
              <p className="section-subtitle">Quick-scan portfolio</p>
            </div>
            <Link to="/customer-summary" className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-0.5">
            {[...customers]
              .sort((a, b) => {
                const order: Record<string, number> = { "At Risk": 0, Critical: 0, Caution: 1, Watch: 1, Healthy: 2, "On Track": 2 };
                return (order[a.health] ?? 2) - (order[b.health] ?? 2);
              })
              .slice(0, 12)
              .map(c => (
                <Link key={c.slug} to={`/customers/${c.slug}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HealthDot health={c.health} />
                    <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">{c.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-shrink-0">
                    <span>{c.openRmTickets} <span className="text-[9px]">RM</span></span>
                    <span>{c.openActionItems} <span className="text-[9px]">act</span></span>
                    {c.blockerCount > 0 && <span className="text-destructive font-bold">{c.blockerCount} <span className="text-[9px]">blk</span></span>}
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Top Action Items */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-header">Top Action Items</h3>
              <p className="section-subtitle">Highest priority open</p>
            </div>
            <Link to="/action-items" className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {topActions.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center italic">No open action items</p>}
            {topActions.map(a => (
              <div key={a.id} className="p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                <p className="text-[13px] text-foreground line-clamp-1 font-medium">{a.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="text-primary font-medium">{a.customer_name}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span>{a.owner}</span>
                  {a.due_date && (
                    <>
                      <span className="text-muted-foreground/30">·</span>
                      <span className={new Date(a.due_date).getTime() < now ? "text-destructive font-semibold" : ""}>{a.due_date}</span>
                    </>
                  )}
                  <PriorityBadge priority={a.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attention Flags — Critical RMs */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-header">Attention Required</h3>
              <p className="section-subtitle">Flagged RMs needing action</p>
            </div>
            <Link to="/rm-issues" className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Signal cards */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link to="/rm-issues" className="block p-2.5 rounded-xl border border-destructive/15 bg-destructive/5 hover:bg-destructive/8 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Blocked</span>
              </div>
              <p className="text-xl font-black text-destructive">{kpis.blockedRm}</p>
            </Link>
            <Link to="/action-items" className="block p-2.5 rounded-xl border border-status-caution/15 bg-status-caution/5 hover:bg-status-caution/8 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3 w-3 text-status-caution" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overdue</span>
              </div>
              <p className="text-xl font-black text-status-caution">{kpis.overdueActions}</p>
            </Link>
          </div>

          {/* Critical RM list */}
          <div className="space-y-1.5">
            {criticalRms.map(r => (
              <Link key={r.id} to={`/rm/${r.rm_number}`} className="block p-2 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-primary">{r.rm_number}</span>
                  <span className="text-[11px] text-foreground truncate flex-1">{r.title || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {r.flags.slice(0, 3).map(f => <FlagBadge key={f} flag={f} />)}
                  <span className="text-[10px] text-muted-foreground ml-auto">{r.customer_name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Dependency counts */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50">
            <div className="p-2 rounded-lg border border-border/40 bg-muted/10">
              <p className="metric-label">Wait on Cust</p>
              <p className="text-lg font-bold mt-0.5">{narrativeData.waitingOnCustomerCount}</p>
            </div>
            <div className="p-2 rounded-lg border border-border/40 bg-muted/10">
              <p className="metric-label">Wait on CFS</p>
              <p className="text-lg font-bold mt-0.5">{narrativeData.waitingOnCfsCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Secondary KPI Row ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Open Actions" value={kpis.openActions} icon={<FileText className="h-3.5 w-3.5" />} sub={`of ${kpis.totalActions}`} />
        <KpiCard label="Renewals" value={kpis.totalRenewals} icon={<TrendingUp className="h-3.5 w-3.5" />} sub="tracked" />
        <KpiCard label="Key Dates" value={kpis.totalKeyDates} icon={<Calendar className="h-3.5 w-3.5" />} sub="upcoming" />
        <KpiCard label="Meetings" value={kpis.totalMeetings} icon={<BarChart3 className="h-3.5 w-3.5" />} sub="recorded" />
      </section>
    </AppShell>
  );
}
