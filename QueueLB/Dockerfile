FROM node:14.15.0
WORKDIR /usr/src/app/queuelb
COPY ./queue-load-balancer/package*.json ./
RUN npm install
COPY ./queue-load-balancer .
CMD [ "npm","start"]