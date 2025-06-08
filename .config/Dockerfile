FROM node:23-alpine3.20 AS build
WORKDIR /app
RUN corepack enable

RUN apk add --no-cache curl

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY prisma/ schema.zmodel ./
RUN yarn zen

COPY . .

RUN yarn run build
 
FROM node:23-alpine3.20

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/.config ./.config