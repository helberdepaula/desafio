FROM node:lts-alpine

# Usando o serve para servir a aplicação tem suporte a SPA
RUN npm install -g serve

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# Expor porta 8080
EXPOSE 8080

# Iniciar serve com SPA (redireciona 404s para index.html)
CMD [ "serve", "-s", "dist", "-l", "8080" ]