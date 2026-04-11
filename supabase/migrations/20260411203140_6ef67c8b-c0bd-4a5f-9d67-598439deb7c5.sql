
-- Drop and recreate all RLS policies to include anon role

-- meetings
DROP POLICY IF EXISTS "Team access meetings" ON public.meetings;
CREATE POLICY "Team access meetings" ON public.meetings FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- meeting_action_items
DROP POLICY IF EXISTS "Team access meeting_action_items" ON public.meeting_action_items;
CREATE POLICY "Team access meeting_action_items" ON public.meeting_action_items FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- action_items
DROP POLICY IF EXISTS "Team access action_items" ON public.action_items;
CREATE POLICY "Team access action_items" ON public.action_items FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- customers
DROP POLICY IF EXISTS "Team access customers" ON public.customers;
CREATE POLICY "Team access customers" ON public.customers FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- initiatives
DROP POLICY IF EXISTS "Team access initiatives" ON public.initiatives;
CREATE POLICY "Team access initiatives" ON public.initiatives FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- rm_tickets
DROP POLICY IF EXISTS "Team access rm_tickets" ON public.rm_tickets;
CREATE POLICY "Team access rm_tickets" ON public.rm_tickets FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- documents
DROP POLICY IF EXISTS "Team access documents" ON public.documents;
CREATE POLICY "Team access documents" ON public.documents FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- wiki_entries
DROP POLICY IF EXISTS "Team access wiki_entries" ON public.wiki_entries;
CREATE POLICY "Team access wiki_entries" ON public.wiki_entries FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- app_settings
DROP POLICY IF EXISTS "Team access app_settings" ON public.app_settings;
CREATE POLICY "Team access app_settings" ON public.app_settings FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Storage: allow anon uploads/downloads for documents bucket
CREATE POLICY "Anon upload documents" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Anon read documents" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'documents');
CREATE POLICY "Anon delete documents" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'documents');
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Auth read documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents');
CREATE POLICY "Auth delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents');
