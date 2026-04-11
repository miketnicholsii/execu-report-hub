import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { useSupabaseRmTickets } from "@/hooks/useSupabaseRmTickets";
import { useSupabaseActionItems } from "@/hooks/useSupabaseActionItems";
import { useSupabaseCustomers } from "@/hooks/useSupabaseCustomers";
import { useSupabaseMeetings } from "@/hooks/useSupabaseMeetings";
import { useSupabaseInitiatives } from "@/hooks/useSupabaseInitiatives";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Sparkles, Calendar, FileText, Loader2 } from "lucide-react";

export default function WeeklySummaryPage() {
  const { tickets } = useSupabaseRmTickets();
  const { actionItems } = useSupabaseActionItems();
  const { customers } = useSupabaseCustomers();
  const { meetings } = useSupabaseMeetings();
  const { initiatives } = useSupabaseInitiatives();
  const { analyze, loading } = useAiAnalyze();
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);
  const [summaryType, setSummaryType] = useState<"midweek" | "weekend">("midweek");

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isMidweek = dayOfWeek >= 1 && dayOfWeek <= 3;

  // Compute stats for summary
  const openTickets = tickets.filter(t => t.status !== "Complete");
  const blockedTickets = tickets.filter(t => t.status === "Blocked" || t.status === "Waiting on Customer");
  const openActions = actionItems.filter(a => !["Complete", "Done"].includes(a.status));
  const overdueActions = openActions.filter(a => a.due_date && new Date(a.due_date) < new Date());
  const recentMeetings = meetings.filter(m => {
    const d = new Date(m.date);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });

  // Stale tickets
  const staleTickets = tickets.filter(t => {
    if (t.status === "Complete") return false;
    if (!t.last_update) return true;
    const days = Math.floor((Date.now() - new Date(t.last_update).getTime()) / 86400000);
    return days > 14;
  });

  const generateSummary = async () => {
    const context = `
Today is ${today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
Summary type: ${summaryType === "midweek" ? "Midweek (Wednesday)" : "End of Week (Friday)"}

PORTFOLIO STATUS:
- ${customers.length} active customers
- ${openTickets.length} open RM tickets (${blockedTickets.length} blocked)
- ${staleTickets.length} stale tickets (no update in 14+ days)
- ${openActions.length} open action items (${overdueActions.length} overdue)
- ${recentMeetings.length} meetings this week

OPEN RM TICKETS:
${openTickets.slice(0, 30).map(t => `- ${t.rm_number}: ${t.title || "No title"} [${t.status}] Owner: ${t.owner || "Unassigned"} Last: ${t.last_update || "Never"}`).join("\n")}

BLOCKED / WAITING:
${blockedTickets.map(t => `- ${t.rm_number}: ${t.title || "No title"} [${t.status}]`).join("\n") || "None"}

STALE TICKETS (14+ days no update):
${staleTickets.slice(0, 20).map(t => `- ${t.rm_number}: ${t.title || "No title"} Last: ${t.last_update || "Never"}`).join("\n") || "None"}

OVERDUE ACTION ITEMS:
${overdueActions.map(a => `- ${a.title} (Owner: ${a.owner}, Due: ${a.due_date})`).join("\n") || "None"}

RECENT MEETINGS:
${recentMeetings.map(m => `- ${m.title} (${m.date}): ${m.summary || "No summary"}`).join("\n") || "None"}

INITIATIVES:
${initiatives.slice(0, 15).map(i => `- ${i.title} [${i.status}] Health: ${i.health}`).join("\n") || "None"}
`;

    const data = await analyze("summarize-status", context, `Generate a ${summaryType === "midweek" ? "midweek Wednesday" : "end of week Friday"} status summary for Mike Nichols at CFS. Include: Key Highlights, Development Updates, Upcoming Deployments, Blocked Items, Action Items Due, Open Questions, and Recommended Focus Areas.`);

    if (data) {
      setGeneratedSummary({
        type: summaryType,
        date: today.toLocaleDateString(),
        data,
        raw: context,
      });
    }
  };

  const exportExcel = () => {
    if (!generatedSummary) return;
    const d = generatedSummary.data;
    downloadCsv("neko-weekly-summary.csv", [
      { Section: "Summary", Content: d.summary || "" },
      ...(d.highlights || []).map((h: string) => ({ Section: "Highlight", Content: h })),
      ...(d.blockers || []).map((b: string) => ({ Section: "Blocker", Content: b })),
      ...(d.action_items || []).map((a: any) => ({ Section: "Action Item", Content: typeof a === "string" ? a : a.description || a.title })),
      ...(d.open_questions || []).map((q: string) => ({ Section: "Open Question", Content: q })),
      ...(d.next_steps || []).map((n: string) => ({ Section: "Next Step", Content: n })),
    ]);
  };

  return (
    <AppShell title="Weekly Summary Generator" subtitle="Auto-generate midweek and weekend status reports from live data" onExportExcel={generatedSummary ? exportExcel : undefined} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="OPEN RMs" value={openTickets.length} />
        <KpiCard label="BLOCKED" value={blockedTickets.length} color="text-destructive" />
        <KpiCard label="STALE (14d+)" value={staleTickets.length} color="text-status-caution" />
        <KpiCard label="OPEN ACTIONS" value={openActions.length} />
        <KpiCard label="OVERDUE" value={overdueActions.length} color={overdueActions.length > 0 ? "text-destructive" : ""} />
      </section>

      {/* Generate Controls */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button onClick={() => setSummaryType("midweek")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${summaryType === "midweek" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Calendar className="h-4 w-4" /> Midweek (Wed)
            </button>
            <button onClick={() => setSummaryType("weekend")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${summaryType === "weekend" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Calendar className="h-4 w-4" /> End of Week (Fri)
            </button>
          </div>
          <button onClick={generateSummary} disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate Summary"}
          </button>
          <p className="text-xs text-muted-foreground">
            {isMidweek ? "📅 It's midweek — recommended: Midweek summary" : "📅 End of week — recommended: Weekend summary"}
          </p>
        </div>
      </section>

      {/* Generated Summary */}
      {generatedSummary && (
        <section className="space-y-4">
          <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {generatedSummary.type === "midweek" ? "Midweek Status Summary" : "End of Week Summary"}
              </h2>
              <span className="text-xs text-muted-foreground ml-auto">{generatedSummary.date}</span>
            </div>

            {generatedSummary.data.summary && (
              <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Executive Summary</h3>
                <p className="text-sm text-foreground">{generatedSummary.data.summary}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedSummary.data.highlights?.length > 0 && (
                <SummaryBlock title="Key Highlights" items={generatedSummary.data.highlights} color="text-emerald-500" icon="✦" />
              )}
              {generatedSummary.data.rm_updates?.length > 0 && (
                <SummaryBlock title="RM Updates" items={generatedSummary.data.rm_updates} color="text-primary" icon="⚙" />
              )}
              {generatedSummary.data.deployments?.length > 0 && (
                <SummaryBlock title="Upcoming Deployments" items={generatedSummary.data.deployments} color="text-primary" icon="🚀" />
              )}
              {generatedSummary.data.blockers?.length > 0 && (
                <SummaryBlock title="Blocked Items" items={generatedSummary.data.blockers} color="text-destructive" icon="!" />
              )}
              {generatedSummary.data.action_items?.length > 0 && (
                <SummaryBlock title="Action Items Due" items={generatedSummary.data.action_items.map((a: any) => typeof a === "string" ? a : `${a.description || a.title} (${a.owner || "TBD"})`)} color="text-status-caution" icon="→" />
              )}
              {generatedSummary.data.open_questions?.length > 0 && (
                <SummaryBlock title="Open Questions" items={generatedSummary.data.open_questions} color="text-status-caution" icon="?" />
              )}
              {generatedSummary.data.next_steps?.length > 0 && (
                <SummaryBlock title="Recommended Focus" items={generatedSummary.data.next_steps} color="text-foreground" icon="▸" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      {!generatedSummary && (
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="text-center py-8">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Generate Your Weekly Summary</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              AI will analyze all your open RMs, action items, meetings, and initiatives to create a comprehensive status report ready for stakeholders.
            </p>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function SummaryBlock({ title, items, color, icon }: { title: string; items: string[]; color: string; icon: string }) {
  return (
    <div className="rounded-lg border border-border p-4 bg-muted/10">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">{title}</h4>
      <ul className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`${color} mt-0.5 flex-shrink-0 text-xs`}>{icon}</span>
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
