import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbDocument {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  customer_id: string | null;
  status: string;
  ai_summary: string | null;
  extracted_data: any;
  created_at: string;
  updated_at: string;
}

export function useSupabaseDocuments() {
  const qc = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbDocument[];
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ file, customerId }: { file: File; customerId?: string }) => {
      // Upload to storage
      const path = `uploads/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
      if (uploadError) throw uploadError;

      // Create DB record
      const { data, error } = await supabase.from("documents").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        file_name: file.name,
        file_path: path,
        file_type: file.type || file.name.split(".").pop() || "unknown",
        file_size: file.size,
        customer_id: customerId || null,
        status: "pending",
      }).select().single();
      if (error) throw error;
      return data as DbDocument;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success(`Document "${d.title}" uploaded`);
    },
    onError: (e) => toast.error(`Upload failed: ${e.message}`),
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbDocument> & { id: string }) => {
      const { error } = await supabase.from("documents").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted");
    },
  });

  return { documents, isLoading, uploadDocument, updateDocument, deleteDocument };
}
