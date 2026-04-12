import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import AppShell from "@/components/AppShell";
import { StatusBadge, PriorityBadge, FlagBadge } from "@/components/StatusBadge";
import CopyButton from "@/components/CopyButton";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import {
  AlertTriangle, Calendar, Clock, User, FileText, MessageSquare,
  CheckCircle2, ExternalLink, Layers, ArrowLeft, Tag, Info,
} from "lucide-react";

function DetailField({ label, value, icon: Icon, color }: { label: string; value: string | number | null | undefined; icon?: any; color?: string }) {
  if (!value && value !== 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className={`text-sm text-foreground leading-relaxed ${color || ""}`}>{value}</p>
    </div>
  );
}

function RailCard({ label, value, color, icon: Icon }: { label: string; value: string | number; color?: string; icon?: any }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      {Icon && <Icon className={`h-4 w-4 flex-shrink-0 ${color || "text-muted-foreground"}`} />}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`text-sm font-semibold ${color || "text-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}

export default function RmDetailPage() {
  const { rmNumber = "" } = useParams();
  const { rmTickets, actionItems, initiatives, meetings } = useUnifiedData();

  const ticket = useMemo(() => rmTickets.find(t => t.rm_number === rmNumber), [rmTickets, rmNumber]);

  if (!ticket) {
    return (
      <AppShell title="RM Not Found" subtitle="">
        <div className="text-center py-16">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-1">RM ticket not found</h2>
          <p className="text-sm text-muted-foreground mb-4">Could not find {rmNumber} in the system.</p>
          <Link to="/rm-issues" className="text-primary hover:underline text-sm">← Back to RM Issue Center</Link>
        </div>
      </AppShell>
    );
  }

  const relatedActions = actionItems.filter(a =>
    a.title.includes(ticket.rm_number) || a.customer_slug === ticket.customer_slug
  ).slice(0, 10);

  const relatedInitiatives = initiatives.filter(i =>
    i.rm_number === ticket.rm_number || i.customer_slug === ticket.customer_slug
  );

  const relatedMeetings = meetings.filter(m =>
    m.rm_references?.includes(ticket.rm_number)
  );

  const daysOpen = ticket.created_date
    ? Math.floor((Date.now() - new Date(ticket.created_date).getTime()) / 86400000)
    : null;

  const attentionLevel = ticket.flags.includes("Blocked") ? "Critical" :
    ticket.flags.includes("Stale") ? "High" :
    ticket.flags.includes("Overdue") ? "High" :
    ticket.flags.includes("Aging") ? "Medium" : "Normal";

  const attentionColor = attentionLevel === "Critical" ? "text-destructive" :
    attentionLevel === "High" ? "text-amber-500" :
    attentionLevel === "Medium" ? "text-status-caution" : "text-muted-foreground";

  const exportExcel = () => downloadCsv(`${ticket.rm_number}-detail.csv`, [{
    RM: ticket.rm_number, Title: ticket.title, Customer: ticket.customer_name,
    Status: ticket.status, Owner: ticket.owner, Summary: ticket.summary,
    "Last Update": ticket.last_update || "", "Due Date": ticket.due_date || "",
    "Next Steps": ticket.next_steps, "Open Questions": ticket.open_questions,
    Dependencies: ticket.dependencies, Flags: ticket.flags.join("; "),
  }]);

  const copyContent = () => [
    `${ticket.rm_number} — ${ticket.title || "Untitled"}`,
    `Customer: ${ticket.customer_name}`,
    `Status: ${ticket.status}  |  Owner: ${ticket.owner}`,
    `Last Update: ${ticket.last_update || "—"}  |  Due: ${ticket.due_date || "—"}`,
    ticket.summary ? `\nSummary:\n${ticket.summary}` : "",
    ticket.next_steps ? `\nNext Steps:\n${ticket.next_steps}` : "",
    ticket.open_questions ? `\nOpen Questions:\n${ticket.open_questions}` : "",
    ticket.dependencies ? `\nDependencies:\n${ticket.dependencies}` : "",
    ticket.flags.length ? `\nFlags: ${ticket.flags.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  return (
    <AppShell
      title={ticket.rm_number}
      subtitle={ticket.title || "Untitled RM"}
      onExportExcel={exportExcel}
      onExportPdf={exportPdf}
      breadcrumbs={[
        { label: "Customers", to: "/customer-summary" },
        { label: ticket.customer_name, to: `/customers/${ticket.customer_slug}` },
        { label: ticket.rm_number },
      ]}
      actions={<CopyButton content={copyContent} label="Copy Detail" />}
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content */}
        <div className="space-y-6 min-w-0">
          {/* Header card */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">{ticket.title || "Untitled"}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/customers/${ticket.customer_slug}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> {ticket.customer_name}
                  </Link>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs text-muted-foreground">Source: {ticket.source}</span>
                </div>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="grid sm:grid-cols-4 gap-4 text-sm border-t border-border pt-4">
              <div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Owner</p><p className="font-medium text-foreground">{ticket.owner}</p></div>
              <div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Last Update</p><p className="text-foreground">{ticket.last_update || "—"}</p></div>
              <div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Due Date</p><p className={`${ticket.overdue ? "text-destructive font-semibold" : "text-foreground"}`}>{ticket.due_date || "—"}</p></div>
              <div><p className="text-[10px] font-semibold uppercase text-muted-foreground">Days Since Update</p><p className="text-foreground">{ticket.days_since_update ?? "—"}</p></div>
            </div>
          </section>

          {/* Summary & Context */}
          {(ticket.summary || ticket.business_context || ticket.technical_context) && (
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Summary & Context
              </h3>
              <DetailField label="Plain-English Summary" value={ticket.summary} icon={FileText} />
              <DetailField label="Business Context" value={ticket.business_context} />
              <DetailField label="Technical Context" value={ticket.technical_context} />
              <DetailField label="Key Requirements" value={ticket.key_requirements} />
              <DetailField label="Context / Notes" value={ticket.context || ticket.notes} />
            </section>
          )}

          {/* Next Steps & Questions */}
          {(ticket.next_steps || ticket.open_questions || ticket.dependencies) && (
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Operational Detail
              </h3>
              <DetailField label="Next Steps" value={ticket.next_steps} />
              <DetailField label="Open Questions" value={ticket.open_questions} color="text-status-caution" />
              <DetailField label="Dependencies / Blockers" value={ticket.dependencies} />
            </section>
          )}

          {/* Related Action Items */}
          {relatedActions.length > 0 && (
            <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Related Actions ({relatedActions.length})
                </h3>
              </div>
              <div className="divide-y divide-border">
                {relatedActions.map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground">{a.owner} · {a.due_date || "No date"}</p>
                    </div>
                    <PriorityBadge priority={a.priority} />
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Meetings */}
          {relatedMeetings.length > 0 && (
            <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Related Meetings ({relatedMeetings.length})
                </h3>
              </div>
              <div className="divide-y divide-border">
                {relatedMeetings.map(m => (
                  <div key={m.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">{m.date} · {m.attendees?.join(", ")}</p>
                    {m.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.summary}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Side Rail */}
        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          {/* Attention Card */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Summary</h3>
            <RailCard label="Attention Level" value={attentionLevel} color={attentionColor} icon={AlertTriangle} />
            <RailCard label="Status" value={ticket.status} icon={Tag} />
            <RailCard label="Owner" value={ticket.owner} icon={User} />
            {ticket.days_since_update !== null && (
              <RailCard
                label="Days Since Update"
                value={ticket.days_since_update}
                color={ticket.days_since_update > 30 ? "text-destructive" : ticket.days_since_update > 14 ? "text-amber-500" : ""}
                icon={Clock}
              />
            )}
            {daysOpen !== null && <RailCard label="Days Open" value={daysOpen} icon={Calendar} />}
          </div>

          {/* Flags */}
          {ticket.flags.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Flags</h3>
              <div className="flex flex-wrap gap-1.5">
                {ticket.flags.map(f => <FlagBadge key={f} flag={f} />)}
              </div>
            </div>
          )}

          {/* Missing Data */}
          {(ticket.flags.includes("Missing Owner") || !ticket.due_date || !ticket.last_update) && (
            <div className="rounded-xl border border-status-caution/30 bg-status-caution/5 p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-status-caution mb-2">Missing Data</h3>
              <ul className="space-y-1.5 text-xs text-foreground">
                {ticket.flags.includes("Missing Owner") && <li className="flex items-center gap-1.5">⚠ No owner assigned</li>}
                {!ticket.due_date && <li className="flex items-center gap-1.5">⚠ No due date set</li>}
                {!ticket.last_update && <li className="flex items-center gap-1.5">⚠ No last update recorded</li>}
                {!ticket.summary && <li className="flex items-center gap-1.5">⚠ No summary available</li>}
              </ul>
            </div>
          )}

          {/* Spec / Code Status */}
          {(ticket.spec_status || ticket.code_status || ticket.testing_status) && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lifecycle</h3>
              {ticket.spec_status && <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Spec</span><StatusBadge status={ticket.spec_status} /></div>}
              {ticket.code_status && <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Code</span><StatusBadge status={ticket.code_status} /></div>}
              {ticket.testing_status && <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Testing</span><StatusBadge status={ticket.testing_status} /></div>}
              {ticket.deployment_status && <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Deploy</span><StatusBadge status={ticket.deployment_status} /></div>}
            </div>
          )}

          {/* Related Initiatives */}
          {relatedInitiatives.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Linked Initiatives</h3>
              <div className="space-y-2">
                {relatedInitiatives.map(i => (
                  <div key={i.id} className="text-xs">
                    <p className="font-medium text-foreground">{i.title}</p>
                    <p className="text-muted-foreground">{i.status} · {i.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <Link to={`/customers/${ticket.customer_slug}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" /> Back to {ticket.customer_name}
          </Link>
        </aside>
      </div>
    </AppShell>
  );
}
