FROM node:16

WORKDIR /var/www/app

COPY . .

RUN npm install && npm run build

EXPOSE 5000

CMD npm start

