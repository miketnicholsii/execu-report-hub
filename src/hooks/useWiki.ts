import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface WikiEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  related_topics: string[];
  summary: string;
  created_at: string;
  updated_at: string;
  source_type: "manual" | "ai-generated" | "document" | "meeting" | "code";
  source_reference?: string;
}

const STORAGE_KEY = "cfs-wiki-entries";

function loadEntries(): WikiEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveEntries(entries: WikiEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useWiki() {
  const [entries, setEntries] = useState<WikiEntry[]>(loadEntries);

  const addEntry = useCallback((entry: Omit<WikiEntry, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString();
    const newEntry: WikiEntry = {
      ...entry,
      id: `wiki-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: now,
      updated_at: now,
    };
    setEntries((prev) => {
      const updated = [newEntry, ...prev];
      saveEntries(updated);
      return updated;
    });
    toast.success(`Wiki entry "${entry.title}" created`);
    return newEntry;
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<WikiEntry>) => {
    setEntries((prev) => {
      const updated = prev.map((e) => e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
    toast.success("Wiki entry deleted");
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry };
}
