FROM node:14.15.0
WORKDIR /usr/src/app/queue
COPY ./queue-server/package*.json ./
RUN npm install
COPY ./queue-server .
CMD [ "npm","start"]




