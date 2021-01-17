FROM node:14-alpine AS build

ARG Token=${Token}
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR usr/snail-bot

COPY package.json .
RUN npm install -g typescript
RUN npm install
COPY . .

RUN mv ./src/config/auth.template.json src/config/auth.json && \
    mv ./src/config/config.template.json src/config/config.json && \
    sed -i "s/{{DISCORD_TOKEN}}/$Token/" src/config/auth.json

RUN tsc

FROM scratch
WORKDIR usr/app
COPY package.json ./

RUN npm install --production

COPY --from=build usr/snail-bot/dist ./dist
CMD ["node", "."]
