import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbMeeting {
  id: string;
  customer_id: string | null;
  title: string;
  date: string;
  attendees: string[];
  summary: string | null;
  decisions: string[];
  discussion_notes: string[];
  rm_references: string[];
  key_highlights: string[];
  open_questions: string[];
  next_steps: string[];
  raw_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMeetingActionItem {
  id: string;
  meeting_id: string;
  description: string;
  owner: string;
  due_date: string | null;
  status: string;
}

export function useSupabaseMeetings() {
  const qc = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meetings").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data as DbMeeting[];
    },
  });

  const { data: meetingActions = [] } = useQuery({
    queryKey: ["meeting_action_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meeting_action_items").select("*");
      if (error) throw error;
      return data as DbMeetingActionItem[];
    },
  });

  const addMeeting = useMutation({
    mutationFn: async (meeting: {
      customer_id?: string;
      title: string;
      date: string;
      attendees: string[];
      summary: string;
      decisions: string[];
      discussion_notes: string[];
      rm_references: string[];
      key_highlights: string[];
      open_questions: string[];
      next_steps: string[];
      raw_text?: string;
      action_items: { description: string; owner: string; due_date: string | null; status: string }[];
    }) => {
      const { action_items, ...meetingData } = meeting;
      const { data: m, error } = await supabase.from("meetings").insert(meetingData).select().single();
      if (error) throw error;

      if (action_items.length > 0) {
        const items = action_items.map((a) => ({ ...a, meeting_id: m.id }));
        const { error: aiError } = await supabase.from("meeting_action_items").insert(items);
        if (aiError) console.error("Failed to insert meeting action items:", aiError);
      }

      return m;
    },
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["meeting_action_items"] });
      toast.success(`Meeting "${m.title}" saved`);
    },
    onError: (e) => toast.error(`Failed to save meeting: ${e.message}`),
  });

  const deleteMeeting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("meetings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["meeting_action_items"] });
      toast.success("Meeting deleted");
    },
  });

  return { meetings, meetingActions, isLoading, addMeeting, deleteMeeting };
}
