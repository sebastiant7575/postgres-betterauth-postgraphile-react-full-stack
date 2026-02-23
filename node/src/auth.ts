import { betterAuth } from "better-auth";
import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://myapp:myapp@localhost:5433/myapp";

export const auth = betterAuth({
  database: new Pool({
    connectionString: DATABASE_URL,
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
});
