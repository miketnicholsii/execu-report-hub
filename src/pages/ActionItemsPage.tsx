import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function ActionItemsPage() {
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");

  const owners = Array.from(new Set(snap.actionRows.map((r) => r.owner)));
  const customers = Array.from(new Set(snap.actionRows.map((r) => r.customer)));

  const rows = useMemo(
    () => snap.actionRows.filter((row) =>
      (owner === "all" || row.owner === owner)
      && (status === "all" || row.status === status)
      && (priority === "all" || row.priority === priority)
      && (customer === "all" || row.customer === customer)
      && (dueFilter === "all" || (dueFilter === "dated" ? row.dueDate !== "TBD" : row.dueDate === "TBD")),
    ),
    [owner, status, priority, customer, dueFilter],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <div className="flex flex-wrap justify-between gap-2">
            <h1 className="text-2xl font-bold">Action Items View</h1>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("action-items", rows)}>Export</button>
              <button className="rounded border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("action-items-root")}>PDF</button>
              <Link className="rounded border px-3 py-1 text-sm" to="/portfolio">Back</Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-5">
            <select className="rounded border px-2 py-1" value={owner} onChange={(e) => setOwner(e.target.value)}><option value="all">All owners</option>{owners.map((o) => <option key={o}>{o}</option>)}</select>
            <select className="rounded border px-2 py-1" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{Array.from(new Set(snap.actionRows.map((r) => r.status))).map((s) => <option key={s}>{s}</option>)}</select>
            <select className="rounded border px-2 py-1" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="all">All priority</option><option>High</option><option>Medium</option></select>
            <select className="rounded border px-2 py-1" value={customer} onChange={(e) => setCustomer(e.target.value)}><option value="all">All customers</option>{customers.map((c) => <option key={c}>{c}</option>)}</select>
            <select className="rounded border px-2 py-1" value={dueFilter} onChange={(e) => setDueFilter(e.target.value)}><option value="all">All due dates</option><option value="dated">With date</option><option value="tbd">TBD only</option></select>
          </div>
        </header>

        <section id="action-items-root" className="rounded border bg-white p-4 overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Project</th><th>Owner</th><th>Due Date</th><th>Status</th><th>Priority</th><th>Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b align-top"><td className="py-2">{row.customer}</td><td>{row.project}</td><td>{row.owner}</td><td>{row.dueDate}</td><td>{row.status}</td><td>{row.priority}</td><td>{row.text}</td></tr>)}</tbody></table>
        </section>
      </section>
    </main>
  );
}
