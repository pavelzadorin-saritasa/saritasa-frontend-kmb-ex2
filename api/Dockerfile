FROM node:18-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY package*.json ./
RUN npm ci

EXPOSE 8000

ENTRYPOINT [ "npm", "run", "start" ]
