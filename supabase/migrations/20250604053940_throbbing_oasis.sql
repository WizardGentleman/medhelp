/*
  # Authentication System Setup

  1. Tables
    - `users`: Main user data table with authentication and profile information
    - `login_attempts`: Rate limiting table for login security

  2. Security
    - Row Level Security (RLS) enabled
    - Rate limiting implementation (5 attempts per minute)
    - Email and CPF format validation
    - Policies for user data access

  3. Features
    - Automatic last_login updates
    - Index optimization for email and CPF lookups
    - Format validation for email and CPF
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar NOT NULL UNIQUE,
  cpf varchar NOT NULL UNIQUE,
  password_hash varchar NOT NULL,
  subscription_type subscription_type DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  full_name varchar,
  phone varchar,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT cpf_format CHECK (cpf ~* '^\d{3}\.\d{3}\.\d{3}-\d{2}$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS users_cpf_idx ON users (cpf);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_login update
CREATE TRIGGER on_user_login
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_last_login();

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS login_attempts (
  ip_address inet NOT NULL,
  attempt_time timestamptz DEFAULT now(),
  PRIMARY KEY (ip_address, attempt_time)
);

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(ip inet)
RETURNS boolean AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Delete old attempts
  DELETE FROM login_attempts
  WHERE attempt_time < now() - interval '1 minute';
  
  -- Count attempts in last minute
  SELECT COUNT(*) INTO attempt_count
  FROM login_attempts
  WHERE ip_address = ip
  AND attempt_time > now() - interval '1 minute';
  
  RETURN attempt_count < 5;
END;
$$ LANGUAGE plpgsql;