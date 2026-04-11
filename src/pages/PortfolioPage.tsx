import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportPortfolioPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

function KpiCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded border bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div>;
}

export default function PortfolioPage() {
  const customersNeedingAction = snap.byCustomer.filter((c) => c.openActions > 0);
  const blockedOrTbd = snap.byCustomer.filter((c) => c.blockedOrTbd > 0);

  return (
    <main id="portfolio-root" className="min-h-screen bg-slate-50 px-4 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">CFS Projects Team Portfolio Dashboard</h1>
              <p className="text-sm text-slate-600">Executive PMO status tracker from cleaned structured dataset.</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("portfolio-dashboard", snap.byCustomer)}>Excel Export</button>
              <button className="rounded border px-3 py-1 text-sm" onClick={exportPortfolioPdf}>Portfolio PDF</button>
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-4 text-sm text-blue-700 underline">
            <Link to="/customer-summary">Customer Summary</Link>
            <Link to="/action-items">Action Items</Link>
            <Link to="/key-dates">Key Dates</Link>
          </nav>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <KpiCard label="Customers" value={snap.seed.customers.length} />
          <KpiCard label="Projects" value={snap.seed.projects.length} />
          <KpiCard label="Open Action Items" value={snap.seed.actionItems.length} />
          <KpiCard label="Open Risks" value={snap.seed.risks.filter((r) => r.status === "OPEN").length} />
          <KpiCard label="Upcoming Dates" value={snap.upcomingDates.length} />
          <KpiCard label="Renewals" value={snap.renewalRows.length} />
          <KpiCard label="Customers Needing Action" value={customersNeedingAction.length} />
          <KpiCard label="Blocked/TBD Customers" value={blockedOrTbd.length} />
        </section>

        <section className="rounded border bg-white p-4 overflow-x-auto">
          <h2 className="mb-2 font-semibold">By-Customer Summary</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Projects</th><th>Next Date</th><th>Renewals</th><th>Open Actions</th><th>Blocked/TBD</th><th>Open Risks</th><th>Status</th></tr></thead>
            <tbody>{snap.byCustomer.map((row) => <tr className="border-b" key={row.customer}><td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customerSlug}`}>{row.customer}</Link></td><td>{row.projectCount}</td><td>{row.nextDate}</td><td>{row.renewals}</td><td>{row.openActions}</td><td>{row.blockedOrTbd}</td><td>{row.openRisks}</td><td>{row.topStatus}</td></tr>)}</tbody>
          </table>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Upcoming Dates</h2>
            <ul className="space-y-1 text-sm">{snap.upcomingDates.slice(0, 8).map((d, i) => <li key={i}><strong>{d.customer}</strong> · {d.milestone} · {d.date}</li>)}</ul>
          </section>
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Renewals</h2>
            <ul className="space-y-1 text-sm">{snap.renewalRows.map((r, i) => <li key={i}><strong>{r.customer}</strong> · {r.renewalDate} · {r.status}</li>)}</ul>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-2 print-break-before">
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Customers Needing Action</h2>
            <ul className="list-disc pl-5 text-sm">{customersNeedingAction.map((c) => <li key={c.customer}>{c.customer} ({c.openActions} action items)</li>)}</ul>
          </section>
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Customers with Blocked or TBD Items</h2>
            <ul className="list-disc pl-5 text-sm">{blockedOrTbd.map((c) => <li key={c.customer}>{c.customer} ({c.blockedOrTbd} blocked/TBD projects)</li>)}</ul>
          </section>
        </section>
      </section>
    </main>
  );
}
