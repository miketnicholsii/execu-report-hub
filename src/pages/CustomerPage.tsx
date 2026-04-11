import { Link, useParams } from "react-router-dom";
import { action_items, customer_sites, customers, linked_resources, milestones, needs_review, projects, risks } from "@/data/cfsPortfolioRebuild";
import { exportSectionToPdf } from "@/lib/exportUtils";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const customer = customers.find((entry) => slugify(entry.customer_name) === customerSlug);

  if (!customer) {
    return <main className="min-h-screen p-6">Customer page not found. <Link className="underline" to="/portfolio">Back to Portfolio</Link></main>;
  }

  const customerProjects = projects.filter((project) => project.customer_id === customer.customer_id);
  const projectIds = new Set(customerProjects.map((project) => project.project_id));
  const customerActions = action_items.filter((action) => projectIds.has(action.project_id));
  const customerMilestones = milestones.filter((milestone) => projectIds.has(milestone.project_id));
  const customerRisks = risks.filter((risk) => projectIds.has(risk.project_id));
  const customerResources = linked_resources.filter((resource) => projectIds.has(resource.project_id));
  const siteMap = new Map(customer_sites.map((site) => [site.site_id, site.site_name]));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <Link className="text-sm text-blue-700 underline" to="/portfolio">← Executive Portfolio</Link>
              <h1 className="text-2xl font-semibold">{customer.customer_name}</h1>
              <p className="text-sm text-slate-600">{customer.notes}</p>
            </div>
            <button className="rounded border px-3 py-1 text-sm print:hidden" onClick={exportSectionToPdf}>Export Customer Detail to PDF</button>
          </div>
        </header>

        <section className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Active Projects / Deliverables</h2>
          <div className="space-y-3">
            {customerProjects.map((project) => (
              <article key={project.project_id} className="rounded border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{project.project_name} — {project.deliverable_name}</h3>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{project.status}</span>
                </div>
                <p className="text-sm"><strong>Site:</strong> {project.site_id ? siteMap.get(project.site_id) : "Program"} · <strong>Phase:</strong> {project.phase} · <strong>Owner:</strong> {project.owner ?? "TBD"}</p>
                <p className="mt-1 text-sm">{project.summary}</p>
                <p className="mt-1 text-xs text-slate-600"><strong>Source:</strong> {project.source_reference} · <strong>Last Updated:</strong> {project.last_updated}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Key Dates</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">{customerMilestones.map((m) => <li key={m.milestone_id}>{m.milestone_name}: {m.milestone_date} ({m.date_confidence})</li>)}</ul>
          </section>
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Action Items</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">{customerActions.map((a) => <li key={a.action_id}>{a.action_text} — Owner: {a.owner ?? "TBD"}; Due: {a.due_date}; Priority: {a.priority}</li>)}</ul>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Open Issues / Blockers</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">{customerRisks.length ? customerRisks.map((risk) => <li key={risk.risk_id}>{risk.risk_text} ({risk.severity})</li>) : <li>No active risks logged.</li>}</ul>
          </section>
          <section className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">Related Trackers / Linked Resources</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">{customerResources.length ? customerResources.map((resource) => <li key={resource.resource_id}>{resource.resource_label} - {resource.notes}</li>) : <li>No linked resources listed.</li>}</ul>
          </section>
        </section>

        <section className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Recent Highlights and Notes</h2>
          <p className="text-sm">{customer.notes}</p>
          <p className="mt-2 text-xs text-slate-600">Needs Review flags related to this customer: {needs_review.filter((note) => note.toLowerCase().includes(customer.customer_name.toLowerCase().split(" ")[0].toLowerCase())).join(" | ") || "None."}</p>
        </section>
      </section>
    </main>
  );
}
