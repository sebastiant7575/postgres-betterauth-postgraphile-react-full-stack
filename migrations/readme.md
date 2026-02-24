To get better auth + graphile-migrate working:

First reset the database:
sudo docker compose down -v && sudo docker compose up db

Once DB running, in /migrations root directory run:
npx graphile-migrate watch
This will create migrations/current.sql and migrations/committed/

Stop running the watch

We now generate betterauth schema, from /node we run:
npx @better-auth/cli generate --output ../migrations/migrations/current.sql

Then in /migrations run:
npx graphile-migrate commit

Should create 000001.sql

Can verify with: psql "postgres://myapp:myapp@localhost:5433/myapp" -c "\dt"

Once files are in committed, unless script is written,
must run:
npx graphile-migrate migrate
for the database to get filled with the committed sql AFTER a full DB destruction/rebuild
