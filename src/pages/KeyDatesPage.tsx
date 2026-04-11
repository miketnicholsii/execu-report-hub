import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function KeyDatesPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">Key Dates</h1>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("key-dates", snap.keyDateRows)}>Export</button>
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("key-dates-root")}>PDF</button>
            <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
          </div>
        </header>

        <section id="key-dates-root" className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Project</th><th>Date Type</th><th>Date</th><th>Milestone</th><th>Confidence</th></tr></thead><tbody>{snap.keyDateRows.map((row) => <tr key={row.id} className="border-b"><td className="py-2">{row.customer}</td><td>{row.project}</td><td>{row.dateType}</td><td>{row.displayDate}</td><td>{row.milestone}</td><td>{row.confidence}</td></tr>)}</tbody></table>
        </section>
      </section>
    </main>
  );
}
