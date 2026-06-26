FROM node:22.17.0 AS build

LABEL maintainer="Sumit Rathore <srathore132005@gmail.com>"

WORKDIR /app

COPY package*.json /TODO-APP/client  /app/

RUN npm install

COPY . /app

FROM node:22.17.0-slim AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 5173

ENTRYPOINT ["npm", "run", "dev"]

