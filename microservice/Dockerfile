FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build


EXPOSE 3001

CMD /bin/sh -c "echo 'Running migrations...' &&  node dist/main"