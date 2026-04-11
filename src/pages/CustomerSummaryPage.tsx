import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { action_items, customers, projects, renewals, risks, milestones } from "@/data/cfsPortfolioRebuild";
import { downloadCsvFile } from "@/lib/exportUtils";

export default function CustomerSummaryPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => customers.map((customer) => {
    const cProjects = projects.filter((project) => project.customer_id === customer.customer_id);
    const cActions = action_items.filter((action) => cProjects.some((project) => project.project_id === action.project_id));
    const cRisks = risks.filter((risk) => cProjects.some((project) => project.project_id === risk.project_id) && risk.status !== "Closed");
    const cRenewals = renewals.filter((renewal) => renewal.customer_id === customer.customer_id);
    const cMilestone = milestones.find((milestone) => cProjects.some((project) => project.project_id === milestone.project_id));
    return {
      customer: customer.customer_name,
      activeProjects: cProjects.length,
      topInitiative: cProjects[0]?.deliverable_name ?? "TBD",
      nextKeyDate: cMilestone?.milestone_date ?? "TBD",
      openActions: cActions.length,
      risks: cRisks.map((risk) => risk.risk_text).join(" | ") || "None logged",
      renewals: cRenewals.map((renewal) => `${renewal.renewal_type} (${renewal.renewal_date})`).join(" | ") || "None",
      summaryStatus: customer.summary_status,
    };
  }).filter((row) => row.customer.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">Customer Summary View</h1>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => downloadCsvFile("customer-summary.xlsx.csv", rows)}>Export Customer Summary to Excel</button>
              <Link className="rounded border px-3 py-1 text-sm" to="/portfolio">Back to Portfolio</Link>
            </div>
          </div>
          <input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Search customer..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </header>

        <section className="rounded border bg-white p-4">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Active Projects</th><th>Most Important Current Initiative</th><th>Next Key Date</th><th>Open Actions</th><th>Risks / Blockers</th><th>Renewals / Commercial Items</th><th>Summary Status</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b align-top" key={row.customer}>
                  <td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}>{row.customer}</Link></td>
                  <td>{row.activeProjects}</td><td>{row.topInitiative}</td><td>{row.nextKeyDate}</td><td>{row.openActions}</td><td>{row.risks}</td><td>{row.renewals}</td><td>{row.summaryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
