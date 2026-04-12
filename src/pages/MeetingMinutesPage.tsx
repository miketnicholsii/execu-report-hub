import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import CopyButton from "@/components/CopyButton";
import { seed, customerById, getMeetingAllActions } from "@/lib/cfs/selectors2";
import { useSupabaseMeetings } from "@/hooks/useSupabaseMeetings";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";
import { Plus, Sparkles, X, Loader2, Calendar, Users as UsersIcon, MessageSquare } from "lucide-react";

const seedMeetings = seed.meetingMinutes;
const seedActions = getMeetingAllActions();

export default function MeetingMinutesPage() {
  const { meetings: dbMeetings, meetingActions, addMeeting, deleteMeeting, isLoading } = useSupabaseMeetings();
  const { analyze, loading } = useAiAnalyze();
  const [customerFilter, setCustomerFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"ai" | "manual">("ai");

  // AI paste
  const [aiText, setAiText] = useState("");
  const [aiCustomer, setAiCustomer] = useState("");

  // Manual form
  const [manualTitle, setManualTitle] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0, 10));
  const [manualAttendees, setManualAttendees] = useState("");
  const [manualSummary, setManualSummary] = useState("");
  const [manualCustomer, setManualCustomer] = useState("");

  const customers = Array.from(new Set([...seedMeetings.map((m) => m.customer_id), ...dbMeetings.map((m) => m.customer_id)])).filter(Boolean).sort();
  const customerName = (id: string | null) => (id ? customerById.get(id)?.customer_name : null) ?? id ?? "Unknown";

  // Combine seed + db meetings
  const allMeetings = useMemo(() => {
    const fromSeed = seedMeetings.map((m) => ({
      id: m.meeting_id, customer_id: m.customer_id, title: m.title, date: m.date,
      attendees: m.attendees, summary: m.summary,
      decisions: m.decisions || [], discussion_notes: m.discussion_notes || [],
      action_items: m.action_items_from_meeting || [],
      rm_references: [] as string[], key_highlights: [] as string[],
      open_questions: [] as string[], next_steps: [] as string[],
      source: "seed" as const,
    }));
    const fromDb = dbMeetings.map((m) => ({
      id: m.id, customer_id: m.customer_id, title: m.title, date: m.date,
      attendees: m.attendees || [], summary: m.summary || "",
      decisions: m.decisions || [], discussion_notes: m.discussion_notes || [],
      action_items: meetingActions.filter((a) => a.meeting_id === m.id).map((a) => ({
        description: a.description, owner: a.owner, due_date: a.due_date, status: a.status,
      })),
      rm_references: m.rm_references || [], key_highlights: m.key_highlights || [],
      open_questions: m.open_questions || [], next_steps: m.next_steps || [],
      source: "db" as const,
    }));
    const combined = [...fromSeed, ...fromDb];
    const filtered = customerFilter === "all" ? combined : combined.filter((m) => m.customer_id === customerFilter);
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [customerFilter, dbMeetings, meetingActions]);

  const allActions = useMemo(() => {
    const dbActions = dbMeetings.flatMap((m) =>
      meetingActions.filter((a) => a.meeting_id === m.id).map((a) => ({
        ...a, meeting_title: m.title, meeting_date: m.date,
        customer_name: customerName(m.customer_id),
        customer_slug: m.customer_id ? customerById.get(m.customer_id)?.slug ?? "" : "",
      }))
    );
    const filtered = customerFilter === "all" ? seedActions : seedActions.filter((a) => {
      const cust = customers.find((c) => customerById.get(c)?.slug === a.customer_slug);
      return cust === customerFilter;
    });
    return [...filtered, ...dbActions];
  }, [dbMeetings, meetingActions, customerFilter]);

  const openActions = allActions.filter((a) => !["Done", "Complete"].includes(a.status));

  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    const data = await analyze("parse-meeting", aiText.trim(), `Customer: ${aiCustomer ? customerName(aiCustomer) : "Unknown"}`);
    if (!data) return;

    addMeeting.mutate({
      customer_id: aiCustomer || undefined,
      title: data.title || "Parsed Meeting",
      date: data.date || new Date().toISOString().slice(0, 10),
      attendees: data.attendees || [],
      summary: data.summary || "",
      decisions: data.decisions || [],
      discussion_notes: data.discussion_notes || [],
      rm_references: data.rm_references || [],
      key_highlights: data.key_highlights || [],
      open_questions: data.open_questions || [],
      next_steps: data.next_steps || [],
      raw_text: aiText,
      action_items: (data.action_items || []).map((a: any) => ({
        description: a.description, owner: a.owner || "TBD",
        due_date: a.due_date || null, status: a.status || "Open",
      })),
    });
    setAiText("");
    setShowAdd(false);
  };

  const handleManualAdd = () => {
    if (!manualTitle.trim()) return;
    addMeeting.mutate({
      customer_id: manualCustomer || undefined,
      title: manualTitle,
      date: manualDate,
      attendees: manualAttendees.split(",").map((a) => a.trim()).filter(Boolean),
      summary: manualSummary,
      decisions: [], discussion_notes: [],
      rm_references: [], key_highlights: [],
      open_questions: [], next_steps: [],
      action_items: [],
    });
    setManualTitle(""); setManualSummary(""); setManualAttendees("");
    setShowAdd(false);
  };

  const exportExcel = () => downloadCsv("neko-meeting-actions.csv", allActions.map((a) => ({
    Customer: a.customer_name, Meeting: a.meeting_title, Date: a.meeting_date,
    Action: a.description, Owner: a.owner, Due: a.due_date ?? "TBD", Status: a.status,
  })));

  return (
    <AppShell title="Meeting Minutes" subtitle="Capture, analyze, and track all meeting outcomes" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Meetings" value={allMeetings.length} />
        <KpiCard label="Total Actions" value={allActions.length} />
        <KpiCard label="Open Actions" value={openActions.length} color="text-status-caution" />
        <KpiCard label="Completed" value={allActions.length - openActions.length} color="text-status-on-track" />
      </section>

      {/* Controls */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>
            {customers.map((c) => <option key={c} value={c}>{customerName(c)}</option>)}
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 ml-auto">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Meeting"}
          </button>
        </div>
      </section>

      {/* Add Meeting Panel */}
      {showAdd && (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm space-y-4 print:hidden animate-fade-in">
          <div className="flex gap-2">
            <button onClick={() => setAddMode("ai")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${addMode === "ai" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              <Sparkles className="h-3.5 w-3.5" /> AI Parse Notes
            </button>
            <button onClick={() => setAddMode("manual")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${addMode === "manual" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              Manual Entry
            </button>
          </div>

          {addMode === "ai" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Paste your meeting notes, email thread, or chat transcript. AI will extract attendees, decisions, action items, RM references, and more.</p>
              <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm w-full md:w-auto" value={aiCustomer} onChange={(e) => setAiCustomer(e.target.value)}>
                <option value="">Select Customer</option>
                {seed.customers.map((c) => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
              </select>
              <textarea className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Paste meeting notes, email thread, or chat transcript here..." value={aiText} onChange={(e) => setAiText(e.target.value)} />
              <button onClick={handleAiParse} disabled={loading || !aiText.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-primary/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Parsing with AI..." : "Parse & Extract Meeting Data"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <input className="rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Meeting title" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
                <input type="date" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
                <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={manualCustomer} onChange={(e) => setManualCustomer(e.target.value)}>
                  <option value="">Select Customer</option>
                  {seed.customers.map((c) => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
                </select>
              </div>
              <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Attendees (comma separated)" value={manualAttendees} onChange={(e) => setManualAttendees(e.target.value)} />
              <textarea className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Meeting summary..." value={manualSummary} onChange={(e) => setManualSummary(e.target.value)} />
              <button onClick={handleManualAdd} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">Save Meeting</button>
            </div>
          )}
        </section>
      )}

      {/* Action Items Table */}
      <section className="rounded-2xl border border-border bg-card shadow-sm overflow-x-auto">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">All Meeting Action Items ({allActions.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
            <th className="py-2.5 px-4">Customer</th><th className="px-3">Meeting</th><th className="px-3">Date</th><th className="px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Status</th>
          </tr></thead>
          <tbody>{allActions.map((a, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors align-top">
              <td className="py-2.5 px-4"><Link to={`/customers/${a.customer_slug}`} className="text-primary hover:underline text-xs">{a.customer_name}</Link></td>
              <td className="px-3 text-xs">{a.meeting_title}</td>
              <td className="px-3 text-xs text-muted-foreground">{a.meeting_date}</td>
              <td className="px-3 text-foreground">{a.description}</td>
              <td className="px-3 text-xs font-medium">{a.owner}</td>
              <td className="px-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
              <td className="px-3"><StatusBadge status={a.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      {/* Meeting Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Meeting Records</h2>
        {isLoading && <p className="text-sm text-muted-foreground">Loading meetings...</p>}
        {allMeetings.map((mtg) => (
          <article key={mtg.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{mtg.title}</h3>
                  {mtg.source === "db" && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">New</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {mtg.date}</span>
                  <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" /> {customerName(mtg.customer_id)}</span>
                </div>
              </div>
              {mtg.source === "db" && (
                <button onClick={() => deleteMeeting.mutate(mtg.id)} className="text-xs text-destructive hover:underline">Delete</button>
              )}
            </div>

            {mtg.attendees.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">Attendees: {mtg.attendees.join(", ")}</p>
            )}
            {mtg.summary && <p className="text-sm mt-3 text-foreground leading-relaxed">{mtg.summary}</p>}

            {/* RM References */}
            {mtg.rm_references.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground">RMs:</span>
                {mtg.rm_references.map((rm, i) => (
                  <span key={i} className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{rm}</span>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {mtg.decisions.length > 0 && (
                <div className="rounded-xl border border-status-on-track/20 p-4 bg-status-on-track-bg">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-status-on-track mb-2">Decisions Made</h4>
                  <ul className="space-y-1.5 text-sm">{mtg.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-on-track mt-0.5 flex-shrink-0">✓</span><span>{d}</span></li>)}</ul>
                </div>
              )}
              {mtg.discussion_notes.length > 0 && (
                <div className="rounded-xl border border-border/50 p-4 bg-muted/20">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Discussion Notes</h4>
                  <ul className="space-y-1.5 text-sm">{mtg.discussion_notes.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-muted-foreground flex-shrink-0">•</span><span>{d}</span></li>)}</ul>
                </div>
              )}
            </div>

            {/* Open Questions & Next Steps */}
            {(mtg.open_questions.length > 0 || mtg.next_steps.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                {mtg.open_questions.length > 0 && (
                  <div className="rounded-xl border border-status-caution/20 p-4 bg-status-caution-bg">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-status-caution mb-2">Open Questions</h4>
                    <ul className="space-y-1.5 text-sm">{mtg.open_questions.map((q, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-caution flex-shrink-0">?</span><span>{q}</span></li>)}</ul>
                  </div>
                )}
                {mtg.next_steps.length > 0 && (
                  <div className="rounded-xl border border-primary/20 p-4 bg-primary/5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Next Steps</h4>
                    <ul className="space-y-1.5 text-sm">{mtg.next_steps.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary flex-shrink-0">▸</span><span>{s}</span></li>)}</ul>
                  </div>
                )}
              </div>
            )}

            {/* Action Items from this meeting */}
            {mtg.action_items.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Action Items ({mtg.action_items.length})</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b bg-muted/30 text-left text-muted-foreground text-xs"><th className="py-2 px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Status</th></tr></thead>
                    <tbody>{mtg.action_items.map((a, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-2 px-3">{a.description}</td>
                        <td className="px-3 text-xs font-medium">{a.owner}</td>
                        <td className="px-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
                        <td className="px-3"><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
