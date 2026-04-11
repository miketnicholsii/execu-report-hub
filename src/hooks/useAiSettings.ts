import { useState, useCallback, useEffect } from "react";

const SETTINGS_KEY = "cfs-ai-settings";

interface AiSettings {
  provider: "lovable" | "openai";
  openai_key: string;
  model: string;
}

const DEFAULT_SETTINGS: AiSettings = {
  provider: "lovable",
  openai_key: "",
  model: "",
};

function load(): AiSettings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useAiSettings() {
  const [settings, setSettings] = useState<AiSettings>(load);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AiSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const getAiParams = useCallback(() => {
    if (settings.provider === "openai" && settings.openai_key) {
      return { provider: "openai", openai_key: settings.openai_key, model: settings.model || "gpt-4o" };
    }
    return {};
  }, [settings]);

  return { settings, updateSettings, getAiParams };
}
