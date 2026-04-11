import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { useWiki, WikiEntry } from "@/hooks/useWiki";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { BookOpen, Plus, Search, Sparkles, Trash2, Edit2, X, ChevronDown, ChevronUp, Code, FileText } from "lucide-react";

const CATEGORIES = ["All", "Project", "Technical", "Process", "Tool", "Customer", "Specification"] as const;

export default function WikiPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useWiki();
  const { analyze, loading } = useAiAnalyze();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editId, setEditId] = useState<string | null>(null);

  // AI inputs
  const [aiMode, setAiMode] = useState<"document" | "code" | "manual">("manual");
  const [aiInput, setAiInput] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [manualCategory, setManualCategory] = useState("Project");
  const [manualTags, setManualTags] = useState("");

  const filtered = useMemo(() => entries.filter((e) => {
    if (catFilter !== "All" && e.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  }), [entries, search, catFilter]);

  const toggle = (id: string) => { const s = new Set(expanded); s.has(id) ? s.delete(id) : s.add(id); setExpanded(s); };

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    const action = aiMode === "code" ? "explain-code" : aiMode === "document" ? "analyze-document" : "generate-wiki";
    const data = await analyze(action, aiInput.trim());
    if (!data) return;

    if (aiMode === "code") {
      addEntry({
        title: `Code Reference: ${data.purpose?.slice(0, 60) || "Code Snippet"}`,
        category: "Technical",
        content: `## Purpose\n${data.purpose}\n\n## Technical Explanation\n${data.technical_explanation}\n\n## Key Components\n${(data.key_components || []).map((c: string) => `- ${c}`).join("\n")}\n\n## Business Impact\n${data.business_impact || "N/A"}\n\n## Original Code\n\`\`\`${data.language || ""}\n${aiInput}\n\`\`\``,
        tags: [data.language, ...(data.related_systems || [])].filter(Boolean),
        related_topics: data.related_systems || [],
        summary: data.purpose || "",
        source_type: "code",
      });
    } else if (aiMode === "document" && data.wiki_entry) {
      addEntry({
        title: data.wiki_entry.title || "Analyzed Document",
        category: data.wiki_entry.tags?.[0] || "Project",
        content: data.wiki_entry.content || data.summary || "",
        tags: data.wiki_entry.tags || [],
        related_topics: [],
        summary: data.summary || "",
        source_type: "document",
      });
      // Also extract action items if found
      if (data.action_items?.length) {
        addEntry({
          title: `Action Items from: ${data.wiki_entry.title || "Document"}`,
          category: "Process",
          content: data.action_items.map((a: any) => `- **${a.description}** (Owner: ${a.owner || "TBD"}, Due: ${a.due_date || "TBD"})`).join("\n"),
          tags: ["action-items", "extracted"],
          related_topics: [],
          summary: `${data.action_items.length} action items extracted`,
          source_type: "document",
        });
      }
    } else if (data.title) {
      addEntry({
        title: data.title,
        category: data.category || "Project",
        content: data.content || "",
        tags: data.tags || [],
        related_topics: data.related_topics || [],
        summary: data.summary || "",
        source_type: "ai-generated",
      });
    }
    setAiInput("");
    setShowAdd(false);
  };

  const handleManualAdd = () => {
    if (!manualTitle.trim() || !manualContent.trim()) return;
    addEntry({
      title: manualTitle.trim(),
      category: manualCategory,
      content: manualContent.trim(),
      tags: manualTags.split(",").map((t) => t.trim()).filter(Boolean),
      related_topics: [],
      summary: manualContent.trim().slice(0, 120),
      source_type: "manual",
    });
    setManualTitle("");
    setManualContent("");
    setManualTags("");
    setShowAdd(false);
  };

  const exportExcel = () => downloadCsv("cfs-wiki.csv", entries.map((e) => ({
    Title: e.title, Category: e.category, Summary: e.summary, Tags: e.tags.join("; "),
    Source: e.source_type, Created: e.created_at, Updated: e.updated_at,
  })));

  const catIcon = (cat: string) => {
    if (cat === "Technical") return <Code className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
  };

  return (
    <AppShell title="Project Wiki" subtitle="Living project knowledge base" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Wiki Entries" value={entries.length} />
        <KpiCard label="AI Generated" value={entries.filter((e) => e.source_type === "ai-generated" || e.source_type === "document" || e.source_type === "code").length} />
        <KpiCard label="Categories" value={new Set(entries.map((e) => e.category)).size} />
        <KpiCard label="Code Refs" value={entries.filter((e) => e.source_type === "code").length} />
      </section>

      {/* Controls */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" placeholder="Search wiki..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? "Cancel" : "Add Entry"}
          </button>
        </div>
      </section>

      {/* Add Entry Panel */}
      {showAdd && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-4 print:hidden">
          <div className="flex gap-2">
            {(["manual", "document", "code"] as const).map((m) => (
              <button key={m} onClick={() => setAiMode(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {m === "manual" ? "Manual Entry" : m === "document" ? "📄 AI: Analyze Document" : "💻 AI: Explain Code"}
              </button>
            ))}
          </div>

          {aiMode === "manual" ? (
            <div className="space-y-3">
              <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Wiki entry title..." value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
              <div className="grid md:grid-cols-2 gap-3">
                <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={manualCategory} onChange={(e) => setManualCategory(e.target.value)}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Tags (comma separated)" value={manualTags} onChange={(e) => setManualTags(e.target.value)} />
              </div>
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[150px] font-mono" placeholder="Wiki content (supports markdown)..." value={manualContent} onChange={(e) => setManualContent(e.target.value)} />
              <button onClick={handleManualAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Save Entry</button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {aiMode === "document"
                  ? "Paste document text, email, spec, meeting notes, or any project content. AI will analyze it, extract project data, and create a wiki entry."
                  : "Paste a code snippet. AI will explain it in plain English and create a technical wiki reference."}
              </p>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[200px] font-mono"
                placeholder={aiMode === "document" ? "Paste document content here..." : "Paste code snippet here..."}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button onClick={handleAiGenerate} disabled={loading || !aiInput.trim()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                <Sparkles className="h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze & Create Wiki Entry"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Wiki Entries */}
      <section className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No wiki entries yet</h3>
            <p className="text-sm text-muted-foreground">Add entries manually or use AI to analyze documents and code.</p>
          </div>
        )}
        {filtered.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggle(entry.id)}>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                {catIcon(entry.category)} {entry.category}
              </span>
              <h3 className="font-medium text-foreground flex-1">{entry.title}</h3>
              <div className="flex items-center gap-2">
                {entry.tags.slice(0, 3).map((t) => <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">{t}</span>)}
                <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{entry.source_type}</span>
                {expanded.has(entry.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            {expanded.has(entry.id) && (
              <div className="border-t border-border px-5 py-4 bg-muted/10">
                <div className="prose prose-sm max-w-none text-foreground">
                  {entry.content.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">{line.slice(3)}</h3>;
                    if (line.startsWith("- ")) return <div key={i} className="flex items-start gap-2 text-sm ml-2"><span>•</span><span>{line.slice(2)}</span></div>;
                    if (line.startsWith("```")) return null;
                    if (line.trim()) return <p key={i} className="text-sm mb-1">{line}</p>;
                    return null;
                  })}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Updated: {new Date(entry.updated_at).toLocaleString()}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
