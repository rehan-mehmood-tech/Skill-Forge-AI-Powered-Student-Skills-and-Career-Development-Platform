FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 4000
CMD ["node", "src/server.js"]
