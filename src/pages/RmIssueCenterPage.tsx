import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { StatusBadge, PriorityBadge, UrgencyBadge } from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { getRmDetailRows } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";

const allRows = getRmDetailRows();

export default function RmIssueCenterPage() {
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const customers = Array.from(new Set(allRows.map((r) => r.customer_name))).sort();
  const statuses = Array.from(new Set(allRows.map((r) => r.canonical_status))).sort();

  const rows = useMemo(() => allRows.filter((r) => {
    if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
    if (statusFilter !== "all" && r.canonical_status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.rm_reference.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || (r.context || "").toLowerCase().includes(q);
    }
    return true;
  }), [query, customerFilter, statusFilter]);

  const openCount = rows.filter((r) => r.canonical_status !== "Complete").length;
  const highCount = rows.filter((r) => r.urgency === "high").length;
  const needsAttention = rows.filter((r) => r.derived_flags.includes("Needs Attention")).length;

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const exportExcel = () => downloadCsv("cfs-rm-issues.csv", rows.map((r) => ({
    RM_Reference: r.rm_reference, Customer: r.customer_name, Project: r.project_name,
    Description: r.description, Status: r.canonical_status, Raw_Status: r.source_status, Urgency: r.urgency ?? "normal",
    Owner: r.owner, Priority: r.priority ?? "", Context: r.context ?? "",
    Flags: r.derived_flags.join("; "),
    Last_Update: r.last_update ?? "", Target_ETA: r.target_eta ?? "",
    Notes: r.notes ?? "", Next_Steps: r.next_steps ?? "",
  })));

  return (
    <AppShell title="RM / Redmine Center" subtitle="Spec-level RM detail with full context" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Total RM Issues" value={rows.length} />
        <KpiCard label="Open" value={openCount} color="text-status-caution" />
        <KpiCard label="High Urgency" value={highCount} color="text-destructive" />
        <KpiCard label="Needs Attention" value={needsAttention} color="text-destructive" />
        <KpiCard label="Customers" value={customers.length} />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-3 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search RM#, description..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>{customers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* RM Cards with spec-level detail */}
      <section className="space-y-2">
        {rows.map((r) => (
          <div key={r.rm_issue_id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggle(r.rm_issue_id)}>
              <span className="font-mono text-sm font-semibold text-primary">{r.rm_reference}</span>
              <span className="text-sm font-medium text-foreground flex-1">{r.description}</span>
              <StatusBadge status={r.canonical_status} />
              <UrgencyBadge urgency={r.urgency ?? "normal"} />
              <span className="text-xs text-muted-foreground">{r.customer_name}</span>
              <span className="text-xs">{expanded.has(r.rm_issue_id) ? "▼" : "▶"}</span>
            </div>

            {expanded.has(r.rm_issue_id) && (
              <div className="border-t border-border px-4 py-3 bg-muted/20 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Spec Detail</h4>
                    <dl className="text-sm space-y-1">
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Customer:</dt><dd><Link to={`/customers/${r.customer_slug}`} className="text-primary hover:underline">{r.customer_name}</Link></dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Project:</dt><dd>{r.project_name}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Owner:</dt><dd>{r.owner}</dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Status:</dt><dd><StatusBadge status={r.canonical_status} /></dd></div>
                      <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Raw Status:</dt><dd className="text-xs text-muted-foreground">{r.source_status}</dd></div>
                      {r.priority && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Priority:</dt><dd><PriorityBadge priority={r.priority} /></dd></div>}
                      {r.target_eta && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Target ETA:</dt><dd>{r.target_eta}</dd></div>}
                      {r.last_update && <div className="flex gap-2"><dt className="font-medium text-muted-foreground min-w-[90px]">Last Update:</dt><dd>{r.last_update}</dd></div>}
                    </dl>
                  </div>
                  <div>
                    {r.derived_flags.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Attention Flags</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {r.derived_flags.map((flag: string) => (
                            <span key={flag} className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {r.context && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Context / Problem Statement</h4>
                        <p className="text-sm text-foreground">{r.context}</p>
                      </div>
                    )}
                    {r.notes && (
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Notes</h4>
                        <p className="text-sm text-foreground">{r.notes}</p>
                      </div>
                    )}
                    {r.next_steps && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Next Steps</h4>
                        <p className="text-sm text-foreground">{r.next_steps}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </AppShell>
  );
}
