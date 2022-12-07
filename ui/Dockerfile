FROM node:18-alpine AS build
WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .
RUN npm run build

FROM jawg/nginx-spa
COPY --from=build /app/dist/web/ /usr/share/nginx/html
