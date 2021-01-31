FROM node:14.15.0
WORKDIR /usr/src/app/queueendcon
COPY ./queue-end-connector/package*.json ./
RUN npm install
COPY ./queue-end-connector .
CMD [ "npm","start"]