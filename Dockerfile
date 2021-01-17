FROM node:14-alpine AS build

ARG Token=${Token}
ENV DEBIAN_FRONTEND=noninteractive

RUN apk update && \
    apk add --no-cache git && \
    apk add --no-cache tsc

RUN git clone https://github.com/SimplyRon/snail-bot.git

WORKDIR /snail-bot

RUN mv src/config/auth.template.json src/config/auth.json && \
    mv src/config/config.template.json src/config/config.json 

RUN sed -i "s/{{DISCORD_TOKEN}}/$Token/" src/config/auth.json

RUN npm install && tsc




FROM node:14-alpine
COPY --from=build /snail-bot /snail-bot
ENTRYPOINT ["/snail-bot"]
CMD ["node", "."]
