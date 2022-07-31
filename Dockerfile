FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENV DATABASE_URL="postgres://root:root@db:5432/postgres"

RUN npx prisma generate

RUN npx prisma dev

CMD yarn start