import { InternalInitiative } from "@/data/types";

interface Props {
  initiatives: InternalInitiative[];
}

const statusColor: Record<string, string> = {
  WIP: "bg-[hsl(var(--phase-development-bg))] text-[hsl(var(--phase-development))]",
  "In Spec": "bg-[hsl(var(--phase-planning-bg))] text-[hsl(var(--phase-planning))]",
  "Quote Sent": "bg-status-caution-bg text-status-caution",
  "Spec drafted / In Review": "bg-[hsl(var(--phase-testing-bg))] text-[hsl(var(--phase-testing))]",
};

export default function InternalInitiativesTable({ initiatives }: Props) {
  return (
    <section className="print-avoid-break">
      <h2 className="text-lg font-semibold text-foreground mb-4">Internal Deliverables / Team Initiatives</h2>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Customer / Area</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Deliverable</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {initiatives.map((item, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-foreground">{item.customer || "—"}</td>
                  <td className="p-3 text-foreground">{item.owner}</td>
                  <td className="p-3 text-foreground">
                    {item.deliverable}
                    {item.rmRef && (
                      <span className="ml-2 font-mono text-xs px-1.5 py-0.5 rounded bg-status-info-bg text-status-info font-medium">{item.rmRef}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[item.status] || "bg-secondary text-secondary-foreground"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{item.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
