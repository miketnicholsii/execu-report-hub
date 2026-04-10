import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadCsv, exportActionCsv, exportRawRowsCsv, exportTrackerCsv } from "@/lib/cfs/csv";
import { REQUIRED_CUSTOMER_SECTIONS } from "@/lib/cfs/config";
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
  const activeProjects = filteredTrackerItems.filter((item) => item.source_sheet === "Open" || item.source_sheet === "Pending Deployment");
  const milestoneRows = filteredTrackerItems.filter((item) => item.target_eta || item.milestone_date);
  const notesRows = filteredTrackerItems.filter((item) => item.notes || item.context_details);
  const needsReviewRows = filteredTrackerItems.filter((item) => item.review_flag);

  return (
    <main className="min-h-screen bg-background px-6 py-6">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded border bg-card p-4">
          <Link className="text-sm text-primary underline" to="/">← Portfolio</Link>
          <h1 className="text-2xl font-bold">{data.customer.customer_name}</h1>
          <p className="text-sm text-muted-foreground">Customer tracker page with standardized PM view + source tab context.</p>
        </header>

        <section className="rounded border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">Source tab filter:</span>
            <select className="rounded border px-2 py-1 text-sm" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              {SOURCE_TAB_FILTERS.map((tab) => <option key={tab} value={tab}>{tab}</option>)}
            </select>
            <button className="ml-auto rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-standardized.csv`, exportTrackerCsv(data.trackerItems))}>Download CSV - per-customer standardized tracker</button>
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-action-items.csv`, exportActionCsv(data.customerActionItems))}>Download CSV - per-customer action items</button>
            <button className="rounded border px-3 py-1.5 text-sm" onClick={() => downloadCsv(`${data.customer.customer_slug}-raw-source.csv`, exportRawRowsCsv(data.customerRawRows))}>Download CSV - per-customer raw source</button>
          </div>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="font-semibold">Required Section Coverage</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {REQUIRED_CUSTOMER_SECTIONS.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Customer Summary</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Total records: {data.trackerItems.length}</li>
              <li>Action items: {data.customerActionItems.length}</li>
              <li>Blockers / risks: {filteredTrackerItems.filter((item) => item.blocker_flag).length}</li>
              <li>Imported at: {data.trackerItems[0]?.imported_at ?? "—"}</li>
            </ul>
          </div>
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Active Projects / Deliverables</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {activeProjects.map((item) => (
                <li key={`active-${item.id}`}>{item.deliverable ?? item.project_name ?? "—"} ({item.status_bucket})</li>
              ))}
              {activeProjects.length === 0 && <li>None</li>}
            </ul>
          </div>
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Open Issues / Open Items</h3>
            <p className="mt-1 text-sm">{section("Open").length}</p>
          </div>
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Action Items</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {data.customerActionItems.map((action) => (
                <li key={action.action_item_id}>{action.action_text} · {action.status}</li>
              ))}
              {data.customerActionItems.length === 0 && <li>None</li>}
            </ul>
          </div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Pending Deployments</h3><p className="text-sm mt-1">{section("Pending Deployment").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Completed Items</h3><p className="text-sm mt-1">{section("Complete").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Deployed Code Changes</h3><p className="text-sm mt-1">{section("Deployments").length}</p></div>
          <div className="rounded border bg-card p-4"><h3 className="font-semibold">Archive / Historical Items</h3><p className="text-sm mt-1">{section("Archive").length}</p></div>
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Upcoming Dates / Milestones</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {milestoneRows.map((item) => <li key={`date-${item.id}`}>{item.deliverable ?? item.project_name ?? "—"} · {item.target_eta ?? item.milestone_date}</li>)}
              {milestoneRows.length === 0 && <li>None</li>}
            </ul>
          </div>
          <div className="rounded border bg-card p-4">
            <h3 className="font-semibold">Notes / Context</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {notesRows.map((item) => <li key={`notes-${item.id}`}>{item.notes ?? item.context_details}</li>)}
              {notesRows.length === 0 && <li>None</li>}
            </ul>
          </div>
          <div className="rounded border bg-card p-4 md:col-span-2">
            <h3 className="font-semibold">Needs Review / Unmapped</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {needsReviewRows.map((item) => (
                <li key={`review-${item.id}`}>{item.deliverable ?? item.project_name ?? "Unknown"} · {item.source_sheet} row {item.source_row}</li>
              ))}
              {needsReviewRows.length === 0 && <li>None</li>}
            </ul>
          </div>
        </section>

        <section className="rounded border bg-card p-4">
          <h2 className="font-semibold">Standardized tracker view (with source trace)</h2>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Status</th>
                  <th>Topic</th>
                  <th>Owner</th>
                  <th>Next Steps</th>
                  <th>Source Fields</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackerItems.map((item) => (
                  <tr className="border-b last:border-none" key={item.id}>
                    <td className="py-2">{item.status_bucket}</td>
                    <td>{item.deliverable ?? item.project_name ?? "—"}</td>
                    <td>{item.owner ?? "—"}</td>
                    <td>{item.next_steps ?? item.notes ?? "—"}</td>
                    <td>{item.source_file} / {item.source_sheet} / row {item.source_row} / imported {item.imported_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
