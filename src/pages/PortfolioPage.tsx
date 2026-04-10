import { Link } from "react-router-dom";
import { downloadCsv, exportActionCsv, exportTrackerCsv } from "@/lib/cfs/csv";
import { REQUIRED_CUSTOMER_ROUTES, SHEET_MAPPING_RULES } from "@/lib/cfs/config";
import { portfolioStore } from "@/lib/cfs/portfolio";

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function PortfolioPage() {
  const { customerSummaries, normalizedItems, actionItems, audit } = portfolioStore;

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded border bg-card p-4">
          <h1 className="text-2xl font-bold">CFS Status Tracker Portfolio</h1>
          <p className="text-sm text-muted-foreground">Standardized tracker records with source row traceability and customer breakouts.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv("cfs-all-standardized.csv", exportTrackerCsv(normalizedItems))}>Download CSV - portfolio all-data</button>
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv("cfs-all-action-items.csv", exportActionCsv(actionItems))}>Download CSV - portfolio all-action-items</button>
            <button
              className="rounded border px-3 py-1.5 text-sm"
              onClick={() => {
                const deploymentOnly = normalizedItems.filter((item) => ["Deployments", "Pending Deployment"].includes(item.source_sheet));
                downloadCsv("cfs-portfolio-deployment-summary.csv", exportTrackerCsv(deploymentOnly));
              }}
            >
              Download CSV - portfolio deployment summary
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard label="Customers" value={customerSummaries.length} />
          <MetricCard label="Active Projects / Open Items" value={normalizedItems.filter((item) => item.source_sheet === "Open").length} />
          <MetricCard label="Pending Deployments" value={normalizedItems.filter((item) => item.source_sheet === "Pending Deployment").length} />
          <MetricCard label="Completed Items" value={normalizedItems.filter((item) => item.source_sheet === "Complete").length} />
          <MetricCard label="Deployed Code Changes" value={normalizedItems.filter((item) => item.source_sheet === "Deployments").length} />
          <MetricCard label="Action Items" value={actionItems.length} />
          <MetricCard label="Blockers / Risks" value={normalizedItems.filter((item) => item.blocker_flag).length} />
          <MetricCard label="Upcoming Dates / Milestones" value={normalizedItems.filter((item) => item.target_eta || item.milestone_date).length} />
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="mb-2 font-semibold">Required Customer Routes</h2>
          <ul className="list-disc pl-5 text-sm">
            {REQUIRED_CUSTOMER_ROUTES.map((route) => (
              <li key={route}><Link className="text-primary underline" to={route}>{route}</Link></li>
            ))}
          </ul>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="mb-2 font-semibold">Customer Breakouts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Customer</th>
                  <th>Open</th>
                  <th>Action Items</th>
                  <th>Pending Deploy</th>
                  <th>Completed</th>
                  <th>Deployed</th>
                  <th>Blockers</th>
                </tr>
              </thead>
              <tbody>
                {customerSummaries.map((summary) => (
                  <tr key={summary.customer_slug} className="border-b last:border-none">
                    <td className="py-2">
                      <Link className="text-primary underline-offset-4 hover:underline" to={`/customers/${summary.customer_slug}`}>
                        {summary.customer_name}
                      </Link>
                    </td>
                    <td>{summary.open_items_count}</td>
                    <td>{summary.action_items_count}</td>
                    <td>{summary.pending_deployments_count}</td>
                    <td>{summary.completed_items_count}</td>
                    <td>{summary.deployed_count}</td>
                    <td>{summary.blockers_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="mb-2 font-semibold">Sheet Mapping Rules</h2>
          <ul className="grid gap-1 text-sm">
            {Object.entries(SHEET_MAPPING_RULES).map(([source, target]) => (
              <li key={source}><span className="font-medium">{source}</span> → {target}</li>
            ))}
          </ul>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="mb-2 font-semibold">Data Integrity Audit (fails loudly)</h2>
          <ul className="grid gap-1 text-sm">
            <li>Raw row count: {audit.raw_row_count}</li>
            <li>Normalized row count: {audit.normalized_row_count}</li>
            <li>Missing status audit: {audit.missing_status_count}</li>
            <li>Missing owner audit: {audit.missing_owner_count}</li>
            <li>Unmapped row audit: {audit.unmapped_row_count}</li>
            <li>Possible duplicate audit: {audit.possible_duplicate_count}</li>
            <li>Empty export audit: {audit.empty_export_warning ? "WARNING" : "PASS"}</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
