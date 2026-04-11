import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbRmTicket {
  id: string;
  rm_number: string;
  customer_id: string | null;
  initiative_id: string | null;
  title: string | null;
  owner: string | null;
  status: string;
  summary: string | null;
  last_update: string | null;
  due_date: string | null;
  next_steps: string | null;
  open_questions: string | null;
  dependencies: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupabaseRmTickets() {
  const qc = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["rm_tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rm_tickets").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbRmTicket[];
    },
  });

  const addTicket = useMutation({
    mutationFn: async (ticket: Partial<DbRmTicket> & { rm_number: string }) => {
      const { data, error } = await supabase.from("rm_tickets").insert(ticket).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["rm_tickets"] });
      toast.success(`RM ticket ${d.rm_number} created`);
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbRmTicket> & { id: string }) => {
      const { error } = await supabase.from("rm_tickets").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rm_tickets"] }),
  });

  const deleteTicket = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rm_tickets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rm_tickets"] });
      toast.success("RM ticket deleted");
    },
  });

  const bulkUpsert = useMutation({
    mutationFn: async (tickets: (Partial<DbRmTicket> & { rm_number: string })[]) => {
      const { error } = await supabase.from("rm_tickets").upsert(tickets, { onConflict: "rm_number" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rm_tickets"] });
      toast.success("RM tickets updated");
    },
    onError: (e) => toast.error(`Bulk update failed: ${e.message}`),
  });

  return { tickets, isLoading, addTicket, updateTicket, deleteTicket, bulkUpsert };
}
