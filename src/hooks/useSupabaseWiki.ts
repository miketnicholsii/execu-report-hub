import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbWikiEntry {
  id: string;
  title: string;
  category: string;
  content: string | null;
  tags: string[];
  summary: string | null;
  source: string | null;
  ai_generated: boolean;
  has_code: boolean;
  created_at: string;
  updated_at: string;
}

export function useSupabaseWiki() {
  const qc = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["wiki_entries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wiki_entries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbWikiEntry[];
    },
  });

  const addEntry = useMutation({
    mutationFn: async (entry: Omit<DbWikiEntry, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("wiki_entries").insert(entry).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["wiki_entries"] });
      toast.success(`Wiki entry "${d.title}" created`);
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbWikiEntry> & { id: string }) => {
      const { error } = await supabase.from("wiki_entries").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wiki_entries"] }),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wiki_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wiki_entries"] });
      toast.success("Wiki entry deleted");
    },
  });

  return { entries, isLoading, addEntry, updateEntry, deleteEntry };
}
