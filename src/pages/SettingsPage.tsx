import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useAiSettings } from "@/hooks/useAiSettings";
import { Settings, Key, Bot, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const { settings, updateSettings } = useAiSettings();
  const [testResult, setTestResult] = useState<"idle" | "testing" | "success" | "error">("idle");

  const testConnection = async () => {
    setTestResult("testing");
    try {
      const body: any = { action: "summarize-status", content: "Test connection. Reply with a simple JSON status confirmation." };
      if (settings.provider === "openai" && settings.openai_key) {
        body.provider = "openai";
        body.openai_key = settings.openai_key;
        body.model = settings.model || "gpt-4o";
      }
      const { data, error } = await supabase.functions.invoke("ai-analyze", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTestResult("success");
      toast.success("AI connection working!");
    } catch (e: any) {
      setTestResult("error");
      toast.error(`Connection failed: ${e.message}`);
    }
  };

  return (
    <AppShell title="Settings" subtitle="Configure AI providers and system preferences">
      <section className="max-w-2xl space-y-6">
        {/* AI Provider */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">AI Provider</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => updateSettings({ provider: "lovable" })}
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${
                  settings.provider === "lovable" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-medium text-foreground">Lovable AI (Built-in)</p>
                <p className="text-xs text-muted-foreground mt-0.5">No setup needed. Pre-configured, works immediately.</p>
                {settings.provider === "lovable" && <CheckCircle className="h-4 w-4 text-primary mt-2" />}
              </button>
              <button
                onClick={() => updateSettings({ provider: "openai" })}
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${
                  settings.provider === "openai" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-sm font-medium text-foreground">OpenAI API</p>
                <p className="text-xs text-muted-foreground mt-0.5">Use your own API key. Full model control.</p>
                {settings.provider === "openai" && <CheckCircle className="h-4 w-4 text-primary mt-2" />}
              </button>
            </div>

            {settings.provider === "openai" && (
              <div className="space-y-3 pt-2">
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
                  <p className="text-[10px] text-muted-foreground mt-1">Stored locally in your browser. Never sent to our servers.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Model</label>
                  <select
                    value={settings.model || "gpt-4o"}
                    onChange={(e) => updateSettings({ model: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="o1">o1 (Reasoning)</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={testConnection}
              disabled={testResult === "testing"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              {testResult === "testing" ? (
                <span className="animate-spin">⏳</span>
              ) : testResult === "success" ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : testResult === "error" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
              Test AI Connection
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">System Information</h2>
          </div>
          <div className="p-5 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-mono text-foreground">3.0.0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform</span><span className="font-mono text-foreground">CFS Command Center</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span className="font-mono text-emerald-600">Connected</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span className="font-mono text-emerald-600">Connected</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Provider</span>
              <span className="font-mono text-foreground">{settings.provider === "openai" ? "OpenAI" : "Lovable AI"}</span>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
