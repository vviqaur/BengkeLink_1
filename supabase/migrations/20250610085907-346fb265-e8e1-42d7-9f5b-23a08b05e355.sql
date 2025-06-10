
-- Create user profiles table for storing additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'technician', 'workshop')),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  phone VARCHAR(20) NOT NULL,
  profile_photo_url TEXT,
  address TEXT,
  date_of_birth DATE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create technician additional data table
CREATE TABLE public.technician_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  workshop_name VARCHAR(255) NOT NULL,
  partnership_number VARCHAR(100) UNIQUE NOT NULL,
  id_number VARCHAR(20) NOT NULL,
  id_photo_url TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true
);

-- Create workshop additional data table  
CREATE TABLE public.workshop_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  workshop_name VARCHAR(255) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  detail_address TEXT NOT NULL,
  operating_hours JSONB NOT NULL,
  services TEXT[] NOT NULL,
  vehicle_types TEXT[] NOT NULL,
  technician_count INTEGER NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  business_number VARCHAR(100),
  tax_number VARCHAR(100),
  bank_name VARCHAR(100),
  account_number VARCHAR(100),
  account_name VARCHAR(255),
  is_approved BOOLEAN DEFAULT false,
  partnership_number VARCHAR(100) UNIQUE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0
);

-- Create promos table
CREATE TABLE public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  poster_image_url TEXT,
  discount_percentage INTEGER,
  discount_amount DECIMAL(12,2),
  terms_conditions TEXT[],
  expiry_date DATE NOT NULL,
  eligibility_criteria JSONB,
  promo_code VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user promo claims table
CREATE TABLE public.user_promo_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  promo_id UUID REFERENCES promos(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT false,
  UNIQUE(user_id, promo_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add RLS policies for technician_profiles
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view own profile"
  ON public.technician_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Technicians can update own profile"
  ON public.technician_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Technicians can insert own profile"
  ON public.technician_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add RLS policies for workshop_profiles
ALTER TABLE public.workshop_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workshops can view own profile"
  ON public.workshop_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Workshops can update own profile"
  ON public.workshop_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Workshops can insert own profile"
  ON public.workshop_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add RLS policies for promos (public read access)
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promos"
  ON public.promos FOR SELECT
  USING (is_active = true);

-- Add RLS policies for user_promo_claims
ALTER TABLE public.user_promo_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own promo claims"
  ON public.user_promo_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own promo claims"
  ON public.user_promo_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own promo claims"
  ON public.user_promo_claims FOR UPDATE
  USING (auth.uid() = user_id);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert dummy promo data
INSERT INTO public.promos (title, description, poster_image_url, discount_percentage, terms_conditions, expiry_date, eligibility_criteria, promo_code) VALUES
('Promo Pengguna Baru', 'Nikmati diskon 50% untuk pemesanan layanan pertama Anda.', '/promo-images/new-user.png', 50, ARRAY['Hanya untuk pengguna baru yang belum pernah memesan layanan'], '2025-12-31', '{"isNewUser": true}', 'NEWUSER50'),
('Promo Awal Bulan', 'Dapatkan diskon 20% untuk setiap pemesanan di awal bulan.', '/promo-images/monthly.png', 20, ARRAY['Berlaku untuk semua pengguna'], '2025-06-30', '{"allUsers": true}', 'MONTH20'),
('Promo Undang Teman', 'Dapatkan bonus Rp50.000 untuk setiap teman yang diundang dan memesan layanan.', '/promo-images/referral.png', 0, ARRAY['Minimal 1 teman diundang yang berhasil memesan'], '2025-12-31', '{"inviteCount": 1}', 'REFER50K'),
('Promo Pengguna Setia', 'Diskon 30% untuk pengguna dengan 5 atau lebih pemesanan.', '/promo-images/loyal.png', 30, ARRAY['Minimal 5 pemesanan layanan'], '2025-12-31', '{"serviceCount": 5}', 'LOYAL30'),
('Promo Hari Pancasila', 'Rayakan Hari Pancasila dengan diskon 25% untuk semua layanan.', '/promo-images/pancasila.png', 25, ARRAY['Berlaku untuk semua pengguna, hanya pada 1 Juni 2025'], '2025-06-01', '{"allUsers": true, "specificDate": "2025-06-01"}', 'PANCASILA25'),
('Promo Tanggal Kembar 6.6', 'Diskon 66% untuk pemesanan pada tanggal 6 Juni 2025.', '/promo-images/double66.png', 66, ARRAY['Berlaku untuk semua pengguna, hanya pada 6 Juni 2025'], '2025-06-06', '{"allUsers": true, "specificDate": "2025-06-06"}', 'DOUBLE66');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, username, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
