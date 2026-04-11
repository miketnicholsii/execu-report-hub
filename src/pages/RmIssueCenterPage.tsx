import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function RmIssueCenterPage() {
  const rows = snap.rmRows;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">RM / Issue Center</h1>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("rm-issues", rows)}>Export</button>
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("rm-issues-root")}>PDF</button>
            <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
          </div>
        </header>

        <section id="rm-issues-root" className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Project</th><th>RM Ref</th><th>Status</th><th>Urgency</th><th>Owner</th><th>Description</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id} className="border-b align-top"><td className="py-2">{row.customer}</td><td>{row.project}</td><td className="font-medium">{row.rmReference}</td><td>{row.status}</td><td>{row.urgency}</td><td>{row.owner}</td><td>{row.description}</td></tr>)}</tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
