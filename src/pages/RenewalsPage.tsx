import AppShell from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getRenewalRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";

const rows = getRenewalRows();

export default function RenewalsPage() {
  const exportExcel = () => downloadCsv("cfs-renewals.csv", rows.map((r) => ({
    Customer: r.customer, Type: r.type, Date: r.renewalDate,
    Confidence: r.confidence, Status: r.status, Quote: r.quoteNumber, Summary: r.summary,
  })));

  return (
    <AppShell title="Renewals" subtitle="Software maintenance renewals pipeline" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
            <th className="py-2.5 px-3">Customer</th><th className="px-3">Type</th><th className="px-3">Date</th><th className="px-3">Confidence</th><th className="px-3">Status</th><th className="px-3">Quote #</th><th className="px-3">Summary</th>
          </tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-b hover:bg-muted/30 transition-colors align-top">
              <td className="py-2.5 px-3"><Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline font-medium">{r.customer}</Link></td>
              <td className="px-3 text-xs">{r.type}</td>
              <td className="px-3 text-xs">{r.renewalDate}</td>
              <td className="px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                  r.confidence === "high" ? "bg-status-on-track/15 text-status-on-track border-status-on-track/30" : "bg-muted text-muted-foreground border-border"
                }`}>{r.confidence}</span>
              </td>
              <td className="px-3"><StatusBadge status={r.status} /></td>
              <td className="px-3 font-mono text-xs">{r.quoteNumber}</td>
              <td className="px-3 text-xs max-w-[250px]">{r.summary}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </AppShell>
  );
}
