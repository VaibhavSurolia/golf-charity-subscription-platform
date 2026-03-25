-- Supabase Setup Script: Part 3 Authentication & User Profiles

ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS rollover_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS rollover_from_previous DECIMAL(12,2) DEFAULT 0;

-- Simple stats table for global values
CREATE TABLE IF NOT EXISTS public.system_stats (
    key TEXT PRIMARY KEY,
    value_decimal DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initialize jackpot entry if not exists
INSERT INTO public.system_stats (key, value_decimal)
VALUES ('current_jackpot', 0)
ON CONFLICT (key) DO NOTHING;

-- Policies for stats
ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage stats." 
ON public.system_stats FOR ALL 
USING ( public.is_admin() );

CREATE POLICY "Everyone can view stats." 
ON public.system_stats FOR SELECT 
USING ( true );

-- Charity System
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Track payouts generated from draws
CREATE TABLE IF NOT EXISTS public.charity_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
    charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Charities
INSERT INTO public.charities (name, description, website)
VALUES 
('Green Fairways Foundation', 'Supporting environmental conservation in local golf courses.', 'https://greenfairways.org'),
('Youth Golf Initiative', 'Providing equipment and training to underprivileged children.', 'https://youthgolf.org'),
('Veterans on the Green', 'Therapeutic golf programs for wounded veterans.', 'https://vetsgreen.org')
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view charities." ON public.charities FOR SELECT USING (true);
CREATE POLICY "Anyone can view payout history." ON public.charity_payouts FOR SELECT USING (true);

CREATE POLICY "Admins can manage charities." ON public.charities FOR ALL USING ( public.is_admin() );
CREATE POLICY "Admins can manage payouts." ON public.charity_payouts FOR ALL USING ( public.is_admin() );

ALTER TABLE public.winners 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS proof_url TEXT,
ADD COLUMN IF NOT EXISTS admin_comment TEXT;

-- Policy to allow winners to update their own record (for proof upload)
CREATE POLICY "Winners can update their own records for verification." 
ON public.winners FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
-- Note: Create the profiles table that extends auth.users

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own profile." 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Helper function to check if a user is an admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins can view and update all profiles
CREATE POLICY "Admins can view all profiles." 
ON public.users FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles." 
ON public.users FOR UPDATE 
USING (public.is_admin());

-- Trigger to automatically create a user profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, subscription_status)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Golfer'), new.email, 'user', 'inactive');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Part 5: Scores Table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 45) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scores." 
ON public.scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all scores." 
ON public.scores FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Users can insert their own scores." 
ON public.scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. Draw System
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  winning_numbers INTEGER[] NOT NULL, -- Array of 5 numbers
  total_pool DECIMAL(12,2) NOT NULL DEFAULT 0,
  charity_pool DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'closed' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL, -- Point directly to profiles table
  match_count INTEGER NOT NULL CHECK (match_count >= 0),
  prize_won DECIMAL(12,2) DEFAULT 0,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  proof_url TEXT,
  admin_comment TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure relationship exists for existing tables
ALTER TABLE public.winners DROP CONSTRAINT IF EXISTS winners_user_id_fkey;
ALTER TABLE public.winners ADD CONSTRAINT winners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';

-- Enable RLS for Draws and Winners
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Draws Policies
CREATE POLICY "Anyone can view draws." ON public.draws FOR SELECT USING (true);
CREATE POLICY "Admins can manage draws." ON public.draws FOR ALL USING (public.is_admin());

-- Winners Policies
CREATE POLICY "Users can view their own winning records." ON public.winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage winners." ON public.winners FOR ALL USING (public.is_admin());
