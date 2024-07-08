FROM node:latest

WORKDIR /app

COPY  package*.json ./
COPY prisma ./prisma/
COPY entrypoint.sh /app/entrypoint.sh
COPY . .

RUN npm install 

RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD ["npm", "run", "start:dev" ]