FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN yarn
EXPOSE 8080

COPY . .

CMD ["yarn", "dev"]