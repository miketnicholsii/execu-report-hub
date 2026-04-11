import { Link } from "react-router-dom";
import { customers, renewals } from "@/data/cfsPortfolioRebuild";
import { downloadCsvFile, exportSectionToPdf } from "@/lib/exportUtils";

export default function RenewalsPage() {
  const rows = renewals.map((renewal) => ({
    Customer: customers.find((customer) => customer.customer_id === renewal.customer_id)?.customer_name ?? "TBD",
    Type: renewal.renewal_type,
    Date: renewal.renewal_date,
    Status: renewal.status,
    Notes: renewal.notes,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6">
      <section className="mx-auto max-w-5xl space-y-4">
        <header className="rounded border bg-white p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Software Renewal Summary</h1>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={() => downloadCsvFile("renewals.xlsx.csv", rows)}>Export Renewals to Excel</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={exportSectionToPdf}>Export Renewals to PDF</button>
            <Link className="rounded border px-3 py-1 text-sm" to="/portfolio">Back to Portfolio</Link>
          </div>
        </header>
        <section className="rounded border bg-white p-4 overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b text-left text-slate-500">{Object.keys(rows[0] ?? {}).map((header) => <th key={header} className="py-2">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.Customer}-${index}`} className="border-b align-top">{Object.values(row).map((value, i) => <td key={i} className="py-2 pr-2">{String(value)}</td>)}</tr>)}</tbody></table>
        </section>
      </section>
    </main>
  );
}
