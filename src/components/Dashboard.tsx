import { useMemo, useState } from "react";
import {
  ActionItem,
  chunkedIngestion,
  extractActionItems,
  integrityAudit,
  normalizeRows,
  NormalizedItem,
  rawImports,
  WorkstreamType,
} from "@/data/cfsPortfolio";

type ExportFormat = "portfolio" | "action-items";

function toCsv(items: Record<string, string | number | undefined>[]) {
  if (items.length === 0) return "";
  const headers = Object.keys(items[0]);
  const rows = items.map((item) =>
    headers
      .map((header) => {
        const value = `${item[header] ?? ""}`.replaceAll('"', '""');
        return `"${value}"`;
      })
      .join(","),
  );
  return `${headers.join(",")}\n${rows.join("\n")}`;
}

function downloadFile(filename: string, content: string, type = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sectionItems(items: NormalizedItem[], type: WorkstreamType) {
  return items.filter((item) => item.type === type);
}

export default function Dashboard() {
  const [customerFilter, setCustomerFilter] = useState("All");
  const [query, setQuery] = useState("");

  const checkpoints = useMemo(() => chunkedIngestion(rawImports, 4), []);
  const normalized = useMemo(() => normalizeRows(rawImports), []);
  const actionItems = useMemo(() => extractActionItems(normalized), [normalized]);
  const unmappedRows = useMemo(() => integrityAudit(rawImports, normalized), [normalized]);

  const customers = useMemo(
    () => ["All", ...Array.from(new Set(normalized.map((item) => item.customer))).sort((a, b) => a.localeCompare(b))],
    [normalized],
  );

  const filteredItems = useMemo(() => {
    return normalized.filter((item) => {
      const matchesCustomer = customerFilter === "All" || item.customer === customerFilter;
      const q = query.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.customer.toLowerCase().includes(q) ||
        item.project.toLowerCase().includes(q) ||
        item.deliverable.toLowerCase().includes(q) ||
        (item.rm_ticket ?? "").toLowerCase().includes(q) ||
        item.status_display.toLowerCase().includes(q);
      return matchesCustomer && matchesSearch;
    });
  }, [normalized, customerFilter, query]);

  const filteredActions = useMemo(
    () =>
      actionItems.filter((item) =>
        customerFilter === "All" ? true : item.customer === customerFilter,
      ),
    [actionItems, customerFilter],
  );

  const groupedByCustomer = useMemo(() => {
    return filteredItems.reduce<Record<string, NormalizedItem[]>>((acc, item) => {
      acc[item.customer] = acc[item.customer] ?? [];
      acc[item.customer].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const exportSheet = (format: ExportFormat) => {
    if (format === "portfolio") {
      const csv = toCsv(
        filteredItems.map((item) => ({
          customer: item.customer,
          project: item.project,
          type: item.type,
          deliverable: item.deliverable,
          rm_ticket: item.rm_ticket,
          status_original: item.status_original,
          status_display: item.status_display,
          owner: item.owner,
          target_date: item.target_date,
          source_file: item.source.source_file,
          source_sheet: item.source.source_sheet,
          source_row: item.source.source_row,
          import_timestamp: item.source.import_timestamp,
        })),
      );
      downloadFile("cfs-portfolio-tracker.csv", csv);
      return;
    }

    const csv = toCsv(
      filteredActions.map((item) => ({
        customer: item.customer,
        project: item.project,
        summary: item.summary,
        action_type: item.action_type,
        status: item.status,
        owner: item.owner,
        source_item_id: item.source_item_id,
      })),
    );
    downloadFile("cfs-action-items.csv", csv);
  };

  const downloadCustomerTracker = (customer: string, items: NormalizedItem[], actions: ActionItem[]) => {
    const payload = {
      customer,
      generated_at: new Date().toISOString(),
      summary: {
        active_work: items.filter((item) => item.type === "Open Issue").length,
        completed_work: items.filter((item) => item.type === "Completed Item").length,
        pending_deployments: items.filter((item) => item.type === "Pending Deployment").length,
        deployed_code_changes: items.filter((item) => item.type === "Deployed Code Change").length,
        raw_exceptions: items.filter((item) => item.type === "Unclassified / Needs Review").length,
      },
      active_projects_deliverables: sectionItems(items, "Open Issue"),
      open_issues_open_items: sectionItems(items, "Open Issue"),
      action_items: actions,
      pending_deployments: sectionItems(items, "Pending Deployment"),
      completed_items: sectionItems(items, "Completed Item"),
      deployed_code_changes: sectionItems(items, "Deployed Code Change"),
      raw_source_exceptions: sectionItems(items, "Unclassified / Needs Review"),
    };

    downloadFile(`tracker-${customer.toLowerCase().replaceAll(/\s+/g, "-")}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8;");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="border rounded-lg p-4 bg-card">
          <h1 className="text-2xl font-bold">CFS World-Class Status Tracker</h1>
          <p className="text-sm text-muted-foreground">Portfolio + customer PM operating system with source-traceable ingestion, classification, and exports.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-3 py-2 rounded bg-primary text-primary-foreground text-sm" onClick={() => window.print()}>Download PDF</button>
            <button className="px-3 py-2 rounded border text-sm" onClick={() => exportSheet("portfolio")}>Download Portfolio Spreadsheet</button>
            <button className="px-3 py-2 rounded border text-sm" onClick={() => exportSheet("action-items")}>Download Action Items Spreadsheet</button>
          </div>
        </header>

        <section className="grid md:grid-cols-4 gap-3">
          <div className="border rounded-lg p-3 bg-card"><p className="text-xs text-muted-foreground">Raw Rows Imported</p><p className="text-2xl font-semibold">{rawImports.length}</p></div>
          <div className="border rounded-lg p-3 bg-card"><p className="text-xs text-muted-foreground">Normalized Records</p><p className="text-2xl font-semibold">{normalized.length}</p></div>
          <div className="border rounded-lg p-3 bg-card"><p className="text-xs text-muted-foreground">Action Items</p><p className="text-2xl font-semibold">{actionItems.length}</p></div>
          <div className="border rounded-lg p-3 bg-card"><p className="text-xs text-muted-foreground">Unmapped Raw Rows</p><p className="text-2xl font-semibold">{unmappedRows.length}</p></div>
        </section>

        <section className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Ingestion Pipeline Checkpoints (Chunked + Memory Safe)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Chunk</th><th>Processed Rows</th><th>Checkpoint Save Token</th></tr></thead>
              <tbody>
                {checkpoints.map((item) => (
                  <tr key={item.checkpointToken} className="border-b last:border-none"><td className="py-2">{item.chunkIndex}</td><td>{item.processedRows}</td><td>{item.checkpointToken}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-card space-y-3">
          <h2 className="font-semibold">Portfolio Filters</h2>
          <div className="flex flex-wrap gap-2">
            <select className="border rounded px-2 py-1.5 text-sm" value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)}>
              {customers.map((customer) => <option key={customer} value={customer}>{customer}</option>)}
            </select>
            <input className="border rounded px-2 py-1.5 text-sm min-w-[260px]" placeholder="Search customer/project/deliverable/RM" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Full Portfolio Item Grid</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Customer</th><th>Project</th><th>Type</th><th>RM</th><th>Status</th><th>Owner</th><th>Source Trace</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr className="border-b last:border-none" key={item.id}>
                    <td className="py-2">{item.customer}</td>
                    <td>{item.project}</td>
                    <td>{item.type}</td>
                    <td>{item.rm_ticket ?? "—"}</td>
                    <td>{item.status_display} {item.status_original ? "" : "(inferred)"}</td>
                    <td>{item.owner ?? "Missing"}</td>
                    <td>{item.source.source_file} / {item.source.source_sheet} / Row {item.source.source_row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Action Item Board (First-Class Model)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Customer</th><th>Project</th><th>Action</th><th>Type</th><th>Status</th><th>Owner</th></tr></thead>
              <tbody>
                {filteredActions.map((item) => (
                  <tr className="border-b last:border-none" key={item.id}><td className="py-2">{item.customer}</td><td>{item.project}</td><td>{item.summary}</td><td>{item.action_type}</td><td>{item.status}</td><td>{item.owner ?? "Missing"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Standardized Customer Trackers</h2>
          {Object.entries(groupedByCustomer).map(([customer, items]) => {
            const customerActions = filteredActions.filter((item) => item.customer === customer);
            return (
              <article key={customer} className="border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{customer}</h3>
                  <button className="px-3 py-1.5 text-sm rounded border" onClick={() => downloadCustomerTracker(customer, items, customerActions)}>Download Tracker (JSON)</button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Customer Summary: {items.length} records, {customerActions.length} action items.</p>
                <div className="grid md:grid-cols-3 gap-3 mt-3 text-sm">
                  <div><p className="font-medium">Active Projects / Deliverables</p><p>{sectionItems(items, "Open Issue").length}</p></div>
                  <div><p className="font-medium">Open Issues / Open Items</p><p>{sectionItems(items, "Open Issue").length}</p></div>
                  <div><p className="font-medium">Action Items</p><p>{customerActions.length}</p></div>
                  <div><p className="font-medium">Pending Deployments</p><p>{sectionItems(items, "Pending Deployment").length}</p></div>
                  <div><p className="font-medium">Completed Items</p><p>{sectionItems(items, "Completed Item").length}</p></div>
                  <div><p className="font-medium">Deployed Code Changes</p><p>{sectionItems(items, "Deployed Code Change").length}</p></div>
                  <div><p className="font-medium">Upcoming Dates</p><p>{items.filter((item) => !!item.target_date).length}</p></div>
                  <div><p className="font-medium">Risks / Blockers</p><p>{items.filter((item) => item.status_display.includes("Waiting") || item.status_display.includes("Needs Review")).length}</p></div>
                  <div><p className="font-medium">Raw Source Exceptions</p><p>{sectionItems(items, "Unclassified / Needs Review").length}</p></div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-2">Unclassified / Needs Review Queue</h2>
          <ul className="text-sm space-y-2">
            {normalized
              .filter((item) => item.type === "Unclassified / Needs Review" || !item.owner || !item.status_original)
              .map((item) => (
                <li key={item.id} className="border rounded p-2">
                  <strong>{item.customer}</strong> — {item.deliverable} <span className="text-muted-foreground">({item.source.source_file} row {item.source.source_row})</span>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
