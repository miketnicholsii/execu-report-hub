import { Link } from "react-router-dom";
import { getPortfolioSnapshot } from "@/lib/cfs/selectors";
import { exportDatasetToExcel, exportSectionToPdf } from "@/lib/exportUtils";

const snap = getPortfolioSnapshot();

export default function RenewalsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Renewals</h1>
          <div className="flex gap-2">
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportDatasetToExcel("renewals", snap.renewalRows)}>Export</button>
            <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportSectionToPdf("renewals-root")}>PDF</button>
            <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
          </div>
        </header>
        <section id="renewals-root" className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Type</th><th>Date</th><th>Date Confidence</th><th>Status</th><th>Quote</th><th>Summary</th></tr></thead><tbody>{snap.renewalRows.map((row) => <tr key={row.id} className="border-b align-top"><td className="py-2">{row.customer}</td><td>{row.type}</td><td>{row.renewalDate}</td><td>{row.confidence}</td><td>{row.status}</td><td>{row.quoteNumber}</td><td>{row.summary}</td></tr>)}</tbody></table>
        </section>
      </section>
    </main>
  );
}
