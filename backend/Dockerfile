FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build


EXPOSE 3000

CMD /bin/sh -c "echo 'Running migrations...' && yarn migration:run &&  node dist/main"