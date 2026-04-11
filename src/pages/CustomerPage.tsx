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
  const blockers = seed.risks.filter((r) => ids.has(r.project_id) && r.status === "OPEN");

  return (
    <main id={`customer-${customer.slug}`} className="min-h-screen bg-slate-50 px-4 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link className="text-sm text-blue-700 underline" to="/portfolio">← Portfolio</Link>
              <h1 className="text-2xl font-semibold">{customer.customer_name}</h1>
              <p className="text-sm text-slate-600">Projects: {projects.length} · Action Items: {actions.length} · Open Blockers: {blockers.length}</p>
            </div>
            <button className="rounded border px-3 py-1 text-sm print:hidden" onClick={() => exportCustomerPdf(customer.slug)}>Customer PDF</button>
          </div>
        </header>

        {projects.map((project) => {
          const pMilestones = milestones.filter((m) => m.project_id === project.project_id);
          const pActions = actions.filter((a) => a.project_id === project.project_id);
          const pRisks = blockers.filter((r) => r.project_id === project.project_id);
          const resources = seed.linkedResources.filter((r) => r.note.toLowerCase().includes(customer.customer_name.split(" ")[0].toLowerCase()));

          return (
            <section key={project.project_id} className="rounded border bg-white p-4 print-avoid-break">
              <h2 className="text-lg font-semibold">{project.project_name}</h2>
              <p className="text-sm">Status: <strong>{project.normalizedStatus}</strong></p>
              <p className="text-sm text-slate-700">{project.summary}</p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div><h3 className="font-medium">Key Dates</h3><ul className="list-disc pl-5 text-sm">{pMilestones.length ? pMilestones.map((m) => <li key={m.milestone_id}>{m.title}: {vagueMilestoneToLabel(m.date)}</li>) : <li>TBD</li>}</ul></div>
                <div><h3 className="font-medium">Action Items</h3><ul className="list-disc pl-5 text-sm">{pActions.length ? pActions.map((a) => <li key={a.action_item_id}>{a.description} (Owner: {a.owner}; Due: {a.due_date ?? "TBD"})</li>) : <li>None</li>}</ul></div>
                <div><h3 className="font-medium">Blockers</h3><ul className="list-disc pl-5 text-sm">{pRisks.length ? pRisks.map((r) => <li key={r.risk_id}>{r.description}</li>) : <li>No active blockers</li>}</ul></div>
                <div><h3 className="font-medium">Linked Trackers / Resources</h3><ul className="list-disc pl-5 text-sm">{resources.length ? resources.map((r) => <li key={r.resource_id}>{r.label} ({r.availability})</li>) : <li>No linked resources</li>}</ul></div>
              </div>

              <div className="mt-3"><h3 className="font-medium">Recent Highlights</h3><ul className="list-disc pl-5 text-sm">{project.recent_highlights.length ? project.recent_highlights.map((h, i) => <li key={i}>{h}</li>) : <li>No highlights captured in dataset.</li>}</ul></div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
