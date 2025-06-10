
-- Check and add missing foreign key relationships for bookings table
DO $$
BEGIN
    -- Add workshop foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_bookings_workshop'
    ) THEN
        ALTER TABLE public.bookings 
        ADD CONSTRAINT fk_bookings_workshop 
        FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE CASCADE;
    END IF;
    
    -- Add technician foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_bookings_technician'
    ) THEN
        ALTER TABLE public.bookings 
        ADD CONSTRAINT fk_bookings_technician 
        FOREIGN KEY (technician_id) REFERENCES public.technicians(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS on tables if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Anyone can view available technicians" ON public.technicians;

-- Create RLS policies for bookings table
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policy for workshops table
CREATE POLICY "Anyone can view active workshops" 
ON public.workshops 
FOR SELECT 
USING (is_active = true);

-- Create RLS policy for technicians table
CREATE POLICY "Anyone can view available technicians" 
ON public.technicians 
FOR SELECT 
USING (is_available = true);

-- Insert sample workshop data (only if table is empty)
INSERT INTO public.workshops (name, address, phone, email, services, rating, review_count, is_active)
SELECT * FROM (VALUES
    ('Bengkel Maju Jaya', 'Jl. Sudirman No. 123, Jakarta Pusat', '+62-21-12345678', 'info@majujaya.com', ARRAY['Ganti Oli', 'Servis Rutin', 'Tune Up', 'AC Mobil'], 4.8, 150, true),
    ('Auto Service Center', 'Jl. Thamrin No. 45, Jakarta Pusat', '+62-21-87654321', 'contact@autoservice.com', ARRAY['AC Mobil', 'Electrical', 'Body Repair', 'Ganti Oli'], 4.5, 98, true),
    ('Quick Fix Workshop', 'Jl. Gatot Subroto No. 78, Jakarta Selatan', '+62-21-11223344', 'hello@quickfix.com', ARRAY['Tune Up', 'Rem', 'Ban', 'Radiator'], 4.7, 76, true)
) AS workshop_data
WHERE NOT EXISTS (SELECT 1 FROM public.workshops LIMIT 1);

-- Insert sample technician data (only if table is empty)
DO $$
DECLARE
    workshop1_id UUID;
    workshop2_id UUID;
    workshop3_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.technicians LIMIT 1) THEN
        SELECT id INTO workshop1_id FROM public.workshops WHERE name = 'Bengkel Maju Jaya' LIMIT 1;
        SELECT id INTO workshop2_id FROM public.workshops WHERE name = 'Auto Service Center' LIMIT 1;
        SELECT id INTO workshop3_id FROM public.workshops WHERE name = 'Quick Fix Workshop' LIMIT 1;
        
        INSERT INTO public.technicians (name, phone, specialties, rating, review_count, workshop_id, is_available) VALUES
        ('Ahmad Supardi', '+62-812-3456-7890', ARRAY['Ganti Oli', 'Tune Up', 'Servis Rutin'], 4.8, 125, workshop1_id, true),
        ('Budi Santoso', '+62-813-4567-8901', ARRAY['AC Mobil', 'Electrical'], 4.6, 98, workshop1_id, true),
        ('Sari Dewi', '+62-814-5678-9012', ARRAY['AC Mobil', 'Electrical', 'Body Repair'], 4.6, 87, workshop2_id, true),
        ('Agus Pratama', '+62-815-6789-0123', ARRAY['Electrical', 'Body Repair'], 4.5, 65, workshop2_id, true),
        ('Dedi Rahman', '+62-816-7890-1234', ARRAY['Tune Up', 'Rem', 'Ban'], 4.7, 54, workshop3_id, true),
        ('Eko Wijaya', '+62-817-8901-2345', ARRAY['Radiator', 'Rem'], 4.6, 43, workshop3_id, true);
    END IF;
END $$;
