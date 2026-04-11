import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { seed, customerById, getMeetingAllActions } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";

const allMeetings = seed.meetingMinutes;
const allActions = getMeetingAllActions();

export default function MeetingMinutesPage() {
  const [customerFilter, setCustomerFilter] = useState("all");
  const customers = Array.from(new Set(allMeetings.map((m) => m.customer_id))).sort();

  const meetings = useMemo(() => {
    const items = customerFilter === "all" ? allMeetings : allMeetings.filter((m) => m.customer_id === customerFilter);
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
  }, [customerFilter]);

  const meetingActions = useMemo(() => {
    if (customerFilter === "all") return allActions;
    return allActions.filter((a) => customers.includes(customerFilter) && a.customer_slug === (customerById.get(customerFilter)?.slug ?? ""));
  }, [customerFilter]);

  const openActions = meetingActions.filter((a) => !["Done", "Complete"].includes(a.status));
  const customerName = (id: string) => customerById.get(id)?.customer_name ?? id;

  const exportExcel = () => downloadCsv("cfs-meeting-actions.csv", meetingActions.map((a) => ({
    Customer: a.customer_name, Meeting: a.meeting_title, Date: a.meeting_date,
    Action: a.description, Owner: a.owner, Due: a.due_date ?? "TBD", Status: a.status,
  })));

  return (
    <AppShell title="Meeting Minutes" subtitle="All meeting records and action items" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Meetings" value={meetings.length} />
        <KpiCard label="Total Actions" value={meetingActions.length} />
        <KpiCard label="Open Actions" value={openActions.length} color="text-status-caution" />
        <KpiCard label="Completed" value={meetingActions.length - openActions.length} color="text-status-on-track" />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
          <option value="all">All Customers</option>
          {customers.map((c) => <option key={c} value={c}>{customerName(c)}</option>)}
        </select>
      </section>

      {/* Aggregate Meeting Actions */}
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">All Meeting Action Items ({meetingActions.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2 px-3">Customer</th><th className="px-3">Meeting</th><th className="px-3">Date</th><th className="px-3">Action</th><th className="px-3">Owner</th><th className="px-3">Due</th><th className="px-3">Status</th>
          </tr></thead>
          <tbody>{meetingActions.map((a, i) => (
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

      {/* Individual Meeting Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Meeting Records</h2>
        {meetings.map((mtg) => (
          <article key={mtg.meeting_id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{mtg.title}</h3>
                <p className="text-sm text-muted-foreground">{customerName(mtg.customer_id)} · {mtg.date}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Attendees: {mtg.attendees.join(", ")}</p>
            <p className="text-sm mt-3 text-foreground">{mtg.summary}</p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {mtg.decisions.length > 0 && (
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Decisions Made</h4>
                  <ul className="space-y-1 text-sm">{mtg.decisions.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-status-on-track mt-0.5">✓</span>{d}</li>)}</ul>
                </div>
              )}
              {mtg.discussion_notes.length > 0 && (
                <div className="rounded-lg border border-border p-3 bg-muted/20">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Discussion Notes</h4>
                  <ul className="space-y-1 text-sm">{mtg.discussion_notes.map((d, i) => <li key={i} className="flex items-start gap-2"><span className="text-muted-foreground">•</span>{d}</li>)}</ul>
                </div>
              )}
            </div>

            {mtg.action_items_from_meeting.length > 0 && (
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
