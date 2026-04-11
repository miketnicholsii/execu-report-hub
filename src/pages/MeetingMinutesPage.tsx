import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { loadSeedData } from "@/data/cfsSeedLoader";

const seed = loadSeedData();

export default function MeetingMinutesPage() {
  const [customerFilter, setCustomerFilter] = useState("all");
  const customers = useMemo(() => Array.from(new Set(seed.meetingMinutes.map((m) => m.customer_id))), []);

  const filtered = useMemo(() => {
    const items = customerFilter === "all" ? seed.meetingMinutes : seed.meetingMinutes.filter((m) => m.customer_id === customerFilter);
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
  }, [customerFilter]);

  const customerName = (id: string) => seed.customers.find((c) => c.customer_id === id)?.customer_name ?? id;

  const allMeetingActions = filtered.flatMap((m) =>
    m.action_items_from_meeting.map((a) => ({ ...a, meeting: m.title, date: m.date, customer: customerName(m.customer_id) }))
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">Meeting Minutes</h1>
            <Link className="rounded-lg border px-3 py-1 text-sm" to="/portfolio">Back</Link>
          </div>
          <div className="mt-3">
            <select className="rounded border px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
              <option value="all">All Customers</option>
              {customers.map((c) => <option key={c} value={c}>{customerName(c)}</option>)}
            </select>
          </div>
        </header>

        {/* Aggregate Action Items from Meetings */}
        <section className="rounded-xl border bg-white p-4 shadow-sm overflow-x-auto">
          <h2 className="font-semibold mb-2">All Meeting Action Items ({allMeetingActions.length})</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Meeting</th><th>Date</th><th>Action</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>{allMeetingActions.map((a, i) => (
              <tr key={i} className="border-b align-top">
                <td className="py-2">{a.customer}</td>
                <td className="py-2 text-xs">{a.meeting}</td>
                <td className="py-2 text-xs">{a.date}</td>
                <td className="py-2">{a.description}</td>
                <td className="py-2">{a.owner}</td>
                <td className="py-2 text-xs">{a.due_date ?? "TBD"}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === "Done" || a.status === "Complete" ? "bg-green-100 text-green-800" : a.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </section>

        {/* Individual Meeting Cards */}
        {filtered.map((mtg) => (
          <article key={mtg.meeting_id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{mtg.title}</h3>
                <p className="text-sm text-slate-500">{customerName(mtg.customer_id)} · {mtg.date}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Attendees: {mtg.attendees.join(", ")}</p>
            <p className="text-sm mt-2">{mtg.summary}</p>

            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Decisions Made</h4>
                <ul className="list-disc pl-5 text-sm space-y-0.5">{mtg.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Discussion Notes</h4>
                <ul className="list-disc pl-5 text-sm space-y-0.5">{mtg.discussion_notes.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            </div>

            {mtg.action_items_from_meeting.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Action Items</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-slate-400"><th className="py-1">Action</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
                  <tbody>{mtg.action_items_from_meeting.map((a, i) => (
                    <tr key={i} className="border-b last:border-0"><td className="py-1">{a.description}</td><td>{a.owner}</td><td className="text-xs">{a.due_date ?? "TBD"}</td><td>{a.status}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
