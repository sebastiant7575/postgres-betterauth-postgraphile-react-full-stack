import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://myapp:myapp@localhost:5433/myapp";

export const auth = betterAuth({
  database: new Pool({
    connectionString: DATABASE_URL + "?options=-c search_path=auth",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
  plugins: [jwt()],
});
