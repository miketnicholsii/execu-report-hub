import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbActionItem {
  id: string;
  customer_id: string | null;
  initiative_id: string | null;
  title: string;
  description: string | null;
  owner: string;
  due_date: string | null;
  status: string;
  priority: string;
  source: string | null;
  source_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupabaseActionItems() {
  const qc = useQueryClient();

  const { data: actionItems = [], isLoading } = useQuery({
    queryKey: ["action_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("action_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbActionItem[];
    },
  });

  const addActionItem = useMutation({
    mutationFn: async (item: Omit<DbActionItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("action_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["action_items"] });
      toast.success("Action item created");
    },
  });

  const updateActionItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbActionItem> & { id: string }) => {
      const { error } = await supabase.from("action_items").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["action_items"] }),
  });

  const deleteActionItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("action_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["action_items"] });
      toast.success("Action item deleted");
    },
  });

  const bulkAdd = useMutation({
    mutationFn: async (items: Omit<DbActionItem, "id" | "created_at" | "updated_at">[]) => {
      const { error } = await supabase.from("action_items").insert(items);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["action_items"] });
      toast.success("Action items created");
    },
  });

  return { actionItems, isLoading, addActionItem, updateActionItem, deleteActionItem, bulkAdd };
}
