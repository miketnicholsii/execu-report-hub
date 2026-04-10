import { Renewal } from "@/data/types";

interface Props {
  renewals: Renewal[];
}

export default function RenewalTable({ renewals }: Props) {
  return (
    <section className="print-avoid-break">
      <h2 className="text-lg font-semibold text-foreground mb-4">Software Maintenance Renewals</h2>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Renewal Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((r, i) => (
              <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium text-foreground">{r.customer}</td>
                <td className="p-3 text-foreground whitespace-nowrap">{r.renewalDate}</td>
                <td className="p-3">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-status-caution-bg text-status-caution">{r.status}</span>
                </td>
                <td className="p-3 text-muted-foreground">{r.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
