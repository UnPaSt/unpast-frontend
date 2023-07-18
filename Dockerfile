FROM node:14.15.4-alpine3.12 as build-stage
COPY package.json /app/
COPY package-lock.json /app/

WORKDIR /app/

RUN npm install

COPY . /app/

RUN npm run build -- --base-href=./

FROM nginx:alpine
RUN apk add --upgrade apk-tools
RUn apk upgrade --available

COPY --from=build-stage /app/dist/frontend/* /usr/share/nginx/html/unpast/

COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
