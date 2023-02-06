FROM node:18-slim

RUN apt-get update && apt-get install openssl
RUN yarn config set user node
RUN yarn global add nodemon
RUN yarn global add mocha

# Create app directory
RUN mkdir -p /iris-api/node_modules && chown -R node:node /iris-api
RUN chmod -R 777 /iris-api
WORKDIR /iris-api

# Install app dependencies

COPY yarn.lock ./
COPY package.json ./
COPY example.env ./.env

USER node

RUN yarn install

# Bundle app source
COPY --chown=node:node . .

EXPOSE 80