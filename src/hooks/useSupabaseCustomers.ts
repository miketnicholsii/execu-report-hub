import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbCustomer {
  id: string;
  customer_name: string;
  slug: string;
  health: string;
  owner: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useSupabaseCustomers() {
  const qc = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("customer_name");
      if (error) throw error;
      return data as DbCustomer[];
    },
  });

  const addCustomer = useMutation({
    mutationFn: async (customer: Partial<DbCustomer> & { customer_name: string; slug: string }) => {
      const { data, error } = await supabase.from("customers").insert(customer).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      toast.success(`Customer "${d.customer_name}" added`);
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbCustomer> & { id: string }) => {
      const { error } = await supabase.from("customers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });

  return { customers, isLoading, addCustomer, updateCustomer };
}
