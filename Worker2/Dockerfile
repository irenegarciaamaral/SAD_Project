FROM node:14.15.0
WORKDIR /usr/src/app/worker2
COPY ./worker-client/package*.json ./
RUN npm install
COPY ./worker-client .
CMD [ "npm","start"]





