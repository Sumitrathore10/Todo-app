FROM node:22.17.0 AS build

LABEL maintainer="Sumit Rathore <srathore132005@gmail.com>"

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.config /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

