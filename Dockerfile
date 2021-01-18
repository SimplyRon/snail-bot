FROM node:14-alpine AS build

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/snail-bot

COPY package.json .
RUN npm install -g typescript
RUN npm install
COPY . .

RUN mv ./src/config/auth.template.json src/config/auth.json && \
    mv ./src/config/config.template.json src/config/config.json

RUN tsc

RUN cp src/config/config.json dist/config/config.json && \
    cp src/config/auth.json dist/config/auth.json

FROM node:14-alpine AS build2
WORKDIR /usr/snail-bot
COPY package.json ./

RUN npm install --production

COPY --from=build usr/snail-bot/dist ./dist

FROM node:14-alpine
WORKDIR /usr/snail-bot
COPY package.json ./

COPY --from=build2 /usr/snail-bot ./

CMD ["node", "."]
