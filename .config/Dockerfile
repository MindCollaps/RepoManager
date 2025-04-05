FROM node:23-alpine3.20 AS build
WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --immutable

COPY . .

RUN yarn run build


FROM node:23-alpine3.20

WORKDIR /app

COPY --from=build /app/.output/. .

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]
 