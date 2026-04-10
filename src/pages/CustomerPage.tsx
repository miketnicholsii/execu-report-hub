import { Link, useParams } from "react-router-dom";
import { customers } from "@/lib/projects";
import { StatusBadge } from "@/components/status/StatusComponents";

export default function CustomerPage() {
  const { customerSlug = "" } = useParams();
  const customer = customers.find((entry) => entry.slug === customerSlug);

  if (!customer) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded border bg-white p-4">
          <p>Customer page not found.</p>
          <Link className="mt-2 inline-block text-blue-700 underline" to="/status">Back to executive status</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-6xl space-y-4">
        <header className="rounded border bg-white p-4">
          <Link className="text-sm text-blue-700 underline" to="/status">← Executive Status</Link>
          <h1 className="text-2xl font-semibold">{customer.customerName}</h1>
          <p className="text-sm text-slate-600">{customer.overview}</p>
          {customer.trackerAvailable && <Link className="mt-2 inline-block text-sm text-blue-700 underline" to={`/customers/${customer.slug}/tracker`}>Open customer tracker table</Link>}
        </header>

        <section className="grid gap-4">
          {customer.initiatives.map((initiative) => (
            <article key={initiative.id} className="rounded border bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{initiative.projectName}{initiative.siteName ? ` — ${initiative.siteName}` : ""}</h2>
                <StatusBadge status={initiative.status} />
              </div>
              <p className="mt-1 text-sm"><strong>Deliverable:</strong> {initiative.deliverable}</p>
              <p className="text-sm"><strong>Phase:</strong> {initiative.phase}</p>
              <p className="mt-2 text-sm">{initiative.summary}</p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Key Dates</p>
                  <ul className="list-disc pl-5 text-sm">{initiative.keyDates.map((date) => <li key={date}>{date}</li>)}</ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Key Open Items / Next Steps</p>
                  <ul className="list-disc pl-5 text-sm">{initiative.nextSteps.map((step) => <li key={step}>{step}</li>)}</ul>
                </div>
                {initiative.recentHighlights && (
                  <div>
                    <p className="text-sm font-medium">Recent Highlights</p>
                    <ul className="list-disc pl-5 text-sm">{initiative.recentHighlights.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                {initiative.recentDeployments && (
                  <div>
                    <p className="text-sm font-medium">Recent Deployments</p>
                    <ul className="list-disc pl-5 text-sm">{initiative.recentDeployments.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
