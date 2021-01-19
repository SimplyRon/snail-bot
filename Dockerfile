FROM node:14-alpine AS build

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/snail-bot

COPY package*.json ./
RUN npm install
COPY . .

RUN mv ./src/config/auth.template.json src/config/auth.json && \
    mv ./src/config/config.template.json src/config/config.json && \
    /usr/snail-bot/node_modules/typescript/bin/tsc -p /usr/snail-bot/tsconfig.json && \
    cp src/config/config.json dist/config/config.json && \
    cp src/config/auth.json dist/config/auth.json

FROM node:14-alpine
WORKDIR /usr/snail-bot
COPY package*.json ./

RUN npm install --production

COPY --from=build usr/snail-bot/dist ./dist

USER node
CMD ["node", "."]
