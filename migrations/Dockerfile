FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY .gmrc.docker .gmrc

COPY migrations ./migrations

CMD ["npx", "graphile-migrate", "migrate"]