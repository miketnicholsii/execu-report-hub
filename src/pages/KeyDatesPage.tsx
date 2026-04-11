import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function KeyDatesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Key Dates View</h1>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("key-dates", snap.keyDateRows)}>Export</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("key-dates-root")}>PDF</button>
            <Link className="rounded border px-3 py-1 text-sm" to="/portfolio">Back</Link>
          </div>
        </header>

        <section id="key-dates-root" className="grid gap-4 md:grid-cols-2">
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Timeline</h2>
            <ol className="space-y-2 border-l pl-4">
              {snap.keyDateRows.map((row) => <li key={`tl-${row.id}`} className="relative"><span className="absolute -left-[1.15rem] top-1 h-2 w-2 rounded-full bg-blue-600" />
                <p className="text-xs text-slate-500">{row.displayDate}</p>
                <p className="text-sm"><strong>{row.customer}</strong> · {row.milestone}</p>
              </li>)}
            </ol>
          </section>

          <section className="rounded border bg-white p-4 overflow-x-auto">
            <h2 className="mb-2 font-semibold">Table</h2>
            <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Project</th><th>Date</th><th>Milestone</th><th>Confidence</th></tr></thead><tbody>{snap.keyDateRows.map((row) => <tr key={row.id} className="border-b"><td className="py-2">{row.customer}</td><td>{row.project}</td><td>{row.displayDate}</td><td>{row.milestone}</td><td>{row.confidence}</td></tr>)}</tbody></table>
          </section>
        </section>
      </section>
    </main>
  );
}
