import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge, HealthBadge, PriorityBadge } from "@/components/StatusBadge";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseInitiatives } from "@/hooks/useSupabaseInitiatives";
import { useSupabaseRmTickets } from "@/hooks/useSupabaseRmTickets";
import { useSupabaseActionItems } from "@/hooks/useSupabaseActionItems";
import { useSupabaseMeetings } from "@/hooks/useSupabaseMeetings";
import { downloadCsvFile } from "@/lib/exportUtils";
import { ChevronDown, ChevronUp, Eye, Layers, CheckCircle2, Circle, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Open: "hsl(38,92%,50%)", "In Progress": "hsl(220,70%,50%)", Complete: "hsl(142,70%,35%)",
  "In Programming": "hsl(220,70%,50%)", "In-Testing": "hsl(38,92%,50%)", Deployed: "hsl(142,70%,35%)",
  "Waiting on Customer": "hsl(0,72%,51%)", "On Hold": "hsl(0,0%,60%)", Discovery: "hsl(200,60%,50%)",
};
const PRIORITY_COLORS: Record<string, string> = { High: "hsl(0,60%,55%)", Medium: "hsl(38,92%,50%)", Low: "hsl(220,15%,60%)" };

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export default function CustomerDrilldownPage() {
  const { customerId } = useParams();
  const { customers } = useSupabaseCustomers();
  const { initiatives } = useSupabaseInitiatives();
  const { tickets } = useSupabaseRmTickets();
  const { actionItems, updateActionItem } = useSupabaseActionItems();
  const { meetings, meetingActions } = useSupabaseMeetings();

  const [mode, setMode] = useState<"executive" | "operational">("executive");
  const [expandedRm, setExpandedRm] = useState<Set<string>>(new Set());
  const [expandedMtg, setExpandedMtg] = useState<Set<string>>(new Set());

  const customer = useMemo(() => customers.find((c) => c.id === customerId || c.slug === customerId), [customers, customerId]);

  const custInitiatives = useMemo(() => customer ? initiatives.filter((i) => i.customer_id === customer.id) : [], [initiatives, customer]);
  const custTickets = useMemo(() => customer ? tickets.filter((t) => t.customer_id === customer.id) : [], [tickets, customer]);
  const custActions = useMemo(() => customer ? actionItems.filter((a) => a.customer_id === customer.id) : [], [actionItems, customer]);
  const custMeetings = useMemo(() => customer ? meetings.filter((m) => m.customer_id === customer.id) : [], [meetings, customer]);

  const openActions = custActions.filter((a) => a.status !== "Done" && a.status !== "Complete");
  const openTickets = custTickets.filter((t) => !["Complete", "Deployed", "Closed"].includes(t.status));
  const staleTickets = custTickets.filter((t) => daysSince(t.last_update) > 21 && !["Complete", "Deployed", "Closed"].includes(t.status));

  // Charts
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    custTickets.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [custTickets]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    custInitiatives.forEach((i) => { counts[i.priority] = (counts[i.priority] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [custInitiatives]);

  const toggleRm = (id: string) => { const s = new Set(expandedRm); s.has(id) ? s.delete(id) : s.add(id); setExpandedRm(s); };
  const toggleMtg = (id: string) => { const s = new Set(expandedMtg); s.has(id) ? s.delete(id) : s.add(id); setExpandedMtg(s); };

  const toggleActionComplete = (a: typeof custActions[0]) => {
    const newStatus = a.status === "Done" || a.status === "Complete" ? "Open" : "Done";
    updateActionItem.mutate({ id: a.id, status: newStatus });
  };

  const exportCustomerExcel = () => {
    if (!customer) return;
    const rows = custTickets.map((t) => ({
      RM: t.rm_number, Title: t.title || "", Status: t.status, Owner: t.owner || "",
      "Last Update": t.last_update || "", "Due Date": t.due_date || "", "Next Steps": t.next_steps || "",
      "Open Questions": t.open_questions || "",
    }));
    downloadCsvFile(`${customer.slug}-rm-tracker.csv`, rows);
    toast.success("Customer tracker exported");
  };

  if (!customer) return (
    <AppShell title="Customer Not Found" subtitle="">
      <p className="text-muted-foreground">Customer not found. <Link className="text-primary underline" to="/customer-summary">Back to Customers</Link></p>
    </AppShell>
  );

  return (
    <AppShell
      title={customer.customer_name}
      subtitle={`Deep Dive · ${new Date().toLocaleDateString()}`}
      onExportExcel={exportCustomerExcel}
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
        <KpiCard label="Initiatives" value={custInitiatives.length} />
        <KpiCard label="RM Tickets" value={custTickets.length} />
        <KpiCard label="Open RMs" value={openTickets.length} color="text-status-caution" />
        <KpiCard label="Stale RMs" value={staleTickets.length} color={staleTickets.length > 0 ? "text-destructive" : ""} />
        <KpiCard label="Action Items" value={custActions.length} />
        <KpiCard label="Open Actions" value={openActions.length} color="text-status-caution" />
        <KpiCard label="Health" value={customer.health} color={customer.health === "Healthy" ? "text-status-on-track" : customer.health === "Caution" ? "text-status-caution" : "text-destructive"} />
      </section>

      {/* Charts */}
      {custTickets.length > 0 && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">RM Tickets by Status</h3>
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
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Initiatives by Priority</h3>
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

      {/* Initiatives */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Initiatives ({custInitiatives.length})
        </h2>
        <div className="space-y-3">
          {custInitiatives.map((init) => (
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
          {custInitiatives.length === 0 && <p className="text-sm text-muted-foreground">No initiatives linked to this customer.</p>}
        </div>
      </section>

      {/* RM Tickets */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> RM Tickets ({custTickets.length})
        </h2>
        {custTickets.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleRm(t.id)}>
              <span className="font-mono text-sm font-semibold text-primary">{t.rm_number}</span>
              <span className="text-sm font-medium text-foreground flex-1">{t.title || "Untitled"}</span>
              <StatusBadge status={t.status} />
              {daysSince(t.last_update) > 21 && <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">Stale</span>}
              <span className="text-xs text-muted-foreground">{t.owner || "—"}</span>
              {expandedRm.has(t.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {expandedRm.has(t.id) && (
              <div className="border-t border-border px-5 py-4 bg-muted/10 space-y-3">
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-xs font-semibold text-muted-foreground block">Owner</span>{t.owner || "—"}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Last Update</span>{t.last_update || "—"}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Due Date</span>{t.due_date || "—"}</div>
                </div>
                {t.summary && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Summary</h4><p className="text-sm text-foreground">{t.summary}</p></div>}
                {t.next_steps && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Next Steps</h4><p className="text-sm text-foreground">{t.next_steps}</p></div>}
                {t.open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Open Questions</h4><p className="text-sm text-status-caution">{t.open_questions}</p></div>}
                {t.dependencies && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Dependencies</h4><p className="text-sm text-foreground">{t.dependencies}</p></div>}
              </div>
            )}
          </div>
        ))}
        {custTickets.length === 0 && <p className="text-sm text-muted-foreground rounded-xl border border-border bg-card p-4">No RM tickets for this customer.</p>}
      </section>

      {/* Action Items with completion toggle */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Action Items ({custActions.length})
          </h2>
        </div>
        <div className="divide-y divide-border">
          {custActions.map((a) => {
            const done = a.status === "Done" || a.status === "Complete";
            return (
              <div key={a.id} className={`flex items-center gap-3 px-4 py-3 ${done ? "opacity-50" : ""}`}>
                <button onClick={() => toggleActionComplete(a)} className="flex-shrink-0">
                  {done ? <CheckCircle2 className="h-5 w-5 text-status-on-track" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.title}</p>
                  {a.description && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                </div>
                <PriorityBadge priority={a.priority} />
                <span className="text-xs text-muted-foreground">{a.owner}</span>
                {a.due_date && <span className="text-xs text-muted-foreground">{a.due_date}</span>}
              </div>
            );
          })}
          {custActions.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No action items.</p>}
        </div>
      </section>

      {/* Meetings */}
      {mode === "operational" && custMeetings.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Meeting Minutes ({custMeetings.length})
          </h2>
          {custMeetings.map((mtg) => {
            const mtgActions = meetingActions.filter((a) => a.meeting_id === mtg.id);
            return (
              <article key={mtg.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleMtg(mtg.id)}>
                  <h3 className="font-semibold text-foreground flex-1">{mtg.title}</h3>
                  <span className="text-xs text-muted-foreground">{mtg.date}</span>
                  {expandedMtg.has(mtg.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                {expandedMtg.has(mtg.id) && (
                  <div className="border-t border-border px-5 py-4 space-y-3 bg-muted/10">
                    <p className="text-xs text-muted-foreground">Attendees: {mtg.attendees.join(", ")}</p>
                    {mtg.summary && <p className="text-sm text-foreground">{mtg.summary}</p>}
                    <div className="grid md:grid-cols-2 gap-3">
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
                    {mtgActions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Action Items</h4>
                        <div className="space-y-1">{mtgActions.map((a) => (
                          <div key={a.id} className="flex items-center gap-2 text-sm py-1 border-b border-border/50 last:border-0">
                            <span className="flex-1">{a.description}</span>
                            <span className="text-xs text-muted-foreground">{a.owner}</span>
                            <StatusBadge status={a.status} />
                          </div>
                        ))}</div>
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
