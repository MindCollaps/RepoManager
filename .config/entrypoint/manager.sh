#!/bin/sh

yarn db-deploy
exec node /app/.output/server/index.mjs