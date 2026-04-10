import { Link } from "react-router-dom";
import {
  lastUpdated,
  pmNotes,
  portfolioItems,
  projectCards,
  renewals,
  supportingLinks,
  type ProjectStatus,
  upcomingDates,
} from "@/data/statusTracker";

const statusClass: Record<ProjectStatus, string> = {
  Planning: "bg-slate-100 text-slate-700 border-slate-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Testing: "bg-amber-100 text-amber-700 border-amber-300",
  Live: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Post Implementation": "bg-purple-100 text-purple-700 border-purple-300",
  "Needs Attention": "bg-rose-100 text-rose-700 border-rose-300",
  "In Review": "bg-indigo-100 text-indigo-700 border-indigo-300",
  TBD: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusClass[status]}`}>{status}</span>;
}

export default function ExecutiveStatusPage() {
  const statusCounts = projectCards.reduce<Record<ProjectStatus, number>>(
    (acc, card) => ({ ...acc, [card.status]: acc[card.status] + 1 }),
    {
      Planning: 0,
      "In Progress": 0,
      Testing: 0,
      Live: 0,
      "Post Implementation": 0,
      "Needs Attention": 0,
      "In Review": 0,
      TBD: 0,
    },
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 print:bg-white print:px-0">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-md border bg-white p-5 print:break-inside-avoid">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Executive Status Summary</p>
          <h1 className="text-2xl font-semibold text-slate-900">CFS Projects Team | Initiatives & Status Tracker</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-600">
            <span>Last Updated: {lastUpdated}</span>
            <Link className="text-blue-700 underline" to="/portfolio">Open data integrity portfolio</Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {(["Planning", "In Progress", "Testing", "Live", "Post Implementation", "In Review"] as ProjectStatus[]).map((status) => (
              <div key={status} className="rounded border bg-slate-50 p-2 text-sm">
                <div className="text-slate-500">{status}</div>
                <div className="text-xl font-semibold text-slate-900">{statusCounts[status]}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="rounded-md border bg-white p-4 print:break-inside-avoid">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Upcoming Dates</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2">Customer</th><th>Topic</th><th>Date</th><th>Notes</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDates.map((item) => (
                  <tr key={item.id} className="border-b align-top">
                    <td className="py-2 font-medium text-slate-800">{item.customer}</td>
                    <td>{item.topic}</td>
                    <td>{item.dateLabel}</td>
                    <td>{item.notes ?? "—"}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border bg-white p-4 print:break-inside-avoid">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Software Maintenance Renewals</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Date</th><th>Notes</th><th>Status</th></tr>
              </thead>
              <tbody>
                {renewals.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 font-medium text-slate-800">{item.customer}</td>
                    <td>{item.renewalDate}</td>
                    <td>{item.notes ?? "—"}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border bg-white p-4 print:break-inside-avoid">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">PM Notes</h2>
            <div className="space-y-3 text-sm">
              {pmNotes.map((note) => (
                <div key={note.id}>
                  <p className="font-medium text-slate-800">{note.customer}</p>
                  <ul className="list-disc pl-5 text-slate-700">
                    {note.notes.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-md border bg-white p-4 print:break-inside-avoid">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Key Deliverables / Project Portfolio</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Deliverable</th><th>Phase</th><th>Status</th><th>Summary</th></tr>
            </thead>
            <tbody>
              {portfolioItems.map((item) => (
                <tr key={item.id} className="border-b align-top">
                  <td className="py-2 font-medium text-slate-800">{item.customer}</td>
                  <td>{item.deliverable}</td>
                  <td>{item.phase}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Customer / Project Detail Cards</h2>
          <div className="grid gap-4">
            {projectCards.map((card) => (
              <article key={card.id} className="rounded-md border bg-white p-4 print:break-inside-avoid">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{card.customer}{card.site ? ` — ${card.site}` : ""}</h3>
                  <div className="flex items-center gap-2">
                    {card.urgency === "high" && <span className="rounded border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">Urgent</span>}
                    <StatusBadge status={card.status} />
                  </div>
                </div>
                <p className="text-sm text-slate-700"><span className="font-medium text-slate-900">Project / Deliverable:</span> {card.projectDeliverable}</p>
                <p className="text-sm text-slate-700"><span className="font-medium text-slate-900">Phase:</span> {card.phase}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Key Dates</p>
                    <ul className="list-disc pl-5 text-sm text-slate-700">{card.keyDates.map((line) => <li key={line}>{line}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Summary / Notes</p>
                    <ul className="list-disc pl-5 text-sm text-slate-700">{card.summaryNotes.map((line) => <li key={line}>{line}</li>)}</ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Key Open Issues / Next Steps</p>
                    <ul className="list-disc pl-5 text-sm text-slate-700">{card.openIssuesNextSteps.map((line) => <li key={line}>{line}</li>)}</ul>
                  </div>
                  {card.recentHighlights && (
                    <div>
                      <p className="text-sm font-medium text-slate-900">Recent Highlights</p>
                      <ul className="list-disc pl-5 text-sm text-slate-700">{card.recentHighlights.map((line) => <li key={line}>{line}</li>)}</ul>
                    </div>
                  )}
                  {card.recentDeployments && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-slate-900">Recent Deployments</p>
                      <ul className="list-disc pl-5 text-sm text-slate-700">{card.recentDeployments.map((line) => <li key={line}>{line}</li>)}</ul>
                    </div>
                  )}
                </div>
                <div className="mt-3 rounded border bg-slate-50 p-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Tracker Link:</span>{" "}
                  {card.trackerLink.availability === "available" ? (
                    <a className="text-blue-700 underline" href={card.trackerLink.href}>{card.trackerLink.label}</a>
                  ) : (
                    <span>{card.trackerLink.label} — {card.trackerLink.note ?? "Needs confirmation"}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-md border bg-white p-4 print:break-inside-avoid">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Links / Supporting References</h2>
          <ul className="space-y-1 text-sm">
            {supportingLinks.map((link) => (
              <li key={link.label}>
                {link.availability === "available" ? <a className="text-blue-700 underline" href={link.href}>{link.label}</a> : <span>{link.label} — {link.note ?? "Needs confirmation"}</span>}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
