import { InitiativeCard, RenewalsTable, StatusBadge, StatusPageHeader, UpcomingDatesTable } from "@/components/status/StatusComponents";
import { customers, lastUpdated, pmNotes, portfolioItems, renewals, upcomingDates } from "@/lib/projects";

export default function ExecutiveStatusPage() {
  const initiatives = customers.flatMap((customer) => customer.initiatives.map((initiative) => ({ customer, initiative })));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 print:bg-white print:px-0">
      <section className="mx-auto max-w-7xl space-y-6">
        <StatusPageHeader lastUpdated={lastUpdated} />

        <UpcomingDatesTable dates={upcomingDates} />

        <section className="grid gap-4 lg:grid-cols-2 print:break-inside-avoid">
          <RenewalsTable items={renewals} />
          <section className="rounded-md border bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">PM Notes / Key Updates</h2>
            <div className="space-y-3 text-sm">
              {pmNotes.map((note) => (
                <div key={note.customer}>
                  <p className="font-medium">{note.customer}</p>
                  <ul className="list-disc pl-5">
                    {note.updates.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="rounded-md border bg-white p-4 print:break-inside-avoid">
          <h2 className="mb-3 text-lg font-semibold">Project Portfolio / Key Deliverables</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Customer</th><th>Initiative</th><th>Phase</th><th>Status</th><th>Summary</th></tr></thead>
            <tbody>
              {portfolioItems.map((item) => (
                <tr key={`${item.customer}-${item.deliverable}`} className="border-b align-top">
                  <td className="py-2 font-medium">{item.customer}</td><td>{item.deliverable}</td><td>{item.phase}</td><td><StatusBadge status={item.status} /></td><td>{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Customer / Initiative Summary Cards</h2>
          <div className="grid gap-4">
            {initiatives.map(({ customer, initiative }) => (
              <InitiativeCard key={initiative.id} customer={customer} initiative={initiative} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
