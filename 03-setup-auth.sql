-- UMAI Admin User Setup
-- Run this in Supabase SQL Editor AFTER the main schema
-- This creates your admin user account

-- First, you need to create your user through the Supabase Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Enter your email: kimberlydrath@gmail.com
-- 4. Enter a strong password
-- 5. Click "Create user"

-- OR run this SQL if you prefer:
-- Note: You'll need to verify the email or set email_confirmed_at manually

-- Create admin user (replace 'your-secure-password' with actual password)
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   confirmation_token,
--   email_change,
--   email_change_token_new,
--   recovery_token
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'kimberlydrath@gmail.com',
--   crypt('your-secure-password', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '',
--   '',
--   '',
--   ''
-- );

-- Verify user was created:
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'kimberlydrath@gmail.com';

-- The RLS policies we created earlier will automatically allow this user
-- to access all admin functions since the email matches.
