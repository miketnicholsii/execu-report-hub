import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function ActionItemsPage() {
  const [owner, setOwner] = useState("all");
  const [customer, setCustomer] = useState("all");

  const owners = Array.from(new Set(snap.actionRows.map((r) => r.owner)));
  const customers = Array.from(new Set(snap.actionRows.map((r) => r.customer)));

  const rows = useMemo(() => snap.actionRows.filter((row) => (owner === "all" || row.owner === owner) && (customer === "all" || row.customer === customer)), [owner, customer]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <h1 className="text-2xl font-semibold">Action Center</h1>
            <div className="flex gap-2">
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("action-items", rows)}>Export</button>
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("action-items-root")}>PDF</button>
              <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <select className="rounded border px-2 py-1" value={owner} onChange={(e) => setOwner(e.target.value)}><option value="all">All owners</option>{owners.map((o) => <option key={o}>{o}</option>)}</select>
            <select className="rounded border px-2 py-1" value={customer} onChange={(e) => setCustomer(e.target.value)}><option value="all">All customers</option>{customers.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        </header>

        <section id="action-items-root" className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm"><thead className="sticky top-0 bg-white"><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Project</th><th>RM Ref</th><th>Owner</th><th>Due Type</th><th>Due Date</th><th>Priority</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b align-top"><td className="py-2">{row.customer}</td><td>{row.project}</td><td>{row.rmReference}</td><td>{row.owner}</td><td>{row.dueType}</td><td>{row.dueDate}</td><td>{row.priority}</td><td>{row.text}</td></tr>)}</tbody></table>
        </section>
      </section>
    </main>
  );
}
