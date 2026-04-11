import { Link } from "react-router-dom";
import { action_items, projects, customer_sites, customers } from "@/data/cfsPortfolioRebuild";
import { downloadCsvFile, exportSectionToPdf } from "@/lib/exportUtils";

export default function ActionItemsPage() {
  const rows = action_items.map((action) => {
    const project = projects.find((entry) => entry.project_id === action.project_id);
    const customer = customers.find((entry) => entry.customer_id === project?.customer_id);
    const site = customer_sites.find((entry) => entry.site_id === project?.site_id);

    return {
      Customer: customer?.customer_name ?? "TBD",
      Site: site?.site_name ?? "Program",
      Project: project?.project_name ?? "TBD",
      "Action Item": action.action_text,
      Owner: action.owner ?? "TBD",
      "Due Date": action.due_date,
      Status: action.status,
      Priority: action.priority,
      "Dependency / Blocker": action.blocker ?? "None",
      Notes: action.notes,
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Action Items View</h1>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={() => downloadCsvFile("action-items.xlsx.csv", rows)}>Export Action Items to Excel</button>
            <button className="rounded border px-3 py-1 text-sm" onClick={exportSectionToPdf}>Export Action Items to PDF</button>
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
