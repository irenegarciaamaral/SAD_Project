FROM node:14.15.0
WORKDIR /usr/src/app/worker
COPY ./worker-client/package*.json ./
RUN npm install
COPY ./worker-client .
CMD [ "npm","start"]





