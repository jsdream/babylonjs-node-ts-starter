FROM node:7.6.0

# Add user
RUN useradd --user-group --create-home --shell /bin/false gamer

RUN mkdir -p /usr/src/game
RUN chown -R gamer:gamer /usr/src/*

# Install global npm dependencies
RUN npm install --global --quiet gulp-cli

WORKDIR /usr/src/game

COPY . /usr/src/game
COPY init.sh /usr/src/init.sh
RUN chown -R gamer:gamer /usr/src/*

USER gamer

EXPOSE 3214

ENTRYPOINT ["/usr/src/init.sh"]
