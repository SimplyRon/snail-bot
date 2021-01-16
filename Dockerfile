FROM ubuntu


ENV DEBIAN_FRONTEND=noninteractive
ARG Token

RUN apt-get update && apt-get install -y \
    git \
    curl wget \
    vim 

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN git clone https://github.com/SimplyRon/snail-bot.git


RUN cp ./snail-bot/src/config/auth.json.template ./snail-bot/src/config/auth.json && cp ./snail-bot/src/config/config.json.template ./snail-bot/src/config/config.json 
RUN sed -i 's/{{DISCORD_TOKEN}}/${Token}/' ./snail-bot/data/auth.json


# COPY ./snail-bot/snail-bot ./snail-bot
WORKDIR /snail-bot
RUN npm install 
CMD ["npm", "start"]