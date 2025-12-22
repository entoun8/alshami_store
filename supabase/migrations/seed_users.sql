-- Seed user profiles
INSERT INTO user_profiles (id, name, role) VALUES
  ('d3b39827-bb41-4d0d-ac62-eacb5f0356ed', 'John', 'admin'),
  ('2f4ed0d0-1851-4051-bd7a-2640985f72f2', 'Jane', 'user')
ON CONFLICT (id) DO NOTHING;
