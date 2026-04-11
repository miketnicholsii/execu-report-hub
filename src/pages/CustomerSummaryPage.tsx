import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();
type SortKey = "customer" | "projectCount" | "openActions" | "openRisks";

export default function CustomerSummaryPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("customer");

  const rows = useMemo(() => {
    const filtered = snap.byCustomer.filter((row) => row.customer.toLowerCase().includes(query.toLowerCase()) || row.topStatus.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sortBy === "customer") return a.customer.localeCompare(b.customer);
      return (b[sortBy] as number) - (a[sortBy] as number);
    });
  }, [query, sortBy]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">Customer Summary View</h1>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("customer-summary", rows)}>Export</button>
              <Link className="rounded border px-3 py-1 text-sm" to="/portfolio">Back</Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input className="rounded border px-3 py-2 text-sm" placeholder="Filter customer or status" value={query} onChange={(event) => setQuery(event.target.value)} />
            <select className="rounded border px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
              <option value="customer">Sort: Customer</option>
              <option value="projectCount">Sort: Projects</option>
              <option value="openActions">Sort: Open Actions</option>
              <option value="openRisks">Sort: Open Risks</option>
            </select>
          </div>
        </header>

        <section className="rounded border bg-white p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Projects</th><th>Next Date</th><th>Renewals</th><th>Open Actions</th><th>Open Risks</th><th>Status</th></tr></thead>
            <tbody>{rows.map((row) => <tr className="border-b" key={row.customer}><td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customerSlug}`}>{row.customer}</Link></td><td>{row.projectCount}</td><td>{row.nextDate}</td><td>{row.renewals}</td><td>{row.openActions}</td><td>{row.openRisks}</td><td>{row.topStatus}</td></tr>)}</tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
