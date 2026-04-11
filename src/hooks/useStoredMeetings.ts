import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface StoredMeeting {
  id: string;
  customer_id: string;
  title: string;
  date: string;
  attendees: string[];
  summary: string;
  decisions: string[];
  discussion_notes: string[];
  action_items: { description: string; owner: string; due_date: string | null; status: string }[];
  rm_references: string[];
  key_highlights: string[];
  open_questions: string[];
  next_steps: string[];
  created_at: string;
  source: "manual" | "ai-parsed";
  raw_text?: string;
}

const STORAGE_KEY = "cfs-stored-meetings";

function load(): StoredMeeting[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save(m: StoredMeeting[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)); }

export function useStoredMeetings() {
  const [meetings, setMeetings] = useState<StoredMeeting[]>(load);

  const addMeeting = useCallback((meeting: Omit<StoredMeeting, "id" | "created_at">) => {
    const newMeeting: StoredMeeting = {
      ...meeting,
      id: `mtg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    setMeetings((prev) => {
      const updated = [newMeeting, ...prev];
      save(updated);
      return updated;
    });
    toast.success(`Meeting "${meeting.title}" saved`);
    return newMeeting;
  }, []);

  const deleteMeeting = useCallback((id: string) => {
    setMeetings((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      save(updated);
      return updated;
    });
    toast.success("Meeting deleted");
  }, []);

  return { meetings, addMeeting, deleteMeeting };
}
