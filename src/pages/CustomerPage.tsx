import { Link, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import GanttChart from "@/components/GanttChart";
import { StatusBadge, PriorityBadge, HealthBadge, FlagBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { vagueMilestoneToLabel } from "@/lib/cfs/helpers";
import { Eye, Layers, ChevronDown, ChevronUp, CheckCircle2, Circle, MessageSquare, AlertTriangle, FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Open: "hsl(38,92%,50%)", "In Progress": "hsl(220,70%,50%)", Complete: "hsl(142,70%,35%)",
  "In Development": "hsl(220,70%,50%)", "In Testing": "hsl(38,92%,50%)", Deployed: "hsl(142,70%,35%)",
  "Waiting on Customer": "hsl(0,72%,51%)", Blocked: "hsl(0,72%,51%)", Live: "hsl(142,70%,35%)",
  "Not Started": "hsl(220,15%,55%)", Discovery: "hsl(270,50%,55%)",
};
const PRIORITY_COLORS: Record<string, string> = { High: "hsl(0,60%,55%)", Medium: "hsl(38,92%,50%)", Low: "hsl(220,15%,60%)" };
const CLOSED = ["Complete", "Deployed", "Closed", "Live", "Shipped", "Done"];

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const unified = useUnifiedData();
  const custData = unified.getCustomerData(customerSlug);

  const [mode, setMode] = useState<"executive" | "operational">("executive");
  const [expandedRm, setExpandedRm] = useState<Set<string>>(new Set());
  const [expandedMtg, setExpandedMtg] = useState<Set<string>>(new Set());

  if (!custData) return (
    <AppShell title="Not Found" subtitle="">
      <p className="text-muted-foreground">Customer not found. <Link className="text-primary underline" to="/customer-summary">Back to Customers</Link></p>
    </AppShell>
  );

  const { customer, initiatives, rmTickets, actionItems, meetings, meetingActions, staticDeep } = custData;

  const openRms = rmTickets.filter(r => !CLOSED.includes(r.status));
  const staleRms = rmTickets.filter(r => r.flags.includes("Stale") || r.flags.includes("Aging"));
  const openActions = actionItems.filter(a => !["Complete", "Done"].includes(a.status));
  const blockedRms = rmTickets.filter(r => r.flags.includes("Blocked"));

  // Static deep data for extras
  const blockers = staticDeep?.blockers || [];
  const milestones = staticDeep?.milestones || [];
  const trackerItems = staticDeep?.trackerItems || [];
  const ganttItems = (staticDeep?.projects || []).filter((p: any) => p.start_date || p.target_date).map((p: any) => {
    const ms = milestones.filter(m => m.project_id === p.project_id && m.date_text && !m.date_text.includes("TBD")).map(m => ({ date: m.date_text!, label: m.title }));
    return { id: p.project_id, label: p.project_name, startDate: p.start_date, endDate: p.target_date, milestones: ms, percentComplete: p.percent_complete, status: p.normalizedStatus, owner: p.owner };
  });

  // Charts from unified RM data
  const statusCounts: Record<string, number> = {};
  rmTickets.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const priorityCounts: Record<string, number> = {};
  initiatives.forEach(i => { priorityCounts[i.priority] = (priorityCounts[i.priority] || 0) + 1; });
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  const toggleRm = (id: string) => { const s = new Set(expandedRm); s.has(id) ? s.delete(id) : s.add(id); setExpandedRm(s); };
  const toggleMtg = (id: string) => { const s = new Set(expandedMtg); s.has(id) ? s.delete(id) : s.add(id); setExpandedMtg(s); };

  const toggleActionComplete = (a: typeof actionItems[0]) => {
    if (!a.from_db) return;
    const newStatus = ["Complete", "Done"].includes(a.status) ? "Open" : "Done";
    unified.updateActionItem.mutate({ id: a.id, status: newStatus });
  };

  const exportExcel = () => downloadCsv(`${customer.slug}-full-tracker.csv`, rmTickets.map(r => ({
    RM: r.rm_number, Title: r.title, Status: r.status, Owner: r.owner,
    "Last Update": r.last_update || "", "Due Date": r.due_date || "",
    "Next Steps": r.next_steps, Flags: r.flags.join("; "),
  })));

  return (
    <AppShell
      title={customer.customer_name}
      subtitle={`Deep Dive · ${new Date().toLocaleDateString()}`}
      onExportExcel={exportExcel}
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
      {/* KPIs — same counts as Customer Summary card */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Initiatives" value={initiatives.length} />
        <KpiCard label="RM Tickets" value={rmTickets.length} />
        <KpiCard label="Open RMs" value={openRms.length} color="text-status-caution" />
        <KpiCard label="Stale RMs" value={staleRms.length} color={staleRms.length > 0 ? "text-destructive" : ""} />
        <KpiCard label="Action Items" value={actionItems.length} />
        <KpiCard label="Open Actions" value={openActions.length} color="text-status-caution" />
        <KpiCard label="Health" value={customer.health} color={customer.health === "Healthy" || customer.health === "On Track" ? "text-status-on-track" : customer.health === "Caution" ? "text-status-caution" : "text-destructive"} />
      </section>

      {/* Charts */}
      {rmTickets.length > 0 && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">RM Tickets by Status ({rmTickets.length} total)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map(e => <Cell key={e.name} fill={STATUS_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Initiatives by Priority ({initiatives.length} total)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {priorityData.map(e => <Cell key={e.name} fill={PRIORITY_COLORS[e.name] || "hsl(220,15%,70%)"} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Gantt */}
      {ganttItems.length > 0 && <GanttChart items={ganttItems} title="Initiative Timeline" />}

      {/* Blockers */}
      {blockers.length > 0 && (
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <h2 className="font-semibold text-destructive mb-2">Active Blockers ({blockers.length})</h2>
          {blockers.map((b: any) => (
            <div key={b.blocker_id} className="flex items-start gap-2 py-1 text-sm border-b border-destructive/10 last:border-0">
              <span className="text-destructive font-bold">!</span>
              <span className="text-foreground">{b.description}</span>
              <span className="text-xs text-muted-foreground ml-auto">Severity: {b.severity}</span>
            </div>
          ))}
        </section>
      )}

      {/* Initiatives */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Initiatives ({initiatives.length})
        </h2>
        <div className="space-y-3">
          {initiatives.map(init => (
            <div key={init.id} className="rounded-lg border border-border p-4 bg-muted/10">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="font-semibold text-foreground">{init.title}</span>
                {init.rm_number && <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">{init.rm_number}</span>}
                <StatusBadge status={init.status} />
                <PriorityBadge priority={init.priority} />
                <HealthBadge health={init.health} />
                <span className="text-xs text-muted-foreground ml-auto">Owner: {init.owner || "Unassigned"}</span>
              </div>
              {init.description && <p className="text-sm text-foreground mb-2">{init.description}</p>}
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {init.next_step && <div><span className="text-xs font-semibold text-muted-foreground">Next Step:</span> {init.next_step}</div>}
                {init.open_question && <div><span className="text-xs font-semibold text-muted-foreground">Open Question:</span> <span className="text-status-caution">{init.open_question}</span></div>}
                {init.due_date && <div><span className="text-xs font-semibold text-muted-foreground">Due:</span> {init.due_date}</div>}
              </div>
            </div>
          ))}
          {initiatives.length === 0 && <p className="text-sm text-muted-foreground">No initiatives for this customer.</p>}
        </div>
      </section>

      {/* RM Tickets */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> RM Tickets ({rmTickets.length})
        </h2>
        {rmTickets.map(t => (
          <div key={t.id} className={`rounded-xl border bg-card shadow-sm overflow-hidden ${t.flags.includes("Stale") ? "border-destructive/30" : t.flags.includes("Aging") ? "border-amber-500/30" : "border-border"}`}>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleRm(t.id)}>
              <span className="font-mono text-sm font-semibold text-primary">{t.rm_number}</span>
              <span className="text-sm font-medium text-foreground flex-1">{t.title || "Untitled"}</span>
              {t.flags.slice(0, 2).map(f => (
                <FlagBadge key={f} flag={f} />
              ))}
              <StatusBadge status={t.status} />
              <span className="text-xs text-muted-foreground">{t.owner}</span>
              {expandedRm.has(t.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {expandedRm.has(t.id) && (
              <div className="border-t border-border px-5 py-4 bg-muted/10 space-y-3">
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-xs font-semibold text-muted-foreground block">Owner</span>{t.owner}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Last Update</span>{t.last_update || "—"}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Due Date</span>{t.due_date || "—"}</div>
                </div>
                {t.summary && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Summary</h4><p className="text-sm text-foreground">{t.summary}</p></div>}
                {t.next_steps && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Next Steps</h4><p className="text-sm text-foreground">{t.next_steps}</p></div>}
                {t.open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Open Questions</h4><p className="text-sm text-status-caution">{t.open_questions}</p></div>}
                {t.dependencies && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Dependencies</h4><p className="text-sm text-foreground">{t.dependencies}</p></div>}
                {t.spec_status && <div className="flex gap-4 text-xs"><span className="text-muted-foreground">Spec: <StatusBadge status={t.spec_status} /></span></div>}
              </div>
            )}
          </div>
        ))}
        {rmTickets.length === 0 && <p className="text-sm text-muted-foreground rounded-xl border border-border bg-card p-4">No RM tickets for this customer.</p>}
      </section>

      {/* Action Items */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Action Items ({actionItems.length})
          </h2>
        </div>
        <div className="divide-y divide-border">
          {actionItems.map(a => {
            const done = ["Complete", "Done"].includes(a.status);
            return (
              <div key={a.id} className={`flex items-center gap-3 px-4 py-3 ${done ? "opacity-50" : ""}`}>
                <button onClick={() => toggleActionComplete(a)} className={`flex-shrink-0 ${a.from_db ? "cursor-pointer" : "cursor-default opacity-30"}`} disabled={!a.from_db}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-status-on-track" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.title}</p>
                  {a.description && a.description !== a.title && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                </div>
                <PriorityBadge priority={a.priority} />
                <span className="text-xs text-muted-foreground">{a.owner}</span>
                {a.due_date && <span className="text-xs text-muted-foreground">{a.due_date}</span>}
              </div>
            );
          })}
          {actionItems.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No action items.</p>}
        </div>
      </section>

      {/* Meetings (operational mode) */}
      {mode === "operational" && meetings.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Meeting Minutes ({meetings.length})
          </h2>
          {meetings.map(mtg => {
            const mtgActs = meetingActions.filter(a => a.meeting_id === mtg.id);
            return (
              <article key={mtg.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleMtg(mtg.id)}>
                  <h3 className="font-semibold text-foreground flex-1">{mtg.title}</h3>
                  <span className="text-xs text-muted-foreground">{mtg.date}</span>
                  {expandedMtg.has(mtg.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {expandedMtg.has(mtg.id) && (
                  <div className="border-t border-border px-5 py-4 space-y-3 bg-muted/10">
                    {mtg.attendees.length > 0 && <p className="text-xs text-muted-foreground">Attendees: {mtg.attendees.join(", ")}</p>}
                    {mtg.summary && <p className="text-sm text-foreground">{mtg.summary}</p>}
                    {mtg.decisions.length > 0 && (
                      <div className="rounded-lg border border-border p-3 bg-card">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Decisions</h4>
                        <ul className="space-y-1 text-sm">{mtg.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-on-track">✓</span>{d}</li>)}</ul>
                      </div>
                    )}
                    {mtg.next_steps.length > 0 && (
                      <div className="rounded-lg border border-border p-3 bg-card">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Next Steps</h4>
                        <ul className="space-y-1 text-sm">{mtg.next_steps.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary">→</span>{s}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </AppShell>
  );
}
