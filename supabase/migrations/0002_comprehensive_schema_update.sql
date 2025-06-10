-- #############################################################################
-- # MIGRATION 0002: COMPREHENSIVE SCHEMA UPDATE FOR BENKELINK
-- # This migration updates the existing schema to align with detailed app requirements.
-- #############################################################################

-- #############################################################################
-- # 1. ALTER EXISTING TABLES
-- #############################################################################

-- ## USERS TABLE ##
-- Add columns required for different roles during sign-up.
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS address JSONB, -- For storing main address { street, city, province, postal_code }
ADD COLUMN IF NOT EXISTS birth_date DATE; -- Specifically for technicians

-- ## TEKNISI TABLE ##
-- Ensure all required fields for technician sign-up are present.
-- The original schema was missing some fields.
ALTER TABLE public.teknisi
ADD COLUMN IF NOT EXISTS bengkel_name VARCHAR(100), -- Name of the partner workshop
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE; -- For technicians to set their working status

-- Remove partnership_number from teknisi as it's a workshop-level identifier
-- The technician will be linked via bengkel_id
ALTER TABLE public.teknisi
DROP COLUMN IF EXISTS partnership_number;


-- ## BENGKEL TABLE ##
-- Add columns for location details and other information.
ALTER TABLE public.bengkel
ADD COLUMN IF NOT EXISTS email VARCHAR(100) NOT NULL, -- Workshop's own email
ADD COLUMN IF NOT EXISTS geo_location JSONB, -- For storing { lat, lng }
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);

-- #############################################################################
-- # 2. NEW TABLES & FUNCTIONS
-- #############################################################################

-- ## FUNCTION to handle new user creation and profile population ##
-- This function will be called by a trigger on the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (id, role, name, username, email, terms_accepted)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    (NEW.raw_user_meta_data->>'terms_accepted')::BOOLEAN
  );

  -- If the role is 'technician', insert into public.teknisi
  IF (NEW.raw_user_meta_data->>'role') = 'technician' THEN
    INSERT INTO public.teknisi (user_id, bengkel_name, partnership_number, ktp_number, ktp_scan, birth_date)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'bengkel_name',
      NEW.raw_user_meta_data->>'partnership_number',
      NEW.raw_user_meta_data->>'ktp_number',
      NEW.raw_user_meta_data->>'ktp_scan',
      (NEW.raw_user_meta_data->>'birth_date')::DATE
    );
  END IF;

  -- Note: Workshop creation is a separate, multi-step process after the user (owner) is created.
  -- It will be handled by the application logic, not this trigger.

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ## TRIGGER to call the function on new user sign-up ##
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ## FUNCTION to calculate average rating for a bengkel ##
CREATE OR REPLACE FUNCTION public.update_bengkel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.bengkel
  SET rating = (
    SELECT AVG(rating) FROM public.ratings WHERE bengkel_id = NEW.bengkel_id
  )
  WHERE id = NEW.bengkel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ## TRIGGER to update bengkel rating after a new rating is inserted ##
DROP TRIGGER IF EXISTS on_new_rating_bengkel ON public.ratings;
CREATE TRIGGER on_new_rating_bengkel
  AFTER INSERT ON public.ratings
  FOR EACH ROW
  WHEN (NEW.bengkel_id IS NOT NULL)
  EXECUTE PROCEDURE public.update_bengkel_rating();


-- ## FUNCTION to calculate average rating for a teknisi ##
CREATE OR REPLACE FUNCTION public.update_teknisi_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.teknisi
  SET rating = (
    SELECT AVG(rating) FROM public.ratings WHERE teknisi_id = NEW.teknisi_id
  )
  WHERE user_id = NEW.teknisi_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ## TRIGGER to update teknisi rating after a new rating is inserted ##
DROP TRIGGER IF EXISTS on_new_rating_teknisi ON public.ratings;
CREATE TRIGGER on_new_rating_teknisi
  AFTER INSERT ON public.ratings
  FOR EACH ROW
  WHEN (NEW.teknisi_id IS NOT NULL)
  EXECUTE PROCEDURE public.update_teknisi_rating();


-- #############################################################################
-- # 3. RLS POLICY UPDATES
-- #############################################################################

-- Allow workshop owners to update their technicians' data (e.g., assign to bengkel)
DROP POLICY IF EXISTS "Workshop owners can add/update their technicians." ON public.teknisi;
CREATE POLICY "Workshop owners can manage their technicians." ON public.teknisi
FOR ALL USING (bengkel_id IN (SELECT id FROM public.bengkel WHERE user_id = auth.uid()));

-- Allow authenticated users to view approved workshops.
DROP POLICY IF EXISTS "All users can view approved workshops." ON public.bengkel;
CREATE POLICY "Authenticated users can view approved workshops." ON public.bengkel
FOR SELECT USING (auth.role() = 'authenticated' AND partnership_status = 'approved');

-- Allow authenticated users to view technicians of approved workshops.
DROP POLICY IF EXISTS "All users can view technicians." ON public.teknisi;
CREATE POLICY "Authenticated users can view technicians." ON public.teknisi
FOR SELECT USING (auth.role() = 'authenticated');


-- End of migration.
