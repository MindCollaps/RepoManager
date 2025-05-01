FROM node:23-alpine3.20
WORKDIR /app
RUN corepack enable

RUN apk add --no-cache curl

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY prisma/ schema.zmodel ./

COPY . .

RUN yarn run build
 