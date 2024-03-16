FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# USER node

COPY . /home/node/app/
EXPOSE 8080

RUN npm install
RUN npx prisma generate
RUN npm run build

COPY --chown=node:node . .

CMD [ "npm", "run", "start:prod" ]
