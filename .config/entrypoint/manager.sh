#!/bin/sh

yarn prisma migrate deploy
exec node /app/.output/server/index.mjs