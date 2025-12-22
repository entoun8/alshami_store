-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'no_name',
  image TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  address JSONB,
  payment_method TEXT
);
