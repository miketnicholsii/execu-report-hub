import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { seed, customerById, getMeetingAllActions } from "@/lib/cfs/selectors2";
import { useStoredMeetings } from "@/hooks/useStoredMeetings";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";
import { Plus, Sparkles, X, Upload } from "lucide-react";

const seedMeetings = seed.meetingMinutes;
const seedActions = getMeetingAllActions();

export default function MeetingMinutesPage() {
  const { meetings: storedMeetings, addMeeting, deleteMeeting } = useStoredMeetings();
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

  const customers = Array.from(new Set([...seedMeetings.map((m) => m.customer_id), ...storedMeetings.map((m) => m.customer_id)])).sort();
  const customerName = (id: string) => customerById.get(id)?.customer_name ?? id;

  // Combine seed + stored meetings
  const allMeetings = useMemo(() => {
    const combined = [
      ...seedMeetings.map((m) => ({ ...m, source: "seed" as const, action_items: m.action_items_from_meeting })),
      ...storedMeetings.map((m) => ({ ...m, source: "stored" as const, action_items: m.action_items, action_items_from_meeting: m.action_items })),
    ];
    const filtered = customerFilter === "all" ? combined : combined.filter((m) => m.customer_id === customerFilter);
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [customerFilter, storedMeetings]);

  // Combine actions
  const allActions = useMemo(() => {
    const stored = storedMeetings.flatMap((m) => m.action_items.map((a) => ({
      ...a, meeting_title: m.title, meeting_date: m.date,
      customer_name: customerName(m.customer_id), customer_slug: customerById.get(m.customer_id)?.slug ?? "",
    })));
    const seed = customerFilter === "all" ? seedActions : seedActions.filter((a) => {
      const cust = customers.find((c) => customerById.get(c)?.slug === a.customer_slug);
      return cust === customerFilter;
    });
    return [...seed, ...stored];
  }, [storedMeetings, customerFilter]);

  const openActions = allActions.filter((a) => !["Done", "Complete"].includes(a.status));

  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    const data = await analyze("parse-meeting", aiText.trim(), `Customer: ${aiCustomer || "Unknown"}`);
    if (!data) return;

    addMeeting({
      customer_id: aiCustomer || "unknown",
      title: data.title || "Parsed Meeting",
      date: data.date || new Date().toISOString().slice(0, 10),
      attendees: data.attendees || [],
      summary: data.summary || "",
      decisions: data.decisions || [],
      discussion_notes: data.discussion_notes || [],
      action_items: (data.action_items || []).map((a: any) => ({
        description: a.description, owner: a.owner || "TBD", due_date: a.due_date, status: a.status || "Open",
      })),
      rm_references: data.rm_references || [],
      key_highlights: data.key_highlights || [],
      open_questions: data.open_questions || [],
      next_steps: data.next_steps || [],
      source: "ai-parsed",
      raw_text: aiText,
    });
    setAiText("");
    setShowAdd(false);
  };

  const handleManualAdd = () => {
    if (!manualTitle.trim()) return;
    addMeeting({
      customer_id: manualCustomer || "unknown",
      title: manualTitle,
      date: manualDate,
      attendees: manualAttendees.split(",").map((a) => a.trim()).filter(Boolean),
      summary: manualSummary,
      decisions: [], discussion_notes: [], action_items: [],
      rm_references: [], key_highlights: [], open_questions: [], next_steps: [],
      source: "manual",
    });
    setManualTitle(""); setManualSummary(""); setManualAttendees("");
    setShowAdd(false);
  };

  const exportExcel = () => downloadCsv("cfs-meeting-actions.csv", allActions.map((a) => ({
    Customer: a.customer_name, Meeting: a.meeting_title, Date: a.meeting_date,
    Action: a.description, Owner: a.owner, Due: a.due_date ?? "TBD", Status: a.status,
  })));

  return (
    <AppShell title="Meeting Minutes" subtitle="Capture and track all meeting outcomes" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Meetings" value={allMeetings.length} />
        <KpiCard label="Total Actions" value={allActions.length} />
        <KpiCard label="Open Actions" value={openActions.length} color="text-status-caution" />
        <KpiCard label="Completed" value={allActions.length - openActions.length} color="text-status-on-track" />
      </section>

      {/* Controls */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>
            {customers.map((c) => <option key={c} value={c}>{customerName(c)}</option>)}
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 ml-auto">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Meeting"}
          </button>
        </div>
      </section>

      {/* Add Meeting Panel */}
      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-4 print:hidden">
          <div className="flex gap-2">
            <button onClick={() => setAddMode("ai")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addMode === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Sparkles className="h-3.5 w-3.5" /> AI Parse Notes
            </button>
            <button onClick={() => setAddMode("manual")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addMode === "manual" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              Manual Entry
            </button>
          </div>

          {addMode === "ai" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Paste your meeting notes, email thread, or chat transcript. AI will extract attendees, decisions, action items, RM references, and more.</p>
              <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={aiCustomer} onChange={(e) => setAiCustomer(e.target.value)}>
                <option value="">Select Customer</option>
                {seed.customers.map((c) => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
              </select>
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[200px]" placeholder="Paste meeting notes, email thread, or chat transcript here..." value={aiText} onChange={(e) => setAiText(e.target.value)} />
              <button onClick={handleAiParse} disabled={loading || !aiText.trim()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                <Sparkles className="h-4 w-4" />
                {loading ? "Parsing..." : "Parse & Extract Meeting Data"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Meeting title" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
                <input type="date" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
                <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={manualCustomer} onChange={(e) => setManualCustomer(e.target.value)}>
                  <option value="">Select Customer</option>
                  {seed.customers.map((c) => <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>)}
                </select>
              </div>
              <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Attendees (comma separated)" value={manualAttendees} onChange={(e) => setManualAttendees(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Meeting summary..." value={manualSummary} onChange={(e) => setManualSummary(e.target.value)} />
              <button onClick={handleManualAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Save Meeting</button>
            </div>
          )}
        </section>
      )}

      {/* Action Items Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">All Meeting Action Items ({allActions.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2 px-3">Customer</th><th className="px-3">Meeting</th><th className="px-3">Date</th><th className="px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Status</th>
          </tr></thead>
          <tbody>{allActions.map((a, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors align-top">
              <td className="py-2 px-3"><Link to={`/customers/${a.customer_slug}`} className="text-primary hover:underline text-xs">{a.customer_name}</Link></td>
              <td className="px-3 text-xs">{a.meeting_title}</td>
              <td className="px-3 text-xs text-muted-foreground">{a.meeting_date}</td>
              <td className="px-3">{a.description}</td>
              <td className="px-3 text-xs">{a.owner}</td>
              <td className="px-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
              <td className="px-3"><StatusBadge status={a.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      {/* Meeting Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Meeting Records</h2>
        {allMeetings.map((mtg) => (
          <article key={mtg.meeting_id ?? mtg.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{mtg.title}</h3>
                  {mtg.source === "stored" && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">New</span>}
                </div>
                <p className="text-sm text-muted-foreground">{customerName(mtg.customer_id)} · {mtg.date}</p>
              </div>
              {mtg.source === "stored" && (
                <button onClick={() => deleteMeeting((mtg as any).id)} className="text-xs text-destructive hover:underline">Delete</button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Attendees: {mtg.attendees.join(", ")}</p>
            <p className="text-sm mt-3 text-foreground">{mtg.summary}</p>

            {/* AI-extracted extras for stored meetings */}
            {mtg.source === "stored" && (mtg as any).rm_references?.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-muted-foreground">RM References: </span>
                {(mtg as any).rm_references.map((rm: string, i: number) => <span key={i} className="font-mono text-xs text-primary mr-2">{rm}</span>)}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {mtg.decisions?.length > 0 && (
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Decisions Made</h4>
                  <ul className="space-y-1 text-sm">{mtg.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-on-track mt-0.5">✓</span>{d}</li>)}</ul>
                </div>
              )}
              {mtg.discussion_notes?.length > 0 && (
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Discussion Notes</h4>
                  <ul className="space-y-1 text-sm">{mtg.discussion_notes.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-muted-foreground">•</span>{d}</li>)}</ul>
                </div>
              )}
            </div>

            {/* Open Questions & Next Steps for AI-parsed */}
            {mtg.source === "stored" && (
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                {(mtg as any).open_questions?.length > 0 && (
                  <div className="rounded-lg border border-status-caution/30 p-3 bg-status-caution/5">
                    <h4 className="text-xs font-semibold uppercase text-status-caution mb-2">Open Questions</h4>
                    <ul className="space-y-1 text-sm">{(mtg as any).open_questions.map((q: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-status-caution">?</span>{q}</li>)}</ul>
                  </div>
                )}
                {(mtg as any).next_steps?.length > 0 && (
                  <div className="rounded-lg border border-primary/30 p-3 bg-primary/5">
                    <h4 className="text-xs font-semibold uppercase text-primary mb-2">Next Steps</h4>
                    <ul className="space-y-1 text-sm">{(mtg as any).next_steps.map((s: string, i: number) => <li key={i} className="flex items-start gap-2"><span className="text-primary">▸</span>{s}</li>)}</ul>
                  </div>
                )}
              </div>
            )}

            {mtg.action_items_from_meeting?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Action Items from This Meeting</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-muted-foreground"><th className="py-1.5 pr-3">Action</th><th className="pr-3">Owner</th><th className="pr-3">Due</th><th>Status</th></tr></thead>
                  <tbody>{mtg.action_items_from_meeting.map((a, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-1.5 pr-3">{a.description}</td>
                      <td className="pr-3 text-xs">{a.owner}</td>
                      <td className="pr-3 text-xs text-muted-foreground">{a.due_date ?? "TBD"}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
