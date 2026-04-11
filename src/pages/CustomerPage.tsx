import { Link, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import GanttChart from "@/components/GanttChart";
import { StatusBadge, PriorityBadge, HealthBadge, UrgencyBadge } from "@/components/StatusBadge";
import { EditableText, EditableSelect } from "@/components/EditableCell";
import { getCustomerDeepData, seed, customerById } from "@/lib/cfs/selectors2";
import { vagueMilestoneToLabel } from "@/lib/cfs/helpers";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { useState } from "react";
import { Eye, Layers, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Testing Complete": "hsl(142,60%,40%)", "Complete": "hsl(142,70%,35%)", "Deployed": "hsl(142,70%,35%)", "Shipped": "hsl(142,60%,40%)",
  "Testing Active": "hsl(38,92%,50%)", "In-Testing": "hsl(38,92%,50%)", "Open": "hsl(38,92%,50%)",
  "In Progress": "hsl(220,70%,50%)", "In Programming": "hsl(220,70%,50%)", "In-Programming": "hsl(220,70%,50%)",
  "Moved To Programming": "hsl(260,50%,55%)", "Moved to Programming": "hsl(260,50%,55%)",
  "In-Spec": "hsl(200,60%,50%)", "In Spec": "hsl(200,60%,50%)", "In Review": "hsl(200,60%,50%)",
  "Waiting on Customer": "hsl(0,72%,51%)", "Waiting on Case Farms": "hsl(0,72%,51%)", "Waiting on Info": "hsl(0,72%,51%)",
  "On Hold": "hsl(0,0%,60%)", "Quote Sent": "hsl(260,50%,55%)",
};
const PRIORITY_COLORS: Record<string, string> = { Highest: "hsl(0,72%,51%)", High: "hsl(0,60%,55%)", Medium: "hsl(38,92%,50%)", Low: "hsl(220,15%,60%)" };

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const data = getCustomerDeepData(customerSlug);
  const [rmExpanded, setRmExpanded] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"executive" | "operational">("executive");
  const [showComplete, setShowComplete] = useState(false);

  if (!data) return (
    <AppShell title="Not Found" subtitle="">
      <p>Customer not found. <Link className="text-primary underline" to="/portfolio">Back to Portfolio</Link></p>
    </AppShell>
  );

  const { customer, projects, actions, milestones, rmIssues, rmDetail, blockers, highlights, trackerItems, openTracker, completeTracker, meetings, resources, health } = data;
  const displayedTracker = showComplete ? trackerItems : openTracker;

  // Charts
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  trackerItems.forEach((t) => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    if (t.priority) priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  // Gantt
  const ganttItems = projects.filter((p) => (p as any).start_date || (p as any).target_date).map((p) => {
    const ms = milestones.filter((m) => m.project_id === p.project_id && m.date_text && !m.date_text.includes("TBD")).map((m) => ({ date: m.date_text!, label: m.title }));
    return { id: p.project_id, label: p.project_name, startDate: (p as any).start_date, endDate: (p as any).target_date, milestones: ms, percentComplete: p.percent_complete, status: p.normalizedStatus, owner: p.owner };
  });

  const toggleRm = (id: string) => { const n = new Set(rmExpanded); n.has(id) ? n.delete(id) : n.add(id); setRmExpanded(n); };

  const exportTrackerExcel = () => downloadCsv(`${customer.slug}-tracker.csv`, trackerItems.map((t) => ({
    Priority: t.priority, Topic: t.topic, RM: t.rm_reference ?? "", Status: t.status, Context: t.context ?? "", Last_Update: t.last_update ?? "", ETA: t.target_eta ?? "", Notes: t.notes ?? "", Next_Steps: t.next_steps ?? "", Owner: t.owner,
  })));
  const exportActionsExcel = () => downloadCsv(`${customer.slug}-actions.csv`, actions.map((a) => ({ Description: a.description, Owner: a.owner, Due: a.due_date ?? "TBD", Urgency: a.urgency ?? "normal" })));
  const exportRmExcel = () => downloadCsv(`${customer.slug}-rm.csv`, rmDetail.map((r) => ({ RM: r.rm_reference, Description: r.description, Status: r.normalizedStatus, Owner: r.owner, Context: r.context ?? "", Next_Steps: r.next_steps ?? "" })));
  const exportAll = () => { exportTrackerExcel(); setTimeout(exportActionsExcel, 200); setTimeout(exportRmExcel, 400); };

  return (
    <AppShell
      title={customer.customer_name}
      subtitle={`Customer Deep Dive · ${new Date().toLocaleDateString()}`}
      onExportExcel={exportAll}
      onExportPdf={exportPdf}
      breadcrumbs={[{ label: "Customers", to: "/customer-summary" }, { label: customer.customer_name }]}
      actions={
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          <button onClick={() => setMode("executive")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${mode === "executive" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Eye className="h-3 w-3" /> Executive
          </button>
          <button onClick={() => setMode("operational")} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${mode === "operational" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Layers className="h-3 w-3" /> Operational
          </button>
        </div>
      }
    >
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Projects" value={projects.length} />
        <KpiCard label="Open Items" value={openTracker.length} color="text-status-caution" />
        <KpiCard label="Complete" value={completeTracker.length} color="text-status-on-track" />
        <KpiCard label="Open RM" value={rmIssues.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).length} />
        <KpiCard label="Action Items" value={actions.length} />
        <KpiCard label="Blockers" value={blockers.length} color={blockers.length > 0 ? "text-destructive" : ""} />
        <KpiCard label="Health" value={health} color={health === "On Track" ? "text-status-on-track" : health === "Caution" ? "text-status-caution" : "text-destructive"} />
      </section>

      {/* Charts */}
      {trackerItems.length > 0 && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Items by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Items by Priority</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {priorityData.map((e) => <Cell key={e.name} fill={PRIORITY_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Gantt Timeline */}
      {ganttItems.length > 0 && <GanttChart items={ganttItems} title="Initiative Timeline" />}

      {/* Executive Summary Block */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">Executive Summary</h2>
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.project_id} className="rounded-lg border border-border p-4 bg-muted/10">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <Link to={`/initiatives/${p.project_id}`} className="font-semibold text-primary hover:underline">{p.project_name}</Link>
                {p.deliverable && <span className="text-xs text-muted-foreground">· {p.deliverable}</span>}
                <StatusBadge status={p.normalizedStatus} />
                <PriorityBadge priority={p.priority} />
                <span className="text-xs text-muted-foreground ml-auto">
                  {p.percent_complete}% · Owner: {p.owner}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full max-w-[200px]">
                  <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${p.percent_complete}%` }} />
                </div>
              </div>
              <p className="text-sm text-foreground">{p.summary}</p>
              {milestones.filter((m) => m.project_id === p.project_id).length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-muted-foreground">Key Dates: </span>
                  {milestones.filter((m) => m.project_id === p.project_id).map((m) => (
                    <span key={m.milestone_id} className="text-xs text-foreground mr-3">{m.title}: {vagueMilestoneToLabel(m.date_text)}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Blockers */}
      {blockers.length > 0 && (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <h2 className="font-semibold text-destructive mb-2">Active Blockers</h2>
          {blockers.map((b) => (
            <div key={b.blocker_id} className="flex items-start gap-2 py-1 text-sm border-b border-destructive/10 last:border-0">
              <span className="text-destructive font-bold">!</span>
              <span className="text-foreground">{b.description}</span>
              <span className="text-xs text-muted-foreground ml-auto">Severity: {b.severity}</span>
            </div>
          ))}
        </section>
      )}

      {/* Operational: Tracker Items */}
      {(mode === "operational" || openTracker.length > 0) && (
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
            <h2 className="font-semibold text-foreground">{showComplete ? "All" : "Open"} Items ({displayedTracker.length})</h2>
            <div className="flex items-center gap-3 print:hidden">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={showComplete} onChange={(e) => setShowComplete(e.target.checked)} className="rounded" />
                Show completed
              </label>
              <button onClick={exportTrackerExcel} className="text-xs text-primary hover:underline">Export ↓</button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
              <th className="py-2 px-3">Priority</th><th className="px-3">Topic</th><th className="px-3">RM#</th>
              <th className="px-3">Status</th><th className="px-3">Owner</th>
              {mode === "operational" && <><th className="px-3">Last Update</th><th className="px-3">ETA</th></>}
              <th className="px-3">Next Steps</th>
            </tr></thead>
            <tbody>{displayedTracker.map((t) => (
              <tr key={t.item_id} className="border-b hover:bg-muted/30 transition-colors align-top">
                <td className="py-2 px-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-3 max-w-[280px]">
                  <div className="font-medium text-foreground">{t.topic}</div>
                  {mode === "operational" && t.context && <div className="text-xs text-muted-foreground mt-0.5">{t.context}</div>}
                  {mode === "operational" && t.notes && <div className="text-xs text-muted-foreground/70 mt-0.5 italic">{t.notes}</div>}
                </td>
                <td className="px-3 font-mono text-xs">{t.rm_reference ?? "—"}</td>
                <td className="px-3">
                  <EditableSelect entityId={t.item_id} field="status" defaultValue={t.status} options={["Open", "In Progress", "In Programming", "In-Testing", "Testing Active", "Testing Complete", "Moved To Programming", "Waiting on Customer", "Complete", "Deployed", "On Hold"]} renderBadge={(v) => <StatusBadge status={v} />} />
                </td>
                <td className="px-3 text-xs">
                  <EditableText entityId={t.item_id} field="owner" defaultValue={t.owner} />
                </td>
                {mode === "operational" && <>
                  <td className="px-3 text-xs text-muted-foreground">{t.last_update ?? "—"}</td>
                  <td className="px-3 text-xs text-muted-foreground">{t.target_eta ?? "—"}</td>
                </>}
                <td className="px-3 text-xs max-w-[180px]">
                  <EditableText entityId={t.item_id} field="next_steps" defaultValue={t.next_steps ?? ""} />
                </td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {/* RM Issues with Spec Detail */}
      {rmDetail.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">RM / Redmine Issues ({rmDetail.length})</h2>
            <button onClick={exportRmExcel} className="text-xs text-primary hover:underline print:hidden">Export RM ↓</button>
          </div>
          {rmDetail.map((r) => (
            <div key={r.rm_issue_id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleRm(r.rm_issue_id)}>
                <span className="font-mono text-sm font-semibold text-primary">{r.rm_reference}</span>
                <span className="text-sm font-medium text-foreground flex-1">{r.description}</span>
                <StatusBadge status={r.normalizedStatus} />
                <UrgencyBadge urgency={r.urgency ?? "normal"} />
                <span className="text-xs">{rmExpanded.has(r.rm_issue_id) ? "▼" : "▶"}</span>
              </div>
              {rmExpanded.has(r.rm_issue_id) && (
                <div className="border-t border-border px-4 py-3 bg-muted/20">
                  <div className="grid md:grid-cols-3 gap-4">
                    <dl className="text-sm space-y-1.5">
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Owner:</dt><dd><EditableText entityId={r.rm_issue_id} field="owner" defaultValue={r.owner} /></dd></div>
                      {r.priority && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Priority:</dt><dd><PriorityBadge priority={r.priority} /></dd></div>}
                      {r.target_eta && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Target ETA:</dt><dd>{r.target_eta}</dd></div>}
                      {r.last_update && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Last Update:</dt><dd>{r.last_update}</dd></div>}
                      {(r as any).type && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Type:</dt><dd>{(r as any).type}</dd></div>}
                      {(r as any).severity && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Severity:</dt><dd>{(r as any).severity}</dd></div>}
                    </dl>
                    <dl className="text-sm space-y-1.5">
                      {(r as any).spec_status && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Spec:</dt><dd><StatusBadge status={(r as any).spec_status} /></dd></div>}
                      {(r as any).code_status && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Code:</dt><dd className="text-xs">{(r as any).code_status}</dd></div>}
                      {(r as any).testing_status && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Testing:</dt><dd className="text-xs">{(r as any).testing_status}</dd></div>}
                      {(r as any).deployment_status && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Deploy:</dt><dd className="text-xs">{(r as any).deployment_status}</dd></div>}
                      {(r as any).created_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Created:</dt><dd className="text-xs">{(r as any).created_date}</dd></div>}
                      {(r as any).due_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Due:</dt><dd className="text-xs">{(r as any).due_date}</dd></div>}
                    </dl>
                    <div className="space-y-2">
                      {(r as any).business_context && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Business Context</h4><p className="text-sm">{(r as any).business_context}</p></div>}
                      {(r as any).technical_context && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Technical Context</h4><p className="text-sm">{(r as any).technical_context}</p></div>}
                      {(r as any).key_requirements && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Requirements</h4><p className="text-sm">{(r as any).key_requirements}</p></div>}
                      {(r as any).open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Open Questions</h4><p className="text-sm text-status-caution">{(r as any).open_questions}</p></div>}
                      {r.context && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Context</h4><p className="text-sm">{r.context}</p></div>}
                      {r.notes && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Notes</h4><p className="text-sm">{r.notes}</p></div>}
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Next Steps</h4>
                        <EditableText entityId={r.rm_issue_id} field="next_steps" defaultValue={r.next_steps ?? ""} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Action Items */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Action Items ({actions.length})</h2>
          <button onClick={exportActionsExcel} className="text-xs text-primary hover:underline print:hidden">Export Actions ↓</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2 px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Urgency</th><th className="px-3">Status</th>
          </tr></thead>
          <tbody>{actions.length ? actions.map((a) => (
            <tr key={a.action_item_id} className="border-b hover:bg-muted/30 transition-colors align-top">
              <td className="py-2 px-3"><EditableText entityId={a.action_item_id} field="description" defaultValue={a.description} /></td>
              <td className="px-3 text-xs"><EditableText entityId={a.action_item_id} field="owner" defaultValue={a.owner} /></td>
              <td className="px-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
              <td className="px-3"><UrgencyBadge urgency={a.urgency ?? "normal"} /></td>
              <td className="px-3">
                <EditableSelect entityId={a.action_item_id} field="status" defaultValue={a.normalizedStatus} options={["Open", "In Progress", "Complete", "Done", "Waiting", "On Hold"]} renderBadge={(v) => <StatusBadge status={v} />} />
              </td>
            </tr>
          )) : <tr><td className="py-3 px-3 text-muted-foreground" colSpan={5}>No action items.</td></tr>}</tbody>
        </table>
      </section>

      {/* Recent Highlights */}
      {highlights.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-semibold text-foreground mb-2">Recent Highlights</h2>
          <ul className="space-y-1.5 text-sm">{highlights.map((h) => (
            <li key={h.highlight_id} className="flex items-start gap-2">
              <span className="text-status-on-track mt-0.5">✓</span>
              <span>{h.highlight} {h.date_text && <span className="text-xs text-muted-foreground">({h.date_text})</span>}</span>
            </li>
          ))}</ul>
        </section>
      )}

      {/* Meeting Minutes */}
      {meetings.length > 0 && mode === "operational" && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Meeting Minutes ({meetings.length})</h2>
          {meetings.map((mtg) => (
            <article key={mtg.meeting_id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{mtg.title}</h3>
                <span className="text-xs text-muted-foreground">{mtg.date}</span>
              </div>
              <p className="text-xs text-muted-foreground">Attendees: {mtg.attendees.join(", ")}</p>
              <p className="text-sm mt-2 text-foreground">{mtg.summary}</p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {mtg.decisions.length > 0 && (
                  <div className="rounded-lg border border-border p-3 bg-muted/20">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Decisions</h4>
                    <ul className="space-y-1 text-sm">{mtg.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-on-track">✓</span>{d}</li>)}</ul>
                  </div>
                )}
                {mtg.discussion_notes.length > 0 && (
                  <div className="rounded-lg border border-border p-3 bg-muted/20">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Discussion</h4>
                    <ul className="space-y-1 text-sm">{mtg.discussion_notes.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-muted-foreground">•</span>{d}</li>)}</ul>
                  </div>
                )}
              </div>
              {mtg.action_items_from_meeting.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Meeting Action Items</h4>
                  <table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="py-1.5 pr-3">Action</th><th className="pr-3">Owner</th><th className="pr-3">Due</th><th>Status</th></tr></thead>
                    <tbody>{mtg.action_items_from_meeting.map((a, i) => (
                      <tr key={i} className="border-b last:border-0"><td className="py-1.5 pr-3">{a.description}</td><td className="pr-3 text-xs">{a.owner}</td><td className="pr-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td><td><StatusBadge status={a.status} /></td></tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {/* Resources */}
      {resources.length > 0 && mode === "operational" && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Linked Resources</h2>
          <div className="space-y-1 text-sm">{resources.map((r) => (
            <div key={r.resource_id} className="flex items-center gap-3 py-1 border-b border-border/50 last:border-0">
              <span className="px-2 py-0.5 rounded text-xs font-medium border border-border bg-muted text-muted-foreground">{r.resource_type}</span>
              <span className="font-medium">{r.label}</span>
              {r.notes && <span className="text-xs text-muted-foreground">— {r.notes}</span>}
            </div>
          ))}</div>
        </section>
      )}
    </AppShell>
  );
}
