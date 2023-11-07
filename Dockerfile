FROM node:18

WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install
# Generate prisma client, leave out if generating in `postinstall` script
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 80
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./package*.json
#COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/main.js" ]