import type { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { createRemoteJWKSet, jwtVerify } from "jose";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4001;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://myapp:myapp@localhost:5433/myapp";
const AUTH_JWKS_URL =
  process.env.AUTH_JWKS_URL || "http://localhost:4000/api/auth/jwks";
const AUTH_ISSUER = process.env.AUTH_ISSUER || "http://localhost:4000";

// Create JWKS keyset — fetched once and cached
const JWKS = createRemoteJWKSet(new URL(AUTH_JWKS_URL));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  postgraphile(DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    pgSettings: async (req: Request) => {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        try {
          const { payload } = await jwtVerify(token, JWKS, {
            issuer: AUTH_ISSUER,
            audience: AUTH_ISSUER,
          });
          if (payload.sub) {
            return {
              role: "app_authenticated",
              "jwt.claims.user_id": payload.sub,
            };
          }
        } catch (e) {
          // Invalid token — fall through to anonymous
        }
      }

      return {
        role: "app_anonymous",
      };
    },
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("GraphQL server running");
});

app.listen(PORT, () => {
  console.log(`GraphQL server running on http://localhost:${PORT}`);
  console.log(`GraphiQL available at http://localhost:${PORT}/graphiql`);
});
