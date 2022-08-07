FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENV DATABASE_URL="postgres://root:root@postgres:5432/postgres"

RUN yarn prisma generate

CMD yarn start:migrate:prod