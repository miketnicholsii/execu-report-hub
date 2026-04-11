import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbInitiative {
  id: string;
  customer_id: string | null;
  title: string;
  rm_number: string | null;
  status: string;
  health: string;
  priority: string;
  owner: string | null;
  due_date: string | null;
  description: string | null;
  next_step: string | null;
  open_question: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupabaseInitiatives() {
  const qc = useQueryClient();

  const { data: initiatives = [], isLoading } = useQuery({
    queryKey: ["initiatives"],
    queryFn: async () => {
      const { data, error } = await supabase.from("initiatives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbInitiative[];
    },
  });

  const addInitiative = useMutation({
    mutationFn: async (initiative: Partial<DbInitiative> & { title: string }) => {
      const { data, error } = await supabase.from("initiatives").insert(initiative).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["initiatives"] });
      toast.success(`Initiative "${d.title}" created`);
    },
  });

  const updateInitiative = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbInitiative> & { id: string }) => {
      const { error } = await supabase.from("initiatives").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["initiatives"] }),
  });

  return { initiatives, isLoading, addInitiative, updateInitiative };
}
