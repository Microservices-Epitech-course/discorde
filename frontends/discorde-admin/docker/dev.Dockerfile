FROM node:15-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

CMD ["yarn", "dev"]