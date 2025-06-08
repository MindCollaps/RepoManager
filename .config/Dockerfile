FROM node:24-alpine3.21
WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY prisma/ schema.zmodel ./
RUN yarn zen

COPY . .

RUN yarn run build