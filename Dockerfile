# --- Etapa 1: compilar el sitio Angular ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY angular.json tsconfig*.json ./
COPY src ./src
COPY public ./public
RUN npm run build

# --- Etapa 2: el servicio que sirve el sitio y expone /contact ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server --omit=dev

COPY server/src ./server/src
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "server/src/main.js"]
