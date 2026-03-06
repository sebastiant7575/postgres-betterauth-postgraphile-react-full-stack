--! Previous: sha1:cbe51d4ced21dd9a194722fbfcca091f8545f394
--! Hash: sha1:b72e664d2a97baf1095065956b98d643c2d15d47

-- Enter your migration here
-- JWKS table for JWT plugin
CREATE TABLE auth."jwks" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "publicKey" TEXT NOT NULL,
  "privateKey" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
