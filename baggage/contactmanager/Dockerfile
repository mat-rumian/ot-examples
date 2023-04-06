# pull the base image
FROM node:16-alpine

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "start"]