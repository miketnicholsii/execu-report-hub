import { useParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, PriorityBadge, UrgencyBadge } from "@/components/StatusBadge";
import { getProjectDetail } from "@/lib/cfs/selectors2";
import { vagueMilestoneToLabel } from "@/lib/cfs/helpers";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  "Testing Complete": "hsl(142,60%,40%)", "Complete": "hsl(142,70%,35%)", "Deployed": "hsl(142,70%,35%)",
  "Testing Active": "hsl(38,92%,50%)", "In-Testing": "hsl(38,92%,50%)",
  "In Progress": "hsl(220,70%,50%)", "In Programming": "hsl(220,70%,50%)",
  "Moved To Programming": "hsl(260,50%,55%)", "Moved to Programming": "hsl(260,50%,55%)",
  "In-Spec": "hsl(200,60%,50%)", "In Spec": "hsl(200,60%,50%)",
  "Waiting on Customer": "hsl(0,72%,51%)", "On Hold": "hsl(0,0%,60%)",
};

export default function InitiativeDetailPage() {
  const { projectId = "" } = useParams();
  const data = getProjectDetail(projectId);
  const [rmExpanded, setRmExpanded] = useState<Set<string>>(new Set());

  if (!data) return (
    <AppShell title="Not Found"><p>Initiative not found. <Link className="text-primary underline" to="/portfolio">Back to Portfolio</Link></p></AppShell>
  );

  const { project, trackerItems, openTracker, rmIssues, actions, milestones, blockers, highlights, resources } = data;
  const completeItems = trackerItems.filter((t) => ["Complete", "Deployed", "Shipped"].includes(t.status));

  const statusCounts: Record<string, number> = {};
  trackerItems.forEach((t) => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const toggleRm = (id: string) => {
    const next = new Set(rmExpanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setRmExpanded(next);
  };

  const exportAll = () => downloadCsv(`initiative-${projectId}.csv`, trackerItems.map((t) => ({
    Priority: t.priority, Topic: t.topic, RM: t.rm_reference ?? "", Status: t.status,
    Owner: t.owner, "Last Update": t.last_update ?? "", ETA: t.target_eta ?? "",
    Notes: t.notes ?? "", "Next Steps": t.next_steps ?? "",
  })));

  return (
    <AppShell title={project.project_name} subtitle={`${project.customer_name} · Initiative Detail`} onExportExcel={exportAll} onExportPdf={exportPdf}>
      {/* Initiative Overview */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={project.normalizedStatus} />
              <PriorityBadge priority={project.priority} />
              <span className="px-2 py-0.5 rounded text-xs font-medium border border-border bg-muted text-muted-foreground">{project.initiative_type}</span>
            </div>
            <dl className="text-sm space-y-2">
              <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Customer:</dt><dd><Link to={`/customers/${project.customer_slug}`} className="text-primary hover:underline">{project.customer_name}</Link></dd></div>
              <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Deliverable:</dt><dd>{project.deliverable ?? "—"}</dd></div>
              <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Owner:</dt><dd>{project.owner}</dd></div>
              {(project as any).sponsor && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Sponsor:</dt><dd>{(project as any).sponsor}</dd></div>}
              <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Phase:</dt><dd>{project.phase}</dd></div>
              <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">% Complete:</dt><dd>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full max-w-[120px]">
                    <div className="h-2 bg-primary rounded-full" style={{ width: `${project.percent_complete}%` }} />
                  </div>
                  <span className="text-xs font-medium">{project.percent_complete}%</span>
                </div>
              </dd></div>
              {(project as any).start_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Start Date:</dt><dd>{(project as any).start_date}</dd></div>}
              {(project as any).target_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Target Date:</dt><dd>{(project as any).target_date}</dd></div>}
              {(project as any).last_updated && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[100px]">Last Updated:</dt><dd>{(project as any).last_updated}</dd></div>}
            </dl>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Summary</h4>
              <p className="text-sm">{project.summary}</p>
            </div>
            {(project as any).business_goal && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Business Goal</h4>
                <p className="text-sm">{(project as any).business_goal}</p>
              </div>
            )}
            {(project as any).technical_goal && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Technical Goal</h4>
                <p className="text-sm">{(project as any).technical_goal}</p>
              </div>
            )}
            {(project as any).deployment_notes && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Deployment Notes</h4>
                <p className="text-sm">{(project as any).deployment_notes}</p>
              </div>
            )}
          </div>
        </div>
        {project.dependencies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Dependencies</h4>
            <ul className="text-sm space-y-1">{project.dependencies.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-caution">⚠</span>{d}</li>)}</ul>
          </div>
        )}
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Open Items" value={openTracker.length} color="text-status-caution" />
        <KpiCard label="Complete" value={completeItems.length} color="text-status-on-track" />
        <KpiCard label="RM Issues" value={rmIssues.length} />
        <KpiCard label="Actions" value={actions.length} />
        <KpiCard label="Blockers" value={blockers.length} color={blockers.length > 0 ? "text-destructive" : ""} />
      </section>

      {/* Status Chart */}
      {statusData.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Items by Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Blockers */}
      {blockers.length > 0 && (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <h2 className="font-semibold text-destructive mb-2">Blockers</h2>
          {blockers.map((b) => (
            <div key={b.blocker_id} className="flex items-start gap-2 py-1 text-sm border-b border-destructive/10 last:border-0">
              <span className="text-destructive font-bold">!</span>
              <span>{b.description}</span>
              <span className="text-xs text-muted-foreground ml-auto">Severity: {b.severity}</span>
            </div>
          ))}
        </section>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-semibold text-foreground mb-2">Key Milestones</h2>
          <div className="space-y-2">{milestones.map((m) => (
            <div key={m.milestone_id} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0 text-sm">
              <span className="font-medium">{m.title}</span>
              <span className="text-xs text-muted-foreground">{vagueMilestoneToLabel(m.date_text)}</span>
            </div>
          ))}</div>
        </section>
      )}

      {/* Open Tracker Items */}
      {openTracker.length > 0 && (
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <div className="px-4 py-3 border-b border-border"><h2 className="font-semibold text-foreground">Open Items ({openTracker.length})</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-card border-b"><tr className="text-left text-muted-foreground">
              <th className="py-2 px-3">Priority</th><th className="px-3">Topic</th><th className="px-3">RM#</th>
              <th className="px-3">Status</th><th className="px-3">Owner</th><th className="px-3">Next Steps</th>
            </tr></thead>
            <tbody>{openTracker.map((t) => (
              <tr key={t.item_id} className="border-b hover:bg-muted/30 align-top">
                <td className="py-2 px-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-3 max-w-[250px]">
                  <div className="font-medium">{t.topic}</div>
                  {t.context && <div className="text-xs text-muted-foreground mt-0.5">{t.context}</div>}
                </td>
                <td className="px-3 font-mono text-xs">{t.rm_reference ?? "—"}</td>
                <td className="px-3"><StatusBadge status={t.status} /></td>
                <td className="px-3 text-xs">{t.owner}</td>
                <td className="px-3 text-xs max-w-[180px]">{t.next_steps ?? "—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {/* RM Issues */}
      {rmIssues.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">RM Issues ({rmIssues.length})</h2>
          {rmIssues.map((r) => (
            <div key={r.rm_issue_id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleRm(r.rm_issue_id)}>
                <span className="font-mono text-sm font-semibold text-primary">{r.rm_reference}</span>
                <span className="text-sm font-medium flex-1">{r.description}</span>
                <StatusBadge status={r.normalizedStatus} />
                <span className="text-xs">{rmExpanded.has(r.rm_issue_id) ? "▼" : "▶"}</span>
              </div>
              {rmExpanded.has(r.rm_issue_id) && (
                <div className="border-t border-border px-4 py-3 bg-muted/20 space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <dl className="text-sm space-y-1.5">
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Type:</dt><dd>{(r as any).type ?? "—"}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Severity:</dt><dd>{(r as any).severity ?? "—"}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Owner:</dt><dd>{r.owner}</dd></div>
                      {(r as any).created_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Created:</dt><dd>{(r as any).created_date}</dd></div>}
                      {(r as any).due_date && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Due:</dt><dd>{(r as any).due_date}</dd></div>}
                    </dl>
                    <dl className="text-sm space-y-1.5">
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Spec:</dt><dd><StatusBadge status={(r as any).spec_status ?? "—"} /></dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Code:</dt><dd className="text-xs">{(r as any).code_status ?? "—"}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Testing:</dt><dd className="text-xs">{(r as any).testing_status ?? "—"}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[85px]">Deploy:</dt><dd className="text-xs">{(r as any).deployment_status ?? "—"}</dd></div>
                    </dl>
                    <div className="space-y-2">
                      {(r as any).business_context && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Business Context</h4><p className="text-sm">{(r as any).business_context}</p></div>}
                      {(r as any).technical_context && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Technical Context</h4><p className="text-sm">{(r as any).technical_context}</p></div>}
                      {(r as any).key_requirements && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Requirements</h4><p className="text-sm">{(r as any).key_requirements}</p></div>}
                      {(r as any).open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground">Open Questions</h4><p className="text-sm text-status-caution">{(r as any).open_questions}</p></div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Action Items */}
      {actions.length > 0 && (
        <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <div className="px-4 py-3 border-b border-border"><h2 className="font-semibold text-foreground">Action Items ({actions.length})</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-card border-b"><tr className="text-left text-muted-foreground">
              <th className="py-2 px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Urgency</th><th className="px-3">Status</th>
            </tr></thead>
            <tbody>{actions.map((a) => (
              <tr key={a.action_item_id} className="border-b hover:bg-muted/30 align-top">
                <td className="py-2 px-3">{a.description}</td>
                <td className="px-3 text-xs">{a.owner}</td>
                <td className="px-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
                <td className="px-3"><UrgencyBadge urgency={a.urgency ?? "normal"} /></td>
                <td className="px-3"><StatusBadge status={a.normalizedStatus} /></td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Recent Highlights</h2>
          <ul className="space-y-1.5 text-sm">{highlights.map((h) => (
            <li key={h.highlight_id} className="flex items-start gap-2"><span className="text-status-on-track">✓</span>{h.highlight}</li>
          ))}</ul>
        </section>
      )}

      {/* Resources */}
      {resources.length > 0 && (
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