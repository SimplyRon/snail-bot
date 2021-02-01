FROM alpine:latest AS buildTSC
ENV NODE_VERSION=~14
WORKDIR /usr/snail-bot
RUN apk --update add --no-cache nodejs=${NODE_VERSION} nodejs-npm
COPY package*.json ./
RUN npm install --production --no-fund --no-optional --no-audit --ignore-scripts

RUN VERSION_TS=`node -p -e "require('./package.json').devDependencies.typescript"` \
 && VERSION_NTS=`node -p -e "require('./package.json').devDependencies[\"@types/node\"]"` \
 && VERSION_RTS=`node -p -e "require('./package.json').devDependencies[\"@types/ioredis\"]"` \
 && npm install --no-package-lock --no-save typescript@"$VERSION_TS" @types/node@"$VERSION_NTS" @types/ioredis@"$VERSION_RTS"

COPY . .
RUN /usr/snail-bot/node_modules/typescript/bin/tsc -p /usr/snail-bot/tsconfig.json

FROM alpine:latest AS buildPROD
ENV NODE_VERSION=~14
WORKDIR /usr/snail-bot
RUN apk --update add --no-cache nodejs=${NODE_VERSION} nodejs-npm
COPY package*.json ./
RUN npm install --production --no-fund --no-optional --no-audit --ignore-scripts

FROM alpine:latest
ENV NODE_VERSION=~14
WORKDIR /usr/snail-bot

RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node \
    && apk --update add --no-cache nodejs=${NODE_VERSION}

USER node

COPY --from=buildPROD usr/snail-bot/ ./
COPY --from=buildTSC usr/snail-bot/dist ./dist

ENTRYPOINT ["node", "."]