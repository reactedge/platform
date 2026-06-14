FROM node:18-alpine

WORKDIR /user/src/node-backend

COPY package*.json ./

RUN npm install -g concurrently  && \
    npm install && \
    npm ci --only=production

COPY . .

CMD ["npm", "run", "start"]