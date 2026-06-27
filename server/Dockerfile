FROM node:22.17.0 AS build

LABEL maintainer="Sumit Rathore <srathore132005@gmail.com>"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

FROM node:22.17.0-slim AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 8000

ENTRYPOINT ["npm" , "start"]