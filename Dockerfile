FROM node:14

ARG Token=${Token}
ENV DEBIAN_FRONTEND=noninteractive

RUN git clone https://github.com/SimplyRon/snail-bot.git

WORKDIR /snail-bot

COPY src/config/auth.template.json src/config/auth.json 
COPY src/config/config.template.json src/config/config.json 

RUN sed -i "s/{{DISCORD_TOKEN}}/$Token/" src/config/auth.json

CMD ["npm", "start"]
