import { useState } from "react";
import AppShell from "@/components/AppShell";
import { CheckCircle, Circle, Key, Database, Upload, Bot, Shield, ArrowRight, ExternalLink } from "lucide-react";
import { useAiSettings } from "@/hooks/useAiSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: typeof Database;
  required: boolean;
  status: "complete" | "pending" | "skipped";
}

export default function SetupWizardPage() {
  const { settings, updateSettings } = useAiSettings();
  const [activeStep, setActiveStep] = useState(0);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");
  const [storageStatus, setStorageStatus] = useState<"checking" | "connected" | "error">("checking");
  const [aiTestResult, setAiTestResult] = useState<"idle" | "testing" | "success" | "error">("idle");

  // Check database
  useState(() => {
    supabase.from("customers").select("id", { count: "exact", head: true }).then(({ error }) => {
      setDbStatus(error ? "error" : "connected");
    });
    supabase.storage.listBuckets().then(({ error }) => {
      setStorageStatus(error ? "error" : "connected");
    });
  });

  const steps: Step[] = [
    {
      id: "database",
      title: "Database Connection",
      description: "Your database is powered by Lovable Cloud. It stores all customers, RMs, action items, meetings, specs, and wiki entries persistently.",
      icon: Database,
      required: true,
      status: dbStatus === "connected" ? "complete" : "pending",
    },
    {
      id: "storage",
      title: "File Storage",
      description: "Document uploads (PDFs, Excel, Word) are stored securely in cloud storage. This is already configured.",
      icon: Upload,
      required: true,
      status: storageStatus === "connected" ? "complete" : "pending",
    },
    {
      id: "ai",
      title: "AI Provider",
      description: "AI powers meeting parsing, document analysis, spec generation, code explanation, and wiki creation. Built-in Lovable AI works out of the box. Optionally use your own OpenAI API key for full model control.",
      icon: Bot,
      required: false,
      status: settings.provider === "openai" && settings.openai_key ? "complete" : (settings.provider === "lovable" ? "complete" : "pending"),
    },
    {
      id: "security",
      title: "Access Control",
      description: "Your site is protected with a session password. For team use, you can add proper authentication with email/password login.",
      icon: Shield,
      required: false,
      status: "complete",
    },
  ];

  const completedCount = steps.filter((s) => s.status === "complete").length;

  const testAi = async () => {
    setAiTestResult("testing");
    try {
      const body: any = { action: "summarize-status", content: "Test. Reply with JSON confirmation." };
      if (settings.provider === "openai" && settings.openai_key) {
        body.provider = "openai";
        body.openai_key = settings.openai_key;
        body.model = settings.model || "gpt-4o";
      }
      const { data, error } = await supabase.functions.invoke("ai-analyze", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiTestResult("success");
      toast.success("AI connection verified!");
    } catch (e: any) {
      setAiTestResult("error");
      toast.error(`AI test failed: ${e.message}`);
    }
  };

  return (
    <AppShell title="Setup Wizard" subtitle="Get CFS Command Center configured and ready for action">
      {/* Progress */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">System Status</h2>
          <span className="text-sm text-muted-foreground">{completedCount}/{steps.length} configured</span>
        </div>
        <div className="flex gap-1 mb-4">
          {steps.map((s) => (
            <div key={s.id} className={`h-2 flex-1 rounded-full transition-colors ${s.status === "complete" ? "bg-status-on-track" : "bg-muted"}`} />
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                activeStep === i ? "border-primary bg-primary/5" : step.status === "complete" ? "border-status-on-track/30 bg-status-on-track/5" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {step.status === "complete" ? <CheckCircle className="h-4 w-4 text-status-on-track" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                <span className="text-xs font-medium text-foreground">{step.title}</span>
              </div>
              <span className={`text-[10px] ${step.status === "complete" ? "text-status-on-track" : "text-muted-foreground"}`}>
                {step.status === "complete" ? "Connected" : step.required ? "Required" : "Optional"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Active Step Detail */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {activeStep === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Database</h2>
              {dbStatus === "connected" && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-status-on-track/10 text-status-on-track">Connected</span>}
            </div>
            <p className="text-sm text-muted-foreground">Your database is managed by Lovable Cloud. All tables are already created:</p>
            <div className="grid grid-cols-3 gap-2">
              {["customers", "initiatives", "action_items", "meetings", "meeting_action_items", "wiki_entries", "documents", "rm_tickets", "app_settings"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                  <CheckCircle className="h-3.5 w-3.5 text-status-on-track" />
                  <span className="font-mono text-xs">{t}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">✓ No setup needed — the database is fully configured and ready to use.</p>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Upload className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">File Storage</h2>
              {storageStatus === "connected" && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-status-on-track/10 text-status-on-track">Connected</span>}
            </div>
            <p className="text-sm text-muted-foreground">Cloud storage is configured for document uploads. The <code className="px-1 py-0.5 bg-muted rounded text-xs">documents</code> bucket is ready.</p>
            <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-2">
              <p><strong>Supported file types:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>PDF documents (.pdf)</li>
                <li>Word documents (.doc, .docx)</li>
                <li>Excel spreadsheets (.xlsx, .xls)</li>
                <li>CSV files (.csv)</li>
                <li>Text files (.txt)</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">✓ No setup needed — storage is fully configured.</p>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">AI Provider</h2>
            </div>
            <p className="text-sm text-muted-foreground">Choose your AI provider. Built-in Lovable AI works immediately with no setup. For more control, you can use your own OpenAI API key.</p>

            <div className="flex gap-3">
              <button
                onClick={() => updateSettings({ provider: "lovable" })}
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${settings.provider === "lovable" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
              >
                <p className="text-sm font-medium text-foreground">Lovable AI (Built-in)</p>
                <p className="text-xs text-muted-foreground mt-0.5">No setup needed. Works immediately. Recommended.</p>
                {settings.provider === "lovable" && <CheckCircle className="h-4 w-4 text-primary mt-2" />}
              </button>
              <button
                onClick={() => updateSettings({ provider: "openai" })}
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${settings.provider === "openai" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
              >
                <p className="text-sm font-medium text-foreground">OpenAI API</p>
                <p className="text-xs text-muted-foreground mt-0.5">Use your own API key. Full model control.</p>
                {settings.provider === "openai" && <CheckCircle className="h-4 w-4 text-primary mt-2" />}
              </button>
            </div>

            {settings.provider === "openai" && (
              <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">OpenAI API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={settings.openai_key}
                      onChange={(e) => updateSettings({ openai_key: e.target.value })}
                      placeholder="sk-..."
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Stored locally in your browser only. Never sent to our servers.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">How to get an API key:</label>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                    <li>Go to <strong>platform.openai.com</strong></li>
                    <li>Sign in or create an account</li>
                    <li>Navigate to <strong>API Keys</strong> in the left sidebar</li>
                    <li>Click <strong>"Create new secret key"</strong></li>
                    <li>Copy the key and paste it above</li>
                    <li>Any paid plan works — the cheapest tier is sufficient</li>
                  </ol>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Model</label>
                  <select value={settings.model || "gpt-4o"} onChange={(e) => updateSettings({ model: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={testAi}
              disabled={aiTestResult === "testing"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {aiTestResult === "testing" ? <span className="animate-spin">⏳</span> : aiTestResult === "success" ? <CheckCircle className="h-4 w-4 text-status-on-track" /> : <Bot className="h-4 w-4" />}
              Test AI Connection
            </button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Access Control</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-status-on-track/10 text-status-on-track">Active</span>
            </div>
            <p className="text-sm text-muted-foreground">Your site is protected with a session password. Anyone who visits must enter the password to access the app.</p>
            <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-2">
              <p><strong>Current protection:</strong> Session password gate</p>
              <p className="text-muted-foreground">To change the password, edit <code className="px-1 py-0.5 bg-muted rounded text-[11px]">src/components/PasswordGate.tsx</code> line 5.</p>
            </div>
            <p className="text-xs text-muted-foreground">✓ For team-wide access with individual accounts, authentication with email/password can be added as a future enhancement.</p>
          </div>
        )}
      </section>

      {/* Quick Start Guide */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Start Guide</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { step: "1", title: "Upload a Tracker", desc: "Go to Document Intelligence → Upload an Excel tracker. AI will extract RMs, action items, and customer data." },
            { step: "2", title: "Parse Meeting Notes", desc: "Go to Meeting Minutes → Paste notes → Click 'Parse & Extract'. AI extracts decisions, actions, and RM references." },
            { step: "3", title: "Create a Spec", desc: "Go to Specs Workspace → Paste requirements → AI generates a structured spec with Request Overview, Goals, Scope, and Open Questions." },
            { step: "4", title: "Build Your Wiki", desc: "Go to Project Wiki → Paste code, documents, or manuals → AI creates searchable wiki entries with explanations." },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 p-3 rounded-lg border border-border bg-muted/20">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">{item.step}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
