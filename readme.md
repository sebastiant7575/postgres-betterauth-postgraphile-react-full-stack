Full stack application using Docker to build the project. Hand built from scratch (mostly)

Project Architecture:

frontend (React + Vite) -> node.js middleware(postgraphile + betterauth) -> Postgres DB

Vague outline:

project/
├── docker-compose.yml
├── .env
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ ├── vite.config.ts
│ └── src/
├── node/
│ ├── Dockerfile
│ ├── package.json
│ └── src/
│ ├── index.ts
│ ├── postgraphile.ts
│ └── auth.ts
└── db/
└── init.sql # seed schema, roles, etc.
