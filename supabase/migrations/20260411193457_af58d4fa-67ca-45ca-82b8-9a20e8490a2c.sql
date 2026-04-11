
-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Active',
  health TEXT NOT NULL DEFAULT 'Healthy',
  owner TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create initiatives table
CREATE TABLE public.initiatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  rm_number TEXT,
  status TEXT NOT NULL DEFAULT 'Discovery',
  health TEXT NOT NULL DEFAULT 'Healthy',
  priority TEXT NOT NULL DEFAULT 'Medium',
  owner TEXT,
  description TEXT,
  due_date DATE,
  next_step TEXT,
  open_question TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access initiatives" ON public.initiatives FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create action_items table
CREATE TABLE public.action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT NOT NULL DEFAULT 'Unassigned',
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT NOT NULL DEFAULT 'Medium',
  source TEXT DEFAULT 'manual',
  source_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access action_items" ON public.action_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create meetings table
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  attendees TEXT[] DEFAULT '{}',
  summary TEXT,
  decisions TEXT[] DEFAULT '{}',
  discussion_notes TEXT[] DEFAULT '{}',
  rm_references TEXT[] DEFAULT '{}',
  key_highlights TEXT[] DEFAULT '{}',
  open_questions TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access meetings" ON public.meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create meeting_action_items table
CREATE TABLE public.meeting_action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  owner TEXT NOT NULL DEFAULT 'TBD',
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.meeting_action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access meeting_action_items" ON public.meeting_action_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create wiki_entries table
CREATE TABLE public.wiki_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Project',
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  source TEXT DEFAULT 'manual',
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  has_code BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.wiki_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access wiki_entries" ON public.wiki_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  ai_summary TEXT,
  extracted_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create rm_tickets table
CREATE TABLE public.rm_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rm_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  owner TEXT,
  summary TEXT,
  last_update DATE,
  due_date DATE,
  next_steps TEXT,
  open_questions TEXT,
  dependencies TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.rm_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access rm_tickets" ON public.rm_tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create app_settings table (for API keys etc)
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team access app_settings" ON public.app_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_initiatives_updated_at BEFORE UPDATE ON public.initiatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meeting_action_items_updated_at BEFORE UPDATE ON public.meeting_action_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wiki_entries_updated_at BEFORE UPDATE ON public.wiki_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rm_tickets_updated_at BEFORE UPDATE ON public.rm_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Auth users can upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Auth users can view documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents');
CREATE POLICY "Auth users can delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents');
