#!/bin/sh

yarn install --immutable
yarn zenstack generate
yarn prisma generate
yarn db-deploy
exec yarn dev