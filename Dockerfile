FROM node:latest

WORKDIR /app

COPY  package*.json ./
COPY prisma ./prisma/
COPY migrate.sh /app/migrate.sh
COPY . .

RUN npm install 

RUN chmod +x /app/migrate.sh

EXPOSE 3000

ENTRYPOINT [ "/app/migrate.sh" ]
CMD ["npm", "run", "start:dev" ]