import { Link, useParams } from "react-router-dom";
import { loadSeedData } from "@/data/cfsSeedLoader";
import { exportCustomerPdf } from "@/lib/exportUtils";
import { vagueMilestoneToLabel } from "@/lib/cfs/helpers";

const seed = loadSeedData();

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const customer = seed.customers.find((c) => c.slug === customerSlug);
  if (!customer) return <main className="p-6">Not found. <Link className="underline" to="/portfolio">Back</Link></main>;

  const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
  const ids = new Set(projects.map((p) => p.project_id));
  const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
  const milestones = seed.milestones.filter((m) => ids.has(m.project_id));
  const rmIssues = seed.rmIssues.filter((r) => ids.has(r.project_id));
  const blockers = seed.blockers.filter((r) => ids.has(r.project_id));
  const resources = seed.linkedResources.filter((r) => r.project_id && ids.has(r.project_id));
  const highlights = seed.recentHighlights.filter((h) => ids.has(h.project_id));

  return (
    <main id={`customer-${customer.slug}`} className="min-h-screen bg-slate-100 px-4 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-5 shadow-sm print-avoid-break">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link className="text-sm text-blue-700 underline" to="/portfolio">← Portfolio</Link>
              <h1 className="text-3xl font-semibold">{customer.customer_name}</h1>
              <p className="text-sm text-slate-600">Executive PMO Customer Detail · Generated {new Date().toLocaleString()}</p>
            </div>
            <button className="rounded-lg border px-3 py-1 text-sm print:hidden" onClick={() => exportCustomerPdf(customer.slug)}>Export PDF</button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Executive Summary</h2>
            <p className="text-sm mt-2">Projects: {projects.length} · Active RM Issues: {rmIssues.length} · Open blockers: {blockers.length}.</p>
            <p className="text-sm mt-2">Customer health is {blockers.length ? "At Risk" : "On Track"} based on blocker proximity and RM volume.</p>
          </section>
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Key Dates</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{milestones.length ? milestones.map((m) => <li key={m.milestone_id}>{m.title}: {vagueMilestoneToLabel(m.date_text)} <span className="text-slate-500">({m.date_confidence ?? "low"} confidence)</span></li>) : <li>TBD</li>}</ul>
          </section>
        </section>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Risks / Blockers (Priority)</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">{blockers.length ? blockers.map((r) => <li key={r.blocker_id}>{r.description}</li>) : <li>No active blockers.</li>}</ul>
        </section>

        <section className="grid gap-4 md:grid-cols-2 print-break-before">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Active Workstreams</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{projects.map((project) => <li key={project.project_id}><strong>{project.project_name}</strong> · {project.deliverable ?? "TBD"} · {project.normalizedStatus}</li>)}</ul>
          </section>
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Action Items</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{actions.length ? actions.map((a) => <li key={a.action_item_id}>{a.description} (Owner: {a.owner}; Due: {a.due_date ?? "TBD"})</li>) : <li>None</li>}</ul>
          </section>
        </section>

        <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <h2 className="font-semibold">RM / Issue Tracker</h2>
          <table className="mt-2 w-full text-sm"><thead><tr className="border-b text-left"><th className="py-2">RM Ref</th><th>Description</th><th>Status</th><th>Owner</th></tr></thead><tbody>{rmIssues.length ? rmIssues.map((r) => <tr key={r.rm_issue_id} className="border-b"><td className="py-2 font-medium">{r.rm_reference}</td><td>{r.description}</td><td>{r.normalizedStatus}</td><td>{r.owner}</td></tr>) : <tr><td className="py-2" colSpan={4}>No RM issues</td></tr>}</tbody></table>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Recent Highlights</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{highlights.length ? highlights.map((h) => <li key={h.highlight_id}>{h.highlight}</li>) : <li>No highlights captured.</li>}</ul>
          </section>
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Related Trackers / Resources</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{resources.length ? resources.map((r) => <li key={r.resource_id}>{r.label} · {r.resource_type} · {r.notes ?? "TBD"}</li>) : <li>No linked resources.</li>}</ul>
          </section>
        </section>
      </section>
    </main>
  );
}
