import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadCsv, exportActionCsv, exportRawRowsCsv, exportTrackerCsv } from "@/lib/cfs/csv";
import { getCustomerDataBySlug } from "@/lib/cfs/portfolio";

const SOURCE_TAB_FILTERS = ["All", "Open", "Complete", "Deployments", "Pending Deployment", "Archive"];

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const data = getCustomerDataBySlug(customerSlug);
  const [sourceFilter, setSourceFilter] = useState("All");

  const filteredTrackerItems = useMemo(() => {
    if (!data) return [];
    if (sourceFilter === "All") return data.trackerItems;
    return data.trackerItems.filter((item) => item.source_sheet === sourceFilter);
  }, [data, sourceFilter]);

  if (!data) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl rounded border bg-card p-4">
          <p>Customer page not found.</p>
          <Link className="mt-2 inline-block text-primary underline" to="/">Back to portfolio</Link>
        </div>
      </main>
    );
  }

  const section = (sheet: string) => filteredTrackerItems.filter((item) => item.source_sheet === sheet);

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded border bg-card p-4">
          <Link className="text-sm text-primary underline" to="/">← Portfolio</Link>
          <h1 className="text-2xl font-bold">{data.customer.customer_name}</h1>
          <p className="text-sm text-muted-foreground">Customer tracker page with standardized PM view + source tab context.</p>
        </header>

        <section className="grid gap-3 md:grid-cols-5">
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Total records</p><p className="text-2xl font-semibold">{data.trackerItems.length}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Action items</p><p className="text-2xl font-semibold">{data.customerActionItems.length}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Pending deployments</p><p className="text-2xl font-semibold">{section("Pending Deployment").length}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Completed</p><p className="text-2xl font-semibold">{section("Complete").length}</p></div>
          <div className="rounded border p-3"><p className="text-xs text-muted-foreground">Needs review</p><p className="text-2xl font-semibold">{filteredTrackerItems.filter((item) => item.review_flag).length}</p></div>
        </section>

        <section className="rounded border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">Source tab filter:</span>
            <select className="rounded border px-2 py-1 text-sm" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              {SOURCE_TAB_FILTERS.map((tab) => <option key={tab} value={tab}>{tab}</option>)}
            </select>
            <button className="ml-auto rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-standardized.csv`, exportTrackerCsv(data.trackerItems))}>Download CSV - standardized tracker</button>
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-action-items.csv`, exportActionCsv(data.customerActionItems))}>Download CSV - action items only</button>
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-raw-source.csv`, exportRawRowsCsv(data.customerRawRows))}>Download CSV - raw source rows</button>
          </div>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="font-semibold">Standardized tracker view (with source trace)</h2>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left"><th className="py-2">Status</th><th>Topic</th><th>Owner</th><th>Next Steps</th><th>Source</th></tr>
              </thead>
              <tbody>
                {filteredTrackerItems.map((item) => (
                  <tr className="border-b last:border-none" key={item.id}>
                    <td className="py-2">{item.status_bucket}</td>
                    <td>{item.deliverable ?? item.project_name ?? "—"}</td>
                    <td>{item.owner ?? "—"}</td>
                    <td>{item.next_steps ?? item.notes ?? "—"}</td>
                    <td>{item.source_sheet} / row {item.source_row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Open issues / open items</h3><p className="text-sm mt-1">{section("Open").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Pending deployments</h3><p className="text-sm mt-1">{section("Pending Deployment").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Completed items</h3><p className="text-sm mt-1">{section("Complete").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Deployed code changes</h3><p className="text-sm mt-1">{section("Deployments").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Archive / historical</h3><p className="text-sm mt-1">{section("Archive").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Milestones / dates</h3><p className="text-sm mt-1">{filteredTrackerItems.filter((item) => item.target_eta || item.milestone_date).length}</p></div>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="font-semibold">Action items (first-class)</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {data.customerActionItems.map((action) => (
              <li key={action.action_item_id} className="rounded border p-2">
                <p>{action.action_text}</p>
                <p className="text-xs text-muted-foreground">{action.status} · {action.owner ?? "Unassigned"} · source {action.source_sheet} row {action.source_row}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="font-semibold">Needs review / unmapped queue</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {filteredTrackerItems.filter((item) => item.review_flag).map((item) => (
              <li className="rounded border p-2" key={`review-${item.id}`}>{item.deliverable ?? item.project_name ?? "Unknown"} · {item.source_sheet} row {item.source_row}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
