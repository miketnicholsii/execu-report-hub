import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();
type SortKey = "customer" | "projectCount" | "openActions" | "openRmCount";

export default function CustomerSummaryPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("customer");

  const rows = useMemo(() => {
    const filtered = snap.byCustomer.filter((row) => row.customer.toLowerCase().includes(query.toLowerCase()) || row.health.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => (sortBy === "customer" ? a.customer.localeCompare(b.customer) : (b[sortBy] as number) - (a[sortBy] as number)));
  }, [query, sortBy]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">Customer Summary</h1>
            <div className="flex gap-2">
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("customer-summary", rows)}>Export</button>
              <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <input className="rounded border px-3 py-2 text-sm" placeholder="Filter customer or health" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="rounded border px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
              <option value="customer">Sort: Customer</option><option value="projectCount">Sort: Projects</option><option value="openActions">Sort: Open Actions</option><option value="openRmCount">Sort: Open RM</option>
            </select>
          </div>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Health</th><th>Projects</th><th>Milestone</th><th>Open Actions</th><th>Open RM</th><th>Blockers</th></tr></thead>
            <tbody>{rows.map((row) => <tr className="border-b" key={row.customer}><td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customerSlug}`}>{row.customer}</Link></td><td>{row.health}</td><td>{row.projectCount}</td><td>{row.nextDate}</td><td>{row.openActions}</td><td>{row.openRmCount}</td><td>{row.openRisks}</td></tr>)}</tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
