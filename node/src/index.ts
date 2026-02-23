import type { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import express from "express";
import cors from "cors";

// Because this is file is a typescript file (.ts) to properly run express.js
// and the imports, the following changes had to be made to
// package.json and tsconfig.json
//
//********************************** */
// package.json:
//********************************** */
//
// "scripts": {
//   "start": "npx tsx src/index.ts"
// },
// "type": "module"
//
//********************************** */
// tsconfig.json:
//********************************** */
//
// "compilerOptions": {
//   "module": "esnext",
//   "target": "esnext",
//   "types": ["node"],
//   "moduleResolution": "bundler",
// },
// "include": ["src"]

const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://myapp:myapp@localhost:5433/myapp";
console.log("Connecting to:", DATABASE_URL);
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
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express in Docker Hello World");
});

app.listen(PORT, () => {
  console.log(`Node.js (postgraphile + betterauth) running on :${PORT}`);
  console.log(`GraphiQL available at http://localhost:${PORT}/graphiql`);
});
