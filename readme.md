Full Stack App using React (Vite) + Postgraphile/GraphQL (node) + BetterAuth (node) + 2 Postgres DBs

To run the project download docker and run:

sudo docker compose up --build

To stop the project and reset the database run:

sudo docker compose down -v

This project runs a simple login/signup workflow, using Docker to
orchestrate each service as its own container. BetterAuth can easily connect to
any OAuth provider.

Postgraphile and BetterAuth run on their own node containers using express.js

There are 2 postgres databases that run, one for authentication and one for data
Only an authenticated user can query the graphql data database. Checks are done
via JWT. These DBs sync users via a lazy creation method upon first graphql
query, whereby if an authenticated user is not present in the app data db, their
user information is taken from the JWT.

This project uses graphile-migrate to handle migrations. Committed migrations
are run on every project re-build - the databases are wiped if the containers
are destroyed.
