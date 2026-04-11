import { useState, useMemo, useRef } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useUnifiedData } from "@/hooks/useUnifiedData";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { normalizeRm } from "@/lib/rmNormalize";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Link } from "react-router-dom";
import { Upload, Sparkles, Camera, FileSpreadsheet, Plus, Loader2, ChevronDown, ChevronUp, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

const STATUSES = [
  "Not Started", "Discovery", "Drafting Spec", "Spec Review", "Ready for Development",
  "In Development", "In Testing", "Ready to Deploy", "Scheduled", "Blocked",
  "Waiting on Customer", "Waiting on CFS", "Monitoring", "Complete", "On Hold",
];
const CLOSED = ["Complete", "Deployed", "Closed", "Live", "Shipped", "Done"];

export default function RmIssueCenterPage() {
  const { rmTickets, customers, kpis, addTicket, updateTicket, deleteTicket, bulkUpsert } = useUnifiedData();
  const { analyze, loading: aiLoading } = useAiAnalyze();
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flagFilter, setFlagFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [importMode, setImportMode] = useState<"screenshot" | "excel" | "paste">("paste");
  const [importText, setImportText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const [newRm, setNewRm] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("Not Started");
  const [newOwner, setNewOwner] = useState("");
  const [newCustomerId, setNewCustomerId] = useState("");

  const allCustomers = useMemo(() => Array.from(new Set(rmTickets.map(r => r.customer_name))).sort(), [rmTickets]);
  const allStatuses = useMemo(() => Array.from(new Set(rmTickets.map(r => r.status))).sort(), [rmTickets]);
  const allFlags = ["Stale", "Aging", "Needs Attention", "Overdue", "Blocked", "Missing Owner"];

  const rows = useMemo(() => rmTickets.filter(r => {
    if (customerFilter !== "all" && r.customer_name !== customerFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (flagFilter !== "all" && !r.flags.includes(flagFilter)) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.rm_number.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q);
    }
    return true;
  }), [rmTickets, query, customerFilter, statusFilter, flagFilter]);

  const openCount = rows.filter(r => !CLOSED.includes(r.status)).length;
  const staleCount = rows.filter(r => r.flags.includes("Stale") || r.flags.includes("Aging")).length;
  const blockedCount = rows.filter(r => r.flags.includes("Blocked")).length;
  const overdueCount = rows.filter(r => r.overdue).length;

  const toggle = (id: string) => { const n = new Set(expanded); n.has(id) ? n.delete(id) : n.add(id); setExpanded(n); };

  const startEdit = (row: typeof rows[0]) => {
    setEditingId(row.id);
    setEditFields({ status: row.status, owner: row.owner, next_steps: row.next_steps, due_date: row.due_date || "", last_update: row.last_update || "" });
  };

  const saveEdit = (id: string) => {
    if (rmTickets.find(r => r.id === id)?.source === "db") {
      updateTicket.mutate({ id, ...editFields });
    }
    setEditingId(null);
    toast.success("RM ticket updated");
  };

  const handleAddRm = () => {
    if (!newRm.trim()) return;
    addTicket.mutate({
      rm_number: normalizeRm(newRm),
      title: newTitle || null,
      status: newStatus,
      owner: newOwner || null,
      customer_id: newCustomerId || null,
    });
    setNewRm(""); setNewTitle(""); setNewStatus("Not Started"); setNewOwner(""); setNewCustomerId("");
    setShowAdd(false);
  };

  const handleAiImport = async () => {
    if (!importText.trim()) return;
    const data = await analyze("process-spreadsheet", importText, "Extract all Redmine/RM ticket numbers with their statuses, owners, and any dates. Return structured data.");
    if (data?.action_items) {
      const tickets = data.action_items.map((item: any) => ({
        rm_number: normalizeRm(item.title || item.description || ""),
        title: item.description || item.title || "",
        status: item.status || "Not Started",
        owner: item.owner || null,
        due_date: item.due_date || null,
        last_update: new Date().toISOString().split("T")[0],
      })).filter((t: any) => t.rm_number.startsWith("RM-"));
      if (tickets.length > 0) {
        bulkUpsert.mutate(tickets);
        toast.success(`Imported ${tickets.length} RM tickets`);
      } else {
        toast.info("No RM tickets found in the input");
      }
    }
    setImportText("");
    setShowImport(false);
  };

  const exportExcel = () => downloadCsv("neko-rm-tickets.csv", rows.map(r => ({
    RM: r.rm_number, Customer: r.customer_name, Title: r.title, Status: r.status,
    Owner: r.owner, Due_Date: r.due_date || "", Last_Update: r.last_update || "",
    Days_Since_Update: r.days_since_update ?? "", Next_Steps: r.next_steps,
    Open_Questions: r.open_questions, Flags: r.flags.join("; "),
  })));

  // DB customers for select
  const dbCustomers = customers.filter(c => c.source === "db" || c.source === "both");

  return (
    <AppShell title="RM Issue Center" subtitle={`Every Redmine ticket — ${kpis.totalRm} total, ${kpis.openRm} open`} onExportExcel={exportExcel} onExportPdf={exportPdf}>
      {/* KPIs — consistent with Executive Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <KpiCard label="TOTAL RMs" value={rows.length} sub={rows.length !== rmTickets.length ? `of ${rmTickets.length}` : undefined} />
        <KpiCard label="OPEN" value={openCount} color="text-status-caution" />
        <KpiCard label="STALE / AGING" value={staleCount} color={staleCount > 0 ? "text-destructive" : ""} />
        <KpiCard label="BLOCKED" value={blockedCount} color={blockedCount > 0 ? "text-destructive" : ""} />
        <KpiCard label="OVERDUE" value={overdueCount} color={overdueCount > 0 ? "text-destructive" : ""} />
        <KpiCard label="CUSTOMERS" value={allCustomers.length} />
      </section>

      {/* Action Bar */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden space-y-3">
        <div className="grid md:grid-cols-5 gap-2">
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Search RM#, title, owner..." value={query} onChange={e => setQuery(e.target.value)} />
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)}>
            <option value="all">All Customers</option>
            {allCustomers.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {allStatuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={flagFilter} onChange={e => setFlagFilter(e.target.value)}>
            <option value="all">All Flags</option>
            {allFlags.map(f => <option key={f}>{f}</option>)}
          </select>
          <div className="flex gap-1.5">
            <button onClick={() => { setShowImport(!showImport); setShowAdd(false); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
              <Upload className="h-4 w-4" /> Import
            </button>
            <button onClick={() => { setShowAdd(!showAdd); setShowImport(false); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Add RM
            </button>
          </div>
        </div>
      </section>

      {/* Import Panel */}
      {showImport && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-4 print:hidden">
          <div className="flex gap-2">
            {(["paste", "screenshot", "excel"] as const).map(m => (
              <button key={m} onClick={() => setImportMode(m)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${importMode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {m === "paste" ? "📋 Paste" : m === "screenshot" ? <><Camera className="h-3.5 w-3.5" /> Screenshot</> : <><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</>}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {importMode === "paste" ? "Paste RM ticket data or tracker content. AI will extract ticket numbers, statuses, owners, and dates."
              : importMode === "screenshot" ? "Upload a screenshot of Redmine. AI will read statuses and update your tracker."
              : "Upload an Excel tracker. AI will parse columns and map to RM tickets."}
          </p>
          {importMode === "paste" ? (
            <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[150px] font-mono" placeholder="Paste Redmine data here..." value={importText} onChange={e => setImportText(e.target.value)} />
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 transition-colors" onClick={() => fileInput.current?.click()}>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload {importMode === "screenshot" ? "a screenshot" : "an Excel file"}</p>
              <input ref={fileInput} type="file" accept={importMode === "screenshot" ? "image/*" : ".xlsx,.xls,.csv"} className="hidden" onChange={e => {
                if (e.target.files?.[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setImportText(ev.target?.result as string || "");
                  reader.readAsText(e.target.files[0]);
                }
              }} />
            </div>
          )}
          <button onClick={handleAiImport} disabled={aiLoading || !importText.trim()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {aiLoading ? "Processing..." : "AI: Parse & Import"}
          </button>
        </section>
      )}

      {/* Add RM Panel */}
      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm print:hidden">
          <div className="grid md:grid-cols-5 gap-3">
            <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="RM number (e.g. 12721)" value={newRm} onChange={e => setNewRm(e.target.value)} />
            <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Title / Description" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Owner" value={newOwner} onChange={e => setNewOwner(e.target.value)} />
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={newCustomerId} onChange={e => setNewCustomerId(e.target.value)}>
              <option value="">No Customer</option>
              {dbCustomers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
            </select>
          </div>
          <button onClick={handleAddRm} className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Add RM Ticket</button>
        </section>
      )}

      {/* RM Cards */}
      <section className="space-y-2">
        {rows.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">No RM tickets found. Import data or add tickets manually.</p>
          </div>
        )}
        {rows.map(r => {
          const isEditing = editingId === r.id;
          return (
            <div key={r.id} className={`rounded-xl border bg-card shadow-sm overflow-hidden ${r.flags.includes("Stale") ? "border-destructive/30" : r.flags.includes("Aging") ? "border-amber-500/30" : "border-border"}`}>
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggle(r.id)}>
                <span className="font-mono text-sm font-semibold text-primary">{r.rm_number}</span>
                <span className="text-sm font-medium text-foreground flex-1 truncate">{r.title || "—"}</span>
                {r.flags.slice(0, 2).map(f => (
                  <span key={f} className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    f === "Stale" || f === "Overdue" || f === "Blocked" ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}>{f}</span>
                ))}
                <StatusBadge status={r.status} />
                <span className="text-xs text-muted-foreground">{r.owner}</span>
                {r.customer_slug && <Link to={`/customers/${r.customer_slug}`} className="text-xs text-primary hover:underline" onClick={e => e.stopPropagation()}>{r.customer_name}</Link>}
                {expanded.has(r.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              {expanded.has(r.id) && (
                <div className="border-t border-border px-5 py-4 bg-muted/10 space-y-3">
                  {isEditing ? (
                    <div className="grid md:grid-cols-3 gap-3">
                      <div><label className="text-xs text-muted-foreground block mb-1">Status</label>
                        <select className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={editFields.status || ""} onChange={e => setEditFields({...editFields, status: e.target.value})}>
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Owner</label>
                        <input className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={editFields.owner || ""} onChange={e => setEditFields({...editFields, owner: e.target.value})} />
                      </div>
                      <div><label className="text-xs text-muted-foreground block mb-1">Due Date</label>
                        <input type="date" className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={editFields.due_date || ""} onChange={e => setEditFields({...editFields, due_date: e.target.value})} />
                      </div>
                      <div className="md:col-span-3"><label className="text-xs text-muted-foreground block mb-1">Next Steps</label>
                        <input className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={editFields.next_steps || ""} onChange={e => setEditFields({...editFields, next_steps: e.target.value})} />
                      </div>
                      <div className="md:col-span-3 flex gap-2">
                        <button onClick={() => saveEdit(r.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"><Save className="h-3.5 w-3.5" /> Save</button>
                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium"><X className="h-3.5 w-3.5" /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div><span className="text-xs font-semibold text-muted-foreground block">Owner</span>{r.owner}</div>
                        <div><span className="text-xs font-semibold text-muted-foreground block">Last Update</span>{r.last_update || "—"}{r.days_since_update !== null && <span className="text-xs text-muted-foreground ml-1">({r.days_since_update}d ago)</span>}</div>
                        <div><span className="text-xs font-semibold text-muted-foreground block">Due Date</span>{r.due_date || "—"}</div>
                      </div>
                      {r.summary && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Summary</h4><p className="text-sm text-foreground">{r.summary}</p></div>}
                      {r.next_steps && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Next Steps</h4><p className="text-sm text-foreground">{r.next_steps}</p></div>}
                      {r.open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Open Questions</h4><p className="text-sm text-status-caution">{r.open_questions}</p></div>}
                      {r.dependencies && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Dependencies</h4><p className="text-sm text-foreground">{r.dependencies}</p></div>}
                      {r.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.flags.map(f => (
                            <span key={f} className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              f === "Stale" || f === "Overdue" || f === "Blocked" ? "bg-destructive/10 text-destructive border border-destructive/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}>{f}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        {r.source === "db" && (
                          <>
                            <button onClick={() => startEdit(r)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">✏️ Edit</button>
                            <button onClick={() => { deleteTicket.mutate(r.id); toast.success("RM ticket deleted"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
