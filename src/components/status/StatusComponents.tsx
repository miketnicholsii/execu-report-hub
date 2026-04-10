import { Link } from "react-router-dom";
import type { CustomerProfile, ExecutiveStatus, Initiative } from "@/content/customers";
import type { Renewal, UpcomingDate } from "@/lib/projects";

const statusClass: Record<ExecutiveStatus, string> = {
  Planning: "bg-slate-100 text-slate-700 border-slate-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Testing: "bg-amber-100 text-amber-700 border-amber-300",
  Live: "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Post Implementation": "bg-purple-100 text-purple-700 border-purple-300",
  "In Review": "bg-indigo-100 text-indigo-700 border-indigo-300",
  TBD: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

export function StatusBadge({ status }: { status: ExecutiveStatus }) {
  return <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${statusClass[status]}`}>{status}</span>;
}

export function StatusPageHeader({ lastUpdated }: { lastUpdated: string }) {
  return (
    <header className="rounded-md border bg-white p-5 print:break-inside-avoid">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Executive Summary</p>
      <h1 className="text-2xl font-semibold text-slate-900">CFS Projects Team | Initiatives & Status Tracker</h1>
      <div className="mt-2 flex gap-6 text-sm text-slate-600">
        <span>Last Updated: {lastUpdated}</span>
        <Link className="text-blue-700 underline" to="/status/print">Print-friendly view</Link>
      </div>
    </header>
  );
}

export function UpcomingDatesTable({ dates }: { dates: UpcomingDate[] }) {
  return (
    <section className="rounded-md border bg-white p-4 print:break-inside-avoid">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Upcoming Dates</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Topic</th><th>Date</th><th>Notes</th><th>Status</th></tr></thead>
        <tbody>
          {dates.map((item) => (
            <tr key={`${item.customer}-${item.topic}`} className="border-b align-top">
              <td className="py-2 font-medium">{item.customer}</td><td>{item.topic}</td><td>{item.date}</td><td>{item.notes ?? "—"}</td><td><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function RenewalsTable({ items }: { items: Renewal[] }) {
  return (
    <section className="rounded-md border bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold">Software Maintenance Renewals</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Renewal Date</th><th>Notes</th><th>Status</th></tr></thead>
        <tbody>
          {items.map((item) => <tr key={item.customer} className="border-b"><td className="py-2 font-medium">{item.customer}</td><td>{item.renewalDate}</td><td>{item.notes ?? "—"}</td><td><StatusBadge status={item.status} /></td></tr>)}
        </tbody>
      </table>
    </section>
  );
}

export function InitiativeCard({ customer, initiative }: { customer: CustomerProfile; initiative: Initiative }) {
  return (
    <article className="rounded-md border bg-white p-4 print:break-inside-avoid">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{customer.customerName}{initiative.siteName ? ` — ${initiative.siteName}` : ""}</h3>
        <StatusBadge status={initiative.status} />
      </div>
      <p className="text-sm mt-1"><strong>Project / Deliverable:</strong> {initiative.projectName} — {initiative.deliverable}</p>
      <p className="text-sm"><strong>Phase:</strong> {initiative.phase}</p>
      <p className="text-sm mt-2">{initiative.summary}</p>
      <ul className="mt-2 list-disc pl-5 text-sm">{initiative.nextSteps.map((step) => <li key={step}>{step}</li>)}</ul>
      <div className="mt-3 flex gap-4 text-sm">
        <Link className="text-blue-700 underline" to={`/customers/${customer.slug}`}>Open customer breakout</Link>
        {customer.trackerAvailable && <Link className="text-blue-700 underline" to={`/customers/${customer.slug}/tracker`}>Open customer tracker</Link>}
      </div>
    </article>
  );
}
