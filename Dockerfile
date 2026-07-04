FROM node:22-alpine as build-stage
COPY package.json /app/
COPY package-lock.json /app/
COPY .npmrc /app/

WORKDIR /app/

RUN npm install

COPY . /app/

RUN npm run build -- --base-href=/unpast/

FROM nginx:alpine
RUN apk add --upgrade apk-tools
RUn apk upgrade --available

COPY --from=build-stage /app/dist/frontend/ /usr/share/nginx/html/unpast/
COPY src/assets .

COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
