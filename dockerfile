FROM node:23-alpine3.19

WORKDIR /usr/src/app

# Install pnpm

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
