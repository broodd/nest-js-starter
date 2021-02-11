FROM node:14.15.4-alpine3.12
EXPOSE 3000

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

CMD npm run start
