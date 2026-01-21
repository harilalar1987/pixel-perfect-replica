
-- Create enum for loan status
CREATE TYPE public.loan_status AS ENUM ('under-review', 'approved', 'rejected', 'processing', 'disbursed');

-- Create enum for loan type
CREATE TYPE public.loan_type AS ENUM ('WCBL', 'Term Loan', 'LAP', 'OD', 'CC');

-- Create profiles table for analysts
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  designation TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loans table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  loan_amount NUMERIC NOT NULL,
  loan_type public.loan_type NOT NULL DEFAULT 'WCBL',
  status public.loan_status NOT NULL DEFAULT 'under-review',
  assigned_analyst_id UUID REFERENCES public.profiles(id),
  anchor_name TEXT,
  team TEXT DEFAULT 'Retail',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loan_decisions table
CREATE TABLE public.loan_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  comments TEXT,
  decided_by UUID REFERENCES public.profiles(id) NOT NULL,
  decided_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_decisions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Loans policies (all authenticated users can view/manage loans)
CREATE POLICY "Authenticated users can view loans"
  ON public.loans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert loans"
  ON public.loans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update loans"
  ON public.loans FOR UPDATE
  TO authenticated
  USING (true);

-- Loan decisions policies
CREATE POLICY "Authenticated users can view decisions"
  ON public.loan_decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert decisions"
  ON public.loan_decisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
