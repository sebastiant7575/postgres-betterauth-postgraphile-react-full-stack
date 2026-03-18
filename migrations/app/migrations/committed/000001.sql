--! Previous: -
--! Hash: sha1:1d7ad59383a00994af067083648252733b0c693c

-- Enter your migration here
-- Roles
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

GRANT app_anonymous TO myapp;
GRANT app_authenticated TO myapp;
GRANT USAGE ON SCHEMA public TO app_authenticated;
GRANT USAGE ON SCHEMA public TO app_anonymous;

CREATE TABLE public.app_user (
  id SERIAL PRIMARY KEY,
  auth_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.app_user ENABLE ROW LEVEL SECURITY;

CREATE POLICY app_user_select_own ON public.app_user
  FOR SELECT
  TO app_authenticated
  USING (auth_user_id = current_setting('jwt.claims.user_id', true));

CREATE POLICY app_user_update_own ON public.app_user
  FOR UPDATE
  TO app_authenticated
  USING (auth_user_id = current_setting('jwt.claims.user_id', true));

GRANT SELECT, UPDATE ON public.app_user TO app_authenticated;
GRANT USAGE, SELECT ON SEQUENCE app_user_id_seq TO app_authenticated;
