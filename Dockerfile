FROM node:20

WORKDIR /login-trabalho

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5003

CMD ["npx", "nodemon"]
