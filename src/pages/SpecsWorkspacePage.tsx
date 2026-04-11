import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { normalizeRm } from "@/lib/rmNormalize";
import { exportSpecToCsv, exportSpecToText, downloadTextFile, downloadCsvFile } from "@/lib/exportUtils";
import { Plus, X, Sparkles, FileText, ChevronDown, ChevronUp, Search, Download, Trash2, Edit2, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface Spec {
  id: string;
  title: string;
  rm_numbers: string[];
  customer: string;
  author: string;
  status: string;
  request_overview: string;
  goals: string;
  scope: string;
  specification: string;
  open_questions: string;
  created_at: string;
  updated_at: string;
}

const SPEC_STATUSES = ["Draft", "In Review", "Approved", "Ready for Dev", "Needs Revision", "Archived"];
const STORAGE_KEY = "cfs-specs";

function loadSpecs(): Spec[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveSpecs(specs: Spec[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(specs)); }

export default function SpecsWorkspacePage() {
  const [specs, setSpecs] = useState<Spec[]>(loadSpecs);
  const { analyze, loading } = useAiAnalyze();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<"ai" | "manual">("ai");
  const [aiInput, setAiInput] = useState("");
  const [aiCustomer, setAiCustomer] = useState("");

  // Manual fields
  const [mTitle, setMTitle] = useState("");
  const [mRm, setMRm] = useState("");
  const [mCustomer, setMCustomer] = useState("");
  const [mAuthor, setMAuthor] = useState("");
  const [mOverview, setMOverview] = useState("");
  const [mGoals, setMGoals] = useState("");
  const [mScope, setMScope] = useState("");
  const [mSpec, setMSpec] = useState("");
  const [mQuestions, setMQuestions] = useState("");

  // Edit fields
  const [eTitle, setETitle] = useState("");
  const [eOverview, setEOverview] = useState("");
  const [eGoals, setEGoals] = useState("");
  const [eScope, setEScope] = useState("");
  const [eSpec, setESpec] = useState("");
  const [eQuestions, setEQuestions] = useState("");

  const filtered = useMemo(() => specs.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q) || s.rm_numbers.some((r) => r.toLowerCase().includes(q)) || s.specification.toLowerCase().includes(q);
    }
    return true;
  }), [specs, search, statusFilter]);

  const toggle = (id: string) => { const s = new Set(expanded); s.has(id) ? s.delete(id) : s.add(id); setExpanded(s); };

  const persist = (updated: Spec[]) => { setSpecs(updated); saveSpecs(updated); };

  const addSpec = (spec: Omit<Spec, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString();
    const newSpec: Spec = { ...spec, id: crypto.randomUUID(), created_at: now, updated_at: now };
    persist([newSpec, ...specs]);
    toast.success(`Spec "${spec.title}" created`);
  };

  const deleteSpec = (id: string) => persist(specs.filter((s) => s.id !== id));

  const updateStatus = (id: string, status: string) => {
    persist(specs.map((s) => s.id === id ? { ...s, status, updated_at: new Date().toISOString() } : s));
  };

  const startEdit = (spec: Spec) => {
    setEditing(spec.id);
    setETitle(spec.title); setEOverview(spec.request_overview); setEGoals(spec.goals);
    setEScope(spec.scope); setESpec(spec.specification); setEQuestions(spec.open_questions);
  };

  const saveEdit = (id: string) => {
    persist(specs.map((s) => s.id === id ? { ...s, title: eTitle, request_overview: eOverview, goals: eGoals, scope: eScope, specification: eSpec, open_questions: eQuestions, updated_at: new Date().toISOString() } : s));
    setEditing(null);
    toast.success("Spec updated");
  };

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    const data = await analyze("analyze-document", aiInput.trim(), `Generate a CFS specification document from these notes. Customer: ${aiCustomer || "Unknown"}`);
    if (!data) return;
    const rmRefs = data.rm_references?.map(normalizeRm) || [];
    addSpec({
      title: data.wiki_entry?.title || data.summary?.slice(0, 60) || "AI-Generated Spec",
      rm_numbers: rmRefs, customer: aiCustomer || data.customer_references?.[0] || "",
      author: "AI Draft", status: "Draft",
      request_overview: data.summary || "",
      goals: data.wiki_entry?.content?.split("\n").find((l: string) => l.includes("goal"))?.replace(/^#+\s*/, "") || "See specification for details.",
      scope: data.deliverables?.map((d: any) => `• ${d.name} — ${d.status}`).join("\n") || "",
      specification: data.wiki_entry?.content || data.summary || "",
      open_questions: (data.open_questions || []).join("\n• ") || "",
    });
    setAiInput(""); setShowAdd(false);
  };

  const handleManualAdd = () => {
    if (!mTitle.trim()) return;
    addSpec({
      title: mTitle, rm_numbers: mRm.split(",").map((r) => normalizeRm(r.trim())).filter(Boolean),
      customer: mCustomer, author: mAuthor || "Mike Nichols", status: "Draft",
      request_overview: mOverview, goals: mGoals, scope: mScope, specification: mSpec, open_questions: mQuestions,
    });
    setMTitle(""); setMRm(""); setMCustomer(""); setMAuthor(""); setMOverview(""); setMGoals(""); setMScope(""); setMSpec(""); setMQuestions("");
    setShowAdd(false);
  };

  const exportAllSpecsCsv = () => {
    downloadCsvFile("all-specs.csv", specs.map((s) => ({
      Title: s.title, Customer: s.customer, Author: s.author, Status: s.status,
      "RM Numbers": s.rm_numbers.join(", "), "Request Overview": s.request_overview,
      Goals: s.goals, Scope: s.scope, Specification: s.specification,
      "Open Questions": s.open_questions, Created: s.created_at,
    })));
    toast.success("All specs exported");
  };

  const exportSpecAsDoc = (spec: Spec) => {
    const text = exportSpecToText(spec);
    downloadTextFile(`spec-${spec.title.replace(/\s+/g, "-").toLowerCase()}.txt`, text);
    toast.success("Spec document exported");
  };

  const copySpecToClipboard = (spec: Spec) => {
    navigator.clipboard.writeText(exportSpecToText(spec));
    toast.success("Spec copied to clipboard");
  };

  const draftCount = specs.filter((s) => s.status === "Draft").length;
  const reviewCount = specs.filter((s) => s.status === "In Review").length;

  return (
    <AppShell title="Specs Workspace" subtitle="Create, manage, and track specifications" onExportExcel={exportAllSpecsCsv}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Total Specs" value={specs.length} />
        <KpiCard label="Drafts" value={draftCount} color="text-status-caution" />
        <KpiCard label="In Review" value={reviewCount} color="text-status-info" />
        <KpiCard label="Approved" value={specs.filter((s) => s.status === "Approved").length} color="text-status-on-track" />
        <KpiCard label="Ready for Dev" value={specs.filter((s) => s.status === "Ready for Dev").length} color="text-primary" />
      </section>

      {/* Controls */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" placeholder="Search specs, RMs, customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {SPEC_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "New Spec"}
          </button>
        </div>
      </section>

      {/* Add Spec Panel */}
      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-4 print:hidden">
          <div className="flex gap-2">
            <button onClick={() => setAiMode("ai")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Sparkles className="h-3.5 w-3.5" /> AI: Generate from Notes
            </button>
            <button onClick={() => setAiMode("manual")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === "manual" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              Manual Entry
            </button>
          </div>

          {aiMode === "ai" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Paste meeting notes, emails, requirements, or any context. AI will generate a structured spec draft.</p>
              <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Customer name" value={aiCustomer} onChange={(e) => setAiCustomer(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[200px] font-mono" placeholder="Paste notes, requirements, emails..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} />
              <button onClick={handleAiGenerate} disabled={loading || !aiInput.trim()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                <Sparkles className="h-4 w-4" /> {loading ? "Generating..." : "Generate Spec Draft"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Spec title *" value={mTitle} onChange={(e) => setMTitle(e.target.value)} />
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="RM numbers (comma separated)" value={mRm} onChange={(e) => setMRm(e.target.value)} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Customer" value={mCustomer} onChange={(e) => setMCustomer(e.target.value)} />
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Author" value={mAuthor} onChange={(e) => setMAuthor(e.target.value)} />
              </div>
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" placeholder="Request Overview" value={mOverview} onChange={(e) => setMOverview(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" placeholder="Goals" value={mGoals} onChange={(e) => setMGoals(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" placeholder="Scope of changes" value={mScope} onChange={(e) => setMScope(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[120px] font-mono" placeholder="Specification details" value={mSpec} onChange={(e) => setMSpec(e.target.value)} />
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" placeholder="Open Questions" value={mQuestions} onChange={(e) => setMQuestions(e.target.value)} />
              <button onClick={handleManualAdd} disabled={!mTitle.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Save Spec</button>
            </div>
          )}
        </section>
      )}

      {/* Specs List */}
      <section className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No specifications yet</h3>
            <p className="text-sm text-muted-foreground">Create your first spec manually or generate one from meeting notes using AI.</p>
          </div>
        )}
        {filtered.map((spec) => (
          <article key={spec.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggle(spec.id)}>
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h3 className="font-medium text-foreground flex-1">{spec.title}</h3>
              {spec.rm_numbers.map((rm) => <span key={rm} className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">{rm}</span>)}
              {spec.customer && <span className="text-xs text-muted-foreground">{spec.customer}</span>}
              <select value={spec.status} onChange={(e) => { e.stopPropagation(); updateStatus(spec.id, e.target.value); }} onClick={(e) => e.stopPropagation()} className="text-xs rounded border border-border bg-background px-2 py-1">
                {SPEC_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">{new Date(spec.updated_at).toLocaleDateString()}</span>
              {expanded.has(spec.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {expanded.has(spec.id) && (
              <div className="border-t border-border px-5 py-4 bg-muted/10 space-y-4">
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-xs font-semibold text-muted-foreground block">Author</span>{spec.author}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Customer</span>{spec.customer || "—"}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">RMs</span>{spec.rm_numbers.join(", ") || "—"}</div>
                  <div><span className="text-xs font-semibold text-muted-foreground block">Created</span>{new Date(spec.created_at).toLocaleDateString()}</div>
                </div>

                {editing === spec.id ? (
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
                    <div><label className="text-xs font-semibold text-muted-foreground">Request Overview</label><textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" value={eOverview} onChange={(e) => setEOverview(e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground">Goals</label><textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" value={eGoals} onChange={(e) => setEGoals(e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground">Scope</label><textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" value={eScope} onChange={(e) => setEScope(e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground">Specification</label><textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[120px] font-mono" value={eSpec} onChange={(e) => setESpec(e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground">Open Questions</label><textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[60px]" value={eQuestions} onChange={(e) => setEQuestions(e.target.value)} /></div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(spec.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"><Check className="h-3 w-3" /> Save</button>
                      <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {spec.request_overview && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Request Overview</h4><p className="text-sm text-foreground whitespace-pre-wrap">{spec.request_overview}</p></div>}
                    {spec.goals && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Goals</h4><p className="text-sm text-foreground whitespace-pre-wrap">{spec.goals}</p></div>}
                    {spec.scope && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Scope of Changes</h4><p className="text-sm text-foreground whitespace-pre-wrap">{spec.scope}</p></div>}
                    {spec.specification && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Specification</h4><div className="text-sm text-foreground whitespace-pre-wrap bg-card rounded-lg border border-border p-3">{spec.specification}</div></div>}
                    {spec.open_questions && <div><h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Open Questions</h4><p className="text-sm text-foreground whitespace-pre-wrap">{spec.open_questions}</p></div>}
                  </>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button onClick={() => startEdit(spec)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10"><Edit2 className="h-3 w-3" /> Edit</button>
                  <button onClick={() => exportSpecAsDoc(spec)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10"><Download className="h-3 w-3" /> Export Doc</button>
                  <button onClick={() => exportSpecToCsv(spec)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10"><Download className="h-3 w-3" /> CSV</button>
                  <button onClick={() => copySpecToClipboard(spec)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10"><Copy className="h-3 w-3" /> Copy</button>
                  <button onClick={() => deleteSpec(spec.id)} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-destructive hover:bg-destructive/10 ml-auto"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
