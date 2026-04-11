import { Link, useParams } from "react-router-dom";
import { loadSeedData } from "@/data/cfsSeedLoader";
import { exportCustomerPdf } from "@/lib/exportUtils";
import { vagueMilestoneToLabel } from "@/lib/cfs/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const seed = loadSeedData();

const STATUS_COLORS: Record<string, string> = {
  "Testing Complete": "hsl(142,60%,40%)",
  "Testing Active": "hsl(38,92%,50%)",
  "In-Testing": "hsl(38,92%,50%)",
  "In Progress": "hsl(220,70%,50%)",
  "In Programming": "hsl(220,70%,50%)",
  "Moved To Programming": "hsl(260,50%,55%)",
  "Moved to Programming": "hsl(260,50%,55%)",
  "Complete": "hsl(142,70%,35%)",
  "Deployed": "hsl(142,70%,35%)",
  "Waiting on Customer": "hsl(0,72%,51%)",
  "Waiting on Case Farms": "hsl(0,72%,51%)",
  "Waiting on Info": "hsl(0,72%,51%)",
  "In-Spec": "hsl(200,60%,50%)",
  "In-Programming": "hsl(220,70%,50%)",
  "On Hold": "hsl(0,0%,55%)",
  "Quote Sent": "hsl(260,50%,55%)",
  "Open": "hsl(38,92%,50%)",
  "Shipped": "hsl(142,60%,40%)",
};

const PRIORITY_COLORS: Record<string, string> = {
  Highest: "hsl(0,72%,51%)",
  High: "hsl(0,60%,55%)",
  Medium: "hsl(38,92%,50%)",
  Low: "hsl(220,15%,60%)",
};

function priorityBadge(priority: string) {
  const color = PRIORITY_COLORS[priority] || "hsl(220,15%,60%)";
  return <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: color }}>{priority}</span>;
}

function statusBadge(status: string) {
  const color = STATUS_COLORS[status] || "hsl(220,15%,60%)";
  return <span className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: color }}>{status}</span>;
}

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const customer = seed.customers.find((c) => c.slug === customerSlug);
  if (!customer) return <main className="p-6">Not found. <Link className="underline" to="/portfolio">Back</Link></main>;

  const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
  const ids = new Set(projects.map((p) => p.project_id));
  const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
  const milestones = seed.milestones.filter((m) => m.project_id && ids.has(m.project_id));
  const rmIssues = seed.rmIssues.filter((r) => ids.has(r.project_id));
  const blockers = seed.blockers.filter((r) => ids.has(r.project_id));
  const highlights = seed.recentHighlights.filter((h) => ids.has(h.project_id));
  const trackerItems = seed.trackerItems.filter((t) => ids.has(t.project_id));
  const meetings = seed.meetingMinutes.filter((m) => m.customer_id === customer.customer_id);
  const openTracker = trackerItems.filter((t) => !["Complete", "Deployed"].includes(t.normalizedStatus));
  const completeTracker = trackerItems.filter((t) => ["Complete", "Deployed"].includes(t.normalizedStatus));

  // Charts data
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  trackerItems.forEach((t) => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    if (t.priority) priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  const exportExcel = () => {
    const rows = trackerItems.map((t) => ({
      Priority: t.priority,
      Topic: t.topic,
      RM_Reference: t.rm_reference ?? "",
      Status: t.status,
      Context: t.context ?? "",
      Last_Update: t.last_update ?? "",
      Target_ETA: t.target_eta ?? "",
      Notes: t.notes ?? "",
      Next_Steps: t.next_steps ?? "",
      Owner: t.owner,
    }));
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const encode = (v: unknown) => `"${String(v ?? "").split('"').join('""')}"`;
    const csv = `${headers.join(",")}\n${rows.map((r) => headers.map((h) => encode(r[h as keyof typeof r])).join(",")).join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customer.slug}-tracker.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main id={`customer-${customer.slug}`} className="min-h-screen bg-slate-100 px-4 py-6 print:bg-white">
      <section className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <header className="rounded-xl border bg-white p-5 shadow-sm print-avoid-break">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link className="text-sm text-blue-700 underline" to="/portfolio">← Portfolio</Link>
              <h1 className="text-3xl font-semibold">{customer.customer_name}</h1>
              <p className="text-sm text-slate-600">Customer Detail · {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={exportExcel}>Export Excel</button>
              <button className="rounded-lg border px-3 py-1 text-sm" onClick={() => exportCustomerPdf(customer.slug)}>Export PDF</button>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Projects", value: projects.length },
            { label: "Open Items", value: openTracker.length },
            { label: "Complete", value: completeTracker.length },
            { label: "Open RM", value: rmIssues.filter(r => !["Complete","Live"].includes(r.normalizedStatus)).length },
            { label: "Action Items", value: actions.length },
            { label: "Blockers", value: blockers.length },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border bg-white p-3 shadow-sm text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
              <p className="text-2xl font-semibold mt-1">{kpi.value}</p>
            </div>
          ))}
        </section>

        {/* Charts */}
        {trackerItems.length > 0 && (
          <section className="grid md:grid-cols-2 gap-4 print-avoid-break">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Items by Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "hsl(220,15%,70%)"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Items by Priority</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {priorityData.map((entry) => <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || "hsl(220,15%,70%)"} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Executive Summary */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Executive Summary</h2>
            <p className="text-sm">Projects: {projects.length} · Open RM Issues: {rmIssues.length} · Blockers: {blockers.length}</p>
            <p className="text-sm mt-2">Health: <strong className={blockers.length ? "text-red-600" : "text-green-600"}>{blockers.length ? "At Risk" : "On Track"}</strong></p>
            {projects.map((p) => (
              <div key={p.project_id} className="mt-2 text-sm border-t pt-2">
                <strong>{p.project_name}</strong> · {p.normalizedStatus} · Owner: {p.owner}
                <p className="text-slate-600">{p.summary}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Key Dates</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {milestones.length ? milestones.map((m) => (
                <li key={m.milestone_id}>{m.title}: {vagueMilestoneToLabel(m.date_text)} <span className="text-slate-500">({m.date_confidence ?? "low"} confidence)</span></li>
              )) : <li>TBD</li>}
            </ul>
          </div>
        </section>

        {/* Risks / Blockers */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Risks / Blockers</h2>
          <ul className="list-disc pl-5 text-sm">{blockers.length ? blockers.map((r) => <li key={r.blocker_id} className="text-red-700">{r.description}</li>) : <li className="text-green-700">No active blockers.</li>}</ul>
        </section>

        {/* Open Tracker Items - The Core Detail */}
        {openTracker.length > 0 && (
          <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto print-break-before">
            <h2 className="font-semibold mb-3">Open Items ({openTracker.length})</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Priority</th><th>Topic</th><th>RM</th><th>Status</th><th>Owner</th><th>Last Update</th><th>Next Steps</th></tr></thead>
              <tbody>
                {openTracker.map((t) => (
                  <tr key={t.item_id} className="border-b align-top">
                    <td className="py-2">{t.priority ? priorityBadge(t.priority) : "—"}</td>
                    <td className="py-2 max-w-[300px]">
                      <div className="font-medium">{t.topic}</div>
                      {t.context && <div className="text-xs text-slate-500 mt-0.5">{t.context}</div>}
                    </td>
                    <td className="py-2 font-mono text-xs">{t.rm_reference ?? "—"}</td>
                    <td className="py-2">{statusBadge(t.status)}</td>
                    <td className="py-2">{t.owner}</td>
                    <td className="py-2 text-xs">{t.last_update ?? "—"}</td>
                    <td className="py-2 text-xs max-w-[200px]">{t.next_steps ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Action Items */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Action Items ({actions.length})</h2>
          {actions.length ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Action</th><th>Owner</th><th>Due</th><th>Urgency</th></tr></thead>
              <tbody>{actions.map((a) => (
                <tr key={a.action_item_id} className="border-b align-top">
                  <td className="py-2">{a.description}</td>
                  <td className="py-2">{a.owner}</td>
                  <td className="py-2 text-xs">{a.due_date ?? "TBD"}</td>
                  <td className="py-2">{a.urgency === "high" ? <span className="text-red-600 font-medium">High</span> : <span className="text-slate-500">Normal</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          ) : <p className="text-sm text-slate-500">No action items.</p>}
        </section>

        {/* RM / Issue Tracker */}
        <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <h2 className="font-semibold mb-2">RM / Issue Tracker ({rmIssues.length})</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">RM Ref</th><th>Description</th><th>Status</th><th>Urgency</th><th>Owner</th></tr></thead>
            <tbody>{rmIssues.length ? rmIssues.map((r) => (
              <tr key={r.rm_issue_id} className="border-b">
                <td className="py-2 font-mono font-medium">{r.rm_reference}</td>
                <td>{r.description}</td>
                <td>{statusBadge(r.normalizedStatus)}</td>
                <td>{r.urgency === "high" ? <span className="text-red-600">High</span> : <span className="text-slate-500">{r.urgency}</span>}</td>
                <td>{r.owner}</td>
              </tr>
            )) : <tr><td className="py-2" colSpan={5}>No RM issues</td></tr>}</tbody>
          </table>
        </section>

        {/* Recent Highlights */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Recent Highlights</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">{highlights.length ? highlights.map((h) => <li key={h.highlight_id}>{h.highlight} {h.date_text && <span className="text-slate-500">({h.date_text})</span>}</li>) : <li>No highlights captured.</li>}</ul>
        </section>

        {/* Meeting Minutes */}
        {meetings.length > 0 && (
          <section className="space-y-4 print-break-before">
            <h2 className="text-xl font-semibold">Meeting Minutes</h2>
            {meetings.map((mtg) => (
              <div key={mtg.meeting_id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{mtg.title}</h3>
                  <span className="text-sm text-slate-500">{mtg.date}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Attendees: {mtg.attendees.join(", ")}</p>
                <p className="text-sm mt-2">{mtg.summary}</p>
                {mtg.decisions.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold uppercase text-slate-500">Decisions</h4>
                    <ul className="list-disc pl-5 text-sm mt-1">{mtg.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
                {mtg.discussion_notes.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold uppercase text-slate-500">Discussion Notes</h4>
                    <ul className="list-disc pl-5 text-sm mt-1">{mtg.discussion_notes.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
                {mtg.action_items_from_meeting.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold uppercase text-slate-500">Action Items</h4>
                    <table className="w-full text-sm mt-1">
                      <thead><tr className="border-b text-left text-slate-400"><th className="py-1">Action</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
                      <tbody>{mtg.action_items_from_meeting.map((a, i) => (
                        <tr key={i} className="border-b"><td className="py-1">{a.description}</td><td>{a.owner}</td><td>{a.due_date ?? "TBD"}</td><td>{a.status}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Completed Items (collapsed by default in print) */}
        {completeTracker.length > 0 && (
          <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto print-break-before">
            <h2 className="font-semibold mb-3">Completed / Deployed Items ({completeTracker.length})</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Topic</th><th>RM</th><th>Status</th><th>Notes</th></tr></thead>
              <tbody>{completeTracker.map((t) => (
                <tr key={t.item_id} className="border-b"><td className="py-2">{t.topic}</td><td className="font-mono text-xs">{t.rm_reference ?? "—"}</td><td>{statusBadge(t.status)}</td><td className="text-xs">{t.notes ?? "—"}</td></tr>
              ))}</tbody>
            </table>
          </section>
        )}
      </section>
    </main>
  );
}
