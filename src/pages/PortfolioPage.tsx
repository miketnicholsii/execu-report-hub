import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportPortfolioPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function PortfolioPage() {
  const customersNeedingAction = snap.byCustomer.filter((c) => c.openActions > 0);

  return (
    <main id="portfolio-root" className="min-h-screen bg-slate-100 px-4 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print-avoid-break">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-semibold">CFS Premium Portfolio Dashboard</h1>
              <p className="text-sm text-slate-600">Executive summary and deep issue tracking sourced from structured CFS dataset.</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("portfolio-dashboard", snap.byCustomer)}>Excel</button>
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={exportPortfolioPdf}>PDF</button>
            </div>
          </div>
          <nav className="mt-4 flex flex-wrap gap-4 text-sm text-blue-700 underline">
            <Link to="/customer-summary">Customer Summary</Link>
            <Link to="/rm-issues">RM / Issue Center</Link>
            <Link to="/action-items">Action Center</Link>
            <Link to="/key-dates">Key Dates</Link>
            <Link to="/renewals">Renewals</Link>
          </nav>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <KpiCard label="Customers" value={snap.seed.customers.length} />
          <KpiCard label="Open Blockers" value={snap.blockerRows.length} />
          <KpiCard label="Open RM Count" value={snap.rmRows.length} />
          <KpiCard label="Renewals" value={snap.renewalRows.length} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Upcoming Milestones</h2>
            <ul className="space-y-1 text-sm">{snap.upcomingDates.slice(0, 8).map((d, i) => <li key={i}><strong>{d.customer}</strong> · {d.milestone} · {d.date} <span className="text-xs text-slate-500">({d.confidence})</span></li>)}</ul>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Recent Deployments / Live Work</h2>
            <ul className="space-y-1 text-sm">{snap.seed.projects.filter((p) => ["Live", "Complete"].includes(p.normalizedStatus)).slice(0, 8).map((p) => <li key={p.project_id}>{p.project_name} · <span className="text-slate-500">{p.normalizedStatus}</span></li>)}</ul>
          </section>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-x-auto print-break-before">
          <h2 className="mb-2 font-semibold">Premium Portfolio Table</h2>
          <table className="w-full text-sm print-compact-table">
            <thead className="sticky top-0 bg-white"><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Health</th><th>Projects</th><th>Upcoming Milestone</th><th>Open Actions</th><th>Open RM</th><th>Blockers</th><th>Renewals</th></tr></thead>
            <tbody>{snap.byCustomer.map((row) => <tr className="border-b" key={row.customer}><td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customerSlug}`}>{row.customer}</Link></td><td>{row.health}</td><td>{row.projectCount}</td><td>{row.nextDate}</td><td>{row.openActions}</td><td>{row.openRmCount}</td><td>{row.openRisks}</td><td>{row.renewals}</td></tr>)}</tbody>
          </table>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Customers Needing Attention</h2>
            <ul className="list-disc pl-5 text-sm">{customersNeedingAction.map((c) => <li key={c.customer}>{c.customer} ({c.openActions} actions)</li>)}</ul>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Renewal Summary</h2>
            <ul className="space-y-1 text-sm">{snap.renewalRows.slice(0, 8).map((r) => <li key={r.id}><strong>{r.customer}</strong> · {r.renewalDate} · {r.status}</li>)}</ul>
          </section>
        </section>
      </section>
    </main>
  );
}
