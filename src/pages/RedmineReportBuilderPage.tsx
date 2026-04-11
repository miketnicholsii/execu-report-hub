import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { getAllRmReferences } from "@/lib/cfs/selectors2";
import { downloadCsv } from "@/lib/csvExport";
import { Copy, Check, Download } from "lucide-react";

const allRefs = getAllRmReferences();

type GroupBy = "none" | "customer" | "status" | "owner" | "type";
type OutputFormat = "comma" | "line" | "space" | "numbers-only-comma" | "numbers-only-line";

export default function RedmineReportBuilderPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("comma");
  const [copied, setCopied] = useState(false);

  const customers = Array.from(new Set(allRefs.map((r) => r.customer_name))).sort();
  const statuses = Array.from(new Set(allRefs.map((r) => r.status))).sort();

  const rows = useMemo(() => allRefs.filter((r) => {
    if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.rm_reference.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    }
    return true;
  }), [query, customerFilter, statusFilter]);

  const toggleAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.rm_reference)));
    }
  };

  const toggle = (ref: string) => {
    const next = new Set(selected);
    next.has(ref) ? next.delete(ref) : next.add(ref);
    setSelected(next);
  };

  const selectedRefs = allRefs.filter((r) => selected.has(r.rm_reference));

  const formatOutput = (): string => {
    const refs = selectedRefs;
    if (groupBy !== "none") {
      const groups: Record<string, typeof refs> = {};
      for (const r of refs) {
        const key = groupBy === "customer" ? r.customer_name : groupBy === "status" ? r.status : groupBy === "owner" ? r.owner : r.type;
        (groups[key] ??= []).push(r);
      }
      return Object.entries(groups).map(([group, items]) => {
        const formatted = items.map((r) => formatSingle(r.rm_reference));
        return `--- ${group} ---\n${formatted.join(outputFormat === "line" || outputFormat === "numbers-only-line" ? "\n" : outputFormat === "space" ? " " : ", ")}`;
      }).join("\n\n");
    }
    const formatted = refs.map((r) => formatSingle(r.rm_reference));
    return formatted.join(outputFormat === "line" || outputFormat === "numbers-only-line" ? "\n" : outputFormat === "space" ? " " : ", ");
  };

  const formatSingle = (ref: string): string => {
    if (outputFormat === "numbers-only-comma" || outputFormat === "numbers-only-line") {
      return ref.replace(/\D/g, "");
    }
    return ref;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportSelected = () => downloadCsv("redmine-report.csv", selectedRefs.map((r) => ({
    RM_Reference: r.rm_reference, Customer: r.customer_name, Project: r.project_name,
    Description: r.description, Status: r.status, Owner: r.owner,
    Urgency: r.urgency, Severity: r.severity, Type: r.type,
  })));

  return (
    <AppShell title="Redmine Report Builder" subtitle="Select, group, and export RM ticket references">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total RM References" value={allRefs.length} />
        <KpiCard label="Showing" value={rows.length} />
        <KpiCard label="Selected" value={selected.size} color="text-primary" />
        <KpiCard label="Unique Customers" value={customers.length} />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search RM#, description..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>{customers.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={toggleAll} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
            {selected.size === rows.length ? "Deselect All" : "Select All Visible"}
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Selection Table */}
        <section className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b"><tr className="text-left text-muted-foreground">
              <th className="py-2 px-3 w-8"></th><th className="px-3">RM#</th><th className="px-3">Customer</th>
              <th className="px-3">Description</th><th className="px-3">Status</th><th className="px-3">Owner</th>
            </tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.rm_reference} className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${selected.has(r.rm_reference) ? "bg-primary/5" : ""}`} onClick={() => toggle(r.rm_reference)}>
                <td className="py-2 px-3"><input type="checkbox" checked={selected.has(r.rm_reference)} readOnly className="rounded" /></td>
                <td className="px-3 font-mono text-xs font-semibold text-primary">{r.rm_reference}</td>
                <td className="px-3 text-xs">{r.customer_name}</td>
                <td className="px-3 text-xs max-w-[200px] truncate">{r.description}</td>
                <td className="px-3"><StatusBadge status={r.status} /></td>
                <td className="px-3 text-xs">{r.owner}</td>
              </tr>
            ))}</tbody>
          </table>
          {rows.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No RM references match filters.</p>}
        </section>

        {/* Output Panel */}
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Export Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Output Format</label>
                <select className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}>
                  <option value="comma">RM-12345, RM-12346, RM-12347</option>
                  <option value="line">One per line (RM-XXXXX)</option>
                  <option value="space">Space separated</option>
                  <option value="numbers-only-comma">Numbers only (12345, 12346)</option>
                  <option value="numbers-only-line">Numbers only, one per line</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Group By</label>
                <select className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
                  <option value="none">No Grouping</option>
                  <option value="customer">Customer</option>
                  <option value="status">Status</option>
                  <option value="owner">Owner</option>
                  <option value="type">Type</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} disabled={selected.size === 0} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button onClick={exportSelected} disabled={selected.size === 0} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selected.size > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Preview ({selected.size} selected)</h3>
              <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap font-mono">{formatOutput()}</pre>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}