FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp g++ make python3

RUN npm ci --only=production

RUN apk del .gyp

COPY . .

EXPOSE 3000

CMD ["npm", "run", "serve"]
