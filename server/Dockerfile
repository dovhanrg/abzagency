FROM node:20-alpine

WORKDIR /app

COPY seeds/ data/uploads/
COPY . .

RUN npm ci

RUN npm run build



CMD ["node", "dist/index.js"]

