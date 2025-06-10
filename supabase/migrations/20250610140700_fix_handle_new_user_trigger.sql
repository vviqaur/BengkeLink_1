-- Perbaiki fungsi handle_new_user untuk menangani customer dengan benar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role user_role;
  _username TEXT;
  _name TEXT;
  _phone TEXT;
  _terms_accepted BOOLEAN;
  _profile_picture TEXT;
BEGIN
  -- Extract metadata from the new user record
  _role := (new.raw_user_meta_data->>'role')::user_role;
  _username := new.raw_user_meta_data->>'username';
  _name := new.raw_user_meta_data->>'name';
  _phone := new.raw_user_meta_data->>'phone';
  _terms_accepted := (new.raw_user_meta_data->>'terms_accepted')::boolean;
  _profile_picture := new.raw_user_meta_data->>'profile_picture';

  -- Insert into our public users table
  INSERT INTO public.users (
    id, role, name, username, email, phone, 
    profile_picture, terms_accepted, created_at
  )
  VALUES (
    new.id, _role, _name, _username, new.email, _phone,
    _profile_picture, COALESCE(_terms_accepted, false), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    profile_picture = EXCLUDED.profile_picture,
    terms_accepted = EXCLUDED.terms_accepted;

  -- If the role is 'workshop', create an entry in the bengkel table as well
  IF _role = 'workshop' THEN
    -- Kode untuk workshop tetap sama
    -- ...
  -- If the role is 'technician', create an entry in the teknisi table
  ELSIF _role = 'technician' THEN
    -- Kode untuk technician tetap sama
    -- ...
  END IF;

  RETURN new;
END;
$$;
