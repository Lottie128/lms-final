-- ==============================================
-- IQ Didactic LMS - Create Admin Account
-- ==============================================
-- Run this in Supabase SQL Editor to create an admin account

-- METHOD 1: Update existing user to admin
-- Replace 'your@email.com' with your actual email
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "ADMIN", "name": "Admin User"}'::jsonb
WHERE email = 'your@email.com';

-- METHOD 2: Create a new admin user from scratch
-- Change email and password as needed
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_user_meta_data, 
  created_at, 
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@iqdidactic.com',  -- CHANGE THIS EMAIL
  crypt('Admin@123456', gen_salt('bf')),  -- CHANGE THIS PASSWORD
  now(),  -- Email confirmed immediately
  '{"role": "ADMIN", "name": "Admin User"}'::jsonb,
  now(),
  now(),
  '',
  ''
);

-- METHOD 3: Make yourself admin after signing up normally
-- Just sign up through the UI first, then run this:
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"ADMIN"'
)
WHERE email = 'your@email.com';  -- Your signup email

-- Verify the admin account was created
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'ADMIN';
