#!/bin/sh

yarn prisma migrate deploy
exec node --no-experimental-require-module /app/.output/server/index.mjs