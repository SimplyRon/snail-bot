FROM node:14-alpine AS build

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/snail-bot

COPY package*.json ./
RUN npm install
COPY . .

RUN /usr/snail-bot/node_modules/typescript/bin/tsc -p /usr/snail-bot/tsconfig.json

FROM node:14-alpine
WORKDIR /usr/snail-bot
COPY package*.json ./

RUN npm install --production

COPY --from=build usr/snail-bot/dist ./dist

USER node
CMD ["node", "."]
