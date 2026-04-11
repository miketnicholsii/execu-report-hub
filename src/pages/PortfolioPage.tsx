import { Link } from "react-router-dom";
import { action_items, customers, milestones, needs_review, projects, renewals, risks } from "@/data/cfsPortfolioRebuild";
import { downloadCsvFile, exportSectionToPdf } from "@/lib/exportUtils";

function card(label: string, value: number) {
  return (
    <div className="rounded border bg-white p-3" key={label}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function PortfolioPage() {
  const openActions = action_items.filter((action) => !["Complete", "Live"].includes(action.status));
  const customersWithTbdDates = new Set(milestones.filter((m) => m.milestone_date === "TBD").map((m) => projects.find((p) => p.project_id === m.project_id)?.customer_id));

  const byCustomerRows = projects.map((project) => {
    const customer = customers.find((entry) => entry.customer_id === project.customer_id);
    const nextMilestone = milestones.find((milestone) => milestone.project_id === project.project_id);
    const projectRisks = risks.filter((risk) => risk.project_id === project.project_id && risk.status !== "Closed");
    const projectAction = action_items.find((action) => action.project_id === project.project_id);

    return {
      customer: customer?.customer_name ?? "TBD",
      site: project.site_id?.replace("site-", "").replaceAll("-", " ") ?? "Program",
      project: `${project.project_name} - ${project.deliverable_name}`,
      phase: project.phase,
      status: project.status,
      milestone: nextMilestone?.milestone_name ?? "TBD",
      milestoneDate: nextMilestone?.milestone_date ?? "TBD",
      owner: project.owner ?? "TBD",
      action: projectAction?.action_text ?? "TBD",
      risks: projectRisks.map((risk) => risk.risk_text).join(" | ") || "None logged",
      lastUpdated: project.last_updated,
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">CFS Executive Portfolio Summary</h1>
              <p className="text-sm text-slate-600">Normalized CFS program and customer status tracker.</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => downloadCsvFile("portfolio-summary.xlsx.csv", byCustomerRows)}>Export Portfolio to Excel</button>
              <button className="rounded border px-3 py-1 text-sm" onClick={exportSectionToPdf}>Export Portfolio to PDF</button>
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-4 text-sm text-blue-700 underline">
            <Link to="/customer-summary">Customer Summary</Link>
            <Link to="/action-items">Action Items</Link>
            <Link to="/key-dates">Key Dates</Link>
            <Link to="/renewals">Renewals</Link>
          </nav>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {card("Total Customer Count", customers.length)}
          {card("Total Active Initiatives", projects.length)}
          {card("Open Action Items", openActions.length)}
          {card("Customers with TBD Dates", customersWithTbdDates.size)}
          {card("Upcoming Key Dates (30 rows)", milestones.length)}
          {card("Customers Needing Action This Week", action_items.filter((a) => a.due_date >= "2026-04-11" && a.due_date <= "2026-04-18").length)}
          {card("Software Renewals", renewals.length)}
          {card("Open Issues / Risks", risks.filter((r) => r.status !== "Closed").length)}
        </section>

        <section className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">By Customer Portfolio Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2">Customer</th><th>Site / Program</th><th>Project / Deliverable</th><th>Current Phase</th><th>Overall Status</th><th>Next Milestone</th><th>Next Milestone Date</th><th>Owner</th><th>Action Needed</th><th>Open Issues / Risks</th><th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {byCustomerRows.map((row) => (
                  <tr key={`${row.customer}-${row.project}`} className="border-b align-top">
                    <td className="py-2"><Link className="text-blue-700 underline" to={`/customers/${row.customer.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}>{row.customer}</Link></td>
                    <td>{row.site}</td><td>{row.project}</td><td>{row.phase}</td><td>{row.status}</td><td>{row.milestone}</td><td>{row.milestoneDate}</td><td>{row.owner}</td><td>{row.action}</td><td>{row.risks}</td><td>{row.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Needs Review / Source Ambiguities</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {needs_review.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </section>
    </main>
  );
}
