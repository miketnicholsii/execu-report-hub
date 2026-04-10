import { Link, useParams } from "react-router-dom";
import { customers } from "@/lib/projects";
import { getTrackerSections } from "@/content/trackers";

export default function CustomerTrackerPage() {
  const { customerSlug = "" } = useParams();
  const customer = customers.find((entry) => entry.slug === customerSlug);

  if (!customer || !customer.trackerAvailable) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded border bg-white p-4">
          <p>Tracker page is not available for this customer.</p>
          <Link className="mt-2 inline-block text-blue-700 underline" to="/status">Back to executive status</Link>
        </div>
      </main>
    );
  }

  const sections = getTrackerSections(customer.slug);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-7xl space-y-4">
        <header className="rounded border bg-white p-4">
          <Link className="text-sm text-blue-700 underline" to={`/customers/${customer.slug}`}>← {customer.customerName} breakout</Link>
          <h1 className="text-2xl font-semibold">{customer.customerName} Tracker</h1>
          <p className="text-sm text-slate-600">Customer-facing table tracker view derived from standardized tracker rows.</p>
        </header>

        {sections.map((section) => (
          <section key={section.id} className="rounded border bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">{section.label}</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Item</th><th>Status</th><th>Ticket / RM</th><th>Owner</th><th>Due Date</th><th>Notes</th></tr></thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.itemId} className="border-b align-top">
                    <td className="py-2">{row.description}</td>
                    <td>{row.status}</td>
                    <td>{row.ticketNumber ?? "—"}</td>
                    <td>{row.owner ?? "—"}</td>
                    <td>{row.dueDate ?? row.completedDate ?? "—"}</td>
                    <td>{row.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </section>
    </main>
  );
}
