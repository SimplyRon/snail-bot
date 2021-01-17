FROM ubuntu
ARG DISCORD_TOKEN=${DISCORD_TOKEN}

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl wget \
    vim 

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs
RUN git clone https://github.com/SimplyRon/snail-bot.git

WORKDIR /snail-bot

COPY src/config/auth.template.json src/config/auth.json 
COPY src/config/config.template.json src/config/config.json 

RUN sed -i 's/{{DISCORD_TOKEN}}/${DISCORD_TOKEN}/' src/config/auth.json

RUN cat src/config/auth.json