import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge } from "@/components/StatusBadge";
import { getCustomerOverviews, getTrackerRows, getRmDetailRows, getActionDetailRows, getKeyDateRows, getRenewalRows, seed, projectById, customerById } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";

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

const ownerCounts: Record<string, number> = {};
trackerRows.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status)).forEach((t) => {
  ownerCounts[t.owner] = (ownerCounts[t.owner] || 0) + 1;
});
const ownerData = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

const exportAll = () => {
  downloadCsv("cfs-portfolio-overview.csv", customers.map((c) => ({
    Customer: c.customer_name, Health: c.health, Projects: c.projectCount,
    "Open Items": c.openItems, "Total Items": c.totalItems, "Open RM": c.openRm,
    "Action Items": c.actionCount, Blockers: c.blockerCount, "Next Milestone": c.nextMilestone,
    Renewals: c.renewals,
  })));
};

export default function PortfolioPage() {
  return (
    <AppShell title="CFS Portfolio Dashboard" subtitle={`Executive Overview · ${new Date().toLocaleDateString()}`} onExportExcel={exportAll} onExportPdf={exportPdf}>
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Customers" value={customers.length} />
        <KpiCard label="Active Projects" value={totalProjects} />
        <KpiCard label="Open Items" value={openItems} color="text-status-caution" />
        <KpiCard label="Open RM Issues" value={openRm} color="text-status-at-risk" />
        <KpiCard label="Action Items" value={actionRows.length} />
        <KpiCard label="At Risk" value={atRiskCustomers} color="text-destructive" />
        <KpiCard label="Ready to Deploy" value={testingCompleteCount} color="text-status-on-track" />
        <KpiCard label="Upcoming Renewals" value={renewals.length} />
      </section>

      {/* Charts */}
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
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Projects by Phase</h3>
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
      </section>

      {/* Customer Portfolio Table */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm overflow-x-auto">
        <h2 className="font-semibold mb-3 text-foreground">Customer Portfolio</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-3">Customer</th><th className="pr-3">Health</th><th className="pr-3">Projects</th>
            <th className="pr-3">Open / Total</th><th className="pr-3">Open RM</th><th className="pr-3">Actions</th>
            <th className="pr-3">Blockers</th><th className="pr-3">Next Milestone</th><th>Renewals</th>
          </tr></thead>
          <tbody>{customers.sort((a, b) => a.customer_name.localeCompare(b.customer_name)).map((c) => (
            <tr key={c.customer_id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="py-2.5 pr-3"><Link to={`/customers/${c.slug}`} className="text-primary font-medium hover:underline">{c.customer_name}</Link></td>
              <td className="pr-3"><HealthBadge health={c.health} /></td>
              <td className="pr-3">{c.projectCount}</td>
              <td className="pr-3"><span className="font-medium">{c.openItems}</span> / {c.totalItems}</td>
              <td className="pr-3">{c.openRm}</td>
              <td className="pr-3">{c.actionCount}</td>
              <td className="pr-3">{c.blockerCount > 0 ? <span className="text-destructive font-medium">{c.blockerCount}</span> : "0"}</td>
              <td className="pr-3 text-xs">{c.nextMilestone}</td>
              <td>{c.renewals}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      {/* Quick Glance: Upcoming Dates + Renewals */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-foreground">Upcoming Key Dates</h2>
            <Link to="/key-dates" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2 text-sm">
            {keyDates.slice(0, 6).map((d) => (
              <div key={d.id} className={`flex items-center justify-between py-1 border-b border-border/50 ${d.isPast ? "text-destructive" : ""}`}>
                <div><span className="font-medium">{d.customer}</span> · {d.milestone}</div>
                <div className="text-xs text-muted-foreground">{d.displayDate}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-foreground">Renewal Pipeline</h2>
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
          <h2 className="font-semibold text-destructive mb-2">Active Blockers ({seed.blockers.length})</h2>
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

      <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        CFS Projects Team · Last updated {new Date().toLocaleDateString()} · Prepared for Executive Review
      </footer>
    </AppShell>
  );
}
