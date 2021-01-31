FROM node:14.15.0
WORKDIR /usr/src/app/frontend
COPY ./service-registry/package*.json ./
RUN npm install
COPY ./service-registry .
CMD [ "npm","start"]


