FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:railway

FROM nginx:stable-alpine
ENV PORT=8080
COPY railway/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist-railway /usr/share/nginx/html
EXPOSE 8080
