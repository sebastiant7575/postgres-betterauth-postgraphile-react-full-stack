--! Previous: sha1:8c5764fe2855a00db4e8a6c0f8c6e074df5c1924
--! Hash: sha1:aa16f24468e1187c2d1207b4bd61925374af1984

-- Enter your migration here
-- Create roles for PostGraphile
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_anonymous') THEN
    CREATE ROLE app_anonymous;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_authenticated') THEN
    CREATE ROLE app_authenticated;
  END IF;
END
$$;

-- Let the myapp user switch to these roles
GRANT app_anonymous TO myapp;
GRANT app_authenticated TO myapp;

-- Anonymous can't see anything by default
-- Authenticated users can access public schema
GRANT USAGE ON SCHEMA public TO app_authenticated;
GRANT USAGE ON SCHEMA public TO app_anonymous;

-- Authenticated users can read their own data
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_authenticated;

-- Enable RLS on the user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Users can only see their own row
CREATE POLICY user_select_own ON "user"
  FOR SELECT
  TO app_authenticated
  USING (id = current_setting('jwt.claims.user_id', true));

-- Anonymous can't see any users
CREATE POLICY user_select_anon ON "user"
  FOR SELECT
  TO app_anonymous
  USING (false);
