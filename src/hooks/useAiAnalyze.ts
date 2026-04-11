import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AiAction = "parse-meeting" | "analyze-document" | "generate-wiki" | "explain-code" | "summarize-status";

interface UseAiAnalyzeOptions {
  onSuccess?: (data: any) => void;
}

export function useAiAnalyze(options?: UseAiAnalyzeOptions) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (action: AiAction, content: string, context?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-analyze", {
        body: { action, content, context },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setResult(data.data);
      options?.onSuccess?.(data.data);
      return data.data;
    } catch (err: any) {
      const msg = err.message || "AI analysis failed";
      setError(msg);
      if (msg.includes("Rate limit")) {
        toast.error("Rate limited — please wait a moment and try again.");
      } else if (msg.includes("credits")) {
        toast.error("AI credits exhausted. Add funds in Settings > Workspace > Usage.");
      } else {
        toast.error(msg);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { analyze, loading, result, error, setResult };
}
