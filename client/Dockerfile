FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci
RUN npm install -g express

RUN npm run build

CMD ["node", "serve.js"]