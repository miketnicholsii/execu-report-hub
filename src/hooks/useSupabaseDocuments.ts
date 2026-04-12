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

const MAX_PARALLEL_UPLOADS = 3;

const normalizeFileName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const makeStoragePath = (file: File) => {
  const safeName = normalizeFileName(file.name) || "upload.bin";
  return `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
};

const uploadFileToSupabase = async (bucket: string, path: string, file: File) => {
  const storage = supabase.storage.from(bucket);

  const { data: signedData, error: signedError } = await storage.createSignedUploadUrl(path);
  if (!signedError && signedData?.token) {
    const { error: signedUploadError } = await storage.uploadToSignedUrl(path, signedData.token, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (!signedUploadError) return;
  }

  const { error: uploadError } = await storage.upload(path, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) throw uploadError;
};

async function runWithConcurrency<TInput, TOutput>(
  values: TInput[],
  limit: number,
  worker: (value: TInput, index: number) => Promise<TOutput>,
) {
  const results: TOutput[] = new Array(values.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= values.length) return;
      results[index] = await worker(values[index], index);
    }
  });

  await Promise.all(runners);
  return results;
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
      const path = makeStoragePath(file);
      await uploadFileToSupabase("documents", path, file);

      const { data, error } = await supabase.from("documents").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        file_name: file.name,
        file_path: path,
        file_type: file.type || file.name.split(".").pop() || "application/octet-stream",
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

  const uploadDocuments = useMutation({
    mutationFn: async ({ files, customerId }: { files: File[]; customerId?: string }) => {
      const completed: DbDocument[] = [];
      const failed: { fileName: string; error: string }[] = [];

      await runWithConcurrency(files, MAX_PARALLEL_UPLOADS, async (file) => {
        try {
          const record = await uploadDocument.mutateAsync({ file, customerId });
          completed.push(record);
          return record;
        } catch (err: any) {
          failed.push({
            fileName: file.name,
            error: err?.message || "Unknown upload error",
          });
          return null;
        }
      });

      return { completed, failed };
    },
    onSuccess: ({ completed, failed }) => {
      if (completed.length > 1) {
        toast.success(`Uploaded ${completed.length} files`);
      }

      if (failed.length > 0) {
        const firstError = failed[0];
        toast.error(`${failed.length} file(s) failed. First: ${firstError.fileName} (${firstError.error})`);
      }
    },
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

  return { documents, isLoading, uploadDocument, uploadDocuments, updateDocument, deleteDocument };
}
