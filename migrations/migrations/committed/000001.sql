--! Previous: -
--! Hash: sha1:cbe51d4ced21dd9a194722fbfcca091f8545f394

-- Auth schema
CREATE SCHEMA IF NOT EXISTS auth;
GRANT ALL ON SCHEMA auth TO myapp;

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

-- BetterAuth tables in auth schema
CREATE TABLE auth."user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE auth."session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES auth."user" ("id") ON DELETE CASCADE
);

CREATE TABLE auth."account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES auth."user" ("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE auth."verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX "session_userId_idx" ON auth."session" ("userId");
CREATE INDEX "account_userId_idx" ON auth."account" ("userId");
CREATE INDEX "verification_identifier_idx" ON auth."verification" ("identifier");

-- App user table (PostGraphile exposes this)
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

-- Trigger: auto-create app_user when auth.user is created
CREATE OR REPLACE FUNCTION auth.sync_app_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.app_user (auth_user_id, display_name)
  VALUES (NEW.id, NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth."user"
  FOR EACH ROW
  EXECUTE FUNCTION auth.sync_app_user();
