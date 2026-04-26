-- Create the camarades table
CREATE TABLE IF NOT EXISTS public.camarades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    photo_url TEXT,
    video_url TEXT,
    niveau TEXT NOT NULL CHECK (niveau IN ('Primaire', 'Secondaire-Collège', 'Primaire & Secondaire')),
    annees TEXT,
    activite TEXT NOT NULL,
    biographie TEXT,
    telephone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.camarades ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles
CREATE POLICY "Allow public read access" ON public.camarades
    FOR SELECT USING (true);

-- Allow public insert access (anyone can add their profile)
CREATE POLICY "Allow public insert access" ON public.camarades
    FOR INSERT WITH CHECK (true);

-- Allow admin delete/update (to be configured with service role or specific admin logic)
-- For a simple MVP, we can use a basic password in the app for admin actions, 
-- but for real security, we'd use Supabase Auth for the admin.
-- Here we'll just enable all for authenticated users if we want to use Auth later.
CREATE POLICY "Allow authenticated users to manage all" ON public.camarades
    FOR ALL USING (auth.role() = 'authenticated');

-- Storage buckets
-- Note: Buckets need to be created via the Supabase Dashboard or API
-- Name: profiles
-- Public: true
