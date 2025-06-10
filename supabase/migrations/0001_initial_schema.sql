-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- #############################################################################
-- # 1. ENUM TYPES
-- #############################################################################

CREATE TYPE public.user_role AS ENUM ('customer', 'technician', 'workshop');
CREATE TYPE public.workshop_partnership_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.service_type AS ENUM ('panggil_teknisi', 'book_service');
CREATE TYPE public.service_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.notification_type AS ENUM ('service_update', 'promo', 'reminder');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE public.analytics_period AS ENUM ('weekly', 'monthly');

-- #############################################################################
-- # 2. USERS TABLE (extends auth.users)
-- #############################################################################

-- This table will be populated by a trigger when a new user signs up.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL, -- Mirrored from auth.users for convenience
  phone VARCHAR(20),
  profile_picture VARCHAR(255),
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data." ON public.users FOR UPDATE USING (auth.uid() = id);

-- #############################################################################
-- # 3. BENGKEL (WORKSHOP) & TEKNISI TABLES
-- #############################################################################

CREATE TABLE public.bengkel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- The user who owns the workshop
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  operational_hours JSONB NOT NULL,
  services JSONB NOT NULL, -- List of services offered
  vehicle_types JSONB NOT NULL, -- List of vehicle types served
  technician_count INTEGER NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  owner_ktp_number VARCHAR(20) NOT NULL,
  owner_ktp_scan VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  nib VARCHAR(50) NOT NULL, -- Nomor Induk Berusaha
  npwp VARCHAR(50) NOT NULL, -- NPWP
  bank_name VARCHAR(50) NOT NULL,
  bank_account_number VARCHAR(50) NOT NULL,
  bank_account_holder VARCHAR(100) NOT NULL,
  partnership_number VARCHAR(50) UNIQUE,
  partnership_status workshop_partnership_status DEFAULT 'pending',
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for bengkel table
ALTER TABLE public.bengkel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view approved workshops." ON public.bengkel FOR SELECT USING (partnership_status = 'approved');
CREATE POLICY "Workshop owners can view their own workshop data." ON public.bengkel FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Workshop owners can update their own workshop." ON public.bengkel FOR UPDATE USING (auth.uid() = user_id);


CREATE TABLE public.teknisi (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  bengkel_id UUID REFERENCES public.bengkel(id) ON DELETE SET NULL, -- Can be independent or linked
  partnership_number VARCHAR(50),
  ktp_number VARCHAR(20) NOT NULL,
  ktp_scan VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0
);

-- RLS for teknisi table
ALTER TABLE public.teknisi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view technicians." ON public.teknisi FOR SELECT USING (true);
CREATE POLICY "Technicians can update their own data." ON public.teknisi FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Workshop owners can add/update their technicians." ON public.teknisi FOR ALL USING (bengkel_id IN (SELECT id FROM public.bengkel WHERE user_id = auth.uid()));


-- #############################################################################
-- # 4. CORE FEATURE TABLES (Services, Promos, Notifications, etc.)
-- #############################################################################

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bengkel_id UUID REFERENCES public.bengkel(id) ON DELETE SET NULL,
  teknisi_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_type service_type NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  problem TEXT NOT NULL,
  description TEXT,
  location JSONB NOT NULL, -- { lat, lng, address }
  status service_status DEFAULT 'pending',
  estimated_price JSONB, -- { service_fee, component_cost, platform_fee, tax, total }
  final_price JSONB,
  booking_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own services." ON public.services FOR ALL USING (
  auth.uid() = customer_id OR
  auth.uid() = teknisi_id OR
  EXISTS (SELECT 1 FROM public.bengkel WHERE id = services.bengkel_id AND user_id = auth.uid())
);

CREATE TABLE public.promos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  terms TEXT[] NOT NULL,
  expiry_date DATE NOT NULL,
  eligibility JSONB NOT NULL, -- { isNewUser, serviceCount, inviteCount, date }
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for promos table
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view promos." ON public.promos FOR SELECT USING (true);

CREATE TABLE public.user_promos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  promo_id UUID NOT NULL REFERENCES public.promos(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for user_promos table
ALTER TABLE public.user_promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own claimed promos." ON public.user_promos FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications." ON public.notifications FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment VARCHAR(255),
  status message_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can exchange messages related to their service." ON public.messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable Realtime on messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID UNIQUE NOT NULL REFERENCES public.services(id) ON DELETE CASCADE, -- One rating per service
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bengkel_id UUID REFERENCES public.bengkel(id),
  teknisi_id UUID REFERENCES public.users(id),
  rating DECIMAL(2,1) NOT NULL,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for ratings table
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can view ratings." ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can only create ratings for their own services." ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bengkel_id UUID NOT NULL REFERENCES public.bengkel(id) ON DELETE CASCADE,
  booking_count INTEGER NOT NULL,
  revenue DECIMAL(15,2) NOT NULL,
  period analytics_period NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for analytics table
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workshop owners can view their own analytics." ON public.analytics FOR SELECT USING (bengkel_id IN (SELECT id FROM public.bengkel WHERE user_id = auth.uid()));


-- #############################################################################
-- # 5. AUTOMATION: TRIGGERS AND FUNCTIONS
-- #############################################################################

-- Function to create a new user profile upon sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role user_role;
  _username TEXT;
  _name TEXT;
BEGIN
  -- Extract metadata from the new user record
  _role := (new.raw_user_meta_data->>'role')::user_role;
  _username := new.raw_user_meta_data->>'username';
  _name := new.raw_user_meta_data->>'name';

  -- Insert into our public users table
  INSERT INTO public.users (id, role, name, username, email)
  VALUES (new.id, _role, _name, _username, new.email);

  -- If the role is 'bengkel', create an entry in the bengkel table as well
  IF _role = 'workshop' THEN
    INSERT INTO public.bengkel (
      user_id, name, province, city, postal_code, address, 
      operational_hours, services, vehicle_types, technician_count, 
      owner_name, owner_ktp_number, owner_ktp_scan, owner_phone, 
      nib, npwp, bank_name, bank_account_number, bank_account_holder
    )
    VALUES (
      new.id,
      new.raw_user_meta_data->>'workshop_name',
      new.raw_user_meta_data->>'province',
      new.raw_user_meta_data->>'city',
      new.raw_user_meta_data->>'postal_code',
      new.raw_user_meta_data->>'address',
      (new.raw_user_meta_data->>'operational_hours')::jsonb,
      (new.raw_user_meta_data->>'services')::jsonb,
      (new.raw_user_meta_data->>'vehicle_types')::jsonb,
      (new.raw_user_meta_data->>'technician_count')::integer,
      new.raw_user_meta_data->>'owner_name',
      new.raw_user_meta_data->>'owner_ktp_number',
      new.raw_user_meta_data->>'owner_ktp_scan',
      new.raw_user_meta_data->>'owner_phone',
      new.raw_user_meta_data->>'nib',
      new.raw_user_meta_data->>'npwp',
      new.raw_user_meta_data->>'bank_name',
      new.raw_user_meta_data->>'bank_account_number',
      new.raw_user_meta_data->>'bank_account_holder'
    );
  -- If the role is 'teknisi', create an entry in the teknisi table
  ELSIF _role = 'technician' THEN
    INSERT INTO public.teknisi (user_id, ktp_number, ktp_scan, birth_date)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'ktp_number',
      new.raw_user_meta_data->>'ktp_scan',
      (new.raw_user_meta_data->>'birth_date')::date
    );
  END IF;

  RETURN new;
END;
$$;

-- Trigger to call the function when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

