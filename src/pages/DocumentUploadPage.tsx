import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { useSupabaseDocuments } from "@/hooks/useSupabaseDocuments";
import { useSupabaseActionItems } from "@/hooks/useSupabaseActionItems";
import { useAiAnalyze } from "@/hooks/useAiAnalyze";
import { Upload, FileText, FileSpreadsheet, File, Sparkles, Trash2, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const FILE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  doc: FileText,
  docx: FileText,
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_ICONS: Record<string, typeof CheckCircle> = {
  pending: Clock,
  processing: Loader2,
  processed: CheckCircle,
  error: AlertTriangle,
};

export default function DocumentUploadPage() {
  const { documents, uploadDocument, updateDocument, deleteDocument } = useSupabaseDocuments();
  const { bulkAdd } = useSupabaseActionItems();
  const { analyze, loading: aiLoading } = useAiAnalyze();
  const [dragging, setDragging] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const validTypes = [
        "application/pdf", "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword", "text/plain",
      ];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!validTypes.includes(file.type) && !["pdf", "csv", "xlsx", "xls", "doc", "docx", "txt"].includes(ext || "")) {
        toast.error(`Unsupported file type: ${file.name}`);
        continue;
      }
      uploadDocument.mutate({ file });
    }
  };

  const processWithAi = async (doc: typeof documents[0]) => {
    setProcessingId(doc.id);
    updateDocument.mutate({ id: doc.id, status: "processing" });

    try {
      // Read file content
      const { data: fileData, error } = await (await import("@/integrations/supabase/client")).supabase.storage
        .from("documents").download(doc.file_path);
      if (error) throw error;

      let content = "";
      const ext = doc.file_name.split(".").pop()?.toLowerCase();

      if (["csv", "txt"].includes(ext || "") || doc.file_type.includes("text")) {
        content = await fileData.text();
      } else if (["xlsx", "xls"].includes(ext || "")) {
        // Read as text for AI (limited but workable)
        content = await fileData.text();
        if (content.length < 50) {
          content = `[Excel file: ${doc.file_name}, size: ${formatSize(doc.file_size)}. Unable to extract text content directly. Please process manually.]`;
        }
      } else {
        content = `[Document: ${doc.file_name}, type: ${doc.file_type}, size: ${formatSize(doc.file_size)}]`;
      }

      const action = ["csv", "xlsx", "xls"].includes(ext || "") ? "process-spreadsheet" : "analyze-document";
      const data = await analyze(action, content, `File: ${doc.file_name}`);

      if (data) {
        // Update document with AI results
        updateDocument.mutate({
          id: doc.id,
          status: "processed",
          ai_summary: data.summary || "",
          extracted_data: data,
        });

        // Create action items from extracted data
        if (data.action_items?.length > 0) {
          const items = data.action_items.map((a: any) => ({
            title: a.title || a.description,
            description: a.description || a.title,
            owner: a.owner || "Unassigned",
            due_date: a.due_date || null,
            status: a.status || "Open",
            priority: a.priority || "Medium",
            source: "document",
            source_id: doc.id,
            customer_id: doc.customer_id,
            initiative_id: null,
          }));
          bulkAdd.mutate(items);
        }

        toast.success(`Document "${doc.title}" processed — ${data.action_items?.length || 0} action items extracted`);
      } else {
        updateDocument.mutate({ id: doc.id, status: "error" });
      }
    } catch (err: any) {
      console.error("Process error:", err);
      updateDocument.mutate({ id: doc.id, status: "error" });
      toast.error(`Failed to process: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const processed = documents.filter((d) => d.status === "processed").length;
  const pending = documents.filter((d) => d.status === "pending").length;

  return (
    <AppShell title="Document Intelligence" subtitle="Upload, analyze, and extract project data from any document">
      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="TOTAL DOCUMENTS" value={documents.length} />
        <KpiCard label="PROCESSED" value={processed} color="text-emerald-600" />
        <KpiCard label="PENDING" value={pending} color="text-amber-500" />
        <KpiCard label="ACTION ITEMS FOUND" value={documents.reduce((acc, d) => acc + (d.extracted_data?.action_items?.length || 0), 0)} color="text-primary" />
      </section>

      {/* Upload Area */}
      <section
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-lg font-medium text-foreground mb-1">Drag & drop documents here</p>
        <p className="text-sm text-muted-foreground mb-4">
          Supports PDF, Word, Excel, CSV, and text files
        </p>
        <button
          onClick={() => fileInput.current?.click()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Upload className="h-4 w-4" /> Browse Files
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </section>

      {/* Document List */}
      <section className="bg-card rounded-xl border border-border">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Uploaded Documents ({documents.length})</h2>
        </div>
        {documents.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs mt-1">Upload files to have AI extract project data automatically</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {documents.map((doc) => {
              const ext = doc.file_name.split(".").pop()?.toLowerCase() || "";
              const Icon = FILE_ICONS[ext] || File;
              const StatusIcon = STATUS_ICONS[doc.status] || Clock;
              const isProcessing = processingId === doc.id || doc.status === "processing";

              return (
                <div key={doc.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                  <div className="p-2.5 rounded-lg bg-muted flex-shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        doc.status === "processed" ? "bg-emerald-50 text-emerald-700" :
                        doc.status === "processing" ? "bg-blue-50 text-blue-700" :
                        doc.status === "error" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        <StatusIcon className={`h-3 w-3 ${isProcessing ? "animate-spin" : ""}`} />
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {doc.file_name} · {formatSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                    {doc.ai_summary && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 bg-muted/50 rounded p-2">{doc.ai_summary}</p>
                    )}
                    {doc.extracted_data?.action_items?.length > 0 && (
                      <p className="text-xs text-primary mt-1">
                        {doc.extracted_data.action_items.length} action items · {doc.extracted_data.rm_references?.length || 0} RM references
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {doc.status === "pending" && (
                      <button
                        onClick={() => processWithAi(doc)}
                        disabled={isProcessing || aiLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        {isProcessing ? "Processing..." : "AI Analyze"}
                      </button>
                    )}
                    {doc.status === "error" && (
                      <button
                        onClick={() => processWithAi(doc)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Retry
                      </button>
                    )}
                    <button
                      onClick={() => deleteDocument.mutate(doc.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
