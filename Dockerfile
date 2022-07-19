FROM node:18

WORKDIR /

COPY . .

#RUN npm install -g yarn

RUN yarn

ENV DATABASE_URL="postgres://root:root@db:5432/postgres"

CMD ["npx", "prisma", "migrate", "dev"]

CMD ["yarn", "start:dev"]

EXPOSE 3000